import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import prisma from '@/lib/prisma'
import { buildWorkloadPrompt } from './prompt'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const PRIORITY_WEIGHT = { urgent: 4, high: 3, medium: 2, low: 1 }

export async function POST(_request, { params }) {
  const { boardId } = await params

  try {
    // All active board members with user info
    const memberships = await prisma.boardMember.findMany({
      where: { boardId, deleted: false },
      include: { user: { select: { id: true, name: true, email: true } } }
    })

    if (memberships.length === 0) {
      return NextResponse.json({ error: 'No members found on this board.' }, { status: 400 })
    }

    // All non-deleted tasks with assignee + column info
    const tasks = await prisma.task.findMany({
      where: { column: { boardId }, deleted: false },
      include: { column: true, assignee: { select: { id: true, name: true, email: true } } }
    })

    const memberIds = new Set(memberships.map((m) => m.user.id))

    // Separate assigned vs unassigned
    const assignedTasks   = tasks.filter((t) => t.assigneeId && memberIds.has(t.assigneeId))
    const unassignedTasks = tasks.filter((t) => !t.assigneeId)

    // Per-member stats
    const statsMap = {}
    for (const m of memberships) {
      statsMap[m.user.id] = {
        userId:    m.user.id,
        name:      m.user.name || m.user.email.split('@')[0],
        taskCount: 0,
        byPriority: { urgent: 0, high: 0, medium: 0, low: 0 },
        weightedScore: 0
      }
    }

    for (const t of assignedTasks) {
      const s = statsMap[t.assigneeId]
      if (!s) continue
      s.taskCount++
      s.byPriority[t.priority] = (s.byPriority[t.priority] || 0) + 1
      s.weightedScore += PRIORITY_WEIGHT[t.priority] || 1
    }

    const memberList = Object.values(statsMap)
    const avgScore   = memberList.length > 0
      ? memberList.reduce((sum, m) => sum + m.weightedScore, 0) / memberList.length
      : 0

    // Determine load level per member
    const enrichedMembers = memberList.map((m) => ({
      ...m,
      load: m.weightedScore >= avgScore * 1.6
        ? 'high'
        : m.weightedScore >= avgScore * 0.8
          ? 'medium'
          : 'low'
    }))

    const enrichedTasks = assignedTasks.map((t) => ({
      id:           t.id,
      title:        t.title,
      priority:     t.priority,
      column:       t.column.name,
      assigneeId:   t.assigneeId,
      assigneeName: statsMap[t.assigneeId]?.name || 'Unknown'
    }))

    const today = new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })

    const model  = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = buildWorkloadPrompt(enrichedMembers, enrichedTasks, unassignedTasks.length, today)
    const result = await model.generateContent(prompt)

    const raw    = result.response.text().trim().replace(/^```json\n?|```$/g, '')
    const parsed = JSON.parse(raw)

    const validTaskIds = new Set(assignedTasks.map((t) => t.id))

    // Drop any suggestion where the AI hallucinated a title instead of a real ID
    const safeSuggestions = (parsed.suggestions || []).filter((s) => validTaskIds.has(s.taskId))

    return NextResponse.json({
      members:     enrichedMembers,
      summary:     parsed.summary || '',
      suggestions: safeSuggestions
    })
  } catch (err) {
    console.error('AI workload error:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 })
  }
}

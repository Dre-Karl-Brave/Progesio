import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import prisma from '@/lib/prisma'
import { buildInsightsPrompt } from './prompt'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request, { params }) {
  const { boardId } = await params

  try {
    const { sprintId } = await request.json()
    if (!sprintId) return NextResponse.json({ error: 'sprintId is required' }, { status: 400 })

    const sprint = await prisma.sprint.findFirst({
      where: { id: sprintId, boardId, deleted: false }
    })
    if (!sprint) return NextResponse.json({ error: 'Sprint not found' }, { status: 404 })

    // Include archived tasks — completed sprints archive their tasks (deleted: true)
    const tasks = await prisma.task.findMany({
      where: { sprintId },
      include: { column: true }
    })

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const dayMs = 1000 * 60 * 60 * 24
    const durationDays = Math.ceil((sprint.endDate - sprint.startDate) / dayMs)
    const onTime = sprint.completedAt ? sprint.completedAt <= sprint.endDate : null

    const fmt = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null

    // --- compute stats ---
    const columnCounts = {}
    const priorityCounts = { urgent: 0, high: 0, medium: 0, low: 0 }
    const labelCounts = {}

    for (const t of tasks) {
      const col = t.column?.name || 'Unknown'
      columnCounts[col] = (columnCounts[col] || 0) + 1
      priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1
      for (const label of t.labels || []) {
        labelCounts[label] = (labelCounts[label] || 0) + 1
      }
    }

    const byColumn = Object.entries(columnCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))

    const PRIORITY_ORDER = ['urgent', 'high', 'medium', 'low']
    const byPriority = PRIORITY_ORDER
      .filter((p) => priorityCounts[p] > 0)
      .map((p) => ({ name: p.charAt(0).toUpperCase() + p.slice(1), count: priorityCounts[p] }))

    const byLabel = Object.entries(labelCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }))

    const stats = { totalTasks: tasks.length, byColumn, byPriority, byLabel }

    const sprintMeta = {
      name: sprint.name,
      goal: sprint.goal,
      startDate: fmt(sprint.startDate),
      endDate: fmt(sprint.endDate),
      completedAt: fmt(sprint.completedAt),
      durationDays,
      onTime
    }

    const enrichedTasks = tasks.map((t) => ({
      title: t.title,
      priority: t.priority,
      column: t.column?.name || 'Unknown',
      labels: t.labels
    }))

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = buildInsightsPrompt(sprintMeta, enrichedTasks, stats, today)
    const result = await model.generateContent(prompt)

    const raw = result.response.text().trim().replace(/^```json\n?|```$/g, '')
    const parsed = JSON.parse(raw)

    return NextResponse.json({
      sprint: sprintMeta,
      stats,
      summary: parsed
    })
  } catch (err) {
    console.error('AI insights error:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildBottleneckPrompt } from './prompt'
import prisma from '@/lib/prisma'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(_request, { params }) {
  const { boardId } = await params

  try {
    const tasks = await prisma.task.findMany({
      where: { column: { boardId }, deleted: false },
      include: { column: true, sprint: true, assignee: true },
      orderBy: { createdAt: 'asc' }
    })

    if (!tasks.length) {
      return NextResponse.json({
        summary: 'No tasks found on this board.',
        bottlenecks: [],
        totalTasks: 0
      })
    }

    const now = new Date()
    const dayMs = 1000 * 60 * 60 * 24
    const today = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    const enriched = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      column: t.column.name,
      priority: t.priority,
      dueDate: t.dueDate
        ? t.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null,
      sprint: t.sprint ? t.sprint.name : null,
      assignee: t.assignee ? t.assignee.name ?? 'Unnamed' : null,
      createdAt: t.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ageInDays: Math.floor((now - t.createdAt) / dayMs),
      lastUpdated: t.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      daysSinceUpdate: Math.floor((now - t.updatedAt) / dayMs),
      // true when the task was never meaningfully touched after creation (within 30s)
      neverModified: Math.abs(t.updatedAt.getTime() - t.createdAt.getTime()) < 30000,
      overdue: t.dueDate ? t.dueDate < now : false
    }))

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = buildBottleneckPrompt(enriched, today)
    const result = await model.generateContent(prompt)

    const raw = result.response.text().trim().replace(/^```json\n?|```$/g, '')
    const parsed = JSON.parse(raw)

    return NextResponse.json({
      summary: parsed.summary || '',
      bottlenecks: parsed.bottlenecks || [],
      totalTasks: tasks.length
    })
  } catch (err) {
    console.error('AI bottleneck error:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 })
  }
}

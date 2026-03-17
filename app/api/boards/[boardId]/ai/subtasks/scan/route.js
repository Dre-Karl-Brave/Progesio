import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { getBoardForUser } from '@/lib/boardAccess'
import { buildScanPrompt } from './prompt'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request, { params }) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { boardId } = await params

    const board = await getBoardForUser(boardId, user.userId)
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const tasks = await prisma.task.findMany({
      where: { column: { boardId }, deleted: false },
      include: { column: { select: { name: true } } }
    })

    if (tasks.length === 0) {
      return NextResponse.json({ bigTasks: [] })
    }

    const prompt = buildScanPrompt(tasks)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json({ bigTasks: parsed.bigTasks || [] })
  } catch (error) {
    console.error('Subtask scan error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

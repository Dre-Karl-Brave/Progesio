import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { getBoardForUser } from '@/lib/boardAccess'
import { buildEstimatePrompt } from './prompt'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request, { params }) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { boardId } = await params
    const { taskIds } = await request.json()

    if (!taskIds || taskIds.length === 0) {
      return NextResponse.json({ error: 'No tasks provided' }, { status: 400 })
    }

    const board = await getBoardForUser(boardId, user.userId)
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const tasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds },
        column: { boardId },
        deleted: false
      },
      include: { column: { select: { name: true } } }
    })

    if (tasks.length === 0) {
      return NextResponse.json({ error: 'Tasks not found' }, { status: 404 })
    }

    const prompt = buildEstimatePrompt(tasks)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json({ estimates: parsed.estimates })
  } catch (error) {
    console.error('AI estimate error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

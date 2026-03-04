import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { isMember } from '@/lib/boardAccess'

export async function GET(request, { params }) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { boardId, sprintId } = await params

    const memberCheck = await isMember(boardId, user.userId)
    if (!memberCheck) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    // Fetch all tasks from this sprint, including deleted ones (for completed sprints)
    const tasks = await prisma.task.findMany({
      where: {
        sprintId: sprintId,
        column: {
          boardId: boardId,
        },
      },
      include: {
        assignee: { select: { id: true, email: true, name: true } },
        sprint: { select: { id: true, name: true, status: true } },
        column: { select: { id: true, name: true } },
      },
      orderBy: { position: 'asc' },
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Get sprint tasks error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

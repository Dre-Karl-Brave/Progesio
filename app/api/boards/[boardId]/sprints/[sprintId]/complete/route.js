import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { isMember } from '@/lib/boardAccess'

export async function POST(request, { params }) {
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

    const sprint = await prisma.sprint.findFirst({
      where: { id: sprintId, boardId, deleted: false },
    })

    if (!sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 })
    }

    if (sprint.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Sprint is already completed' }, { status: 400 })
    }

    // Complete the sprint and archive all its tasks
    const now = new Date()

    await prisma.$transaction([
      // Update sprint to completed
      prisma.sprint.update({
        where: { id: sprintId },
        data: {
          status: 'COMPLETED',
          completedAt: now,
        },
      }),
      // Archive all tasks in this sprint
      prisma.task.updateMany({
        where: {
          sprintId: sprintId,
          deleted: false,
        },
        data: {
          deleted: true,
          archivedAt: now,
        },
      }),
    ])

    const updatedSprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
    })

    return NextResponse.json({ sprint: updatedSprint })
  } catch (error) {
    console.error('Complete sprint error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

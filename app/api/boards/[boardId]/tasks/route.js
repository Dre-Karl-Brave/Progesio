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

    const { boardId } = await params

    const memberCheck = await isMember(boardId, user.userId)
    if (!memberCheck) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const { title, columnId, priority, dueDate, assigneeId, description, sprintId } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 })
    }

    if (!columnId) {
      return NextResponse.json({ error: 'Column ID is required' }, { status: 400 })
    }

    const column = await prisma.column.findFirst({
      where: { id: columnId, boardId, deleted: false },
      include: { tasks: { where: { deleted: false }, select: { position: true }, orderBy: { position: 'desc' }, take: 1 } },
    })

    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })
    }

    if (assigneeId) {
      const assigneeMember = await prisma.boardMember.findFirst({
        where: { boardId, userId: assigneeId, deleted: false },
      })
      if (!assigneeMember) {
        return NextResponse.json({ error: 'Assignee is not a board member' }, { status: 400 })
      }
    }

    const nextPosition = column.tasks.length > 0 ? column.tasks[0].position + 1 : 0

    // Validate sprint if provided
    if (sprintId) {
      const sprint = await prisma.sprint.findFirst({
        where: { id: sprintId, boardId, deleted: false },
      })
      if (!sprint) {
        return NextResponse.json({ error: 'Sprint not found' }, { status: 404 })
      }
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        position: nextPosition,
        columnId,
        sprintId: sprintId || null,
        assigneeId: assigneeId || null,
      },
      include: {
        assignee: { select: { id: true, email: true, name: true } },
        sprint: { select: { id: true, name: true, status: true } },
      },
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

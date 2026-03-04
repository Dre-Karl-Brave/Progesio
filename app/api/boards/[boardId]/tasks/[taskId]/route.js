import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { isMember } from '@/lib/boardAccess'

export async function PATCH(request, { params }) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { boardId, taskId } = await params

    const memberCheck = await isMember(boardId, user.userId)
    if (!memberCheck) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const task = await prisma.task.findFirst({
      where: { id: taskId, column: { boardId }, deleted: false },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const { title, priority, dueDate, columnId, position, assigneeId, description, labels } = await request.json()

    const data = {}
    if (title !== undefined) data.title = title.trim()
    if (priority !== undefined) data.priority = priority
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null
    if (description !== undefined) data.description = description?.trim() || null
    if (labels !== undefined) data.labels = labels

    if (assigneeId !== undefined) {
      if (assigneeId) {
        const assigneeMember = await prisma.boardMember.findFirst({
          where: { boardId, userId: assigneeId, deleted: false },
        })
        if (!assigneeMember) {
          return NextResponse.json({ error: 'Assignee is not a board member' }, { status: 400 })
        }
      }
      data.assigneeId = assigneeId || null
    }

    if (position !== undefined) {
      if (!Number.isInteger(position) || position < 0) {
        return NextResponse.json({ error: 'Position must be a non-negative integer' }, { status: 400 })
      }
      data.position = position
    }

    if (columnId && columnId !== task.columnId) {
      const targetColumn = await prisma.column.findFirst({
        where: { id: columnId, boardId, deleted: false },
        include: { tasks: { where: { deleted: false }, select: { position: true }, orderBy: { position: 'desc' }, take: 1 } },
      })

      if (!targetColumn) {
        return NextResponse.json({ error: 'Target column not found' }, { status: 404 })
      }

      data.columnId = columnId
      if (data.position === undefined) {
        data.position = targetColumn.tasks.length > 0 ? targetColumn.tasks[0].position + 1 : 0
      }
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data,
      include: { assignee: { select: { id: true, email: true, name: true } } },
    })

    return NextResponse.json({ task: updated })
  } catch (error) {
    console.error('Update task error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { boardId, taskId } = await params

    const memberCheck = await isMember(boardId, user.userId)
    if (!memberCheck) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const task = await prisma.task.findFirst({
      where: { id: taskId, column: { boardId }, deleted: false },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        deleted: true,
        archivedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Task deleted' })
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

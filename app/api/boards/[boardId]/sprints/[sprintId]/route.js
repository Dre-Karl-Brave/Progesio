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

    const { name, goal, startDate, endDate, status } = await request.json()

    const data = {}
    if (name !== undefined) data.name = name.trim()
    if (goal !== undefined) data.goal = goal?.trim() || null
    if (status !== undefined) data.status = status
    if (startDate !== undefined) data.startDate = new Date(startDate)
    if (endDate !== undefined) data.endDate = new Date(endDate)

    if (data.startDate && data.endDate && data.endDate <= data.startDate) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 })
    }

    const updated = await prisma.sprint.update({
      where: { id: sprintId },
      data,
    })

    return NextResponse.json({ sprint: updated })
  } catch (error) {
    console.error('Update sprint error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
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

    await prisma.sprint.update({
      where: { id: sprintId },
      data: {
        deleted: true,
        archivedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Sprint deleted' })
  } catch (error) {
    console.error('Delete sprint error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

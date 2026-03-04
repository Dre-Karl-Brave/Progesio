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

    const { boardId } = await params

    const memberCheck = await isMember(boardId, user.userId)
    if (!memberCheck) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    // Auto-complete sprints that have passed their end date
    const now = new Date()
    const expiredSprints = await prisma.sprint.findMany({
      where: {
        boardId,
        deleted: false,
        status: 'ACTIVE',
        endDate: { lt: now },
      },
    })

    // Complete expired sprints and archive their tasks
    for (const sprint of expiredSprints) {
      await prisma.$transaction([
        prisma.sprint.update({
          where: { id: sprint.id },
          data: {
            status: 'COMPLETED',
            completedAt: now,
          },
        }),
        prisma.task.updateMany({
          where: {
            sprintId: sprint.id,
            deleted: false,
          },
          data: {
            deleted: true,
            archivedAt: now,
          },
        }),
      ])
    }

    const sprints = await prisma.sprint.findMany({
      where: { boardId, deleted: false },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ sprints })
  } catch (error) {
    console.error('List sprints error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

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

    const { name, goal, startDate, endDate, status } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Sprint name is required' }, { status: 400 })
    }

    if (!startDate) {
      return NextResponse.json({ error: 'Start date is required' }, { status: 400 })
    }

    if (!endDate) {
      return NextResponse.json({ error: 'End date is required' }, { status: 400 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end <= start) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 })
    }

    const sprint = await prisma.sprint.create({
      data: {
        name: name.trim(),
        goal: goal?.trim() || null,
        startDate: start,
        endDate: end,
        status: status || 'PLANNED',
        boardId,
      },
    })

    return NextResponse.json({ sprint }, { status: 201 })
  } catch (error) {
    console.error('Create sprint error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

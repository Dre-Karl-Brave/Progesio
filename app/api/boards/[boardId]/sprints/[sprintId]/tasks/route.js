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

    // Get sprint information
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      select: {
        startDate: true,
        endDate: true,
        completedAt: true,
        createdAt: true
      }
    })

    if (!sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 })
    }

    // Fetch all tasks from this sprint, including deleted ones (for completed sprints)
    // Note: We don't filter by deleted status to include archived tasks from completed sprints
    const tasks = await prisma.task.findMany({
      where: {
        sprintId: sprintId,
      },
      include: {
        assignee: { select: { id: true, email: true, name: true } },
        sprint: { select: { id: true, name: true, status: true } },
        column: {
          select: {
            id: true,
            name: true,
            position: true,
            deleted: true,
            boardId: true
          }
        },
      },
      orderBy: { position: 'asc' },
    })

    // Filter tasks to only include those from the specified board
    const boardTasks = tasks.filter(task => task.column?.boardId === boardId)

    // Fetch columns that existed during this sprint
    // Show columns that were created before the sprint ended
    // This includes both currently active and deleted columns that existed during the sprint
    const sprintEndDate = sprint.completedAt || sprint.endDate

    const columns = await prisma.column.findMany({
      where: {
        boardId: boardId,
        createdAt: {
          lte: sprintEndDate // Column existed before sprint ended
        },
        // Also ensure the column wasn't deleted before the sprint started
        OR: [
          { archivedAt: null }, // Never deleted
          {
            archivedAt: {
              gte: sprint.startDate // Deleted during or after sprint started
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        position: true,
        deleted: true,
      },
      orderBy: { position: 'asc' },
    })

    return NextResponse.json({ tasks: boardTasks, columns })
  } catch (error) {
    console.error('Get sprint tasks error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

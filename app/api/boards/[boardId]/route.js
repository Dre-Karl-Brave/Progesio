import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { getBoardForUser, isOwner } from '@/lib/boardAccess'

export async function GET(request, { params }) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { boardId } = await params

    const board = await getBoardForUser(boardId, user.userId, {
      columns: {
        where: { deleted: false },
        orderBy: { position: 'asc' },
        include: {
          tasks: {
            where: { deleted: false },
            orderBy: { position: 'asc' },
            include: { assignee: { select: { id: true, email: true, name: true } } },
          },
        },
      },
      members: {
        where: { deleted: false },
        include: { user: { select: { id: true, email: true, name: true } } },
        orderBy: { role: 'asc' },
      },
    })

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    return NextResponse.json({ board })
  } catch (error) {
    console.error('Get board error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { boardId } = await params

    const ownerCheck = await isOwner(boardId, user.userId)
    if (!ownerCheck) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    await prisma.board.update({
      where: { id: boardId },
      data: {
        deleted: true,
        archivedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Board deleted' })
  } catch (error) {
    console.error('Delete board error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

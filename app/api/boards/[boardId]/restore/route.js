import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(request, { params }) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { boardId } = await params

    // Check if the board exists and is archived (deleted: true)
    const archivedBoard = await prisma.board.findFirst({
      where: {
        id: boardId,
        ownerId: user.userId,
        deleted: true
      },
      select: { id: true },
    })

    if (!archivedBoard) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const board = await prisma.board.update({
      where: { id: boardId },
      data: {
        deleted: false,
        archivedAt: null,
      },
      include: {
        columns: { where: { deleted: false }, select: { id: true } },
        members: { where: { deleted: false }, select: { id: true } },
      },
    })

    return NextResponse.json({ board })
  } catch (error) {
    console.error('Restore board error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

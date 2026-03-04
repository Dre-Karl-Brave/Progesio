import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const archivedBoards = await prisma.board.findMany({
      where: {
        deleted: true,
        OR: [
          { ownerId: user.userId },
          { members: { some: { userId: user.userId, deleted: false } } },
        ],
      },
      include: {
        columns: { where: { deleted: false }, select: { id: true } },
        members: { where: { deleted: false }, select: { id: true } },
      },
      orderBy: { archivedAt: 'desc' },
    })

    return NextResponse.json({ boards: archivedBoards })
  } catch (error) {
    console.error('List archived boards error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

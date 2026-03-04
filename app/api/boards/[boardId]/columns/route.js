import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { getBoardForUser } from '@/lib/boardAccess'

export async function POST(request, { params }) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { boardId } = await params

    const board = await getBoardForUser(boardId, user.userId, {
      columns: { where: { deleted: false }, select: { position: true }, orderBy: { position: 'desc' }, take: 1 },
    })

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const { name } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Column name is required' }, { status: 400 })
    }

    const nextPosition = board.columns.length > 0 ? board.columns[0].position + 1 : 0

    const column = await prisma.column.create({
      data: {
        name: name.trim(),
        position: nextPosition,
        boardId,
      },
      include: { tasks: true },
    })

    return NextResponse.json({ column }, { status: 201 })
  } catch (error) {
    console.error('Create column error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

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

    const { boardId, columnId } = await params

    const memberCheck = await isMember(boardId, user.userId)
    if (!memberCheck) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const column = await prisma.column.findFirst({
      where: { id: columnId, boardId },
    })

    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })
    }

    const { name } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Column name is required' }, { status: 400 })
    }

    const updated = await prisma.column.update({
      where: { id: columnId },
      data: { name: name.trim() },
    })

    return NextResponse.json({ column: updated })
  } catch (error) {
    console.error('Update column error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { boardId, columnId } = await params

    const memberCheck = await isMember(boardId, user.userId)
    if (!memberCheck) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const column = await prisma.column.findFirst({
      where: { id: columnId, boardId },
    })

    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })
    }

    await prisma.column.delete({ where: { id: columnId } })

    return NextResponse.json({ message: 'Column deleted' })
  } catch (error) {
    console.error('Delete column error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

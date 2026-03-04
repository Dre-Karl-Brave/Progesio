import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { isOwner } from '@/lib/boardAccess'

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { boardId, memberId } = await params

    const ownerCheck = await isOwner(boardId, user.userId)
    if (!ownerCheck) {
      return NextResponse.json({ error: 'Only the board owner can remove members' }, { status: 403 })
    }

    const member = await prisma.boardMember.findFirst({
      where: { id: memberId, boardId },
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    if (member.role === 'owner') {
      return NextResponse.json({ error: 'Cannot remove the board owner' }, { status: 400 })
    }

    await prisma.boardMember.update({
      where: { id: memberId },
      data: {
        deleted: true,
      },
    })

    return NextResponse.json({ message: 'Member removed' })
  } catch (error) {
    console.error('Remove member error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

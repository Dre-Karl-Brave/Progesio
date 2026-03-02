import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { isMember, isOwner } from '@/lib/boardAccess'

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

    const members = await prisma.boardMember.findMany({
      where: { boardId },
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { role: 'asc' },
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error('List members error:', error)
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

    const ownerCheck = await isOwner(boardId, user.userId)
    if (!ownerCheck) {
      return NextResponse.json({ error: 'Only the board owner can add members' }, { status: 403 })
    }

    const { email } = await request.json()
    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, email: true, name: true },
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existing = await prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId: targetUser.id } },
    })

    if (existing) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 409 })
    }

    const member = await prisma.boardMember.create({
      data: { boardId, userId: targetUser.id, role: 'member' },
      include: { user: { select: { id: true, email: true, name: true } } },
    })

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    console.error('Add member error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

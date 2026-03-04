import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const boards = await prisma.board.findMany({
      where: {
        deleted: false,
        OR: [
          { ownerId: user.userId },
          { members: { some: { userId: user.userId, deleted: false } } },
        ],
      },
      include: {
        columns: { where: { deleted: false }, select: { id: true } },
        members: { where: { deleted: false }, select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ boards })
  } catch (error) {
    console.error('List boards error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { name, description } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Board name is required' }, { status: 400 })
    }

    const board = await prisma.board.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        ownerId: user.userId,
        columns: {
          create: DASHBOARD_DATA.defaultColumns.map((colName, index) => ({
            name: colName,
            position: index,
          })),
        },
        members: {
          create: {
            userId: user.userId,
            role: 'owner',
          },
        },
      },
      include: {
        columns: { select: { id: true } },
        members: { select: { id: true } },
      },
    })

    return NextResponse.json({ board }, { status: 201 })
  } catch (error) {
    console.error('Create board error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

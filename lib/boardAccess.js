import prisma from '@/lib/prisma'

export async function getBoardForUser(boardId, userId, include = {}) {
  return prisma.board.findFirst({
    where: {
      id: boardId,
      deleted: false,
      OR: [
        { ownerId: userId },
        { members: { some: { userId, deleted: false } } },
      ],
    },
    include,
  })
}

export async function isOwner(boardId, userId) {
  const board = await prisma.board.findFirst({
    where: { id: boardId, ownerId: userId, deleted: false },
    select: { id: true },
  })
  return !!board
}

export async function isMember(boardId, userId) {
  const membership = await prisma.boardMember.findFirst({
    where: {
      boardId,
      userId,
      deleted: false,
      board: { deleted: false }
    },
    select: { id: true },
  })
  return !!membership
}

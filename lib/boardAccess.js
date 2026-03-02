import prisma from '@/lib/prisma'

export async function getBoardForUser(boardId, userId, include = {}) {
  return prisma.board.findFirst({
    where: {
      id: boardId,
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include,
  })
}

export async function isOwner(boardId, userId) {
  const board = await prisma.board.findFirst({
    where: { id: boardId, ownerId: userId },
    select: { id: true },
  })
  return !!board
}

export async function isMember(boardId, userId) {
  const membership = await prisma.boardMember.findUnique({
    where: { boardId_userId: { boardId, userId } },
    select: { id: true },
  })
  return !!membership
}

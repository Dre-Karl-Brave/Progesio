const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const boards = await prisma.board.findMany({ select: { id: true, ownerId: true } })

  console.log(`Found ${boards.length} boards to backfill`)

  let created = 0
  let skipped = 0

  for (const board of boards) {
    try {
      await prisma.boardMember.upsert({
        where: { boardId_userId: { boardId: board.id, userId: board.ownerId } },
        update: { role: 'owner' },
        create: { boardId: board.id, userId: board.ownerId, role: 'owner' },
      })
      created++
    } catch (error) {
      console.error(`Failed for board ${board.id}:`, error.message)
      skipped++
    }
  }

  console.log(`Done. Created/updated: ${created}, Skipped: ${skipped}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

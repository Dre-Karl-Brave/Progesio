const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// t
const USER_ID = 'cmm291wkq000gojanj36bhwin'
const BOARD_ID = 'cmmgoy7ul000bi4zys8m8fhfg'

// Helper to generate dates
const daysAgo = (days) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const daysFromNow = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

// Task templates with variety
const taskTemplates = [
  // Sprint 1 tasks
  [
    { title: 'Implement user authentication flow', priority: 'high', labels: ['feature', 'security', 'backend'] },
    { title: 'Design landing page mockups', priority: 'medium', labels: ['design', 'ui'] },
    { title: 'Set up CI/CD pipeline', priority: 'high', labels: ['devops', 'infrastructure'] },
    { title: 'Write API documentation', priority: 'low', labels: ['documentation'] },
    { title: 'Fix login button alignment', priority: 'low', labels: ['bug', 'ui', 'frontend'] },
  ],
  // Sprint 2 tasks
  [
    { title: 'Integrate payment gateway', priority: 'urgent', labels: ['feature', 'payment', 'backend'] },
    { title: 'Create database migration scripts', priority: 'high', labels: ['database', 'backend'] },
    { title: 'Optimize image loading performance', priority: 'medium', labels: ['performance', 'frontend'] },
    { title: 'Add unit tests for auth module', priority: 'medium', labels: ['testing', 'backend'] },
    { title: 'Update user profile UI', priority: 'low', labels: ['ui', 'enhancement'] },
  ],
  // Sprint 3 tasks
  [
    { title: 'Build notification system', priority: 'high', labels: ['feature', 'backend', 'realtime'] },
    { title: 'Refactor dashboard components', priority: 'medium', labels: ['refactor', 'frontend'] },
    { title: 'Fix memory leak in websocket', priority: 'urgent', labels: ['bug', 'critical', 'backend'] },
    { title: 'Implement dark mode toggle', priority: 'low', labels: ['feature', 'ui'] },
    { title: 'Add email verification flow', priority: 'high', labels: ['feature', 'security'] },
  ],
  // Sprint 4 tasks
  [
    { title: 'Create admin dashboard', priority: 'high', labels: ['feature', 'admin', 'frontend'] },
    { title: 'Implement role-based permissions', priority: 'urgent', labels: ['feature', 'security', 'backend'] },
    { title: 'Add search functionality', priority: 'medium', labels: ['feature', 'frontend'] },
    { title: 'Fix broken API endpoints', priority: 'high', labels: ['bug', 'backend'] },
    { title: 'Write end-to-end tests', priority: 'medium', labels: ['testing', 'qa'] },
  ],
  // Sprint 5 tasks
  [
    { title: 'Implement export to CSV feature', priority: 'medium', labels: ['feature', 'data'] },
    { title: 'Optimize database queries', priority: 'high', labels: ['performance', 'database'] },
    { title: 'Create onboarding tutorial', priority: 'low', labels: ['ux', 'documentation'] },
    { title: 'Add multi-language support', priority: 'medium', labels: ['feature', 'i18n'] },
    { title: 'Fix Safari rendering issues', priority: 'medium', labels: ['bug', 'frontend', 'browser'] },
  ],
]

const descriptions = [
  'Need to ensure this is properly implemented with all edge cases covered.',
  'This task requires careful attention to detail and thorough testing.',
  'Should follow the established patterns in the codebase.',
  'Make sure to update documentation after completing this task.',
  'Consider performance implications when implementing this feature.',
  'This is a critical task that blocks other work items.',
  'Need to coordinate with the team on this one.',
  'Review existing implementations before starting.',
]

async function main() {
  console.log('🚀 Starting seed script...\n')

  // Verify user and board exist
  const user = await prisma.user.findUnique({ where: { id: USER_ID } })
  if (!user) {
    throw new Error(`User ${USER_ID} not found`)
  }
  console.log(`✓ Found user: ${user.email}`)

  const board = await prisma.board.findUnique({
    where: { id: BOARD_ID },
    include: { columns: { where: { deleted: false }, orderBy: { position: 'asc' } } }
  })
  if (!board) {
    throw new Error(`Board ${BOARD_ID} not found`)
  }
  console.log(`✓ Found board: ${board.name}`)
  console.log(`✓ Board has ${board.columns.length} columns: ${board.columns.map(c => c.name).join(', ')}\n`)

  if (board.columns.length === 0) {
    throw new Error('Board has no columns. Please create columns first.')
  }

  // Create 5 sprints with different timelines and statuses
  const sprints = [
    {
      name: 'Sprint 1 - Foundation',
      goal: 'Build core authentication and initial infrastructure',
      status: 'COMPLETED',
      startDate: daysAgo(60),
      endDate: daysAgo(46),
      completedAt: daysAgo(46),
      createdAt: daysAgo(65),
    },
    {
      name: 'Sprint 2 - Payment Integration',
      goal: 'Integrate payment processing and optimize performance',
      status: 'COMPLETED',
      startDate: daysAgo(45),
      endDate: daysAgo(31),
      completedAt: daysAgo(31),
      createdAt: daysAgo(50),
    },
    {
      name: 'Sprint 3 - Notifications & Refactoring',
      goal: 'Build notification system and refactor critical components',
      status: 'ACTIVE',
      startDate: daysAgo(14),
      endDate: daysFromNow(0),
      completedAt: null,
      createdAt: daysAgo(20),
    },
    {
      name: 'Sprint 4 - Admin Features',
      goal: 'Create admin dashboard and implement advanced permissions',
      status: 'PLANNED',
      startDate: daysFromNow(1),
      endDate: daysFromNow(15),
      completedAt: null,
      createdAt: daysAgo(5),
    },
    {
      name: 'Sprint 5 - Polish & Optimization',
      goal: 'Optimize performance and add final features before launch',
      status: 'PLANNED',
      startDate: daysFromNow(16),
      endDate: daysFromNow(30),
      completedAt: null,
      createdAt: daysAgo(3),
    },
  ]

  console.log('📅 Creating sprints...\n')

  const createdSprints = []
  for (const sprintData of sprints) {
    const sprint = await prisma.sprint.create({
      data: {
        ...sprintData,
        boardId: BOARD_ID,
      },
    })
    createdSprints.push(sprint)
    console.log(`✓ Created: ${sprint.name} (${sprint.status})`)
  }

  console.log(`\n✅ Created ${createdSprints.length} sprints\n`)
  console.log('📝 Creating tasks...\n')

  let totalTasksCreated = 0
  const priorities = ['low', 'medium', 'high', 'urgent']

  // Create 5 tasks per sprint
  for (let i = 0; i < createdSprints.length; i++) {
    const sprint = createdSprints[i]
    const sprintTasks = taskTemplates[i]

    console.log(`\n  Sprint ${i + 1}: ${sprint.name}`)
    console.log(`  ${'─'.repeat(60)}`)

    for (let j = 0; j < sprintTasks.length; j++) {
      const taskTemplate = sprintTasks[j]

      // Distribute tasks across columns based on sprint status
      let columnIndex
      if (sprint.status === 'COMPLETED') {
        // Completed sprint: most tasks in "Done", some in "In Progress"
        columnIndex = j < 4 ? board.columns.length - 1 : Math.min(1, board.columns.length - 1)
      } else if (sprint.status === 'ACTIVE') {
        // Active sprint: distribute across all columns
        columnIndex = j % board.columns.length
      } else {
        // Planned sprint: all tasks in "To Do"
        columnIndex = 0
      }

      const column = board.columns[columnIndex]

      // Calculate task creation date based on sprint
      let taskCreatedAt
      if (sprint.status === 'COMPLETED') {
        // Tasks created during the sprint
        const sprintDuration = sprint.endDate.getTime() - sprint.startDate.getTime()
        taskCreatedAt = new Date(sprint.startDate.getTime() + (sprintDuration * j / 5))
      } else if (sprint.status === 'ACTIVE') {
        // Tasks created at various points, some recent
        taskCreatedAt = daysAgo(14 - (j * 2))
      } else {
        // Planned sprint tasks created recently
        taskCreatedAt = daysAgo(Math.max(1, 7 - j))
      }

      // Set due dates relative to sprint end date
      let dueDate
      if (sprint.status === 'COMPLETED') {
        dueDate = null // Completed tasks don't need due dates shown
      } else if (sprint.status === 'ACTIVE') {
        // Due dates within or slightly after sprint
        dueDate = daysFromNow(-2 + j)
      } else {
        // Planned sprint: due dates during the sprint
        const sprintDuration = sprint.endDate.getTime() - sprint.startDate.getTime()
        dueDate = new Date(sprint.startDate.getTime() + (sprintDuration * (j + 1) / 6))
      }

      const task = await prisma.task.create({
        data: {
          title: taskTemplate.title,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          priority: taskTemplate.priority,
          labels: taskTemplate.labels,
          position: j,
          columnId: column.id,
          sprintId: sprint.id,
          assigneeId: USER_ID,
          dueDate: dueDate,
          createdAt: taskCreatedAt,
          updatedAt: taskCreatedAt,
        },
      })

      totalTasksCreated++

      const dueDateStr = dueDate ? dueDate.toISOString().split('T')[0] : 'No due date'
      console.log(`  ✓ [${column.name}] ${task.title}`)
      console.log(`    Priority: ${task.priority} | Due: ${dueDateStr} | Labels: ${task.labels.join(', ')}`)
    }
  }

  console.log(`\n${'═'.repeat(70)}`)
  console.log('✅ Seed completed successfully!')
  console.log(`${'═'.repeat(70)}`)
  console.log(`📊 Summary:`)
  console.log(`   • Sprints created: ${createdSprints.length}`)
  console.log(`   • Tasks created: ${totalTasksCreated}`)
  console.log(`   • User: ${user.email}`)
  console.log(`   • Board: ${board.name}`)
  console.log(`${'═'.repeat(70)}\n`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

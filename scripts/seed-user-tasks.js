const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Board to populate
const BOARD_ID = 'cmmgoy7ul000bi4zys8m8fhfg'

// Assignee distribution — first user gets the bulk of tasks
const USERS = {
  primary:   'cmmgos3v60000i4zyvikyi6ye',  // lots of tasks
  secondary: 'cmm291wkq000gojanj36bhwin',   // moderate
  tertiary:  'cmmlhtfxi0001ji043w9f0q1g',  // fewer
}

// ── Date helpers ───────────────────────────────────────
const daysAgo  = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d }
const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d }

// ── Task definitions ───────────────────────────────────
// assignee: 'primary' | 'secondary' | 'tertiary'
// column:   'first' | 'second' | 'third' | 'last'  (resolved to actual column by position)
// sprint:   'active' | 'planned' | null  (resolved to actual sprint id)

const TASK_POOL = [
  // ── Primary user — 22 tasks ──────────────────────────
  {
    title: 'Redesign onboarding screen flow',
    description: 'The current onboarding is too long. Reduce steps from 7 to 3 and A/B test the new version.',
    priority: 'high', labels: ['ux', 'frontend', 'design'],
    assignee: 'primary', column: 'first', sprint: 'active',
    dueDate: daysFromNow(3), createdAt: daysAgo(8),
  },
  {
    title: 'Fix race condition in order processing',
    description: 'Two simultaneous order submissions can bypass inventory checks. Needs mutex or db-level locking.',
    priority: 'urgent', labels: ['bug', 'backend', 'critical'],
    assignee: 'primary', column: 'second', sprint: 'active',
    dueDate: daysFromNow(1), createdAt: daysAgo(5),
  },
  {
    title: 'Implement OAuth 2.0 for Google login',
    description: 'Users should be able to sign in with their Google account using OAuth 2.0 / PKCE flow.',
    priority: 'high', labels: ['feature', 'auth', 'backend'],
    assignee: 'primary', column: 'first', sprint: 'active',
    dueDate: daysFromNow(5), createdAt: daysAgo(10),
  },
  {
    title: 'Add pagination to task list API',
    description: 'The /tasks endpoint returns all records. Add cursor-based pagination with a default limit of 20.',
    priority: 'medium', labels: ['backend', 'performance', 'api'],
    assignee: 'primary', column: 'second', sprint: 'active',
    dueDate: daysFromNow(4), createdAt: daysAgo(6),
  },
  {
    title: 'Set up error monitoring with Sentry',
    description: 'Integrate Sentry SDK into both frontend and backend. Configure alerts for P0 errors.',
    priority: 'high', labels: ['devops', 'monitoring', 'infrastructure'],
    assignee: 'primary', column: 'first', sprint: null,
    dueDate: null, createdAt: daysAgo(3),
  },
  {
    title: 'Write migration script for legacy user data',
    description: 'Old user records use a different schema. Write a one-time migration to normalize them.',
    priority: 'urgent', labels: ['database', 'migration', 'backend'],
    assignee: 'primary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(8), createdAt: daysAgo(2),
  },
  {
    title: 'Add dark mode support to dashboard',
    description: 'Implement a system-aware and manual dark mode toggle using CSS variables.',
    priority: 'low', labels: ['ui', 'frontend', 'design'],
    assignee: 'primary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(14), createdAt: daysAgo(1),
  },
  {
    title: 'Optimize Prisma queries on board fetch',
    description: 'The board fetch issues N+1 queries for tasks. Rewrite using nested include and select only needed fields.',
    priority: 'high', labels: ['performance', 'database', 'backend'],
    assignee: 'primary', column: 'second', sprint: 'active',
    dueDate: daysFromNow(2), createdAt: daysAgo(7),
  },
  {
    title: 'Add rate limiting to auth endpoints',
    description: 'Brute force protection: limit sign-in attempts to 10/min per IP using a sliding window algorithm.',
    priority: 'high', labels: ['security', 'backend', 'api'],
    assignee: 'primary', column: 'first', sprint: null,
    dueDate: null, createdAt: daysAgo(4),
  },
  {
    title: 'Build CSV export for task reports',
    description: 'Allow users to export their tasks to CSV. Should include title, priority, due date, assignee, column.',
    priority: 'medium', labels: ['feature', 'data', 'frontend'],
    assignee: 'primary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(12), createdAt: daysAgo(1),
  },
  {
    title: 'Create reusable modal component',
    description: 'Extract all modal logic into a single composable Modal component with slot support for header/body/footer.',
    priority: 'medium', labels: ['refactor', 'frontend', 'components'],
    assignee: 'primary', column: 'third', sprint: 'active',
    dueDate: daysFromNow(3), createdAt: daysAgo(9),
  },
  {
    title: 'Fix timezone bug in sprint date display',
    description: 'Sprint start/end dates render one day off for users in UTC-5 and below. Caused by missing TZ conversion.',
    priority: 'medium', labels: ['bug', 'frontend', 'date'],
    assignee: 'primary', column: 'second', sprint: 'active',
    dueDate: daysFromNow(2), createdAt: daysAgo(5),
  },
  {
    title: 'Implement file attachment support for tasks',
    description: 'Users should be able to attach images and PDFs to tasks. Use S3 for storage, max 10MB per file.',
    priority: 'medium', labels: ['feature', 'storage', 'backend'],
    assignee: 'primary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(20), createdAt: daysAgo(2),
  },
  {
    title: 'Add webhook support for task status changes',
    description: 'Allow external systems to subscribe to task events via HTTP webhooks with HMAC signature verification.',
    priority: 'low', labels: ['feature', 'api', 'integrations'],
    assignee: 'primary', column: 'first', sprint: null,
    dueDate: null, createdAt: daysAgo(3),
  },
  {
    title: 'Resolve memory leak in real-time sync worker',
    description: 'The sync worker heap grows unbounded over 48h. Suspected cause: stale event listener accumulation.',
    priority: 'urgent', labels: ['bug', 'critical', 'backend', 'realtime'],
    assignee: 'primary', column: 'second', sprint: 'active',
    dueDate: daysFromNow(1), createdAt: daysAgo(6),
  },
  {
    title: 'Write unit tests for task mutation hooks',
    description: 'Cover all edge cases for useCreateTask, useUpdateTask, and useDeleteTask with React Testing Library.',
    priority: 'medium', labels: ['testing', 'frontend', 'quality'],
    assignee: 'primary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(10), createdAt: daysAgo(1),
  },
  {
    title: 'Audit and revoke unused API keys',
    description: 'Security audit found 14 stale API keys older than 90 days. Revoke them and notify owners.',
    priority: 'high', labels: ['security', 'devops', 'audit'],
    assignee: 'primary', column: 'first', sprint: null,
    dueDate: daysFromNow(3), createdAt: daysAgo(2),
  },
  {
    title: 'Upgrade Next.js to latest stable',
    description: 'Current version has a known vulnerability in the dev server. Test upgrade path in a feature branch first.',
    priority: 'high', labels: ['devops', 'dependencies', 'security'],
    assignee: 'primary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(7), createdAt: daysAgo(1),
  },
  {
    title: 'Build team member invitation flow',
    description: 'Allow board owners to invite members via email. Generate a time-limited invite token and send via email.',
    priority: 'medium', labels: ['feature', 'auth', 'email', 'backend'],
    assignee: 'primary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(15), createdAt: daysAgo(1),
  },
  {
    title: 'Add keyboard shortcuts to kanban board',
    description: 'Implement shortcuts: N to create task, E to edit selected, Del to delete, arrow keys to move between columns.',
    priority: 'low', labels: ['ux', 'accessibility', 'frontend'],
    assignee: 'primary', column: 'first', sprint: null,
    dueDate: null, createdAt: daysAgo(4),
  },
  {
    title: 'Investigate slow login on mobile devices',
    description: 'Users on mobile report 4-6s login latency. Profiling suggests the bcrypt cost factor may be too high.',
    priority: 'high', labels: ['performance', 'auth', 'mobile'],
    assignee: 'primary', column: 'second', sprint: 'active',
    dueDate: daysFromNow(2), createdAt: daysAgo(7),
  },
  {
    title: 'Document REST API with OpenAPI 3.1',
    description: 'Generate an OpenAPI spec for all public endpoints and host it on /docs using Swagger UI.',
    priority: 'low', labels: ['documentation', 'api', 'dx'],
    assignee: 'primary', column: 'first', sprint: null,
    dueDate: null, createdAt: daysAgo(5),
  },

  // ── Secondary user — 8 tasks ─────────────────────────
  {
    title: 'Design system — update color tokens',
    description: 'Update semantic color tokens to match the new brand palette. Ensure WCAG AA contrast compliance.',
    priority: 'medium', labels: ['design', 'ui', 'accessibility'],
    assignee: 'secondary', column: 'second', sprint: 'active',
    dueDate: daysFromNow(4), createdAt: daysAgo(6),
  },
  {
    title: 'Implement sprint velocity tracking',
    description: 'Track story points or task counts per sprint and display a velocity chart over the last 6 sprints.',
    priority: 'medium', labels: ['feature', 'analytics', 'frontend'],
    assignee: 'secondary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(18), createdAt: daysAgo(2),
  },
  {
    title: 'Fix broken avatar upload on Safari',
    description: 'File input for avatar upload silently fails on Safari 17+. Related to Blob handling differences.',
    priority: 'high', labels: ['bug', 'frontend', 'browser', 'safari'],
    assignee: 'secondary', column: 'second', sprint: 'active',
    dueDate: daysFromNow(2), createdAt: daysAgo(8),
  },
  {
    title: 'Add email digest for weekly task summary',
    description: 'Send a weekly digest every Monday with each user\'s open tasks, overdue items, and upcoming deadlines.',
    priority: 'low', labels: ['feature', 'email', 'notifications'],
    assignee: 'secondary', column: 'first', sprint: null,
    dueDate: null, createdAt: daysAgo(3),
  },
  {
    title: 'Refactor column drag-and-drop logic',
    description: 'The current DnD implementation has edge cases when reordering more than 5 columns. Rewrite using dnd-kit.',
    priority: 'medium', labels: ['refactor', 'frontend', 'dnd'],
    assignee: 'secondary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(12), createdAt: daysAgo(1),
  },
  {
    title: 'Create database backup automation',
    description: 'Schedule nightly Postgres backups to S3 with 30-day retention. Alert on backup failures.',
    priority: 'high', labels: ['devops', 'database', 'infrastructure'],
    assignee: 'secondary', column: 'first', sprint: null,
    dueDate: daysFromNow(5), createdAt: daysAgo(2),
  },
  {
    title: 'Add task comment history',
    description: 'Allow team members to leave comments on tasks. Show a chronological thread with timestamps and avatars.',
    priority: 'medium', labels: ['feature', 'collaboration', 'backend'],
    assignee: 'secondary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(16), createdAt: daysAgo(1),
  },
  {
    title: 'Stress test API under 500 concurrent users',
    description: 'Run a load test using k6. Identify bottlenecks and document p95 latency at 500 concurrent users.',
    priority: 'medium', labels: ['testing', 'performance', 'qa'],
    assignee: 'secondary', column: 'first', sprint: null,
    dueDate: null, createdAt: daysAgo(4),
  },

  // ── Tertiary user — 6 tasks ──────────────────────────
  {
    title: 'Set up staging environment on Vercel',
    description: 'Create a dedicated staging deployment with its own database. Mirror production configuration.',
    priority: 'high', labels: ['devops', 'infrastructure', 'deployment'],
    assignee: 'tertiary', column: 'second', sprint: 'active',
    dueDate: daysFromNow(3), createdAt: daysAgo(5),
  },
  {
    title: 'Implement GDPR data deletion endpoint',
    description: 'Add a POST /users/:id/delete endpoint that fully removes all user data including associated tasks and boards.',
    priority: 'urgent', labels: ['compliance', 'gdpr', 'backend', 'legal'],
    assignee: 'tertiary', column: 'first', sprint: 'active',
    dueDate: daysFromNow(2), createdAt: daysAgo(7),
  },
  {
    title: 'Add activity log to board settings',
    description: 'Show a log of recent board events (task created, moved, deleted) with actor, timestamp, and action.',
    priority: 'medium', labels: ['feature', 'audit', 'frontend'],
    assignee: 'tertiary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(14), createdAt: daysAgo(2),
  },
  {
    title: 'Fix incorrect task count in sprint badge',
    description: 'Sprint card shows task count including deleted tasks. Filter by deleted: false in the aggregation query.',
    priority: 'medium', labels: ['bug', 'backend', 'sprint'],
    assignee: 'tertiary', column: 'third', sprint: 'active',
    dueDate: daysFromNow(1), createdAt: daysAgo(3),
  },
  {
    title: 'Create component library documentation site',
    description: 'Set up a Storybook instance documenting all shared UI components with usage examples and props.',
    priority: 'low', labels: ['documentation', 'frontend', 'dx', 'design'],
    assignee: 'tertiary', column: 'first', sprint: null,
    dueDate: null, createdAt: daysAgo(2),
  },
  {
    title: 'Implement two-factor authentication',
    description: 'Add TOTP-based 2FA using an authenticator app. Generate backup codes and store them hashed.',
    priority: 'high', labels: ['security', 'auth', 'feature'],
    assignee: 'tertiary', column: 'first', sprint: 'planned',
    dueDate: daysFromNow(10), createdAt: daysAgo(1),
  },
]

// ── Main ───────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting user task seed...\n')

  // Verify users exist
  const userIds = Object.values(USERS)
  const users = await prisma.user.findMany({ where: { id: { in: userIds } } })
  if (users.length !== userIds.length) {
    const found = users.map((u) => u.id)
    const missing = userIds.filter((id) => !found.includes(id))
    throw new Error(`Users not found: ${missing.join(', ')}`)
  }
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.email]))
  console.log('✓ Users verified:')
  for (const [key, id] of Object.entries(USERS)) {
    console.log(`  ${key.padEnd(10)} → ${userMap[id]} (${id})`)
  }

  // Fetch board + columns
  const board = await prisma.board.findUnique({
    where: { id: BOARD_ID },
    include: { columns: { where: { deleted: false }, orderBy: { position: 'asc' } } }
  })
  if (!board) throw new Error(`Board ${BOARD_ID} not found`)
  console.log(`\n✓ Board: ${board.name} (${board.columns.length} columns)`)
  board.columns.forEach((c, i) => console.log(`  [${i}] ${c.name}`))

  if (board.columns.length < 2) throw new Error('Board needs at least 2 columns.')

  // Resolve column positions
  const cols = board.columns
  const colMap = {
    first:  cols[0],
    second: cols[Math.min(1, cols.length - 1)],
    third:  cols[Math.min(2, cols.length - 1)],
    last:   cols[cols.length - 1]
  }

  // Fetch sprints
  const sprints = await prisma.sprint.findMany({
    where: { boardId: BOARD_ID, deleted: false },
    orderBy: { startDate: 'asc' }
  })
  const activeSprint  = sprints.find((s) => s.status === 'ACTIVE')  || null
  const plannedSprint = sprints.find((s) => s.status === 'PLANNED') || null

  console.log(`\n✓ Sprints found:`)
  console.log(`  active  → ${activeSprint  ? activeSprint.name  : 'none'}`)
  console.log(`  planned → ${plannedSprint ? plannedSprint.name : 'none'}`)

  const sprintMap = {
    active:  activeSprint?.id  || null,
    planned: plannedSprint?.id || null,
    null:    null
  }

  // Get max position in each column to append tasks
  const existingTasks = await prisma.task.findMany({
    where: { column: { boardId: BOARD_ID }, deleted: false },
    select: { columnId: true, position: true }
  })
  const positionCounters = {}
  for (const t of existingTasks) {
    positionCounters[t.columnId] = Math.max(positionCounters[t.columnId] ?? -1, t.position)
  }
  const nextPosition = (columnId) => {
    positionCounters[columnId] = (positionCounters[columnId] ?? -1) + 1
    return positionCounters[columnId]
  }

  console.log(`\n📝 Creating ${TASK_POOL.length} tasks...\n`)

  const counts = { primary: 0, secondary: 0, tertiary: 0 }
  let total = 0

  for (const t of TASK_POOL) {
    const col     = colMap[t.column]
    const sprint  = sprintMap[t.sprint ?? 'null']
    const assigneeId = USERS[t.assignee]

    const task = await prisma.task.create({
      data: {
        title:       t.title,
        description: t.description,
        priority:    t.priority,
        labels:      t.labels,
        position:    nextPosition(col.id),
        columnId:    col.id,
        sprintId:    sprint,
        assigneeId:  assigneeId,
        dueDate:     t.dueDate  ?? null,
        createdAt:   t.createdAt,
        updatedAt:   t.createdAt,
      }
    })

    counts[t.assignee]++
    total++

    const assigneeEmail = userMap[assigneeId].split('@')[0]
    console.log(`  ✓ [${col.name.padEnd(12)}] ${task.title.substring(0, 52).padEnd(52)} → ${assigneeEmail} (${task.priority})`)
  }

  console.log(`\n${'═'.repeat(70)}`)
  console.log('✅ Seed completed!')
  console.log(`${'═'.repeat(70)}`)
  console.log(`📊 Summary:`)
  console.log(`   • Total tasks created : ${total}`)
  console.log(`   • Primary   (${USERS.primary.slice(-6)})  : ${counts.primary} tasks`)
  console.log(`   • Secondary (${USERS.secondary.slice(-6)})  : ${counts.secondary} tasks`)
  console.log(`   • Tertiary  (${USERS.tertiary.slice(-6)})  : ${counts.tertiary} tasks`)
  console.log(`${'═'.repeat(70)}\n`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

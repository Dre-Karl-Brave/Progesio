/**
 * Seed script: 5 completed sprints with diverse tasks
 * Board: cmmgoy7ul000bi4zys8m8fhfg
 *
 * Run with: node scripts/seed-completed-sprints.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const BOARD_ID = 'cmmgoy7ul000bi4zys8m8fhfg'
const USER_ID = 'cmm291wkq000gojanj36bhwin'

// Set to true to wipe existing sprints/tasks/columns on this board before seeding
const CLEAR_EXISTING = true

// ─── Date helpers ────────────────────────────────────────────────────────────

const daysAgo = (days) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

const randomDateBetween = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// ─── Extra columns to add (on top of defaults) ───────────────────────────────

const EXTRA_COLUMNS = ['Backlog', 'In Review', 'QA / Testing', 'Blocked']

// ─── Sprint definitions ───────────────────────────────────────────────────────
// All COMPLETED, spread across ~5 months

const SPRINT_DEFS = [
  {
    name: 'Sprint 1 — MVP Foundation',
    goal: 'Bootstrap the project, set up core infrastructure and authentication',
    startDaysAgo: 120,
    endDaysAgo: 107,
  },
  {
    name: 'Sprint 2 — Core Kanban Features',
    goal: 'Build the kanban board, task CRUD, column management and real-time updates',
    startDaysAgo: 100,
    endDaysAgo: 87,
  },
  {
    name: 'Sprint 3 — UX & Accessibility',
    goal: 'Redesign task cards, add keyboard shortcuts, fix a11y, sprint planning UI',
    startDaysAgo: 80,
    endDaysAgo: 67,
  },
  {
    name: 'Sprint 4 — Performance & Security',
    goal: 'Harden the API, reduce bundle size, add caching and audit logging',
    startDaysAgo: 60,
    endDaysAgo: 47,
  },
  {
    name: 'Sprint 5 — Integrations & Launch Prep',
    goal: 'Google OAuth, Slack notifications, CSV export, load testing and launch readiness',
    startDaysAgo: 40,
    endDaysAgo: 27,
  },
]

// ─── Task templates ───────────────────────────────────────────────────────────
// 10 tasks per sprint  (50 total)

const TASK_TEMPLATES = [
  // ── Sprint 1 ─────────────────────────────────────────────────────────────
  [
    {
      title: 'Set up monorepo and branch strategy',
      priority: 'high',
      labels: ['devops', 'setup'],
      description:
        'Initialize the git repository, configure branch protection rules, and document the branching strategy (main / develop / feature / hotfix).',
    },
    {
      title: 'Design system architecture and ERD',
      priority: 'urgent',
      labels: ['architecture', 'documentation'],
      description:
        'Draft the high-level system architecture diagram and entity-relationship diagram covering all core data models.',
    },
    {
      title: 'Implement user registration and login',
      priority: 'urgent',
      labels: ['feature', 'auth', 'backend'],
      description:
        'Build sign-up and sign-in API routes with email/password. Hash passwords with bcrypt, return httpOnly JWT cookie.',
    },
    {
      title: 'Create database schema with Prisma migrations',
      priority: 'high',
      labels: ['database', 'backend', 'migration'],
      description:
        'Write the initial Prisma schema covering User, Board, Column, Task and Sprint models. Run first migration.',
    },
    {
      title: 'Build JWT authentication middleware',
      priority: 'high',
      labels: ['auth', 'security', 'backend'],
      description:
        'Create a reusable getAuthenticatedUser helper that validates the JWT cookie and attaches user context to API requests.',
    },
    {
      title: 'Design wireframes for main screens',
      priority: 'medium',
      labels: ['design', 'ux'],
      description:
        'Produce lo-fi wireframes for dashboard, board view, task detail modal, and sprint planning pages in Figma.',
    },
    {
      title: 'Configure Docker development environment',
      priority: 'medium',
      labels: ['devops', 'infrastructure'],
      description:
        'Write docker-compose.yml with postgres and app services. Ensure hot-reload works inside the container.',
    },
    {
      title: 'Setup ESLint, Prettier and Husky pre-commit hooks',
      priority: 'low',
      labels: ['dx', 'tooling'],
      description:
        'Enforce consistent code style across the repo. Add pre-commit hook that runs lint and format checks.',
    },
    {
      title: 'Write initial API reference documentation',
      priority: 'low',
      labels: ['documentation', 'api'],
      description:
        'Document all auth endpoints in a shared Notion page including request/response examples and error codes.',
    },
    {
      title: 'Create base UI component library',
      priority: 'medium',
      labels: ['frontend', 'design-system'],
      description:
        'Scaffold reusable Button, Input, Badge, Avatar, Modal and Card components using HeroUI as the base.',
    },
  ],

  // ── Sprint 2 ─────────────────────────────────────────────────────────────
  [
    {
      title: 'Build drag-and-drop kanban board',
      priority: 'urgent',
      labels: ['feature', 'frontend', 'dnd'],
      description:
        'Integrate @dnd-kit to support drag-and-drop for tasks between columns and for column reordering.',
    },
    {
      title: 'Implement task CRUD operations',
      priority: 'urgent',
      labels: ['feature', 'backend', 'api'],
      description:
        'POST, PATCH, DELETE endpoints for tasks. Support title, description, priority, labels, dueDate and assignee fields.',
    },
    {
      title: 'Create column management system',
      priority: 'high',
      labels: ['feature', 'backend', 'frontend'],
      description:
        'Allow users to add, rename, reorder and delete columns on their boards with optimistic UI updates.',
    },
    {
      title: 'Add task priority and label tagging',
      priority: 'medium',
      labels: ['feature', 'ui', 'frontend'],
      description:
        'Build a priority selector (low/medium/high/urgent) and a multi-value label input on the task form.',
    },
    {
      title: 'Build team member invitation flow',
      priority: 'high',
      labels: ['feature', 'backend', 'email'],
      description:
        'Allow board owners to invite members by email. Create BoardMember record; send invite email with magic link.',
    },
    {
      title: 'Add real-time column position sync',
      priority: 'medium',
      labels: ['realtime', 'backend'],
      description:
        'Persist column and task position updates to the database immediately. Handle concurrent drag conflicts gracefully.',
    },
    {
      title: 'Implement responsive mobile layout',
      priority: 'medium',
      labels: ['frontend', 'mobile', 'responsive'],
      description:
        'Ensure the board view is usable on phones (≥375 px). Use horizontal scroll for columns on small viewports.',
    },
    {
      title: 'Fix cross-browser compatibility issues',
      priority: 'high',
      labels: ['bug', 'frontend', 'browser'],
      description:
        'Resolve drag-and-drop and CSS grid issues affecting Firefox 120 and Safari 17. Validate in BrowserStack.',
    },
    {
      title: 'Write unit tests for core utilities',
      priority: 'low',
      labels: ['testing', 'backend'],
      description:
        'Add Jest tests for boardAccess helpers, auth utilities, and position calculation functions. Target ≥80 % coverage.',
    },
    {
      title: 'Implement board soft-delete and archive flow',
      priority: 'low',
      labels: ['feature', 'backend'],
      description:
        'Mark boards as deleted (soft-delete) rather than hard-deleting. Add archive/restore endpoints and UI.',
    },
  ],

  // ── Sprint 3 ─────────────────────────────────────────────────────────────
  [
    {
      title: 'Redesign task card component',
      priority: 'high',
      labels: ['design', 'frontend', 'ui'],
      description:
        'Update task cards to show priority color stripe, assignee avatar, label chips and a due-date badge. Use Framer Motion for micro-animations.',
    },
    {
      title: 'Add keyboard shortcuts for power users',
      priority: 'medium',
      labels: ['feature', 'ux', 'frontend'],
      description:
        'Implement global hotkeys: N = new task, / = search, E = edit focused task, Delete = archive. Show shortcut cheatsheet with ?.',
    },
    {
      title: 'Build sprint planning interface',
      priority: 'urgent',
      labels: ['feature', 'frontend', 'sprint'],
      description:
        'Create a sprint planning panel that lets users drag backlog tasks into a sprint, set sprint dates and publish the sprint.',
    },
    {
      title: 'Fix accessibility issues (WCAG 2.1 AA)',
      priority: 'high',
      labels: ['a11y', 'bug', 'frontend'],
      description:
        'Address axe-core audit findings: missing aria-labels, insufficient colour contrast on priority badges, and focus trapping in modals.',
    },
    {
      title: 'Implement drag-and-drop column reordering',
      priority: 'medium',
      labels: ['feature', 'frontend', 'dnd'],
      description:
        'Extend @dnd-kit integration to support reordering of columns. Persist new positions via PATCH /columns/:id.',
    },
    {
      title: 'Add loading skeleton states',
      priority: 'low',
      labels: ['ux', 'frontend'],
      description:
        'Replace spinner-only loading with skeleton screens for board, task list and member list to reduce perceived latency.',
    },
    {
      title: 'Build user settings page',
      priority: 'medium',
      labels: ['feature', 'frontend', 'profile'],
      description:
        'Create a settings page for updating display name, email, password, and notification preferences.',
    },
    {
      title: 'Create custom date-picker component',
      priority: 'low',
      labels: ['frontend', 'component', 'ui'],
      description:
        'Build an accessible date-picker that wraps MUI DatePicker with project styling. Support keyboard navigation.',
    },
    {
      title: 'Implement bulk task selection and actions',
      priority: 'medium',
      labels: ['feature', 'frontend'],
      description:
        'Allow users to shift-click or checkbox-select multiple tasks, then perform bulk move, label, or delete actions.',
    },
    {
      title: 'Add sprint burndown chart (basic)',
      priority: 'high',
      labels: ['feature', 'analytics', 'frontend'],
      description:
        'Display a simple burndown line chart inside the active sprint panel showing tasks remaining vs. ideal burn rate.',
    },
  ],

  // ── Sprint 4 ─────────────────────────────────────────────────────────────
  [
    {
      title: 'Optimize slow database queries',
      priority: 'urgent',
      labels: ['performance', 'database', 'backend'],
      description:
        'Profile API response times with Prisma query logs. Add missing composite indexes; reduce N+1 queries in board and task endpoints.',
    },
    {
      title: 'Implement Redis caching layer',
      priority: 'high',
      labels: ['performance', 'backend', 'infrastructure'],
      description:
        'Cache board membership lookups and column lists in Redis with 60-second TTL. Invalidate on write operations.',
    },
    {
      title: 'Add rate limiting to all API routes',
      priority: 'high',
      labels: ['security', 'backend', 'api'],
      description:
        'Apply express-rate-limit middleware. Auth endpoints: 5 req/min. General API: 100 req/min per user. Return 429 with Retry-After header.',
    },
    {
      title: 'Conduct security audit and fix XSS vulnerabilities',
      priority: 'urgent',
      labels: ['security', 'bug', 'backend'],
      description:
        'Run OWASP ZAP against staging. Fix two reflected-XSS issues in task description rendering and sanitize all user-supplied HTML.',
    },
    {
      title: 'Optimize frontend bundle size',
      priority: 'medium',
      labels: ['performance', 'frontend', 'devops'],
      description:
        'Analyse bundle with webpack-bundle-analyzer. Replace moment.js with date-fns, lazy-load heavy AI dialog components. Target 40 % reduction.',
    },
    {
      title: 'Integrate Sentry for error monitoring',
      priority: 'medium',
      labels: ['observability', 'devops', 'backend'],
      description:
        'Set up Sentry SDK for both Next.js frontend and API routes. Configure source maps upload in CI. Add custom error boundaries.',
    },
    {
      title: 'Build activity audit log',
      priority: 'medium',
      labels: ['feature', 'security', 'backend'],
      description:
        'Log all task create/update/delete and member add/remove events to an AuditLog table. Expose paginated history in board settings.',
    },
    {
      title: 'Fix memory leak in drag-and-drop module',
      priority: 'urgent',
      labels: ['bug', 'frontend', 'memory'],
      description:
        'Profiling shows event listeners are not cleaned up when columns unmount. Fix cleanup in useDraggable and useSortable hooks.',
    },
    {
      title: 'Implement automated database backups',
      priority: 'low',
      labels: ['infrastructure', 'devops', 'database'],
      description:
        'Configure pg_dump cron job on the production host. Upload encrypted snapshots to S3 daily. Test restore procedure.',
    },
    {
      title: 'Write integration tests for sprint lifecycle',
      priority: 'medium',
      labels: ['testing', 'backend', 'qa'],
      description:
        'Cover sprint create → start → complete → task archival flow with Supertest against a real Postgres test database.',
    },
  ],

  // ── Sprint 5 ─────────────────────────────────────────────────────────────
  [
    {
      title: 'Integrate Google OAuth provider',
      priority: 'high',
      labels: ['feature', 'auth', 'backend'],
      description:
        'Add "Sign in with Google" using NextAuth. Link existing email accounts if they match. Persist OAuth tokens for profile photo sync.',
    },
    {
      title: 'Build Slack notification integration',
      priority: 'high',
      labels: ['feature', 'integration', 'backend'],
      description:
        'Post sprint start/complete and @mention notifications to a user-configured Slack webhook. Add settings UI to manage the webhook.',
    },
    {
      title: 'Create CSV and Excel export for sprint data',
      priority: 'medium',
      labels: ['feature', 'data', 'export'],
      description:
        'Export all tasks in a sprint (title, priority, labels, assignee, status, dates) to CSV and XLSX. Downloadable from sprint panel.',
    },
    {
      title: 'Implement sprint insights dashboard',
      priority: 'urgent',
      labels: ['feature', 'analytics', 'frontend'],
      description:
        'Build a sprint insights page showing: total tasks, completed vs incomplete, priority breakdown, label frequency, and cycle time histogram.',
    },
    {
      title: 'Add email notification system',
      priority: 'high',
      labels: ['feature', 'email', 'backend'],
      description:
        'Send transactional emails via Resend: task assigned, due date approaching (48 h), and sprint starting tomorrow. Use React Email templates.',
    },
    {
      title: 'Build interactive onboarding tutorial',
      priority: 'medium',
      labels: ['ux', 'frontend', 'onboarding'],
      description:
        'Guide new users through creating their first board, adding columns, creating a task and inviting a teammate using a step-by-step spotlight overlay.',
    },
    {
      title: 'Conduct load testing (1 000 concurrent users)',
      priority: 'high',
      labels: ['qa', 'performance', 'devops'],
      description:
        'Use k6 to simulate 1 000 concurrent users across board load and task update endpoints. Identify and fix bottlenecks before launch.',
    },
    {
      title: 'Word document export for sprint report',
      priority: 'medium',
      labels: ['feature', 'export', 'docx'],
      description:
        'Generate a formatted .docx sprint report using the docx package: sprint summary, task table, priority chart description, and recommendations.',
    },
    {
      title: 'Fix production deployment pipeline',
      priority: 'urgent',
      labels: ['bug', 'devops', 'ci-cd'],
      description:
        'CI deploy to Vercel fails on Prisma generate step. Root cause: missing DATABASE_URL in build env. Fix env vars and add smoke test step.',
    },
    {
      title: 'Write public API SDK documentation',
      priority: 'low',
      labels: ['documentation', 'api', 'developer-experience'],
      description:
        'Document every public API endpoint in a Docusaurus site with code examples in JavaScript, Python and cURL. Publish to docs subdomain.',
    },
  ],
]

// ─── Column distribution for completed sprints ────────────────────────────────
// We purposefully spread tasks to show realistic sprint progression data
// Indices reference the final sorted columns array

const COLUMN_DIST = [
  // sprint 1 — early sprint, mostly done
  ['Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'In Review', 'In Review', 'Blocked'],
  // sprint 2 — strong delivery
  ['Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'QA / Testing', 'In Review'],
  // sprint 3 — some items stuck
  ['Done', 'Done', 'Done', 'Done', 'Done', 'In Review', 'In Review', 'QA / Testing', 'Blocked', 'Done'],
  // sprint 4 — most done, a couple in review
  ['Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'In Review', 'QA / Testing'],
  // sprint 5 — strong finish
  ['Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'In Review'],
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting seed: completed sprints\n')

  // Verify user and board
  const user = await prisma.user.findUnique({ where: { id: USER_ID } })
  if (!user) throw new Error(`User ${USER_ID} not found`)
  console.log(`✓ User: ${user.email}`)

  const board = await prisma.board.findUnique({ where: { id: BOARD_ID } })
  if (!board) throw new Error(`Board ${BOARD_ID} not found`)
  console.log(`✓ Board: ${board.name}\n`)

  // ── Optional cleanup ────────────────────────────────────────────────────
  if (CLEAR_EXISTING) {
    console.log('🧹 Clearing existing data on this board...')

    // Hard-delete tasks on this board's columns
    const cols = await prisma.column.findMany({ where: { boardId: BOARD_ID } })
    const colIds = cols.map((c) => c.id)
    const deletedTasks = await prisma.task.deleteMany({ where: { columnId: { in: colIds } } })
    console.log(`   Deleted ${deletedTasks.count} tasks`)

    // Hard-delete sprints
    const deletedSprints = await prisma.sprint.deleteMany({ where: { boardId: BOARD_ID } })
    console.log(`   Deleted ${deletedSprints.count} sprints`)

    // Hard-delete columns
    const deletedCols = await prisma.column.deleteMany({ where: { boardId: BOARD_ID } })
    console.log(`   Deleted ${deletedCols.count} columns\n`)
  }

  // ── Create columns ──────────────────────────────────────────────────────
  console.log('📋 Creating columns...')

  const columnNames = ['Backlog', 'To Do', 'In Progress', 'In Review', 'QA / Testing', 'Done', 'Blocked']
  const createdColumns = []

  for (let i = 0; i < columnNames.length; i++) {
    const col = await prisma.column.create({
      data: {
        name: columnNames[i],
        position: i,
        boardId: BOARD_ID,
        createdAt: daysAgo(130),
      },
    })
    createdColumns.push(col)
    console.log(`   ✓ [${i}] ${col.name}`)
  }

  // Build a lookup map for column names
  const columnByName = Object.fromEntries(createdColumns.map((c) => [c.name, c]))
  console.log()

  // ── Create sprints and tasks ────────────────────────────────────────────
  let totalTasks = 0

  for (let si = 0; si < SPRINT_DEFS.length; si++) {
    const def = SPRINT_DEFS[si]
    const startDate = daysAgo(def.startDaysAgo)
    const endDate = daysAgo(def.endDaysAgo)
    const completedAt = new Date(endDate.getTime() + 1000 * 60 * 60 * 2) // 2 h after end
    const createdAt = daysAgo(def.startDaysAgo + 5) // created 5 days before sprint start

    const sprint = await prisma.sprint.create({
      data: {
        name: def.name,
        goal: def.goal,
        status: 'COMPLETED',
        startDate,
        endDate,
        completedAt,
        createdAt,
        updatedAt: completedAt,
        boardId: BOARD_ID,
      },
    })

    console.log(`📅 ${sprint.name}`)
    console.log(`   ${startDate.toDateString()} → ${endDate.toDateString()}`)
    console.log(`   ${'─'.repeat(62)}`)

    const tasks = TASK_TEMPLATES[si]
    const dist = COLUMN_DIST[si]

    for (let ti = 0; ti < tasks.length; ti++) {
      const tmpl = tasks[ti]
      const targetColumnName = dist[ti]
      const column = columnByName[targetColumnName]

      // Diverse createdAt: spread randomly across the sprint + up to 3 days before
      const taskCreatedAt = randomDateBetween(
        new Date(startDate.getTime() - 1000 * 60 * 60 * 24 * 3),
        new Date(endDate.getTime() - 1000 * 60 * 60 * 24 * 2)
      )

      // updatedAt: after createdAt but before sprint end
      const taskUpdatedAt = randomDateBetween(
        taskCreatedAt,
        endDate
      )

      // archivedAt: at or slightly after sprint completion (simulates sprint complete action)
      const archivedAt = new Date(
        completedAt.getTime() + Math.random() * 1000 * 60 * 10
      )

      // dueDate: varied — some before sprint end, some slightly overdue, some null
      let dueDate = null
      const dueDateRoll = ti % 5
      if (dueDateRoll === 0) {
        // no due date
        dueDate = null
      } else if (dueDateRoll === 1) {
        // due mid-sprint
        dueDate = randomDateBetween(startDate, endDate)
      } else if (dueDateRoll === 2) {
        // due at sprint end
        dueDate = new Date(endDate.getTime() - 1000 * 60 * 60 * 12)
      } else if (dueDateRoll === 3) {
        // slightly overdue (2 days after end)
        dueDate = new Date(endDate.getTime() + 1000 * 60 * 60 * 48)
      } else {
        // due 3 days before sprint end
        dueDate = new Date(endDate.getTime() - 1000 * 60 * 60 * 72)
      }

      const task = await prisma.task.create({
        data: {
          title: tmpl.title,
          description: tmpl.description,
          priority: tmpl.priority,
          labels: tmpl.labels,
          position: ti,
          columnId: column.id,
          sprintId: sprint.id,
          assigneeId: USER_ID,
          dueDate,
          createdAt: taskCreatedAt,
          updatedAt: taskUpdatedAt,
          deleted: true,
          archivedAt,
        },
      })

      totalTasks++

      const dueDateStr = dueDate ? dueDate.toISOString().split('T')[0] : '—'
      console.log(`   ✓ [${targetColumnName.padEnd(14)}] ${task.title}`)
      console.log(`     ${task.priority.padEnd(7)} | due: ${dueDateStr.padEnd(12)} | ${task.labels.join(', ')}`)
    }

    console.log()
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log('═'.repeat(70))
  console.log('✅ Seed completed!')
  console.log('═'.repeat(70))
  console.log(`   Sprints : ${SPRINT_DEFS.length} (all COMPLETED)`)
  console.log(`   Columns : ${columnNames.length}`)
  console.log(`   Tasks   : ${totalTasks} (archived, ready for sprint insights)`)
  console.log(`   Board   : ${board.name}`)
  console.log(`   User    : ${user.email}`)
  console.log('═'.repeat(70))
  console.log('\nTip: run `npx prisma studio` to browse the seeded data.\n')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType, VerticalAlign
} = require('docx')
const fs = require('fs')
const path = require('path')

// ── Helpers ────────────────────────────────────────────

const divider = () => new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'E2E8F0' } },
  spacing: { before: 200, after: 200 }
})

const gap = (size = 120) => new Paragraph({ spacing: { before: size } })

const h1 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 52, color: '0F172A', font: 'Calibri' })],
  spacing: { before: 0, after: 160 }
})

const h2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 36, color: '0F172A', font: 'Calibri' })],
  spacing: { before: 440, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' } }
})

const h3 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 26, color: '0F172A', font: 'Calibri' })],
  spacing: { before: 320, after: 120 }
})

const h4 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 22, color: '374151', font: 'Calibri' })],
  spacing: { before: 200, after: 80 }
})

const body = (text, indent = false) => new Paragraph({
  children: [new TextRun({ text, size: 21, color: '374151', font: 'Calibri' })],
  spacing: { after: 80 },
  indent: indent ? { left: 240 } : undefined
})

const bullet = (text, bold = '') => new Paragraph({
  bullet: { level: 0 },
  children: [
    ...(bold ? [new TextRun({ text: bold, bold: true, size: 21, color: '0F172A', font: 'Calibri' })] : []),
    new TextRun({ text: bold ? `  ${text}` : text, size: 21, color: '374151', font: 'Calibri' })
  ],
  spacing: { after: 60 },
  indent: { left: 360, hanging: 240 }
})

const subbullet = (text) => new Paragraph({
  bullet: { level: 1 },
  children: [new TextRun({ text, size: 20, color: '64748B', font: 'Calibri' })],
  spacing: { after: 40 },
  indent: { left: 720, hanging: 240 }
})

const badge = (label, bg, textColor) => new Table({
  width: { size: 18, type: WidthType.PERCENTAGE },
  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideH: { style: BorderStyle.NONE }, insideV: { style: BorderStyle.NONE } },
  rows: [new TableRow({ children: [new TableCell({
    shading: { type: ShadingType.CLEAR, fill: bg },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, bold: true, size: 18, color: textColor, font: 'Calibri' })] })]
  })] })]
})

const infoBox = (text, bg = 'F0F9FF', border = '0EA5E9') => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 4, color: border },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: border },
    left: { style: BorderStyle.THICK, size: 12, color: border },
    right: { style: BorderStyle.NONE },
    insideH: { style: BorderStyle.NONE }, insideV: { style: BorderStyle.NONE }
  },
  rows: [new TableRow({ children: [new TableCell({
    shading: { type: ShadingType.CLEAR, fill: bg },
    margins: { top: 120, bottom: 120, left: 180, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text, size: 20, color: '374151', font: 'Calibri' })] })]
  })] })]
})

const stepTable = (steps) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
    insideH: { style: BorderStyle.SINGLE, size: 2, color: 'F1F5F9' },
    insideV: { style: BorderStyle.SINGLE, size: 2, color: 'F1F5F9' }
  },
  rows: steps.map(([num, label, desc], i) => new TableRow({
    children: [
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? 'F8FAFC' : 'FFFFFF' },
        width: { size: 6, type: WidthType.PERCENTAGE },
        margins: { top: 100, bottom: 100, left: 120, right: 80 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: num, bold: true, size: 20, color: '6366F1', font: 'Calibri' })] })]
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? 'F8FAFC' : 'FFFFFF' },
        width: { size: 25, type: WidthType.PERCENTAGE },
        margins: { top: 100, bottom: 100, left: 120, right: 80 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, color: '0F172A', font: 'Calibri' })] })]
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? 'F8FAFC' : 'FFFFFF' },
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: desc, size: 20, color: '374151', font: 'Calibri' })] })]
      })
    ]
  }))
})

// ── Document ───────────────────────────────────────────

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const doc = new Document({
  styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
  numbering: {
    config: [{
      reference: 'bullet-list',
      levels: [
        { level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT },
        { level: 1, format: 'bullet', text: '◦', alignment: AlignmentType.LEFT }
      ]
    }]
  },
  sections: [{
    properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
    children: [

      // ── Cover ────────────────────────────────────────
      new Paragraph({
        children: [new TextRun({ text: 'Progresio', bold: true, size: 28, color: '6366F1', font: 'Calibri' })],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [new TextRun({ text: 'AI Features', bold: true, size: 72, color: '0F172A', font: 'Calibri' })],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Full Implementation & Feature Guide', size: 28, color: '64748B', font: 'Calibri' })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: `Prepared ${today}`, size: 20, color: '94A3B8', font: 'Calibri' })],
        spacing: { after: 80 }
      }),
      divider(),

      // ── Overview ─────────────────────────────────────
      h2('Overview'),
      body('Progresio embeds AI directly into the kanban board experience through two intelligence panels: Task-level Intelligence and Board-level Intelligence. Both are accessible from the AI button fixed to the bottom-right corner of any board.'),
      gap(80),
      body('Task-level Intelligence focuses on individual tasks — estimating effort, breaking down complex work, and organizing priorities. Board-level Intelligence takes a wider view of the entire board — detecting risks, analyzing completed sprints, and balancing workload across the team.'),
      gap(80),
      infoBox('All AI features use Google Gemini 2.5 Flash. No mutations happen until you explicitly press Apply — every feature has an Apply and Discard/Close option so results are always reviewed first.', 'F0F9FF', '6366F1'),
      gap(),

      divider(),

      // ══════════════════════════════════════════════════
      // TASK INTELLIGENCE
      // ══════════════════════════════════════════════════
      h2('Task-Level Intelligence'),
      body('Access: AI button → "Task-level intelligence". Three features are available, selected via radio cards.'),
      gap(),

      // ── 1. Estimate Effort ────────────────────────────
      h3('1.  Estimate Effort'),
      body('AI analyzes the title and description of selected tasks and estimates how long each one will realistically take. It then computes a suggested due date based on the time estimate, taking into account the task\'s existing due date if one is already set.'),
      gap(80),

      h4('How to use'),
      stepTable([
        ['1', 'Select feature', 'Choose "Estimate Effort" on the feature selection screen and press Run.'],
        ['2', 'Select tasks', 'Pick one or more tasks from the multi-select dropdown. Tasks show their title and current column.'],
        ['3', 'Analyze', 'Press Analyze. A progress bar appears with live status messages while AI processes.'],
        ['4', 'Review results', 'Each task gets its own result card. Review the estimates, then Apply or Discard.'],
      ]),
      gap(),

      h4('What the results show'),
      bullet('Complexity badge — Simple, Moderate, or Complex'),
      bullet('Estimated time range — e.g. "2–4 hours" or "3–5 days"'),
      bullet('Confidence level — indicated by a colored dot (high / medium / low)'),
      bullet('Contributing factors — the main reasons behind the estimate'),
      bullet('Current due date → Expected due date — shown side by side with an arrow'),
      gap(),

      h4('Apply / Discard'),
      bullet('Apply', '— Updates the due date on every analyzed task to match the AI\'s suggested date.'),
      bullet('Discard', '— Closes the dialog without touching any task data.'),
      gap(),

      infoBox('Toast on success: "Due dates updated for X tasks."', 'F0FDF4', '22C55E'),
      gap(),
      divider(),

      // ── 2. Generate Subtasks ──────────────────────────
      h3('2.  Generate Subtasks'),
      body('AI scans the entire board for tasks that are too large to complete in a single focused session. It identifies these "big tasks" and lets you choose which ones to break down. For each selected task, it generates a list of focused, actionable subtasks.'),
      gap(80),

      h4('How to use'),
      stepTable([
        ['1', 'Select feature', 'Choose "Generate Subtasks" on the feature selection screen and press Run.'],
        ['2', 'Auto-scan', 'AI automatically scans all board tasks — no input needed at this step.'],
        ['3', 'Review big tasks', 'A checkbox list appears showing tasks identified as too complex, each with a reason and column badge.'],
        ['4', 'Select tasks', 'Check the tasks you want to break down. Uncheck any you want to skip.'],
        ['5', 'Generate', 'Press Generate. AI creates specific subtasks for each selected task.'],
        ['6', 'Review results', 'Each parent task shows its generated subtask cards. Then Apply or Discard.'],
      ]),
      gap(),

      h4('What the results show'),
      bullet('Parent task title — shown with a branch icon'),
      bullet('Subtask cards — indented under the parent, each with a title and description'),
      gap(),

      h4('Apply / Discard'),
      bullet('Apply', '— Creates all subtasks on the board. Each subtask is placed in the same column as its parent task with a Low priority.'),
      bullet('Discard', '— Closes without creating anything.'),
      gap(),

      infoBox('Toast on success: "X subtasks created across Y tasks."', 'F0FDF4', '22C55E'),
      gap(),
      divider(),

      // ── 3. Organize Tasks ─────────────────────────────
      h3('3.  Organize Tasks'),
      body('AI reviews the priority level of selected tasks and either recommends a new priority or confirms that the current one is correct. Each suggestion comes with a short explanation of the reasoning.'),
      gap(80),

      h4('How to use'),
      stepTable([
        ['1', 'Select feature', 'Choose "Organize Tasks" on the feature selection screen and press Run.'],
        ['2', 'Select tasks', 'Pick the tasks you want reviewed from the multi-select dropdown.'],
        ['3', 'Analyze', 'Press Analyze. Progress bar appears while AI evaluates each task.'],
        ['4', 'Review results', 'Each task shows a priority recommendation. Then Apply or Discard.'],
      ]),
      gap(),

      h4('What the results show'),
      bullet('Current priority badge → Suggested priority badge (e.g. Medium → High)'),
      bullet('If no change is needed — a green "Retained" label with a checkmark appears instead of an arrow'),
      bullet('Reason — one to two sentences explaining why the priority should change or stay'),
      gap(),

      h4('Priority levels used'),
      bullet('Urgent', '— Blocking other work, production issue, or critically overdue.'),
      bullet('High', '— Important and time-sensitive. Should be done in the current cycle.'),
      bullet('Medium', '— Standard work. Important but not blocking.'),
      bullet('Low', '— Nice to have, non-blocking, or can be deferred.'),
      gap(),

      h4('Apply / Discard'),
      bullet('Apply', '— Updates priority only for tasks where a change was recommended. Retained tasks are untouched.'),
      bullet('Discard', '— Closes without making any changes.'),
      gap(),

      infoBox('Toast on success: "Priority updated for X tasks."', 'F0FDF4', '22C55E'),
      gap(),

      divider(),

      // ══════════════════════════════════════════════════
      // BOARD INTELLIGENCE
      // ══════════════════════════════════════════════════
      h2('Board-Level Intelligence'),
      body('Access: AI button → "Board-level intelligence". Three features are available. Sprint Insights and Workload Balance are fully implemented. Workload Balance is the third card.'),
      gap(),

      // ── 1. Detect Bottlenecks ─────────────────────────
      h3('1.  Detect Bottlenecks'),
      body('AI scans every task on the board and flags the ones that are at risk — due to missing planning data, inactivity, or deadline issues. No task selection is needed; the AI reviews everything automatically.'),
      gap(80),

      h4('How to use'),
      stepTable([
        ['1', 'Select feature', 'Choose "Detect Bottlenecks" and press Run.'],
        ['2', 'Auto-scan', 'AI scans all board tasks automatically. A progress bar appears during analysis.'],
        ['3', 'Review results', 'An AI summary and a list of flagged tasks appear. Press Download or Close.'],
      ]),
      gap(),

      h4('Bottleneck signals detected'),
      bullet('No due date', '— Task has no deadline assigned. Skipped if task is in a done/completed column.'),
      bullet('No sprint', '— Task is not assigned to any sprint. Skipped if column suggests intentional backlog.'),
      bullet('Stale', '— Task was never modified after creation and is older than 2 days.'),
      bullet('Overdue', '— Task\'s due date has already passed.'),
      bullet('Long inactive', '— Task has not been updated in 3+ days while sitting in an active column.'),
      gap(),

      h4('Risk levels'),
      bullet('High risk', '— 3 or more signals present, or overdue + stale together.'),
      bullet('Medium risk', '— 2 signals, or overdue or stale alone in an active column.'),
      bullet('Low risk', '— 1 minor signal such as missing due date but recently updated.'),
      gap(),

      h4('What the results show'),
      bullet('Amber summary box — AI\'s 2–3 sentence overview of overall board health'),
      bullet('Per-task cards — task title, risk level badge, column badge, and reason chips'),
      gap(),

      h4('Download Report'),
      body('Press Download to generate a professionally formatted Word document (.docx) containing:', true),
      subbullet('Report title and generation date'),
      subbullet('Full AI summary paragraph'),
      subbullet('One formatted card per bottleneck — title, column, risk level, and issue list'),
      subbullet('Disclaimer footer'),
      gap(),
      divider(),

      // ── 2. Sprint Insights ────────────────────────────
      h3('2.  Sprint Insights'),
      body('AI analyzes a completed sprint in full detail — how tasks were distributed, what priorities dominated, which areas of the product were touched, and whether the team delivered on time. Results include animated bar charts and a structured written narrative.'),
      gap(80),

      h4('How to use'),
      stepTable([
        ['1', 'Select feature', 'Choose "Sprint Insights" and press Run.'],
        ['2', 'Select sprint', 'A list of completed sprints appears as selectable cards showing name, date range, duration, and goal. Pick one.'],
        ['3', 'Analyze', 'Press Analyze. AI processes all tasks from that sprint including archived tasks.'],
        ['4', 'Review results', 'Charts, stats, and AI analysis appear. Press Download or Close.'],
      ]),
      gap(),

      h4('Key stat cards'),
      bullet('Total Tasks — total number of tasks in the sprint'),
      bullet('Completed — tasks that ended in a done/completed column'),
      bullet('Duration — number of days the sprint ran'),
      bullet('On Time — whether the sprint was completed before its end date'),
      gap(),

      h4('Bar charts (animated)'),
      bullet('Tasks by Status', '— shows how many tasks ended up in each column'),
      bullet('Priority Mix', '— breakdown of urgent / high / medium / low tasks'),
      bullet('Top Labels', '— the most frequently used task labels/categories in the sprint'),
      body('All bars animate from 0% on mount with a slight stagger so they fill in one by one.', true),
      gap(),

      h4('AI Analysis sections'),
      bullet('Overview', '— What the sprint set out to do and whether the goal was met.'),
      bullet('Delivery', '— Which tasks were completed and which were not.'),
      bullet('Priority & Focus', '— What the priority mix reveals about the sprint\'s workload.'),
      bullet('Patterns', '— Label and category trends; which product areas were most active.'),
      bullet('Recommendation', '— One specific, actionable suggestion for the next sprint.'),
      gap(),

      h4('Download Report'),
      body('Press Download to generate a Word document (.docx) containing:', true),
      subbullet('Sprint details table — name, goal, dates, duration, on-time status'),
      subbullet('Three stats tables — tasks by status, priority distribution, top labels'),
      subbullet('Full AI narrative with all 5 sections'),
      subbullet('Disclaimer footer'),
      gap(),
      divider(),

      // ── 3. Workload Balance ───────────────────────────
      h3('3.  Workload Balance'),
      body('AI reviews how tasks are distributed across every team member on the board. It calculates a weighted workload score per person (factoring in priority levels), identifies who is overloaded and who has capacity, and suggests specific tasks to reassign.'),
      gap(80),

      h4('How to use'),
      stepTable([
        ['1', 'Select feature', 'Choose "Workload Balance" and press Run.'],
        ['2', 'Auto-scan', 'AI scans all board members and their assigned tasks automatically.'],
        ['3', 'Review results', 'Charts, summary, and suggestions appear. Check suggestions and Apply or Close.'],
      ]),
      gap(),

      h4('Key stat cards'),
      bullet('Team Size — number of members on the board'),
      bullet('Total Tasks — total assigned tasks across all members'),
      bullet('Most Loaded — the member with the highest task count'),
      bullet('Avg per Person — average number of tasks per member'),
      gap(),

      h4('Bar chart'),
      body('One horizontal bar per team member, sorted by task count (highest first). Each bar uses the same color as that person\'s avatar throughout the rest of the app so the chart is immediately recognizable. A load badge (High / Medium / Low) appears beside each bar.', true),
      gap(),

      h4('Load levels'),
      bullet('High load', '— Weighted workload score is 60% or more above the team average.'),
      bullet('Medium load', '— Weighted score is within normal range of the average.'),
      bullet('Low load', '— Weighted score is below 80% of the team average — has clear capacity.'),
      body('Priority weighting: Urgent = 4 points, High = 3, Medium = 2, Low = 1. A member with many urgent tasks scores higher than one with many low-priority tasks.', true),
      gap(),

      h4('Suggested Reassignments'),
      body('Each suggestion is a checkbox card showing:', true),
      subbullet('Task title'),
      subbullet('From person (red badge) → To person (green badge)'),
      subbullet('AI\'s one-sentence reason for the suggestion'),
      gap(),
      body('Suggestions follow these rules:', true),
      subbullet('Only moves tasks from members with high load or significantly above average'),
      subbullet('Only moves to members with low or medium load below average'),
      subbullet('Prefers medium and low priority tasks — avoids moving urgent tasks'),
      subbullet('Returns no suggestions if the board is already balanced (difference ≤ 2 tasks)'),
      gap(),

      h4('Apply / Close'),
      bullet('Apply Rebalancing (N)', '— Updates the assignee on each checked task and refreshes the board. The count in the button updates live as you check/uncheck.'),
      bullet('Close', '— Closes without making any changes. Suggestions are completely optional.'),
      gap(),

      infoBox('Toast on success: "X tasks reassigned successfully."', 'F0FDF4', '22C55E'),
      gap(),

      divider(),

      // ── Shared behaviors ──────────────────────────────
      h2('Shared Behaviors'),

      h4('AI Model'),
      body('All features use Google Gemini 2.5 Flash for fast, high-quality responses.'),
      gap(80),

      h4('Loading Experience'),
      body('Every AI operation shows a progress bar with cycling status messages specific to what the AI is currently doing. The dialog cannot be closed while AI is processing.'),
      gap(80),

      h4('Apply-first design'),
      body('No mutations happen until the user explicitly presses Apply. Every feature offers a Discard or Close option that exits without touching any data.'),
      gap(80),

      h4('Success Toasts'),
      body('A toast notification appears in the top-right corner after every successful apply operation, confirming what changed and how many items were affected.'),
      gap(80),

      h4('Board refresh'),
      body('After any successful apply, the board automatically refreshes so changes are visible immediately without a page reload.'),

      divider(),

      // Footer
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Progresio — AI Features Documentation  ·  Internal Use', size: 17, color: '94A3B8', italics: true, font: 'Calibri' })],
        spacing: { before: 160 }
      })
    ]
  }]
})

// ── Output ─────────────────────────────────────────────

Packer.toBuffer(doc).then((buffer) => {
  const out = path.join(__dirname, 'progresio-ai-features.docx')
  fs.writeFileSync(out, buffer)
  console.log(`✅ Document saved to: ${out}`)
})

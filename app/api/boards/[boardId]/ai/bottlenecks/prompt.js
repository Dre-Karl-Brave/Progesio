/**
 * Builds the prompt to detect bottleneck tasks on a board.
 * @param {Array} tasks - Enriched task objects with computed staleness fields
 * @param {string} today - Human-readable today's date
 * @returns {string}
 */
export function buildBottleneckPrompt(tasks, today) {
  const taskBlock = tasks
    .map((t) =>
      [
        `Task ID: ${t.id}`,
        `Title: ${t.title}`,
        `Column (status): ${t.column}`,
        `Priority: ${t.priority}`,
        `Due date: ${t.dueDate || 'None'}`,
        `Sprint: ${t.sprint || 'None — sitting in Backlog'}`,
        `Assignee: ${t.assignee || 'Unassigned'}`,
        `Created: ${t.createdAt} (${t.ageInDays} day${t.ageInDays !== 1 ? 's' : ''} ago)`,
        `Last updated: ${t.lastUpdated} (${t.daysSinceUpdate} day${t.daysSinceUpdate !== 1 ? 's' : ''} ago)`,
        `Never modified since creation: ${t.neverModified}`,
        `Overdue: ${t.overdue}`
      ].join('\n')
    )
    .join('\n\n---\n\n')

  return `You are a project management expert auditing a software development board for bottlenecks and risks.

Today is ${today}.

Your job is to identify tasks that are blocking progress, at risk of delays, or being neglected. A task is a bottleneck if it has one or more of the following signals:

BOTTLENECK SIGNALS:
1. No due date — deadline visibility is missing (skip this signal if the task is clearly in a done/completed/closed column)
2. No sprint — not planned in any sprint (skip if the column name suggests it is intentionally in a backlog)
3. Stale — neverModified is true AND the task is older than 2 days (the task has been ignored since it was created)
4. Overdue — due date is in the past
5. Long inactive — daysSinceUpdate >= 3 AND the column name suggests an active state (e.g. In Progress, Review, Doing)

SEVERITY RULES:
- high: 3 or more signals, OR overdue + stale together, OR overdue + long inactive in an active column
- medium: exactly 2 signals, OR overdue alone, OR stale alone in an active column
- low: exactly 1 minor signal (e.g. no sprint but has a due date, or no due date but recently updated)

GUIDELINES:
- Do NOT flag tasks in done/completed/closed columns as bottlenecks unless they are overdue.
- Reasons must be short and factual — e.g. "No due date", "No sprint assigned", "Stale for 4 days", "Overdue by 2 days", "Inactive in In Progress for 5 days".
- Only include tasks that have at least one bottleneck signal.
- Write the summary in 2–3 sentences covering: how many tasks are affected, what the dominant patterns are, and the most urgent risk.

---

BOARD TASKS (${tasks.length} total):

${taskBlock}

---

Return ONLY a valid JSON object. No markdown fences, no explanation, no extra text.

{
  "summary": "<2-3 sentences about overall board bottleneck health>",
  "bottlenecks": [
    {
      "id": "<exact task id>",
      "title": "<exact task title>",
      "column": "<column name>",
      "severity": "high" | "medium" | "low",
      "reasons": ["<concise signal>"]
    }
  ]
}`
}

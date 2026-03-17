/**
 * Builds the prompt to scan tasks and identify which ones are "big" and need breakdown.
 * @param {Array<{ id: string, title: string, description: string|null, priority: string, column: { name: string } }>} tasks
 * @returns {string}
 */
export function buildScanPrompt(tasks) {
  const taskBlock = tasks
    .map((t) =>
      [
        `Task ID: ${t.id}`,
        `Title: ${t.title}`,
        `Description: ${t.description?.trim() || 'No description provided'}`,
        `Priority: ${t.priority}`,
        `Column: ${t.column.name}`
      ].join('\n')
    )
    .join('\n\n---\n\n')

  return `You are an experienced software engineering lead reviewing a project board.

Your job is to identify which tasks are too large or broad to be completed as a single unit of work and would benefit from being broken down into smaller subtasks.

---

CRITERIA FOR A "BIG TASK" (needs breakdown):
- The title or description implies multiple distinct steps or deliverables
- The task spans more than one area of the system (e.g., frontend + backend + database)
- It would take more than 2 days to complete as a single unit
- The description is vague and covers a broad feature or goal
- It contains the words "and", "also", "plus", "with", or lists multiple things to do
- High-priority tasks with broad scope that would benefit from clear subtask tracking

CRITERIA TO SKIP (not a big task):
- Clearly scoped, single-action items (e.g., "Fix typo in footer", "Update button color")
- Bug fixes with a known root cause
- Tasks already in a "Done" or "Completed" column

---

TASKS TO ANALYZE:

${taskBlock}

---

Return ONLY a valid JSON object. No markdown, no explanation, no extra text.

If no tasks qualify, return an empty array.

{
  "bigTasks": [
    {
      "id": "<exact task id>",
      "reason": "<one concise sentence explaining why this task needs breakdown>"
    }
  ]
}`
}

/**
 * Builds the prompt to analyze tasks and suggest priority levels.
 * @param {Array<{ id: string, title: string, description: string|null, priority: string, dueDate: string|null, column: { name: string } }>} tasks
 * @returns {string}
 */
export function buildOrganizePrompt(tasks) {
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const taskBlock = tasks
    .map((t) => {
      const due = t.dueDate
        ? new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'None'
      return [
        `Task ID: ${t.id}`,
        `Title: ${t.title}`,
        `Description: ${t.description?.trim() || 'No description provided'}`,
        `Current priority: ${t.priority}`,
        `Current column (status): ${t.column.name}`,
        `Due date: ${due}`
      ].join('\n')
    })
    .join('\n\n---\n\n')

  return `You are an experienced software engineering lead reviewing a project board.

Today's date is ${today}.

Your job is to evaluate the priority of each task and suggest whether it should be changed or retained. Base your judgment on the task's scope, urgency, due date proximity, current workflow status, and how well the existing priority reflects its real importance.

---

PRIORITY LEVELS:
- urgent  → Blocking other work, production issue, or critically overdue. Needs immediate attention.
- high    → Important and time-sensitive. Should be completed in the current sprint or cycle.
- medium  → Standard work. Important but not blocking anything. Normal sprint inclusion.
- low     → Nice to have, non-blocking, or can be deferred without impact.

REASONING GUIDELINES:
- If the due date is within 3 days and priority is low or medium, suggest upgrading.
- If a task is in "Done" or a completed column, suggest low or retain.
- If a task is in "In Progress" and has high scope, consider upgrading.
- If current priority already fits, set changed to false and explain why it's correct as-is.
- Keep reasons concise — one or two sentences maximum.

---

TASKS TO ANALYZE:

${taskBlock}

---

Return ONLY a valid JSON object. No markdown, no explanation, no extra text.

{
  "suggestions": [
    {
      "id": "<exact task id>",
      "suggestedPriority": "low" | "medium" | "high" | "urgent",
      "changed": true | false,
      "reason": "<one or two sentences explaining the suggested priority or why it is retained>"
    }
  ]
}`
}

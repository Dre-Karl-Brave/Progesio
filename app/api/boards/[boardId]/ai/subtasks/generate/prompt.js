/**
 * Builds the prompt to generate subtasks for a list of big tasks.
 * @param {Array<{ id: string, title: string, description: string|null, priority: string, column: { name: string } }>} tasks
 * @returns {string}
 */
export function buildGeneratePrompt(tasks) {
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

  return `You are an experienced software engineering lead breaking down large tasks into concrete, actionable subtasks.

For each task provided, generate 3 to 6 subtasks that together fully cover the scope of the parent task.

---

SUBTASK GUIDELINES:
- Each subtask should be independently completable by one developer
- Subtasks should be ordered logically (e.g., backend before frontend, schema before API)
- Titles should be short, action-oriented, and specific (start with a verb: "Create", "Build", "Add", "Update", "Write", "Fix")
- Descriptions should provide just enough context for a developer to start work
- Do not create subtasks that are too granular (e.g., "Open the file") or too vague (e.g., "Do the backend part")
- Aim for subtasks that take between 30 minutes and half a day each

---

TASKS TO BREAK DOWN:

${taskBlock}

---

Return ONLY a valid JSON object. No markdown, no explanation, no extra text.

{
  "subtasks": [
    {
      "parentId": "<exact parent task id>",
      "items": [
        {
          "title": "<short action-oriented subtask title>",
          "description": "<1-2 sentence description of what needs to be done>"
        }
      ]
    }
  ]
}`
}

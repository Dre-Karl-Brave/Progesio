const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null

/**
 * Builds the effort estimation prompt for a list of tasks.
 * @param {Array<{ id: string, title: string, description: string|null, priority: string, dueDate: string|null, column: { name: string } }>} tasks
 * @returns {string}
 */
export function buildEstimatePrompt(tasks) {
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const taskBlock = tasks
    .map((t) => {
      const existingDue = fmtDate(t.dueDate)
      return [
        `Task ID: ${t.id}`,
        `Title: ${t.title}`,
        `Description: ${t.description?.trim() || 'No description provided'}`,
        `Priority: ${t.priority}`,
        `Current column (status): ${t.column.name}`,
        `Existing due date: ${existingDue || 'None'}`
      ].join('\n')
    })
    .join('\n\n---\n\n')

  return `You are an experienced software engineering lead with deep expertise in effort estimation across frontend, backend, and full-stack projects.

Today's date is ${today}.

Your job is to analyze each task below and produce a realistic, well-reasoned effort estimate. Base your analysis on the task title, description, priority, current workflow status, and existing due date.

---

ESTIMATION GUIDELINES:

Complexity levels:
- low     → Straightforward, well-understood work. Minimal unknowns. Examples: updating copy, fixing a known bug, adding a config flag.
- medium  → Requires design decisions or cross-cutting concerns. Some unknowns. Examples: building a new UI component with state, adding a new API endpoint with validation.
- high    → Significant scope, architecture decisions, or multiple interconnected systems. Examples: new authentication flow, data migration, complex integrations.

Time ranges (use these exact formats):
- "30 min – 1 hour"
- "1 – 2 hours"
- "2 – 4 hours"
- "half a day"
- "1 – 2 days"
- "3 – 5 days"
- "1 – 2 weeks"

Confidence levels:
- low     → Task description is vague or missing; estimate is an educated guess.
- medium  → Reasonable description but some ambiguity remains.
- high    → Clear scope, well-defined requirements, high certainty in the estimate.

Factors to consider per task:
- Clarity and completeness of the description
- Technical complexity (UI, logic, database, integrations)
- Priority signal (high priority tasks often have higher stakes/scrutiny)
- Current column/status (tasks in "In Progress" may already be partially done)
- Potential for hidden complexity (auth, real-time, third-party APIs, etc.)
- Existing due date: if already set, assess whether it is realistic given the complexity. If it is too tight or too far out, your timeRange should reflect a more accurate estimate regardless of the existing date.

---

TASKS TO ESTIMATE:

${taskBlock}

---

Return ONLY a valid JSON object. No markdown, no explanation, no extra text. Use this exact structure:

{
  "estimates": [
    {
      "id": "<exact task id>",
      "complexity": "low" | "medium" | "high",
      "timeRange": "<time range string from the list above>",
      "factors": [
        "<concise factor 1 — what drives complexity or time>",
        "<concise factor 2>",
        "<concise factor 3 — optional, omit if not needed>"
      ],
      "confidence": "low" | "medium" | "high"
    }
  ]
}`
}

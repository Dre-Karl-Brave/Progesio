/**
 * Builds the prompt to generate a sprint insights narrative.
 */
export function buildInsightsPrompt(sprint, tasks, stats, today) {
  const taskBlock = tasks
    .map((t) =>
      [
        `Title: ${t.title}`,
        `Priority: ${t.priority}`,
        `Column (final status): ${t.column}`,
        `Labels: ${t.labels?.length ? t.labels.join(', ') : 'None'}`
      ].join(' | ')
    )
    .join('\n')

  return `You are an experienced engineering lead reviewing a completed sprint.

Today is ${today}.

SPRINT DETAILS:
- Name: ${sprint.name}
- Goal: ${sprint.goal || 'No goal set'}
- Duration: ${sprint.durationDays} days (${sprint.startDate} → ${sprint.endDate})
- Completed: ${sprint.completedAt || 'Unknown'}
- On time: ${sprint.onTime === true ? 'Yes' : sprint.onTime === false ? 'No (completed late)' : 'Unknown'}

SPRINT STATISTICS:
- Total tasks: ${stats.totalTasks}
- Tasks by column: ${stats.byColumn.map((c) => `${c.name}: ${c.count}`).join(', ')}
- Tasks by priority: ${stats.byPriority.map((p) => `${p.name}: ${p.count}`).join(', ')}
- Top labels: ${stats.byLabel.map((l) => `${l.name}: ${l.count}`).join(', ')}

TASKS:
${taskBlock}

---

Write a sprint insights summary with the following structure. Each section must be exactly one short paragraph (2–3 sentences). Be specific and reference actual task names, priorities, or labels where relevant.

Sections:
1. **Overview** — What this sprint set out to do, whether the goal was met, and the overall outcome.
2. **Delivery** — How tasks were distributed across columns at the end. Which tasks were completed and which were not.
3. **Priority & Focus** — What the priority mix tells us about the sprint's workload. Was there a healthy balance or heavy skew toward urgent/high items?
4. **Patterns** — Any label or category patterns (e.g., heavy backend work, lots of bug fixes). What areas of the product were most touched.
5. **Recommendation** — One specific, actionable suggestion for the next sprint based on what was observed.

Return ONLY a valid JSON object. No markdown, no explanation.

{
  "overview": "...",
  "delivery": "...",
  "priorityFocus": "...",
  "patterns": "...",
  "recommendation": "..."
}`
}

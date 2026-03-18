/**
 * Builds the prompt to analyze team workload and suggest task reassignments.
 */
export function buildWorkloadPrompt(members, tasks, unassignedCount, today) {
  const totalAssigned = tasks.length
  const avgLoad = members.length > 0 ? (totalAssigned / members.length).toFixed(1) : 0

  const memberBlock = members
    .map((m) => {
      const priorityLine = Object.entries(m.byPriority)
        .filter(([, count]) => count > 0)
        .map(([p, count]) => `${p}: ${count}`)
        .join(', ') || 'none'
      return [
        `Member: ${m.name} (ID: ${m.userId})`,
        `Tasks assigned: ${m.taskCount}`,
        `Priority breakdown: ${priorityLine}`,
        `Load level: ${m.load}`
      ].join(' | ')
    })
    .join('\n')

  const taskBlock = tasks
    .map((t) =>
      `taskId=${t.id}  title="${t.title}"  assignee=${t.assigneeName}  priority=${t.priority}  column=${t.column}`
    )
    .join('\n')

  return `You are a project management lead reviewing task distribution across a development team.

Today is ${today}.

TEAM OVERVIEW:
- Total members: ${members.length}
- Total assigned tasks: ${totalAssigned}
- Unassigned tasks: ${unassignedCount}
- Average tasks per member: ${avgLoad}

MEMBER WORKLOAD:
${memberBlock}

ASSIGNED TASKS:
${taskBlock}

---

Your job:
1. Write a concise workload summary (2–3 sentences) identifying who is overloaded, who has capacity, and the overall balance health.
2. Suggest up to 5 specific task reassignments to improve balance. Follow these rules:
   - Only reassign from members whose load is "high" or who have significantly more tasks than average.
   - Only reassign to members whose load is "low" or "medium" and have fewer tasks than average.
   - Prefer reassigning "medium" or "low" priority tasks. Avoid moving "urgent" tasks unless no other option.
   - Do not suggest reassigning if the workload is already balanced (difference <= 2 tasks per member).
   - If the board looks balanced, return an empty suggestions array.

CRITICAL: In your JSON response, "taskId" must be the exact database ID from the taskId= field (e.g. "cmm123abc..."), NOT the task title. Never use a task title as a taskId.

Return ONLY a valid JSON object. No markdown, no explanation.

{
  "summary": "<2-3 sentences on overall workload health>",
  "suggestions": [
    {
      "taskId": "<the taskId= value, e.g. cmm123abc — NOT the title>",
      "taskTitle": "<exact task title>",
      "fromUserId": "<exact user id>",
      "fromUserName": "<user name>",
      "toUserId": "<exact user id>",
      "toUserName": "<user name>",
      "reason": "<one sentence explaining why this task should be moved>"
    }
  ]
}`
}

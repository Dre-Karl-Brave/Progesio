/**
 * Builds the prompt for the task creation chatbot.
 */
export function buildCreateTaskPrompt({ message, columns, members, sprints, history }) {
  const columnsList = columns.map((c) => `- id: "${c.id}", name: "${c.name}"`).join('\n')
  const membersList = members.length
    ? members.map((m) => `- id: "${m.user.id}", name: "${m.user.name || m.user.email}"`).join('\n')
    : '- (no members)'
  const activeSprints = sprints.filter((s) => s.status !== 'COMPLETED')
  const sprintsList = activeSprints.length
    ? activeSprints.map((s) => `- id: "${s.id}", name: "${s.name}", status: "${s.status}"`).join('\n')
    : '- (no active sprints)'

  const historyBlock = history.length
    ? history.map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n') + '\n'
    : ''

  return `You are a friendly task creation assistant for a project management tool.
Your job is to help the user create a task by extracting information from their message.

AVAILABLE COLUMNS (you must pick one):
${columnsList}

AVAILABLE TEAM MEMBERS (optional):
${membersList}

AVAILABLE SPRINTS (optional):
${sprintsList}

RULES:
- Always respond with a valid JSON object — no markdown, no extra text.
- Match column names case-insensitively and by partial match. If none is mentioned, use the first column.
- Match member names case-insensitively. If none is mentioned, set assigneeId to null.
- Default priority to "medium" if not mentioned. Valid values: "low", "medium", "high", "urgent".
- Try to create a task suggestion from the very first message if you have enough info (at minimum a title).
- Keep the reply short and friendly (1–2 sentences max).
- If you return a taskSuggestion, still include a brief reply confirming the task.

RESPONSE FORMAT when you have enough info to suggest a task:
{
  "reply": "short friendly message",
  "taskSuggestion": {
    "title": "task title",
    "description": "brief description or empty string",
    "priority": "low|medium|high|urgent",
    "columnId": "<exact column id from list>",
    "columnName": "<column name>",
    "assigneeId": "<member id or null>",
    "assigneeName": "<member name or null>",
    "sprintId": "<sprint id or null>",
    "sprintName": "<sprint name or null>"
  }
}

RESPONSE FORMAT when you need more info:
{
  "reply": "your question"
}

${historyBlock ? `CONVERSATION SO FAR:\n${historyBlock}` : ''}User: ${message}

Respond with JSON only.`
}

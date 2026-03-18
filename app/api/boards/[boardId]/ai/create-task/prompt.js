/**
 * Builds the prompt for the task creation chatbot.
 */
export function buildCreateTaskPrompt({ message, columns, members, sprints, history }) {
  const today = new Date().toISOString().split('T')[0]

  const columnsList = columns.map((c) => `- id: "${c.id}", name: "${c.name}"`).join('\n')
  const membersList = members.length
    ? members.map((m) => `- id: "${m.user.id}", name: "${m.user.name || m.user.email}"`).join('\n')
    : '- (no members)'

  const activeSprints = sprints.filter((s) => s.status !== 'COMPLETED')
  const sprintsList = activeSprints.length
    ? activeSprints.map((s, i) => `- id: "${s.id}", name: "${s.name}", status: "${s.status}", number: ${i + 1}`).join('\n')
    : '- (no active sprints)'

  const historyBlock = history.length
    ? 'CONVERSATION SO FAR:\n' + history.map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n') + '\n\n'
    : ''

  return `You are a friendly task creation assistant for a project management tool.
Your job is to extract task details from the user's message and return a structured task suggestion.

Today's date: ${today}

AVAILABLE COLUMNS (pick one, required):
${columnsList}

AVAILABLE TEAM MEMBERS (optional):
${membersList}

AVAILABLE SPRINTS (optional):
${sprintsList}

RULES:
- Always respond with a valid JSON object — no markdown, no extra text.
- Column: match case-insensitively and by partial name. If none mentioned, use the first column.
- Member: match case-insensitively by name. If none mentioned, set assigneeId/assigneeName to null.
- Sprint: match by name OR by number (e.g. "sprint 4" = the sprint with number 4 in the list above). If none mentioned, set sprintId/sprintName to null.
- Due date: parse natural language relative to today (${today}). Return as ISO 8601 string (e.g. "2026-03-25T00:00:00.000Z"). If none mentioned, set dueDate to null. Examples: "next Friday", "in 2 weeks", "March 25", "end of month".
- Labels: extract any tags, categories, or labels the user mentions (e.g. "bug", "frontend", "urgent", "v2"). Return as an array of lowercase strings. If none, return [].
- Priority: default to "medium" if not mentioned. Valid: "low", "medium", "high", "urgent".
- Try to suggest the task from the first message if you have at least a title.
- Keep reply short and friendly (1–2 sentences).
- Detect the language the user is writing in and reply in that same language. Only the "reply" field should be translated — all other fields (title, description, labels, etc.) should stay in the language the user used.

RESPONSE FORMAT when ready to suggest one or more tasks:
{
  "reply": "short friendly message",
  "taskSuggestions": [
    {
      "title": "task title",
      "description": "brief description or empty string",
      "priority": "low|medium|high|urgent",
      "columnId": "<exact column id>",
      "columnName": "<column name>",
      "assigneeId": "<member id or null>",
      "assigneeName": "<member name or null>",
      "sprintId": "<sprint id or null>",
      "sprintName": "<sprint name or null>",
      "dueDate": "<ISO 8601 string or null>",
      "labels": ["label1", "label2"]
    }
  ]
}

Always use the taskSuggestions array — even for a single task. If the user asks to create multiple tasks, return all of them in the array.

RESPONSE FORMAT when you need more info:
{
  "reply": "your question"
}

${historyBlock}User: ${message}

Respond with JSON only.`
}

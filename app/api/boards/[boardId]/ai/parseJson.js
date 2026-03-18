/**
 * Robustly extracts and parses a JSON object from a Gemini response string.
 * Handles markdown fences, leading/trailing text, and common formatting issues.
 */
export function parseAIJson(raw) {
  // 1. Strip markdown code fences (```json ... ``` or ``` ... ```)
  let text = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  // 2. Extract from the first { to the last } to drop any surrounding prose
  const start = text.indexOf('{')
  const end   = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) {
    throw new Error('No JSON object found in AI response')
  }
  text = text.slice(start, end + 1)

  // 3. Try a straight parse first
  try {
    return JSON.parse(text)
  } catch {
    // 4. Light cleanup pass for common Gemini quirks before retrying
    const cleaned = text
      .replace(/,\s*([}\]])/g, '$1')        // trailing commas
      .replace(/([{,]\s*)'([^']+)'\s*:/g, '$1"$2":') // single-quoted keys
      .replace(/:\s*'([^']*)'/g, ': "$1"')  // single-quoted string values
    return JSON.parse(cleaned)
  }
}

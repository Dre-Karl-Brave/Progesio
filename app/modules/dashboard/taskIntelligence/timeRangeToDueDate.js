/**
 * Converts an AI-generated timeRange string into a due date
 * by adding the upper bound of the range to now.
 *
 * @param {string} timeRange - e.g. "2 – 4 hours", "1 – 2 days", "half a day"
 * @returns {Date}
 */
export function timeRangeToDueDate(timeRange) {
  const now = new Date()
  const str = timeRange.toLowerCase()

  const addHours = (h) => new Date(now.getTime() + h * 60 * 60 * 1000)
  const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000)

  if (str.includes('30 min') || str.includes('30min')) return addHours(1)
  if (str.includes('half a day')) return addHours(6)
  if (str.includes('week')) {
    const match = str.match(/(\d+)\s*[–\-]\s*(\d+)\s*week/)
    return addDays(match ? parseInt(match[2]) * 7 : 14)
  }
  if (str.includes('day')) {
    const match = str.match(/(\d+)\s*[–\-]\s*(\d+)\s*day/)
    return addDays(match ? parseInt(match[2]) : 1)
  }
  if (str.includes('hour')) {
    const match = str.match(/(\d+)\s*[–\-]\s*(\d+)\s*hour/)
    return addHours(match ? parseInt(match[2]) : 2)
  }

  // fallback: 1 day
  return addDays(1)
}

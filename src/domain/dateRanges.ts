export type DateItem = { date: Date; key: string }
export type Period = { key: string; label: string; sublabel: string; dateKeys: string[] }

export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getMonthDays(anchor: Date): DateItem[] {
  const count = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate()
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(anchor.getFullYear(), anchor.getMonth(), index + 1)
    return { date, key: toDateKey(date) }
  })
}

function startOfMonday(date: Date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = result.getDay() || 7
  result.setDate(result.getDate() - day + 1)
  return result
}

export function getWeekPeriods(today: Date): Period[] {
  const current = startOfMonday(today)
  return Array.from({ length: 12 }, (_, index) => {
    const start = new Date(current)
    start.setDate(start.getDate() - (11 - index) * 7)
    const days = Array.from({ length: 7 }, (__, dayIndex) => {
      const date = new Date(start)
      date.setDate(date.getDate() + dayIndex)
      return toDateKey(date)
    })
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return {
      key: days[0],
      label: `${start.getMonth() + 1}/${start.getDate()}`,
      sublabel: `${end.getMonth() + 1}/${end.getDate()}`,
      dateKeys: days,
    }
  })
}

export function getMonthPeriods(today: Date): Period[] {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (11 - index), 1)
    const days = getMonthDays(date)
    return {
      key: `${date.getFullYear()}-${date.getMonth() + 1}`,
      label: `${date.getMonth() + 1}月`,
      sublabel: String(date.getFullYear()),
      dateKeys: days.map((day) => day.key),
    }
  })
}

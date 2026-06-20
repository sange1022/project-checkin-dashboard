import { MoreHorizontal } from 'lucide-react'
import { getIntensity, getPeriodRatio } from '../domain/aggregation'
import { getMonthDays, getMonthPeriods, getWeekPeriods, toDateKey, type Period } from '../domain/dateRanges'
import type { Project, ViewMode } from '../domain/types'
import { EditableText } from './EditableText'

type Props = {
  view: ViewMode
  anchor: Date
  today: Date
  projects: Project[]
  checkins: Record<string, string[]>
  onToggle: (projectId: string, dateKey: string) => void
  onRename: (projectId: string, name: string) => void
  onDelete: (projectId: string) => void
}

const weekday = ['日', '一', '二', '三', '四', '五', '六']

function AggregateCell({ period, checked }: { period: Period; checked: Set<string> }) {
  const ratio = getPeriodRatio(period.dateKeys, checked, new Date())
  const intensity = getIntensity(ratio)
  return <div className="aggregate-cell" data-intensity={intensity} title={`${Math.round(ratio * 100)}%`} />
}

export function ProjectGrid({ view, anchor, today, projects, checkins, onToggle, onRename, onDelete }: Props) {
  const days = getMonthDays(anchor)
  const periods = view === 'week' ? getWeekPeriods(today) : getMonthPeriods(today)
  const columns = view === 'day' ? days.length : periods.length
  const gridStyle = { '--time-columns': columns } as React.CSSProperties
  const todayKey = toDateKey(today)

  return (
    <div className={`grid-scroll grid-${view}`}>
      <div className="progress-grid" style={gridStyle}>
        <div className="grid-header project-spacer">项目</div>
        {view === 'day'
          ? days.map(({ date, key }) => (
              <div className={`grid-header day-header ${key === todayKey ? 'is-today' : ''}`} data-testid="period-header" key={key}>
                <span>{date.getDate()}</span>
                <small>周{weekday[date.getDay()]}</small>
              </div>
            ))
          : periods.map((period) => (
              <div className="grid-header period-header" data-testid="period-header" key={period.key}>
                <span>{period.label}</span>
                <small>{period.sublabel}</small>
              </div>
            ))}
        <div className="grid-header menu-spacer" />

        {projects.map((project) => {
          const checked = new Set(checkins[project.id] ?? [])
          return (
            <div className="project-row-contents" key={project.id}>
              <div className="project-name-cell">
                <i className="project-dot" />
                <EditableText value={project.name} ariaLabel={`${project.name}名称`} onSave={(name) => onRename(project.id, name)} className="project-name" />
              </div>
              {view === 'day'
                ? days.map(({ date, key }) => {
                    const future = key > todayKey
                    const selected = checked.has(key)
                    return (
                      <button
                        key={key}
                        className={`checkin-cell ${selected ? 'checked' : ''} ${key === todayKey ? 'today' : ''}`}
                        aria-label={`${project.name} ${date.getMonth() + 1}月${date.getDate()}日`}
                        aria-pressed={selected}
                        disabled={future}
                        onClick={() => onToggle(project.id, key)}
                      />
                    )
                  })
                : periods.map((period) => <AggregateCell key={period.key} period={period} checked={checked} />)}
              <details className="project-menu">
                <summary aria-label={`${project.name}操作`}><MoreHorizontal size={17} /></summary>
                <div className="menu-popover">
                  <button className="danger" onClick={() => window.confirm(`删除“${project.name}”及全部打卡记录？`) && onDelete(project.id)}>删除项目</button>
                </div>
              </details>
            </div>
          )
        })}
      </div>
    </div>
  )
}

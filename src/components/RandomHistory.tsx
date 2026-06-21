import type { AppState } from '../domain/types'

type Props = {
  categories: AppState['randomCategories']
  history: AppState['dailyRandomResults']
}

export function RandomHistory({ categories, history }: Props) {
  const dates = Object.keys(history).sort().reverse()
  return (
    <details className="bottom-panel">
      <summary>随机记录</summary>
      <div className="random-history">
        {dates.length ? dates.map((date) => (
          <div className="history-row" key={date}>
            <time>{date}</time>
            {categories.map((category) => <span key={category.id}>{history[date]?.[category.id]?.name ?? '—'}</span>)}
          </div>
        )) : <p>还没有记录</p>}
      </div>
    </details>
  )
}

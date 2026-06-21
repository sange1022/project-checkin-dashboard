import { Plus, Trash2 } from 'lucide-react'
import type { RandomCategory } from '../domain/types'
import { EditableText } from './EditableText'

type Props = {
  categories: RandomCategory[]
  onAdd: (categoryId: RandomCategory['id']) => void
  onRename: (categoryId: RandomCategory['id'], itemId: string, name: string) => void
  onDelete: (categoryId: RandomCategory['id'], itemId: string) => void
}

export function RandomPromptManager({ categories, onAdd, onRename, onDelete }: Props) {
  return (
    <details className="bottom-panel">
      <summary>管理随机内容</summary>
      <div className="prompt-manager">
        {categories.map((category) => (
          <section key={category.id}>
            <h3>{category.name}</h3>
            {category.items.map((item) => (
              <div className="prompt-item" key={item.id}>
                <EditableText value={item.name} ariaLabel={`${category.name}${item.name}`} onSave={(name) => onRename(category.id, item.id, name)} />
                <button aria-label={`删除${item.name}`} disabled={category.items.length === 1} onClick={() => onDelete(category.id, item.id)}><Trash2 size={13} /></button>
              </div>
            ))}
            <button className="add-prompt" onClick={() => onAdd(category.id)}><Plus size={13} />添加</button>
          </section>
        ))}
      </div>
    </details>
  )
}

import { useEffect, useRef, useState } from 'react'

type Props = {
  value: string
  onSave: (value: string) => void
  ariaLabel: string
  className?: string
}

export function EditableText({ value, onSave, ariaLabel, className = '' }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setDraft(value), [value])
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const save = () => {
    const next = draft.trim()
    if (!next) return
    onSave(next)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={`editable-input ${className}`}
        aria-label={ariaLabel}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === 'Enter') save()
          if (event.key === 'Escape') {
            setDraft(value)
            setEditing(false)
          }
        }}
      />
    )
  }

  return (
    <button className={`editable-label ${className}`} onClick={() => setEditing(true)}>
      {value}
    </button>
  )
}

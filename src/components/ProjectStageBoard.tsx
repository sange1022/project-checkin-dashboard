import { Plus, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { PROJECT_STAGES } from '../domain/projectStages'
import type { StageProject } from '../domain/types'
import { EditableText } from './EditableText'

type BoardProps = {
  projects: StageProject[]
  onStageChange: (id: string, stageIndex: number) => void
}

export function ProjectStageBoard({ projects, onStageChange }: BoardProps) {
  return (
    <section className="stage-board-section">
      <div className="stage-section-heading">
        <h2>设计项目阶段</h2>
        <span>{projects.length} 个项目</span>
      </div>
      <div className="stage-scroll">
        <div className="stage-grid">
          <div className="stage-project-header">项目</div>
          <div className="stage-axis-header">
            {PROJECT_STAGES.map((stage) => <span key={stage.name} title={stage.name}>{stage.shortName}</span>)}
          </div>
          <div className="stage-percent-header">进度</div>
          {projects.map((project) => {
            const progress = (project.stageIndex / (PROJECT_STAGES.length - 1)) * 100
            return (
              <div className="stage-row" key={project.id}>
                <div className="stage-project-name"><span>{project.name}</span></div>
                <div className="stage-track">
                  <i className="stage-line" style={{ width: `${progress}%` }} />
                  {PROJECT_STAGES.map((stage, index) => (
                    <button key={stage.name} aria-label={`${project.name} ${stage.name}`} className={index <= project.stageIndex ? 'reached' : ''} onClick={() => onStageChange(project.id, index)} />
                  ))}
                </div>
                <div className="stage-row-end"><strong>{PROJECT_STAGES[project.stageIndex].percent}%</strong></div>
              </div>
            )
          })}
          {!projects.length && <div className="stage-empty">在最下方添加进度项目</div>}
        </div>
      </div>
    </section>
  )
}

type ManagerProps = {
  projects: StageProject[]
  onAdd: (name: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export function StageProjectManager({ projects, onAdd, onRename, onDelete }: ManagerProps) {
  const [name, setName] = useState('')
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const add = () => {
    const next = name.trim()
    if (!next) return
    onAdd(next)
    setName('')
    if (detailsRef.current) detailsRef.current.open = false
  }

  return (
    <details ref={detailsRef} className="bottom-panel">
      <summary>管理进度项目</summary>
      <div className="stage-add">
        <input aria-label="阶段项目名称" value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && add()} placeholder="新增项目" />
        <button onClick={add} disabled={!name.trim()}><Plus size={13} />添加</button>
      </div>
      <div className="stage-manage-list">
        {projects.map((project) => (
          <div key={project.id}>
            <EditableText value={project.name} ariaLabel={`${project.name}阶段项目名称`} onSave={(value) => onRename(project.id, value)} />
            <button aria-label={`删除阶段项目 ${project.name}`} onClick={() => onDelete(project.id)}><Trash2 size={13} /></button>
          </div>
        ))}
        {!projects.length && <p>还没有项目</p>}
      </div>
    </details>
  )
}

import { Calendar, Paperclip, Pencil, Trash2 } from 'lucide-react'
import WeatherBadge from './WeatherBadge'

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'in-progress': 'bg-sky-50 text-sky-700 border-sky-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const PRIORITY_STYLES = {
  low: 'bg-canvas text-ink/60 border-line',
  medium: 'bg-orange-50 text-orange-700 border-orange-200',
  high: 'bg-red-50 text-red-700 border-red-200',
}

function formatDate(dateStr) {
  if (!dateStr) return 'No due date'
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function TaskCard({ task, onEdit, onDelete }) {
  const { title, description, dueDate, status, priority, location, fileUrl } = task

  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
        <div className="flex shrink-0 gap-1.5">
          <button
            onClick={() => onEdit?.(task)}
            className="rounded-md p-1.5 text-ink/50 transition-colors hover:bg-canvas hover:text-ink"
            aria-label="Edit task"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete?.(task)}
            className="rounded-md p-1.5 text-ink/50 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Delete task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {description && <p className="text-sm text-ink/70">{description}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${
            STATUS_STYLES[status] || STATUS_STYLES.pending
          }`}
        >
          {status}
        </span>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${
            PRIORITY_STYLES[priority] || PRIORITY_STYLES.low
          }`}
        >
          {priority} priority
        </span>
        {location && <WeatherBadge location={location} />}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-3 text-sm text-ink/60">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={14} />
          {formatDate(dueDate)}
        </span>

        {fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-accent hover:text-accent-dark"
          >
            <Paperclip size={14} />
            Attachment
          </a>
        )}
      </div>
    </div>
  )
}

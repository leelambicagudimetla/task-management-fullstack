import { useEffect, useState } from 'react'
import { X, Upload } from 'lucide-react'

const EMPTY_FORM = {
  title: '',
  description: '',
  dueDate: '',
  status: 'pending',
  priority: 'medium',
  location: '',
}

export default function TaskFormModal({ open, onClose, onSubmit, initialTask, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title || '',
        description: initialTask.description || '',
        dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : '',
        status: initialTask.status || 'pending',
        priority: initialTask.priority || 'medium',
        location: initialTask.location || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setFile(null)
    setError('')
  }, [initialTask, open])

  if (!open) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => formData.append(key, value))
    if (file) {
      formData.append('attachment', file)
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="card w-full max-w-lg p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            {initialTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-ink/50 hover:bg-canvas hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="field-label" htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Finalize client proposal"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Add any relevant details"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label" htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Hyderabad"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="attachment">Attachment</label>
            <label
              htmlFor="attachment"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-line px-3.5 py-3 text-sm text-ink/60 hover:border-accent hover:text-accent"
            >
              <Upload size={16} />
              {file ? file.name : 'Click to upload a file'}
            </label>
            <input
              id="attachment"
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving…' : initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

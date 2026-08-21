import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import TaskFormModal from '../components/TaskFormModal'
import { taskApi } from '../services/api'

export default function DashboardPage() {
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      // Backend responds with { data: [...tasks], meta: {...} }, so unwrap it.
      const { data } = await taskApi.getAll()
      return data.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (formData) => taskApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => taskApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setModalOpen(false)
      setEditingTask(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => taskApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tasks, search, statusFilter, priorityFilter])

  const openCreateModal = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleSubmit = async (formData) => {
    if (editingTask) {
      await updateMutation.mutateAsync({ id: editingTask._id, formData })
    } else {
      await createMutation.mutateAsync(formData)
    }
  }

  const handleDelete = (task) => {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(task._id)
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Your Tasks</h1>
            <p className="text-sm text-ink/60">
              {filteredTasks.length} of {tasks.length} task{tasks.length === 1 ? '' : 's'} shown
            </p>
          </div>
          <button onClick={openCreateModal} className="btn-primary">
            <Plus size={16} />
            New Task
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks by title…"
              className="input-field pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field sm:w-44"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-field sm:w-44"
          >
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        )}

        {isError && (
          <div className="card p-8 text-center text-sm text-red-600">
            Couldn&apos;t load your tasks. Please refresh or try again shortly.
          </div>
        )}

        {!isLoading && !isError && filteredTasks.length === 0 && (
          <div className="card p-12 text-center">
            <p className="font-display text-base font-semibold text-ink">No tasks match here</p>
            <p className="mt-1 text-sm text-ink/60">
              Try a different search, or create a new task to get started.
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredTasks.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={openEditModal} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <TaskFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleSubmit}
        initialTask={editingTask}
        submitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}

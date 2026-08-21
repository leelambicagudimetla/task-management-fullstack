import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ListChecks } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.password) next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-white">
            <ListChecks size={20} />
          </div>
          <h1 className="font-display text-xl font-semibold text-ink">Welcome back</h1>
          <p className="text-sm text-ink/60">Log in to manage your tasks.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          {serverError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-ink/60">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-accent hover:text-accent-dark">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

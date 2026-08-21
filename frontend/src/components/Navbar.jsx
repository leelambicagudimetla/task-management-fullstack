import { useNavigate } from 'react-router-dom'
import { ListChecks, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-white">
            <ListChecks size={18} />
          </div>
          <span className="font-display text-lg font-semibold text-ink">TaskFlow</span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden text-sm text-ink/70 sm:inline">
              Signed in as <span className="font-medium text-ink">{user.name || user.email}</span>
            </span>
          )}
          <button onClick={handleLogout} className="btn-secondary">
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}

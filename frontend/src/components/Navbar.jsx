import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{ background: '#1e293b', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 24 }}>
        <Link to="/" style={link}>Dashboard</Link>
        <Link to="/projects" style={link}>Projects</Link>
        <Link to="/tasks" style={link}>Tasks</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: '#94a3b8', fontSize: 14 }}>{user?.name} ({user?.role})</span>
        <button onClick={handleLogout} style={{ padding: '6px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </nav>
  )
}

const link = { color: '#e2e8f0', textDecoration: 'none', fontSize: 15 }
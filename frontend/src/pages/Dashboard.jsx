import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/api/tasks/dashboard').then(r => setStats(r.data))
  }, [])

  if (!stats) return <p style={{ padding: 32 }}>Loading...</p>

  const cards = [
    { label: 'Total Tasks', value: stats.total, color: '#2563eb' },
    { label: 'To Do', value: stats.todo, color: '#6b7280' },
    { label: 'In Progress', value: stats.in_progress, color: '#f59e0b' },
    { label: 'Done', value: stats.done, color: '#10b981' },
    { label: 'Overdue', value: stats.overdue, color: '#ef4444' },
  ]

  return (
    <div style={{ padding: 32 }}>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 24 }}>
        {cards.map(c => (
          <div key={c.label} style={{
            padding: '24px 32px', borderRadius: 12, background: c.color,
            color: '#fff', minWidth: 140, textAlign: 'center'
          }}>
            <div style={{ fontSize: 36, fontWeight: 700 }}>{c.value}</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
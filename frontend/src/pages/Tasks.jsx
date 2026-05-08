import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const STATUS_COLORS = { todo: '#6b7280', in_progress: '#f59e0b', done: '#10b981' }

export default function Tasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [form, setForm] = useState({ title: '', description: '', project_id: '', assigned_to: '', due_date: '' })

  const fetchTasks = () => api.get('/api/tasks/').then(r => setTasks(r.data))

  useEffect(() => {
    fetchTasks()
    if (user.role === 'admin') {
      api.get('/api/projects/').then(r => setProjects(r.data))
      api.get('/api/projects/members').then(r => setMembers(r.data))
    }
  }, [])

  const createTask = async (e) => {
    e.preventDefault()
    await api.post('/api/tasks/', form)
    setForm({ title: '', description: '', project_id: '', assigned_to: '', due_date: '' })
    fetchTasks()
  }

  const updateStatus = async (id, status) => {
    await api.patch(`/api/tasks/${id}/status`, { status })
    fetchTasks()
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>Tasks</h2>

      {user.role === 'admin' && (
        <form onSubmit={createTask} style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400, marginBottom: 32 }}>
          <h3>Create Task</h3>
          <input placeholder="Title" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} style={inp} required />
          <input placeholder="Description" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} style={inp} />
          <select value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })} style={inp} required>
            <option value="">Select Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} style={inp} required>
            <option value="">Assign To</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input type="date" value={form.due_date}
            onChange={e => setForm({ ...form, due_date: e.target.value })} style={inp} />
          <button type="submit" style={btn}>Create Task</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tasks.length === 0 && <p style={{ color: '#6b7280' }}>No tasks yet.</p>}
        {tasks.map(task => (
          <div key={task.id} style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{task.title}</strong>
              <p style={{ margin: '4px 0', color: '#6b7280', fontSize: 13 }}>{task.description}</p>
              {task.due_date && <small>Due: {task.due_date}</small>}
            </div>
            <select value={task.status} onChange={e => updateStatus(task.id, e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: STATUS_COLORS[task.status], color: '#fff', cursor: 'pointer' }}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

const inp = { padding: '9px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }
const btn = { padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Projects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedMember, setSelectedMember] = useState('')

  const fetchProjects = () => api.get('/api/projects/').then(r => setProjects(r.data))

  useEffect(() => {
    fetchProjects()
    if (user.role === 'admin') {
      api.get('/api/projects/members').then(r => setMembers(r.data))
    }
  }, [])

  const createProject = async (e) => {
    e.preventDefault()
    await api.post('/api/projects/', form)
    setForm({ name: '', description: '' })
    fetchProjects()
  }

  const addMember = async (e) => {
    e.preventDefault()
    await api.post(`/api/projects/${selectedProject}/members/${selectedMember}`)
    alert('Member added!')
  }

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return
    await api.delete(`/api/projects/${id}`)
    fetchProjects()
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>Projects</h2>

      {user.role === 'admin' && (
        <>
          <form onSubmit={createProject} style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400, marginBottom: 32 }}>
            <h3>Create Project</h3>
            <input placeholder="Project Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} style={inp} required />
            <input placeholder="Description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} style={inp} />
            <button type="submit" style={btn}>Create</button>
          </form>

          <form onSubmit={addMember} style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400, marginBottom: 32 }}>
            <h3>Add Member to Project</h3>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} style={inp} required>
              <option value="">Select Project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} style={inp} required>
              <option value="">Select Member</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <button type="submit" style={btn}>Add Member</button>
          </form>
        </>
      )}

      <h3>All Projects</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {projects.map(p => (
          <div key={p.id} style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{p.name}</strong>
              <p style={{ margin: '4px 0', color: '#6b7280', fontSize: 13 }}>{p.description}</p>
            </div>
            {user.role === 'admin' && (
              <button onClick={() => deleteProject(p.id)}
                style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const inp = { padding: '9px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }
const btn = { padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }
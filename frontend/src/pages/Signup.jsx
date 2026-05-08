import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/signup', form)
      login(res.data.user, res.data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed')
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Sign Up</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input placeholder="Full Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} style={styles.input} required />
        <input placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} style={styles.input} required />
        <input type="password" placeholder="Password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} style={styles.input} required />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={styles.input}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={styles.btn}>Sign Up</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  form: { display: 'flex', flexDirection: 'column', gap: 12, width: 320, padding: 32, border: '1px solid #ddd', borderRadius: 8 },
  input: { padding: '10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 },
  btn: { padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }
}
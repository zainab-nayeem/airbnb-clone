import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await API.post('/auth/login', form);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffecf1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', border: '1px solid #f5c6d4' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌸</div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#222' }}>Welcome back</h1>
          <p style={{ fontSize: '14px', color: '#717171', marginTop: '4px' }}>Log in to StayPink</p>
        </div>

        {error && (
          <div style={{ background: '#fff0f3', border: '1px solid #f5c6d4', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#ff385c', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#222', display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              style={{ width: '100%', border: '1px solid #f5c6d4', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#222', display: 'block', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={{ width: '100%', border: '1px solid #f5c6d4', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#ff385c', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#717171', marginTop: '20px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#ff385c', fontWeight: '600', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      height: '100vh', background: '#1a1a2e',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '8px' }}>🚌 BusNow</h1>
      <p style={{ color: '#aaa', marginBottom: '30px' }}>Live College Bus Tracker</p>

      <div style={{ width: '100%', maxWidth: '360px', background: '#16213e', borderRadius: '12px', padding: '30px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '20px' }}>Login</h2>

        {error && <div style={{ background: '#e94560', color: 'white', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', background: '#0f3460', color: 'white', marginBottom: '12px', fontSize: '14px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', background: '#0f3460', color: 'white', marginBottom: '20px', fontSize: '14px' }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#e94560', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{ marginTop: '20px', color: '#aaa', fontSize: '12px', textAlign: 'center' }}>
          <p>Driver: driver1@busnow.com / driver123</p>
          <p>Student: student1@busnow.com / student123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
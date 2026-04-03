import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = isRegister
      ? 'http://localhost:5000/api/auth/register'
      : 'http://localhost:5000/api/auth/login';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
      } else {
        localStorage.setItem('nexhire_user', JSON.stringify(data.user));
        navigate(data.user.role === 'freelancer' ? '/dashboard' : '/browse');
        window.location.reload();
      }
    } catch (err) {
      setError('Server error, please try again');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '90vh', background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)' }}
      className="d-flex align-items-center justify-content-center">
      <div className="card border-0 shadow-lg p-4" style={{ width: '100%', maxWidth: '420px', borderRadius: '16px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#0f3460' }}>NexHire</h2>
          <p className="text-muted">{isRegister ? 'Create your account' : 'Welcome back'}</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="mb-3">
              <label className="form-label small fw-bold">Full Name</label>
              <input type="text" className="form-control" name="name"
                placeholder="Your name" value={form.name} onChange={handleChange} required />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label small fw-bold">Email</label>
            <input type="email" className="form-control" name="email"
              placeholder="your@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Password</label>
            <input type="password" className="form-control" name="password"
              placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          {isRegister && (
            <div className="mb-3">
              <label className="form-label small fw-bold">I am a</label>
              <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                <option value="client">Client — looking to hire</option>
                <option value="freelancer">Freelancer — looking for work</option>
              </select>
            </div>
          )}
          <button type="submit" className="btn w-100 text-white py-2 fw-bold"
            style={{ backgroundColor: '#0f3460', borderRadius: '8px' }} disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <span className="fw-bold" style={{ color: '#0f3460', cursor: 'pointer' }}
              onClick={() => { setIsRegister(!isRegister); setError(''); }}>
              {isRegister ? 'Login' : 'Register'}
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
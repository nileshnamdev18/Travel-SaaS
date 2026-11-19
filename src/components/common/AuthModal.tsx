import React, { useState } from 'react';
import { X, LogIn, UserPlus, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialMode = 'login', onSuccess }) => {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: ''
  });

  const set = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let res;
    if (mode === 'login') {
      res = await login(form.email, form.password);
    } else {
      if (!form.name.trim()) { setError('Name is required'); return; }
      if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
      res = await register(form.name, form.email, form.password, form.phone);
    }
    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setError(res.message || 'Something went wrong');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-card, #fff)',
        borderRadius: '1.25rem',
        padding: '2rem',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)'
        }}>
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0F4CA4, #1a6ed4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            {mode === 'login' ? <LogIn size={22} color="#fff" /> : <UserPlus size={22} color="#fff" />}
          </div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary, #1a1a1a)' }}>
            {mode === 'login' ? 'Sign In to TravelPulse' : 'Create Account'}
          </h2>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted, #666)' }}>
            {mode === 'login' ? 'Book holidays, track your trips' : 'Join thousands of happy travellers'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.5rem',
            padding: '0.65rem 0.875rem', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            color: '#dc2626', fontSize: '0.85rem'
          }}>
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {mode === 'register' && (
            <input
              type="text" placeholder="Full Name *" value={form.name}
              onChange={e => set('name', e.target.value)} required
              style={inputStyle}
            />
          )}
          <input
            type="email" placeholder="Email Address *" value={form.email}
            onChange={e => set('email', e.target.value)} required
            style={inputStyle}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password *" value={form.password}
              onChange={e => set('password', e.target.value)} required
              style={{ ...inputStyle, paddingRight: '2.75rem' }}
            />
            <button type="button" onClick={() => setShowPass(s => !s)}
              style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #666)'
              }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {mode === 'register' && (
            <input
              type="tel" placeholder="Phone Number (optional)" value={form.phone}
              onChange={e => set('phone', e.target.value)}
              style={inputStyle}
            />
          )}

          <button type="submit" disabled={isLoading} style={{
            background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #0F4CA4, #1a6ed4)',
            color: '#fff', border: 'none', borderRadius: '0.65rem',
            padding: '0.85rem', fontWeight: 700, fontSize: '0.95rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            transition: 'all 0.2s', marginTop: '0.25rem'
          }}>
            {isLoading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> :
              mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Quick login hints */}
        <div style={{
          background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.65rem',
          padding: '0.75rem', marginTop: '1rem', fontSize: '0.78rem', color: '#0369a1'
        }}>
          <div style={{ fontWeight: 700, marginBottom: '6px' }}>⚡ Quick 1-Click Demo Login:</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setForm({ name: '', email: 'admin@travelpulse.in', password: 'Admin@123', phone: '' });
                setMode('login');
                setError('');
              }}
              style={{
                background: '#0F4CA4', color: '#fff', border: 'none', borderRadius: '4px',
                padding: '4px 8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Fill Super Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setForm({ name: '', email: 'customer@travelpulse.in', password: 'Customer@123', phone: '' });
                setMode('login');
                setError('');
              }}
              style={{
                background: '#059669', color: '#fff', border: 'none', borderRadius: '4px',
                padding: '4px 8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Fill Demo Customer
            </button>
          </div>
        </div>

        {/* Toggle mode */}
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted, #666)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#0F4CA4', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
            {mode === 'login' ? 'Register here' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 0.875rem',
  border: '1.5px solid var(--border-color, #e5e7eb)',
  borderRadius: '0.65rem',
  fontSize: '0.9rem',
  outline: 'none',
  background: 'var(--bg-input, #f9fafb)',
  color: 'var(--text-primary, #1a1a1a)',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s'
};

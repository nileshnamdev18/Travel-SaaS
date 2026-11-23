import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from './AuthModal';
import { CurrencyCode } from '../../types';
import { Compass, Luggage, Sun, Moon, Shield, Phone, Tag, MessageSquare, LogIn, LogOut, UserCheck } from 'lucide-react';

export const NavigationBar: React.FC = () => {
  const { activePortal, setActivePortal, activeRole, setActiveRole, activeCurrency, setActiveCurrency, theme, toggleTheme, isMyTripsOpen, setIsMyTripsOpen, bookings } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Synchronize AuthContext role with AppContext role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'super_admin') {
        setActiveRole('super_admin');
      } else {
        setActiveRole('customer');
      }
    }
  }, [isAuthenticated, user, setActiveRole]);

  const copyPromo = () => {
    navigator.clipboard.writeText('AKBAR25');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isAdmin = activeRole === 'super_admin' || user?.role === 'super_admin';

  const handleAdminClick = () => {
    if (isAuthenticated && user?.role === 'super_admin') {
      setActiveRole('super_admin');
      setActivePortal('admin');
    } else {
      setAuthModalMode('login');
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    setActiveRole('customer');
    setActivePortal('customer');
  };

  return (
    <>
      {/* Top Notice Strip - Akbar Travels style */}
      <div className="top-notice-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
            <Phone size={13} color="var(--brand-accent)" />
            <span>24x7 Support: <strong style={{ color: 'var(--text-heading)' }}>+91 22 4066 6400</strong> | WhatsApp: <strong style={{ color: '#25D366' }}>+91 98765 43210</strong></span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div onClick={copyPromo} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: 'rgba(250, 58, 58, 0.08)', border: '1px dashed var(--brand-accent)', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem' }} title="Click to copy coupon">
            <Tag size={12} color="var(--brand-accent)" />
            <span>Use Code <strong style={{ color: 'var(--brand-accent)' }}>AKBAR25</strong> for Flat ₹1,500 OFF</span>
            <span style={{ fontSize: '0.7rem', color: copiedCode ? 'var(--color-success)' : 'var(--text-muted)', fontWeight: 600 }}>{copiedCode ? '✓ Copied!' : '(Copy)'}</span>
          </div>

          {!isAdmin && (
            <button
              onClick={handleAdminClick}
              style={{ background: 'var(--brand-navy)', color: '#ffffff', border: 'none', padding: '2px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}
            >
              Admin Login
            </button>
          )}

          {isAdmin && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  if (activePortal === 'admin') {
                    setActivePortal('customer');
                  } else {
                    setActivePortal('admin');
                  }
                }}
                style={{ background: activePortal === 'admin' ? 'var(--color-success)' : 'var(--brand-navy)', color: '#ffffff', border: 'none', padding: '2px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}
              >
                {activePortal === 'admin' ? '← Customer View' : '⚙️ SuperAdmin Panel'}
              </button>
            </div>
          )}
        </div>
      </div>

      <header className="top-nav">
        <div className="nav-inner">
          {/* Brand Logo */}
          <div className="brand-logo" style={{ flexShrink: 0, cursor: 'pointer' }} onClick={() => { setActivePortal('customer'); }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #032559 0%, #fa3a3a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 2px 8px rgba(3,37,89,0.25)' }}>
              <Compass size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', lineHeight: 1.1 }}>
                <span style={{ color: 'var(--text-heading)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>TRAVEL</span>
                <span style={{ color: 'var(--brand-accent)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>PULSE</span>
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Akbar Travels & TravelPulse Partner</div>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="nav-controls">
            {/* Currency */}
            <select className="currency-select" value={activeCurrency} onChange={(e) => setActiveCurrency(e.target.value as CurrencyCode)}>
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="AED">AED</option>
              <option value="EUR">EUR (€)</option>
            </select>

            {/* My Trips */}
            {activePortal !== 'admin' && (
              <button className="btn btn-sm btn-secondary" onClick={() => setIsMyTripsOpen(true)} style={{ gap: '6px' }}>
                <Luggage size={14} />
                <span>My Trips</span>
                {bookings.filter(b => b.status === 'confirmed').length > 0 && (
                  <span style={{ background: 'var(--brand-accent)', color: '#fff', width: '18px', height: '18px', borderRadius: '50%', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </span>
                )}
              </button>
            )}

            {/* Chat Assistant */}
            {activePortal !== 'admin' && (
              <button className="btn btn-sm btn-secondary" onClick={() => setActivePortal('customer')} style={{ gap: '6px', background: 'rgba(37,211,102,0.1)', borderColor: '#25D366', color: '#25D366' }}>
                <MessageSquare size={14} />
                <span>AI Assistant</span>
              </button>
            )}

            {/* Admin Portal Shortcut Button */}
            {isAdmin && activePortal !== 'admin' && (
              <button
                className="btn btn-sm btn-primary"
                onClick={() => { setActiveRole('super_admin'); setActivePortal('admin'); }}
                style={{ gap: '6px', background: '#d97706', borderColor: '#d97706' }}
              >
                <Shield size={14} />
                <span>Admin Hub</span>
              </button>
            )}

            {/* Auth Button or User Badge */}
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: user.role === 'super_admin' ? 'rgba(217,119,6,0.1)' : 'rgba(5,150,105,0.1)',
                  border: `1px solid ${user.role === 'super_admin' ? 'rgba(217,119,6,0.3)' : 'rgba(5,150,105,0.3)'}`,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: user.role === 'super_admin' ? '#d97706' : '#059669'
                }}>
                  <UserCheck size={13} />
                  <span>{user.name.split(' ')[0]}</span>
                  {user.role === 'super_admin' && <span style={{ fontSize: '0.68rem', background: '#d97706', color: '#fff', padding: '1px 5px', borderRadius: 4 }}>ADMIN</span>}
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                  title="Sign Out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => { setAuthModalMode('login'); setShowAuthModal(true); }}
                style={{ gap: '6px' }}
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Real JWT Auth Modal */}
      {showAuthModal && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
          }}
        />
      )}
    </>
  );
};

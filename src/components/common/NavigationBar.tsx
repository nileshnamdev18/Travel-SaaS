import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CurrencyCode } from '../../types';
import { Compass, Luggage, Sun, Moon, Shield, Phone, Tag, MessageSquare, Menu, X } from 'lucide-react';

export const NavigationBar: React.FC = () => {
  const { activePortal, setActivePortal, activeRole, setActiveRole, activeCurrency, setActiveCurrency, theme, toggleTheme, isMyTripsOpen, setIsMyTripsOpen, bookings } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const copyPromo = () => {
    navigator.clipboard.writeText('AKBAR25');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isAdmin = activeRole === 'super_admin';

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
            <button onClick={() => { setActiveRole('super_admin'); setActivePortal('admin'); }} style={{ background: 'var(--brand-navy)', color: '#ffffff', border: 'none', padding: '2px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>
              Admin Login
            </button>
          )}
          {isAdmin && (
            <button onClick={() => { setActiveRole('customer'); setActivePortal('customer'); }} style={{ background: 'var(--color-success)', color: '#ffffff', border: 'none', padding: '2px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>
              ← Exit Admin
            </button>
          )}
        </div>
      </div>

      <header className="top-nav">
        <div className="nav-inner">
          {/* Brand Logo */}
          <div className="brand-logo" style={{ flexShrink: 0, cursor: 'pointer' }} onClick={() => { setActivePortal('customer'); setActiveRole('customer'); }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #032559 0%, #fa3a3a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 2px 8px rgba(3,37,89,0.25)' }}>
              <Compass size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', lineHeight: 1.1 }}>
                <span style={{ color: 'var(--text-heading)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>TRAVEL</span>
                <span style={{ color: 'var(--brand-accent)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>PULSE</span>
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Akbar Travels Partner</div>
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
            {!isAdmin && (
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
            {!isAdmin && (
              <button className="btn btn-sm btn-secondary" onClick={() => setActivePortal('customer')} style={{ gap: '6px', background: 'rgba(37,211,102,0.1)', borderColor: '#25D366', color: '#25D366' }}>
                <MessageSquare size={14} />
                <span>AI Assistant</span>
              </button>
            )}

            {/* Admin Badge */}
            {isAdmin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, color: '#dc2626' }}>
                <Shield size={14} />
                Super Admin
              </div>
            )}

            {/* Theme Toggle */}
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

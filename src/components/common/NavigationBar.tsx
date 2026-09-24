import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PortalType, UserRole, CurrencyCode } from '../../types';
import { 
  Compass, 
  Briefcase, 
  ShieldCheck, 
  Coins, 
  FileText, 
  Sparkles, 
  ChevronDown, 
  Sun, 
  Moon, 
  Luggage, 
  Bell, 
  ChevronRight, 
  User, 
  Clock,
  Phone,
  Tag,
  Shield,
  Award
} from 'lucide-react';

export const NavigationBar: React.FC = () => {
  const { 
    activePortal, 
    setActivePortal, 
    activeRole, 
    setActiveRole, 
    activeCurrency, 
    setActiveCurrency,
    openModal,
    theme,
    toggleTheme,
    isMyTripsOpen,
    setIsMyTripsOpen,
    bookings
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; color: string }[] = [
    { role: 'traveler', label: 'Traveler / Employee', desc: 'Consumer-grade search, book & manage personal trips', color: '#2563eb' },
    { role: 'agency_agent', label: 'Agency Agent', desc: 'Wholesale net-rate booking & quotation generation', color: '#0d9488' },
    { role: 'agency_admin', label: 'Corporate Travel Manager', desc: 'Approve/reject trips, manage policy caps & wallet', color: '#d97706' },
    { role: 'finance_admin', label: 'Finance Admin', desc: 'Vendor ledgers, offline rates & financial audit', color: '#7c3aed' },
    { role: 'support_agent', label: 'Support Desk', desc: 'Dispute resolution & operational assistance', color: '#0891b2' },
    { role: 'super_admin', label: 'Platform Super Admin', desc: 'Global markup engine, analytics & full oversight', color: '#dc2626' }
  ];

  const currentRoleObj = roles.find(r => r.role === activeRole) || roles[0];
  const pendingApprovals = bookings.filter(b => b.status === 'pending_approval').length;

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setRoleDropdownOpen(false);
    if (role === 'traveler') setActivePortal('b2c');
    else if (role === 'agency_agent' || role === 'agency_admin') setActivePortal('b2b');
    else setActivePortal('admin');
  };

  const copyPromo = () => {
    navigator.clipboard.writeText('PULSEAI');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <>
      {/* Top Notice & Helpline Strip */}
      <div className="top-notice-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
            <Phone size={13} color="var(--brand-accent)" />
            <span>24x7 Global Desk: <strong style={{ color: 'var(--text-heading)' }}>+1 (800) 550-7857</strong> / <strong style={{ color: 'var(--text-heading)' }}>+91 22 4066 6400</strong></span>
          </div>
          <span style={{ color: 'var(--border-strong)', display: 'inline-block' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
            <Award size={13} color="var(--brand-blue)" />
            <span style={{ color: 'var(--text-muted)' }}>IATA Accredited • Saudi Nusuk Protocol • PCI-DSS Certified</span>
          </div>
        </div>

        {/* Promo Voucher Highlight */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            onClick={copyPromo}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              cursor: 'pointer',
              background: 'rgba(250, 58, 58, 0.08)',
              border: '1px dashed var(--brand-accent)',
              padding: '2px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem'
            }}
            title="Click to copy coupon code"
          >
            <Tag size={12} color="var(--brand-accent)" />
            <span>Use Code <strong style={{ color: 'var(--brand-accent)', letterSpacing: '0.04em' }}>PULSEAI</strong> for Flat ₹1,500 / $25 OFF</span>
            <span style={{ fontSize: '0.7rem', color: copiedCode ? 'var(--color-success)' : 'var(--text-muted)', fontWeight: 600, marginLeft: '4px' }}>
              {copiedCode ? '✓ Copied!' : '(Copy)'}
            </span>
          </div>

          <button 
            onClick={() => { setActiveRole('agency_admin'); setActivePortal('b2b'); }}
            style={{
              background: 'var(--brand-navy)',
              color: '#ffffff',
              border: 'none',
              padding: '2px 10px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            Corporate Portal
          </button>
        </div>
      </div>

      <header className="top-nav">
        <div className="nav-inner">
          {/* Brand Logo - TravelPulse AI */}
          <div 
            className="brand-logo" 
            style={{ flexShrink: 0, cursor: 'pointer' }}
            onClick={() => setActivePortal('b2c')}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #032559 0%, #fa3a3a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(3, 37, 89, 0.25)'
            }}>
              <Compass size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', lineHeight: 1.1 }}>
                <span style={{ color: 'var(--text-heading)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>TRAVEL</span>
                <span style={{ color: 'var(--brand-accent)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>PULSE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Enterprise SaaS
                </span>
                <span style={{ fontSize: '0.58rem', background: 'rgba(37,99,235,0.1)', color: 'var(--brand-blue)', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                  v2.5 PRO
                </span>
              </div>
            </div>
          </div>

          {/* Portal Switcher */}
          <div className="portal-switcher">
            <button 
              className={`portal-tab ${activePortal === 'b2c' ? 'active-b2c' : ''}`}
              onClick={() => setActivePortal('b2c')}
            >
              <Compass size={15} />
              <span>Book Flights & Travel</span>
            </button>
            <button 
              className={`portal-tab ${activePortal === 'b2b' ? 'active-b2b' : ''}`}
              onClick={() => setActivePortal('b2b')}
            >
              <Briefcase size={15} />
              <span>Corporate & Agency B2B</span>
            </button>
            <button 
              className={`portal-tab ${activePortal === 'admin' ? 'active-admin' : ''}`}
              onClick={() => setActivePortal('admin')}
            >
              <ShieldCheck size={15} />
              <span>Admin Hub</span>
            </button>
          </div>

        {/* Right Controls */}
        <div className="nav-controls">
          {/* Currency */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Coins size={14} color="var(--gold-500)" />
            <select 
              className="currency-select"
              value={activeCurrency}
              onChange={(e) => setActiveCurrency(e.target.value as CurrencyCode)}
            >
              <option value="USD">USD ($)</option>
              <option value="SAR">SAR (SR)</option>
              <option value="INR">INR (₹)</option>
              <option value="AED">AED</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          {/* My Trips Button */}
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setIsMyTripsOpen(true)}
            style={{ position: 'relative', gap: '6px' }}
            title="View My Trips & Bookings"
          >
            <Luggage size={14} />
            <span>My Trips</span>
            {pendingApprovals > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'var(--color-warning)',
                color: '#fff',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {pendingApprovals}
              </span>
            )}
          </button>

          {/* Role Persona Switcher */}
          <div style={{ position: 'relative' }}>
            <button 
              className="role-badge-btn"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              style={{ borderColor: currentRoleObj.color + '55' }}
            >
              <User size={13} color={currentRoleObj.color} />
              <span style={{ color: 'var(--text-main)' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Role: </span>
                <strong style={{ color: currentRoleObj.color }}>{currentRoleObj.label}</strong>
              </span>
              <ChevronDown size={12} color="var(--text-muted)" />
            </button>

            {roleDropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '300px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 200
                }}
              >
                <div style={{ 
                  padding: '0.5rem 0.75rem', 
                  borderBottom: '1px solid var(--border-color)', 
                  fontSize: '0.72rem', 
                  color: 'var(--text-dim)', 
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.25rem'
                }}>
                  Switch Role Persona
                </div>
                {roles.map(r => (
                  <div 
                    key={r.role}
                    onClick={() => handleRoleSelect(r.role)}
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background: activeRole === r.role ? `${r.color}12` : 'transparent',
                      border: activeRole === r.role ? `1px solid ${r.color}30` : '1px solid transparent',
                      marginBottom: '2px'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: activeRole === r.role ? r.color : 'var(--text-main)' }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginTop: '1px' }}>
                      {r.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit Log */}
          <button 
            className="btn btn-sm btn-secondary"
            onClick={() => openModal('audit')}
            title="Immutable Audit Trail"
          >
            <FileText size={14} />
            <span>Audit</span>
          </button>

          {/* Theme Toggle */}
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </div>
    </header>
    </>
  );
};

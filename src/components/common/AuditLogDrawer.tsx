import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, Clock, User, ArrowRight, Lock } from 'lucide-react';

export const AuditLogDrawer: React.FC = () => {
  const { activeModal, closeModal, auditLog } = useApp();

  if (activeModal.type !== 'audit') return null;

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '850px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '8px', borderRadius: '8px', color: '#f87171' }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Immutable Regulatory Audit Trail</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Compliance & Financial Mutation Log (Section 14 & PCI-DSS Audit Requirements)
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        {/* Info Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-dark)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Lock size={16} color="var(--gold-400)" />
          <span>All financial adjustments, commission overrides, and tier escalations are cryptographically tamper-evident.</span>
        </div>

        {/* Audit Log Entries List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '55vh', overflowY: 'auto' }}>
          {auditLog.map((entry) => (
            <div 
              key={entry.id}
              style={{
                background: 'rgba(20, 31, 54, 0.6)',
                border: '1px solid var(--border-dark)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                    {entry.entityType}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                    {entry.action}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  <Clock size={12} />
                  <span>{entry.timestamp}</span>
                </div>
              </div>

              {/* Mutation Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.25)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                <span style={{ color: '#f87171', textDecoration: 'line-through' }}>{entry.previousValue}</span>
                <ArrowRight size={14} color="var(--text-dim)" />
                <span style={{ color: '#34d399', fontWeight: 600 }}>{entry.newValue}</span>
              </div>

              {/* Actor & Source Info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={12} />
                  <span>Actor: <strong>{entry.actorName}</strong> ({entry.actorRole})</span>
                </div>
                <span>IP: {entry.ipAddress} • Entity ID: {entry.entityId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

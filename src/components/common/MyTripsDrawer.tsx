import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatus, BookingRecord } from '../../types';
import { 
  X, 
  Calendar, 
  Download, 
  Plane, 
  Building, 
  Sparkles, 
  FileText, 
  Palmtree, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { PdfEngine } from '../../services/pdfGenerator';

export const MyTripsDrawer: React.FC = () => {
  const { isMyTripsOpen, setIsMyTripsOpen, bookings, formatPrice, cancelBooking } = useApp();
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending_approval' | 'cancelled'>('all');

  if (!isMyTripsOpen) return null;

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const getVerticalIcon = (vertical: string) => {
    switch (vertical) {
      case 'flight': return <Plane size={16} color="var(--brand-blue)" />;
      case 'hotel': return <Building size={16} color="var(--text-heading)" />;
      case 'umrah': return <Sparkles size={16} color="var(--gold-500)" />;
      case 'visa': return <FileText size={16} color="var(--visa-teal)" />;
      case 'holiday': return <Palmtree size={16} color="var(--emerald-500)" />;
      default: return <Briefcase size={16} color="var(--brand-blue)" />;
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} />
            <span>Confirmed</span>
          </span>
        );
      case 'pending_approval':
        return (
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} />
            <span>Manager Approval Pending</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={12} />
            <span>Cancelled</span>
          </span>
        );
      default:
        return <span className="badge badge-blue">{status}</span>;
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsMyTripsOpen(false)}>
      <div 
        className="modal-content"
        style={{
          maxWidth: '850px',
          width: '95%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-blue">TRAVELER PORTAL</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-Time Corporate & Leisure Hub</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-heading)' }}>
              My Trips & Active Reservations
            </h2>
          </div>
          <button className="modal-close-btn" onClick={() => setIsMyTripsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          {[
            { id: 'all', label: `All Bookings (${bookings.length})` },
            { id: 'confirmed', label: `Confirmed (${bookings.filter(b => b.status === 'confirmed').length})` },
            { id: 'pending_approval', label: `Pending Approvals (${bookings.filter(b => b.status === 'pending_approval').length})` },
            { id: 'cancelled', label: `Cancelled (${bookings.filter(b => b.status === 'cancelled').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: filter === tab.id ? '1px solid var(--brand-blue)' : '1px solid var(--border-color)',
                background: filter === tab.id ? 'var(--brand-blue-light, rgba(37, 99, 235, 0.08))' : 'var(--bg-card-subtle)',
                color: filter === tab.id ? 'var(--brand-blue)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '4px' }}>
          {filteredBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Briefcase size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>No bookings found in this category.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Book flights, hotels, Umrah, or visas from the portal to see them here.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div 
                key={booking.id}
                style={{
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1.25rem',
                  transition: 'var(--transition)'
                }}
              >
                {/* Image */}
                <img 
                  src={booking.imageUrl} 
                  alt={booking.title} 
                  style={{ width: '130px', height: '100px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          {getVerticalIcon(booking.vertical)}
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                            {booking.vertical}
                          </span>
                          <span style={{ color: 'var(--text-dim)' }}>•</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-blue)', letterSpacing: '0.04em' }}>
                            {booking.referenceCode}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                          {booking.title}
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {booking.subtitle}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                          {formatPrice(booking.totalAmountUSD)}
                        </div>
                        <div style={{ marginTop: '4px' }}>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} color="var(--brand-blue)" />
                        <span>Dates: <strong>{booking.travelDates}</strong></span>
                      </div>
                      <div>
                        Traveler: <strong>{booking.passenger.fullName}</strong>
                      </div>
                      <div>
                        Tender: <strong>{booking.paymentMethod}</strong>
                      </div>
                    </div>

                    {/* Policy note if applicable */}
                    {booking.policyCompliance.reason && (
                      <div 
                        style={{
                          marginTop: '8px',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          background: booking.policyCompliance.inPolicy ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.1)',
                          color: booking.policyCompliance.inPolicy ? 'var(--color-success)' : 'var(--color-warning)',
                          border: `1px solid ${booking.policyCompliance.inPolicy ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.3)'}`
                        }}
                      >
                        <strong>Policy Note: </strong>{booking.policyCompliance.reason}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                    {booking.status !== 'cancelled' && (
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => cancelBooking(booking.id)}
                        style={{ color: 'var(--color-danger)' }}
                      >
                        <Trash2 size={13} />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => PdfEngine.generateBookingVoucher(booking)}
                    >
                      <Download size={13} />
                      <span>Download PDF Voucher</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

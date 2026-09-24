import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuotationRecord } from '../../types';
import { 
  Briefcase, 
  Percent, 
  Wallet, 
  FileText, 
  Share2, 
  Download, 
  Plus, 
  ShieldCheck, 
  Upload, 
  ArrowUpRight, 
  DollarSign, 
  CheckCircle2, 
  Sparkles,
  Layers,
  AlertTriangle,
  Clock,
  XCircle,
  Plane,
  Building,
  User
} from 'lucide-react';
import { PdfEngine } from '../../services/pdfGenerator';
import confetti from 'canvas-confetti';

export const B2BAgencyPanel: React.FC = () => {
  const { 
    formatPrice, 
    agencyBranding, 
    updateAgencyBranding,
    agencyWallet, 
    topUpWallet,
    agencyMarkup, 
    updateAgencyMarkup,
    quotations, 
    addQuotation,
    openModal,
    bookings,
    approveBooking,
    rejectBooking,
    corporatePolicy,
    updateCorporatePolicy,
    hasPermission
  } = useApp();

  const [topUpAmount, setTopUpAmount] = useState<number>(5000);
  const [activeTab, setActiveTab] = useState<'approvals' | 'quotes' | 'markup' | 'wallet' | 'branding' | 'policy'>('approvals');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  
  const pendingBookings = bookings.filter(b => b.status === 'pending_approval');
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [batchUploadStatus, setBatchUploadStatus] = useState<'idle' | 'processing' | 'done'>('idle');

  // Form for New Quotation
  const [newQuote, setNewQuote] = useState({
    clientName: 'Al-Rajhi Corporate Delegation',
    clientPhone: '+966 55 902 1199',
    clientEmail: 'procurement@alrajhi.com',
    vertical: 'Umrah' as 'Umrah' | 'Visa' | 'Holidays' | 'MICE',
    packageTitle: 'Super Saver 14-Day Umrah Group Departure',
    pax: 8,
    baseCostPerPax: 820 // Wholesale net cost
  });

  const calculatedWholesale = newQuote.baseCostPerPax * newQuote.pax;
  const markupAmount = agencyMarkup.type === 'percentage' 
    ? (calculatedWholesale * agencyMarkup.value) / 100 
    : agencyMarkup.value * newQuote.pax;
  const calculatedClientPrice = calculatedWholesale + markupAmount;

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const createdQuote: QuotationRecord = {
      id: `qt-${Date.now()}`,
      quoteNumber: `QT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newQuote.clientName,
      clientPhone: newQuote.clientPhone,
      clientEmail: newQuote.clientEmail,
      vertical: newQuote.vertical,
      packageTitle: `${newQuote.packageTitle} (${newQuote.pax} Pax)`,
      pax: newQuote.pax,
      wholesaleSupplierCost: calculatedWholesale,
      markupType: agencyMarkup.type,
      markupValue: agencyMarkup.value,
      clientSellingPrice: calculatedClientPrice,
      validUntil: '2026-10-31',
      status: 'Sent',
      agencyBrandingSnapshot: agencyBranding,
      deliveryStatus: {
        downloaded: false,
        whatsappSent: false,
        emailSent: false
      }
    };

    addQuotation(createdQuote);
    setShowNewQuoteModal(false);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleSimulateBatchUpload = () => {
    setBatchUploadStatus('processing');
    setTimeout(() => {
      setBatchUploadStatus('done');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Agency Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.9) 0%, rgba(20, 31, 54, 0.95) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          border: '1px solid rgba(42, 157, 143, 0.4)',
          boxShadow: 'var(--shadow-teal)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <Briefcase size={14} /> B2B AGENCY WORKSPACE & WHOLESALE DESK
            </div>

            <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#ffffff' }}>
              {agencyBranding.agencyName}
            </h1>

            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', marginTop: '4px' }}>
              License: <strong>{agencyBranding.licenseNumber}</strong> • Partner Tier: <strong style={{ color: 'var(--gold-400)' }}>Gold Merchant</strong>
            </p>
          </div>

          {/* Quick Wallet Metric Pill */}
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.5rem', textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Total Available Booking Power
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
              {formatPrice(agencyWallet.availablePower)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Wallet: {formatPrice(agencyWallet.balance)} + Credit: {formatPrice(agencyWallet.creditLimit - agencyWallet.usedCredit)}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-sm ${activeTab === 'approvals' ? 'btn-primary-teal' : 'btn-secondary'}`}
            onClick={() => setActiveTab('approvals')}
            style={{ position: 'relative' }}
          >
            <Clock size={15} /> 
            Approval Queue
            {pendingBookings.length > 0 && (
              <span style={{
                background: '#dc2626',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '4px'
              }}>
                {pendingBookings.length}
              </span>
            )}
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'policy' ? 'btn-primary-teal' : 'btn-secondary'}`}
            onClick={() => setActiveTab('policy')}
          >
            <ShieldCheck size={15} /> Travel Policy Manager
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'quotes' ? 'btn-primary-teal' : 'btn-secondary'}`}
            onClick={() => setActiveTab('quotes')}
          >
            <FileText size={15} /> Branded Quotations ({quotations.length})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'markup' ? 'btn-primary-teal' : 'btn-secondary'}`}
            onClick={() => setActiveTab('markup')}
          >
            <Percent size={15} /> Margin & Markup Engine (+{agencyMarkup.value}{agencyMarkup.type === 'percentage' ? '%' : '$'})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'wallet' ? 'btn-primary-teal' : 'btn-secondary'}`}
            onClick={() => setActiveTab('wallet')}
          >
            <Wallet size={15} /> Wallet & Credit Ledger
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'branding' ? 'btn-primary-teal' : 'btn-secondary'}`}
            onClick={() => setActiveTab('branding')}
          >
            <Sparkles size={15} /> White-Label Settings & Logo
          </button>
        </div>
      </div>

      {/* TAB 0: Approval Queue */}
      {activeTab === 'approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Corporate Travel Approval Queue
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Out-of-policy bookings requiring manager authorization. Review, approve, or reject with reasons.
              </p>
            </div>
            <span className="badge badge-warning" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
              {pendingBookings.length} Pending
            </span>
          </div>

          {pendingBookings.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)' }}>All Clear!</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                No bookings are waiting for approval right now.
              </p>
            </div>
          )}

          {pendingBookings.map((booking) => (
            <div key={booking.id} className="card" style={{ 
              padding: '1.5rem', 
              border: '1px solid rgba(245, 158, 11, 0.3)',
              background: 'rgba(245, 158, 11, 0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                {/* Booking Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-warning">
                      <Clock size={11} />
                      Pending Approval
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {booking.referenceCode || booking.bookingRef}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(37,99,235,0.1)', color: 'var(--brand-blue)' }}>
                      {booking.vertical}
                    </span>
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '8px' }}>
                    {booking.title}
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                    <span><User size={13} style={{ display: 'inline', marginRight: '4px' }} />{booking.passenger?.fullName || booking.travelerName || 'Corporate Traveler'}</span>
                    <span><span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Total:</span> {formatPrice(booking.totalAmountUSD ?? booking.totalCost ?? 0)}</span>
                    <span><span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Travel Date:</span> {booking.travelDates || booking.travelDate || 'Flexible'}</span>
                  </div>

                  {/* Policy Violation Notice */}
                  {(booking.policyCompliance?.reason || booking.policyViolationReason) && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.82rem',
                      color: 'var(--color-warning)'
                    }}>
                      <AlertTriangle size={13} />
                      <strong>Policy Violation:</strong> {booking.policyCompliance?.reason || booking.policyViolationReason}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
                  {rejectingId === booking.id ? (
                    <>
                      <textarea
                        className="form-input"
                        placeholder="Reason for rejection..."
                        rows={2}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        style={{ fontSize: '0.82rem', resize: 'vertical' }}
                      />
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-sm"
                          onClick={() => {
                            rejectBooking(booking.id, rejectReason || 'Rejected by Travel Manager');
                            setRejectingId(null);
                            setRejectReason('');
                          }}
                          style={{ background: 'var(--color-danger)', color: '#fff', flex: 1 }}
                        >
                          Confirm Reject
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setRejectingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          approveBooking(booking.id);
                          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                        }}
                        style={{ background: 'var(--color-success)', color: '#fff', justifyContent: 'center' }}
                      >
                        <CheckCircle2 size={14} />
                        Approve & Notify Traveler
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setRejectingId(booking.id)}
                        style={{ justifyContent: 'center', color: 'var(--color-danger)', borderColor: 'rgba(220,38,38,0.3)' }}
                      >
                        <XCircle size={14} />
                        Reject with Reason
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Recently Processed */}
          {bookings.filter(b => b.status === 'confirmed' || b.status === 'approved' || b.status === 'cancelled' || b.status === 'rejected').length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Recently Processed
              </h4>
              {bookings.filter(b => b.status === 'confirmed' || b.status === 'approved' || b.status === 'cancelled' || b.status === 'rejected').slice(0, 5).map(booking => {
                const isApproved = booking.status === 'confirmed' || booking.status === 'approved';
                return (
                  <div key={booking.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    marginBottom: '8px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem'
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{booking.title}</span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                        {booking.passenger?.fullName || booking.travelerName || 'Corporate Traveler'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 700 }}>{formatPrice(booking.totalAmountUSD ?? booking.totalCost ?? 0)}</span>
                      <span className={isApproved ? 'policy-badge-in' : 'policy-badge-out'}>
                        {isApproved ? '✓ Approved' : '✗ Rejected'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB Policy: Corporate Policy Manager */}
      {activeTab === 'policy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              Corporate Travel Policy Manager
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Define spending caps and booking rules. Changes reflect immediately on all search results.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Flight Policy */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(37, 99, 235, 0.1)', borderRadius: '8px', padding: '8px' }}>
                  <Plane size={18} color="var(--brand-blue)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>Flight Policy</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Per-booking spending caps</p>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Max Economy Ticket (USD)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={corporatePolicy.maxFlightEconomyUSD ?? corporatePolicy.maxFlightBudgetUSD}
                    onChange={(e) => updateCorporatePolicy({ 
                      maxFlightEconomyUSD: Number(e.target.value),
                      maxFlightBudgetUSD: Number(e.target.value) 
                    })}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>per ticket</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Max Business Class (USD)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={corporatePolicy.maxFlightBusinessUSD ?? 2500}
                  onChange={(e) => updateCorporatePolicy({ maxFlightBusinessUSD: Number(e.target.value) })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  <input 
                    type="checkbox" 
                    checked={corporatePolicy.businessRequiresApproval ?? true}
                    onChange={(e) => updateCorporatePolicy({ businessRequiresApproval: e.target.checked })}
                    style={{ accentColor: 'var(--brand-blue)', width: '15px', height: '15px' }}
                  />
                  Business class always needs manager approval
                </label>
              </div>
            </div>

            {/* Hotel Policy */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(13, 148, 136, 0.1)', borderRadius: '8px', padding: '8px' }}>
                  <Building size={18} color="var(--visa-teal)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>Hotel Policy</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Nightly rate caps</p>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Max Nightly Rate (USD)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={corporatePolicy.maxHotelNightlyUSD}
                    onChange={(e) => updateCorporatePolicy({ maxHotelNightlyUSD: Number(e.target.value) })}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>per night</span>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  <input 
                    type="checkbox" 
                    checked={corporatePolicy.allowBnB ?? false}
                    onChange={(e) => updateCorporatePolicy({ allowBnB: e.target.checked })}
                    style={{ accentColor: 'var(--brand-blue)', width: '15px', height: '15px' }}
                  />
                  Allow Airbnb / BnB alternatives
                </label>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', background: 'rgba(37, 99, 235, 0.04)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--brand-blue)', fontWeight: 600, marginBottom: '8px' }}>
              💡 Live Policy Preview
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Flights under <strong style={{ color: 'var(--text-main)' }}>${corporatePolicy.maxFlightEconomyUSD ?? corporatePolicy.maxFlightBudgetUSD}</strong> economy are auto-approved &nbsp;·&nbsp; 
              Hotels under <strong style={{ color: 'var(--text-main)' }}>${corporatePolicy.maxHotelNightlyUSD}</strong>/night are auto-approved &nbsp;·&nbsp; 
              Business class {corporatePolicy.businessRequiresApproval ? 'always needs approval' : 'is auto-approved if under cap'}
            </div>
          </div>
        </div>
      )}


      {/* TAB 1: Branded Quotations & White-Label PDF Exporter */}
      {activeTab === 'quotes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem' }}>Client Proposals & Quotations</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Wholesale supplier pricing is hidden from generated proposals. Client only sees your selling price.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => handleSimulateBatchUpload()}
              >
                <Upload size={14} /> Batch Passport Upload (CSV)
              </button>

              <button 
                className="btn btn-primary-teal btn-sm"
                onClick={() => setShowNewQuoteModal(true)}
              >
                <Plus size={14} /> Create White-Label Quotation
              </button>
            </div>
          </div>

          {batchUploadStatus === 'processing' && (
            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', borderRadius: '8px', fontSize: '0.85rem', color: '#93c5fd' }}>
              Parsing 25 group passenger passports and generating ICAO MRZ checksums...
            </div>
          )}

          {batchUploadStatus === 'done' && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', fontSize: '0.85rem', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>25 Passports Successfully Verified & Attached to Group Manifest!</span>
              <button 
                className="btn btn-sm btn-primary-gold"
                onClick={() => {
                  const manifestList = Array.from({ length: 25 }, (_, i) => ({
                    name: `Group Pilgrim ${i + 1}`,
                    passport: `N${8820100 + i}`,
                    roomType: 'Quad Suite Sharing',
                    busNo: `Coach ${i < 13 ? 'A' : 'B'}`
                  }));
                  PdfEngine.generateGroupManifest('Bulk Group Manifest 25 Pax', manifestList);
                }}
              >
                <Download size={14} /> Download Manifest PDF
              </button>
            </div>
          )}

          {/* Quotations List */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Quote #</th>
                  <th>Client / Organization</th>
                  <th>Vertical & Package</th>
                  <th>Pax</th>
                  <th>Wholesale Cost</th>
                  <th>Applied Markup</th>
                  <th>Client Selling Price</th>
                  <th>Status</th>
                  <th>1-Click Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((q) => {
                  const profit = q.clientSellingPrice - q.wholesaleSupplierCost;
                  return (
                    <tr key={q.id}>
                      <td style={{ fontWeight: 700, color: 'var(--visa-teal)' }}>{q.quoteNumber}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{q.clientName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{q.clientPhone}</div>
                      </td>
                      <td>
                        <div>{q.packageTitle}</div>
                        <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>{q.vertical}</span>
                      </td>
                      <td>{q.pax}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatPrice(q.wholesaleSupplierCost)}</td>
                      <td style={{ color: '#34d399', fontWeight: 600 }}>
                        +{formatPrice(profit)} ({q.markupType === 'percentage' ? `${q.markupValue}%` : `$${q.markupValue}/pax`})
                      </td>
                      <td style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                        {formatPrice(q.clientSellingPrice)}
                      </td>
                      <td>
                        <span className="badge badge-emerald">{q.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            title="Download Branded PDF (Wholesale Hidden)"
                            onClick={() => PdfEngine.generateWhiteLabelQuotation(q)}
                          >
                            <Download size={14} /> PDF
                          </button>
                          <button 
                            className="btn btn-sm btn-primary-teal" 
                            title="Dispatch via WhatsApp Business API / Email"
                            onClick={() => openModal('package_delivery', q)}
                          >
                            <Share2 size={14} /> Dispatch
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Dynamic Margin & Markup Engine (Sec 3) */}
      {activeTab === 'markup' && (
        <div className="glass-card" style={{ maxWidth: '800px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#ffffff' }}>
            Global Agency Margin & Markup Engine
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Configure default wholesale markups applied to net supplier pricing across Umrah, Visas, and Packages before presenting quotes.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button 
                className={`btn btn-sm ${agencyMarkup.type === 'percentage' ? 'btn-primary-teal' : 'btn-secondary'}`}
                onClick={() => updateAgencyMarkup('percentage', agencyMarkup.value)}
              >
                Percentage Markup (+X%)
              </button>
              <button 
                className={`btn btn-sm ${agencyMarkup.type === 'flat' ? 'btn-primary-teal' : 'btn-secondary'}`}
                onClick={() => updateAgencyMarkup('flat', 150)}
              >
                Flat Markup per Traveler (+$)
              </button>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label className="form-label">
                  {agencyMarkup.type === 'percentage' ? 'Profit Margin Percentage' : 'Flat Markup Amount ($)'}
                </label>
                <span style={{ fontWeight: 800, color: 'var(--visa-teal)', fontSize: '1.2rem' }}>
                  {agencyMarkup.type === 'percentage' ? `+${agencyMarkup.value}%` : `+$${agencyMarkup.value}`}
                </span>
              </div>

              <input 
                type="range"
                min={agencyMarkup.type === 'percentage' ? 0 : 0}
                max={agencyMarkup.type === 'percentage' ? 40 : 500}
                step={agencyMarkup.type === 'percentage' ? 1 : 10}
                value={agencyMarkup.value}
                onChange={(e) => updateAgencyMarkup(agencyMarkup.type, parseInt(e.target.value))}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>0% (Wholesale Net)</span>
                <span>+12% (Recommended B2B Standard)</span>
                <span>+40% (Premium Retail)</span>
              </div>
            </div>
          </div>

          {/* Live Simulation Calculator */}
          <div style={{ background: 'rgba(42, 157, 143, 0.1)', border: '1px solid rgba(42, 157, 143, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#5eead4', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Real-Time Quotation Split Preview (Sample 4 Pax Booking)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Net Supplier Cost:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {formatPrice(3280)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Your Agency Margin:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>
                  +{formatPrice(agencyMarkup.type === 'percentage' ? (3280 * agencyMarkup.value) / 100 : agencyMarkup.value * 4)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Client Final Quote:</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                  {formatPrice(3280 + (agencyMarkup.type === 'percentage' ? (3280 * agencyMarkup.value) / 100 : agencyMarkup.value * 4))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Wallet & Credit Ledger (Sec 3) */}
      {activeTab === 'wallet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="glass-card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Liquid Deposit Balance</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                {formatPrice(agencyWallet.balance)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Available for instant ticket lock</div>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Approved Credit Facility</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-400)', margin: '4px 0' }}>
                {formatPrice(agencyWallet.creditLimit)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Used: {formatPrice(agencyWallet.usedCredit)} • Gold Tier Facility
              </div>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Purchasing Capacity</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--visa-teal)', margin: '4px 0' }}>
                {formatPrice(agencyWallet.availablePower)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#5eead4' }}>Direct PNR & Umrah Block power</div>
            </div>
          </div>

          {/* Top-up Action */}
          <div className="glass-card" style={{ maxWidth: '600px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Instant Wallet Deposit Top-Up</h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input 
                type="number"
                className="form-input"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(parseInt(e.target.value) || 0)}
                placeholder="Enter deposit amount"
              />
              <button 
                className="btn btn-primary-teal"
                onClick={() => {
                  topUpWallet(topUpAmount);
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                }}
              >
                Top-Up via Virtual Bank Wire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: White-Label Branding Settings */}
      {activeTab === 'branding' && (
        <div className="glass-card" style={{ maxWidth: '750px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
            White-Label Branding & Identity Customization
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Configure your company details to be dynamically injected into generated PDF proposals, vouchers, and client links.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Agency Trading Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={agencyBranding.agencyName}
                  onChange={(e) => updateAgencyBranding({ agencyName: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">License / IATA Code</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={agencyBranding.licenseNumber}
                  onChange={(e) => updateAgencyBranding({ licenseNumber: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Support Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={agencyBranding.email}
                  onChange={(e) => updateAgencyBranding({ email: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Client WhatsApp / Phone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={agencyBranding.phone}
                  onChange={(e) => updateAgencyBranding({ phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Office Address</label>
              <input 
                type="text" 
                className="form-input" 
                value={agencyBranding.address}
                onChange={(e) => updateAgencyBranding({ address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Custom Quotation Footer Disclaimer</label>
              <textarea 
                className="form-textarea" 
                rows={2}
                value={agencyBranding.footerDisclaimer}
                onChange={(e) => updateAgencyBranding({ footerDisclaimer: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#34d399' }}>
              <CheckCircle2 size={16} />
              <span>Branding automatically syncs across all client-facing PDF proposals & WhatsApp shares.</span>
            </div>
          </div>
        </div>
      )}

      {/* New Quotation Modal */}
      {showNewQuoteModal && (
        <div className="modal-backdrop" onClick={() => setShowNewQuoteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>Create Client White-Label Quotation</h3>
              <button className="modal-close-btn" onClick={() => setShowNewQuoteModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateQuote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Client Full Name / Organization</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newQuote.clientName}
                  onChange={(e) => setNewQuote({ ...newQuote, clientName: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Client WhatsApp / Phone</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newQuote.clientPhone}
                    onChange={(e) => setNewQuote({ ...newQuote, clientPhone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Client Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={newQuote.clientEmail}
                    onChange={(e) => setNewQuote({ ...newQuote, clientEmail: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Vertical</label>
                  <select 
                    className="form-select"
                    value={newQuote.vertical}
                    onChange={(e) => setNewQuote({ ...newQuote, vertical: e.target.value as any })}
                  >
                    <option value="Umrah">Corporate Umrah</option>
                    <option value="Visa">Global Visa</option>
                    <option value="Holidays">Custom Holidays</option>
                    <option value="MICE">M.I.C.E. Event</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Passenger Count (Pax)</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="form-input" 
                    value={newQuote.pax}
                    onChange={(e) => setNewQuote({ ...newQuote, pax: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--text-muted)' }}>
                  <span>Wholesale Net Base ({newQuote.pax} Pax):</span>
                  <span>{formatPrice(calculatedWholesale)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#34d399' }}>
                  <span>Your Margin ({agencyMarkup.type === 'percentage' ? `+${agencyMarkup.value}%` : `+$${agencyMarkup.value}/pax`}):</span>
                  <span>+{formatPrice(markupAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', color: '#ffffff', borderTop: '1px solid var(--border-dark)', paddingTop: '6px' }}>
                  <span>Client Selling Total:</span>
                  <span style={{ color: 'var(--visa-teal)' }}>{formatPrice(calculatedClientPrice)}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary-teal btn-lg" style={{ marginTop: '0.5rem' }}>
                Generate Branded Proposal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

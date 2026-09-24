import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeadPipelineStatus } from '../../types';
import { 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Layers, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Download,
  Building,
  Briefcase,
  Calendar
} from 'lucide-react';
import { PdfEngine } from '../../services/pdfGenerator';
import confetti from 'canvas-confetti';

export const SuperAdminPanel: React.FC = () => {
  const { 
    formatPrice, 
    leads, 
    updateLeadPipeline, 
    assignLeadToStaff, 
    staff,
    vendorLedger, 
    recordVendorPayment, 
    offlineRates, 
    addOfflineRate,
    openModal
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'attribution' | 'leads' | 'vendor_ledger' | 'offline_rates'>('analytics');
  
  // Offline Rate Modal
  const [showAddRateModal, setShowAddRateModal] = useState(false);
  const [newRateForm, setNewRateForm] = useState({
    vendorName: 'Al-Shohada VIP Suites Makkah',
    category: 'Executive Haram View Quad Suite',
    validFrom: '2026-10-01',
    validTo: '2026-12-31',
    unitPrice: 165
  });

  // Pay Vendor Modal
  const [payingVendorId, setPayingVendorId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(10000);

  // Marketing Attribution Campaigns Data (Spec Sec 4)
  const attributionCampaigns = [
    { source: 'Google Ads Search', campaign: 'umrah_clocktower_vip_2026', spend: 8400, leads: 92, converted: 34, gbv: 166600, netProfit: 21400, cac: 247 },
    { source: 'Meta Reels / Ads', campaign: 'kashmir_autumn_honeymoon', spend: 4200, leads: 110, converted: 26, gbv: 50700, netProfit: 7800, cac: 161 },
    { source: 'TikTok Umrah Special', campaign: 'saudi_evisa_instant_promo', spend: 2800, leads: 145, converted: 48, gbv: 38880, netProfit: 5400, cac: 58 },
    { source: 'Direct Organic SEO', campaign: 'organic_mice_dubai_summit', spend: 0, leads: 24, converted: 9, gbv: 252000, netProfit: 34200, cac: 0 },
  ];

  const totalGBV = attributionCampaigns.reduce((acc, c) => acc + c.gbv, 0);
  const totalNetProfit = attributionCampaigns.reduce((acc, c) => acc + c.netProfit, 0);
  const totalAdSpend = attributionCampaigns.reduce((acc, c) => acc + c.spend, 0);
  const blendedROAS = ((totalNetProfit / totalAdSpend) * 100).toFixed(0);

  const handleAddOfflineRate = (e: React.FormEvent) => {
    e.preventDefault();
    addOfflineRate({
      vendorName: newRateForm.vendorName,
      category: newRateForm.category,
      validFrom: newRateForm.validFrom,
      validTo: newRateForm.validTo,
      unitPrice: newRateForm.unitPrice,
      currency: 'USD',
      sourceTag: 'Offline/Manual',
      expiryWarning: false
    });
    setShowAddRateModal(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleRecordPayment = (vendorId: string) => {
    recordVendorPayment(vendorId, paymentAmount, 'Bank Wire Remittance');
    setPayingVendorId(null);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Super Admin Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.95) 0%, rgba(20, 31, 54, 0.98) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          border: '1px solid rgba(129, 140, 248, 0.4)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <ShieldCheck size={14} /> SUPER ADMIN & ENTERPRISE OPERATIONS HUB
            </div>

            <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#ffffff' }}>
              Platform Oversight & Revenue Engine
            </h1>

            <p style={{ fontSize: '0.95rem', color: '#c7d2fe', marginTop: '4px' }}>
              Real-time Gross Booking Value, Marketing Ads Attribution, Lead Assignment CRM, and Vendor Payables Ledgers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => openModal('audit')}
            >
              View Immutable Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-sm ${activeAdminTab === 'analytics' ? 'btn-primary-teal' : 'btn-secondary'}`}
            onClick={() => setActiveAdminTab('analytics')}
          >
            <TrendingUp size={15} /> Executive Revenue & GBV
          </button>

          <button 
            className={`btn btn-sm ${activeAdminTab === 'attribution' ? 'btn-primary-teal' : 'btn-secondary'}`}
            onClick={() => setActiveAdminTab('attribution')}
          >
            <Target size={15} /> Ads Attribution & UTM ROI
          </button>

          <button 
            className={`btn btn-sm ${activeAdminTab === 'leads' ? 'btn-primary-teal' : 'btn-secondary'}`}
            onClick={() => setActiveAdminTab('leads')}
          >
            <Users size={15} /> Staff CRM & Lead Pipeline ({leads.length})
          </button>

          <button 
            className={`btn btn-sm ${activeAdminTab === 'vendor_ledger' ? 'btn-primary-teal' : 'btn-secondary'}`}
            onClick={() => setActiveAdminTab('vendor_ledger')}
          >
            <DollarSign size={15} /> Vendor Payables Ledger & Recon
          </button>

          <button 
            className={`btn btn-sm ${activeAdminTab === 'offline_rates' ? 'btn-primary-teal' : 'btn-secondary'}`}
            onClick={() => setActiveAdminTab('offline_rates')}
          >
            <Layers size={15} /> Offline Rate Sheets ({offlineRates.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Executive Analytics (Sec 4 & 5.2) */}
      {activeAdminTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="glass-card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Gross Booking Value (GBV)</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                {formatPrice(totalGBV)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399' }}>+22.4% vs last calendar month</div>
            </div>

            <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Net Platform Profit (Sec 5.2)</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
                {formatPrice(totalNetProfit)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Revenue − Vendor Cost − Commission</div>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Marketing Paid Spend</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--gold-400)', margin: '4px 0' }}>
                {formatPrice(totalAdSpend)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#60a5fa' }}>Blended Campaign ROI: {blendedROAS}%</div>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Inbound Leads</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--visa-teal)', margin: '4px 0' }}>
                {leads.length} Open
              </div>
              <div style={{ fontSize: '0.75rem', color: '#5eead4' }}>Avg. Staff SLA response: 24 mins</div>
            </div>
          </div>

          {/* Revenue Split & Margin Breakdown Chart Simulation */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#ffffff' }}>
              Vertical-by-Vertical Revenue Contribution
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--gold-400)', fontWeight: 700 }}>Umrah Pilgrimage</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>$166,600</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>34 Groups Confirmed</div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)' }}>
                <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700 }}>M.I.C.E. Corporate</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>$252,000</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>9 Large Summits</div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)' }}>
                <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>Custom Holidays</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>$50,700</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>26 Modular Tours</div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--visa-teal)', fontWeight: 700 }}>Global e-Visas</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>$38,880</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>48 Instant OCR Clearances</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Marketing Ads Attribution (Sec 4) */}
      {activeAdminTab === 'attribution' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Marketing Lead Source Tracking (Ads Attribution)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              UTM tracking captured at first inquiry and tied directly to closed gross revenue and net platform profit.
            </p>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ad Platform / Source</th>
                  <th>UTM Campaign Identifier</th>
                  <th>Ad Spend</th>
                  <th>Leads</th>
                  <th>Bookings</th>
                  <th>CAC / Booking</th>
                  <th>Gross Value (GBV)</th>
                  <th>Net Platform Profit</th>
                </tr>
              </thead>
              <tbody>
                {attributionCampaigns.map((camp, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                        {camp.source}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: '#93c5fd' }}>{camp.campaign}</td>
                    <td>{formatPrice(camp.spend)}</td>
                    <td>{camp.leads}</td>
                    <td style={{ fontWeight: 700, color: '#34d399' }}>{camp.converted}</td>
                    <td>{camp.cac > 0 ? formatPrice(camp.cac) : 'Organic (Free)'}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(camp.gbv)}</td>
                    <td style={{ fontWeight: 800, color: '#34d399' }}>+{formatPrice(camp.netProfit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Staff Management & Lead Pipeline CRM (Sec 4) */}
      {activeAdminTab === 'leads' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Staff Inbound Lead Assignment & Pipeline</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Every inbound inquiry lands with a dedicated staff officer with active SLA window tracking.
              </p>
            </div>
          </div>

          {/* Staff Leaderboard */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {staff.map((s) => (
              <div key={s.id} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={s.avatar} alt={s.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.role}</div>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, marginTop: '2px' }}>
                    Conversion Rate: {s.conversionRate}% ({s.conversionsThisMonth} closed)
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inbound Leads Table */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Vertical</th>
                  <th>Source / Campaign</th>
                  <th>Assigned Officer</th>
                  <th>Est. Value</th>
                  <th>Pipeline Status (Sec 4)</th>
                  <th>Reassign Staff</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{lead.clientName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{lead.clientPhone}</div>
                    </td>
                    <td><span className="badge badge-teal">{lead.vertical}</span></td>
                    <td>
                      <div>{lead.source}</div>
                      <div style={{ fontSize: '0.7rem', color: '#60a5fa' }}>{lead.utmCampaign}</div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#ffffff' }}>{lead.assignedStaffName}</td>
                    <td style={{ fontWeight: 700, color: 'var(--gold-400)' }}>{formatPrice(lead.estimatedValue)}</td>
                    <td>
                      <select 
                        className="form-select"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        value={lead.pipelineStatus}
                        onChange={(e) => updateLeadPipeline(lead.id, e.target.value as LeadPipelineStatus)}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quotation Sent">Quotation Sent</option>
                        <option value="Booking Confirmed">Booking Confirmed</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        value={lead.assignedStaffId}
                        onChange={(e) => assignLeadToStaff(lead.id, e.target.value)}
                      >
                        {staff.map(st => (
                          <option key={st.id} value={st.id}>{st.name}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Vendor Payables Ledger & Reconciliation (Sec 5.4) */}
      {activeAdminTab === 'vendor_ledger' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Vendor Payment Ledger & Reconciliation</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Tracks exact payables owed to hotels, airlines, ground operators, and visa authorities with due-date alerts.
            </p>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vendor Entity</th>
                  <th>Category</th>
                  <th>Total Booked</th>
                  <th>Amount Paid</th>
                  <th>Pending Balance</th>
                  <th>Due Date & Alert</th>
                  <th>Recon Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vendorLedger.map((v) => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600, color: '#ffffff' }}>{v.vendorName}</td>
                    <td><span className="badge badge-teal">{v.vendorType}</span></td>
                    <td>{formatPrice(v.totalBookedAmount)}</td>
                    <td style={{ color: '#34d399' }}>{formatPrice(v.amountPaid)}</td>
                    <td style={{ fontWeight: 700, color: v.pendingBalance > 0 ? 'var(--gold-400)' : '#34d399' }}>
                      {formatPrice(v.pendingBalance)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {v.isOverdue && <AlertTriangle size={14} color="#f87171" />}
                        <span style={{ color: v.isOverdue ? '#f87171' : 'var(--text-main)', fontSize: '0.8rem', fontWeight: v.isOverdue ? 700 : 400 }}>
                          {v.nextDueDate} {v.isOverdue ? '(OVERDUE)' : ''}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${v.reconciliationStatus === 'Reconciled' ? 'badge-emerald' : 'badge-amber'}`}>
                        {v.reconciliationStatus}
                      </span>
                    </td>
                    <td>
                      {v.pendingBalance > 0 ? (
                        <button 
                          className="btn btn-sm btn-primary-teal"
                          onClick={() => {
                            setPayingVendorId(v.id);
                            setPaymentAmount(Math.min(v.pendingBalance, 10000));
                          }}
                        >
                          Record Payment
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Settled in Full</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Record Vendor Payment Modal */}
          {payingVendorId && (
            <div className="modal-backdrop" onClick={() => setPayingVendorId(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 style={{ fontSize: '1.2rem' }}>Record Vendor Wire Remittance</h3>
                  <button className="modal-close-btn" onClick={() => setPayingVendorId(null)}>✕</button>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Amount ($ USD)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button className="btn btn-secondary" onClick={() => setPayingVendorId(null)}>Cancel</button>
                  <button className="btn btn-primary-teal" onClick={() => handleRecordPayment(payingVendorId)}>
                    Confirm Wire & Write to Audit Log
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Contracted Offline Rates (Sec 4) */}
      {activeAdminTab === 'offline_rates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Offline / Manual Contracted Rate Sheets</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Enables hotels and VIP transport vendors with no live API to flow through the same markup engine.
              </p>
            </div>

            <button 
              className="btn btn-primary-teal btn-sm"
              onClick={() => setShowAddRateModal(true)}
            >
              <Plus size={14} /> Add Contracted Offline Rate
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vendor Partner</th>
                  <th>Service Category</th>
                  <th>Contract Validity</th>
                  <th>Net Negotiated Rate</th>
                  <th>Source Tag</th>
                  <th>Alert Status</th>
                </tr>
              </thead>
              <tbody>
                {offlineRates.map((rate) => (
                  <tr key={rate.id}>
                    <td style={{ fontWeight: 600, color: '#ffffff' }}>{rate.vendorName}</td>
                    <td>{rate.category}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {rate.validFrom} to {rate.validTo}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--gold-400)' }}>
                      {formatPrice(rate.unitPrice)}
                    </td>
                    <td><span className="badge badge-teal">{rate.sourceTag}</span></td>
                    <td>
                      {rate.expiryWarning ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171', fontSize: '0.75rem', fontWeight: 700 }}>
                          <AlertTriangle size={14} /> Expires Soon!
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Active Contract</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Rate Modal */}
          {showAddRateModal && (
            <div className="modal-backdrop" onClick={() => setShowAddRateModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 style={{ fontSize: '1.2rem' }}>Add Negotiated Offline Rate Sheet</h3>
                  <button className="modal-close-btn" onClick={() => setShowAddRateModal(false)}>✕</button>
                </div>

                <form onSubmit={handleAddOfflineRate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Vendor Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={newRateForm.vendorName}
                      onChange={(e) => setNewRateForm({ ...newRateForm, vendorName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Category</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={newRateForm.category}
                      onChange={(e) => setNewRateForm({ ...newRateForm, category: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Valid From</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={newRateForm.validFrom}
                        onChange={(e) => setNewRateForm({ ...newRateForm, validFrom: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Valid To</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={newRateForm.validTo}
                        onChange={(e) => setNewRateForm({ ...newRateForm, validTo: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Net Wholesale Rate (USD)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={newRateForm.unitPrice}
                      onChange={(e) => setNewRateForm({ ...newRateForm, unitPrice: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddRateModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary-teal">Save Offline Rate Sheet</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

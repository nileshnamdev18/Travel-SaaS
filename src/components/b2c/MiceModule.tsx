import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MICE_VENUES } from '../../data/mockData';
import { MiceRfqForm } from '../../types';
import { 
  Briefcase, 
  Users, 
  Sparkles, 
  Send, 
  Building, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Download,
  Share2
} from 'lucide-react';
import { PdfEngine } from '../../services/pdfGenerator';
import confetti from 'canvas-confetti';

export const MiceModule: React.FC = () => {
  const { formatPrice, openModal } = useApp();

  const [form, setForm] = useState<MiceRfqForm>({
    companyName: 'Apex Financial Technologies',
    contactName: 'Sarah Jenkins',
    contactEmail: 's.jenkins@apexfinancial.com',
    contactPhone: '+971 4 290 8811',
    paxCount: 380, // 350+ pax target from spec
    destination: 'Dubai, UAE',
    eventType: 'Conference & Summit',
    durationDays: 4,
    cateringTier: 'Premium Gourmet',
    requiresShuttleLogistics: true,
    requiresSimultaneousTranslation: true,
    specialRequests: 'Keynote auditorium with 4K LED staging and private VIP breakout suites.'
  });

  const [submitted, setSubmitted] = useState(false);

  // Corporate Event Copilot instant budget calculation (Spec 15.5 & NFR 9.1: non-blocking 350+ pax)
  const copilotCalculation = useMemo(() => {
    const pax = form.paxCount;
    const days = form.durationDays;

    // Catering cost per head per day
    let cateringRate = 65;
    if (form.cateringTier === 'Premium Gourmet') cateringRate = 110;
    if (form.cateringTier === 'Royal Banquet') cateringRate = 180;

    const totalCatering = pax * days * cateringRate;
    const hallRental = days * (pax > 300 ? 12000 : 7500);
    const avStaging = 8500 + (form.requiresSimultaneousTranslation ? 4500 : 0);
    const logisticsShuttle = form.requiresShuttleLogistics ? Math.ceil(pax / 45) * 450 * days : 0;
    const accommodationEstimate = pax * days * 180;

    const subtotal = totalCatering + hallRental + avStaging + logisticsShuttle + accommodationEstimate;
    const minEstimate = Math.round(subtotal * 0.935);
    const maxEstimate = Math.round(subtotal * 1.065);

    return {
      totalMin: minEstimate,
      totalMax: maxEstimate,
      perPaxMin: Math.round(minEstimate / pax),
      perPaxMax: Math.round(maxEstimate / pax),
      hallAreaRequired: Math.round(pax * 2.2), // sq meters
      coachesRequired: Math.ceil(pax / 45),
      confidenceBand: '± 6.5% Margin of Error (Subject to Hotel RFQ Approval)'
    };
  }, [form]);

  const handleSubmitRfq = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(20, 31, 54, 0.95) 0%, rgba(79, 70, 229, 0.8) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          border: '1px solid rgba(79, 70, 229, 0.4)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            <Briefcase size={14} /> M.I.C.E. CORPORATE EVENT COPILOT
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff' }}>
            Large-Scale Corporate Gatherings & RFQ Engine
          </h1>

          <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            Instant budget estimation, venue hall sizing, and ground logistics coordination for groups of 350+ corporate delegates.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* RFQ Intake Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: '#ffffff' }}>
            Corporate Intake Form & Scale Parameters
          </h3>

          <form onSubmit={handleSubmitRfq} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Company Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Contact Person</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Corporate Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone / WhatsApp</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Delegate Scale Slider (Spec 15.5: 350+ pax responsiveness) */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label className="form-label">Delegate Count (Scale Parameter)</label>
                <span style={{ fontWeight: 800, color: '#a5b4fc', fontSize: '1.1rem' }}>
                  {form.paxCount} Delegates
                </span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="10"
                value={form.paxCount} 
                onChange={(e) => setForm({ ...form, paxCount: parseInt(e.target.value) })}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>50 Pax (Boutique)</span>
                <span>350+ Pax (Summit Target)</span>
                <span>1,000+ Pax (Global Convention)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Event Category</label>
                <select 
                  className="form-select"
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value as any })}
                >
                  <option value="Conference & Summit">Conference & Summit</option>
                  <option value="Incentive Trip">Incentive Trip</option>
                  <option value="Annual Gala">Annual Gala</option>
                  <option value="Board Retreat">Board Retreat</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Catering Standard</label>
                <select 
                  className="form-select"
                  value={form.cateringTier}
                  onChange={(e) => setForm({ ...form, cateringTier: e.target.value as any })}
                >
                  <option value="Executive Standard">Executive Standard ($65/day)</option>
                  <option value="Premium Gourmet">Premium Gourmet ($110/day)</option>
                  <option value="Royal Banquet">Royal Banquet ($180/day)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={form.requiresShuttleLogistics}
                  onChange={(e) => setForm({ ...form, requiresShuttleLogistics: e.target.checked })}
                />
                Include Fleet Airport Shuttles
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={form.requiresSimultaneousTranslation}
                  onChange={(e) => setForm({ ...form, requiresSimultaneousTranslation: e.target.checked })}
                />
                Simultaneous AV Translation
              </label>
            </div>

            <button type="submit" className="btn btn-primary-teal btn-lg" style={{ marginTop: '1rem' }}>
              <Send size={18} /> Submit Corporate RFQ for Executive Approval
            </button>
          </form>
        </div>

        {/* Corporate Event Copilot Output (Spec 15.5) */}
        <div className="glass-card" style={{ borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Sparkles size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>AI Event Copilot Instant Estimation</h3>
          </div>

          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: 700 }}>
              Estimated Total Budget Band (Confidence {copilotCalculation.confidenceBand})
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '6px 0' }}>
              {formatPrice(copilotCalculation.totalMin)} – {formatPrice(copilotCalculation.totalMax)}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#c7d2fe' }}>
              Approx. {formatPrice(copilotCalculation.perPaxMin)} – {formatPrice(copilotCalculation.perPaxMax)} per delegate for {form.durationDays} Days.
            </div>
          </div>

          {/* Logistics Feasibility Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Auditorium / Plenary Area</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                {copilotCalculation.hallAreaRequired.toLocaleString()} m²
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Classroom & theater layout</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Dedicated VIP Coaches</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                {copilotCalculation.coachesRequired} Buses
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>50-seater luxury fleet</div>
            </div>
          </div>

          {/* Recommended Verified Venues */}
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Matching Verified Summit Venues:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {MICE_VENUES.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={16} color="#818cf8" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{v.name}</span>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                  Cap: {v.maxPax} Pax
                </span>
              </div>
            ))}
          </div>

          {submitted && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700 }}>
                <CheckCircle2 size={18} /> Corporate RFQ Dispatched to Operations Desk!
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                Assigned to M.I.C.E. Lead Coordinator (SLA window: 2 hours). Formal proposal PDF available below.
              </p>
              <button 
                className="btn btn-sm btn-primary-teal"
                style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                onClick={() => {
                  const manifestList = [
                    { name: 'Sarah Jenkins (Chief Org)', passport: 'GB982014', roomType: 'Executive Suite', busNo: 'Coach Alpha' },
                    { name: 'Michael Chang (Keynote)', passport: 'US892110', roomType: 'Deluxe King', busNo: 'Coach Alpha' },
                    { name: 'Delegate Roster (378 Pax)', passport: 'Manifest-Encrypted', roomType: 'Standard Twin Block', busNo: 'Fleet 1-8' }
                  ];
                  PdfEngine.generateGroupManifest(`${form.companyName} Summit`, manifestList);
                }}
              >
                <Download size={14} /> Download Corporate Manifest PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

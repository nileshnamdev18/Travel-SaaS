import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_PASSPORTS, SamplePassport } from '../../data/ocrSamples';
import { CountryVisaInfo, VisaOption, PassportOCRData, VisaApplicationRecord, DoorstepAddress } from '../../types';
import {
  FileText,
  Scan,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Share2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Camera,
  Check,
  RotateCcw,
  Search,
  MapPin,
  Zap,
  Star,
  Globe,
  Package,
  ChevronLeft,
  Home,
  Calendar,
  Phone,
  Mail,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';

type AppScreen = 'home' | 'country_detail' | 'ocr_form' | 'tracker';
type FilterCategory = 'all' | 'popular' | 'instant_evisa' | 'sticker' | 'on_arrival';

export const VisaModule: React.FC = () => {
  const {
    formatPrice,
    openModal,
    visaDestinations,
    visaApplications,
    createVisaApplication,
    adminVisaConfig,
    calculateGuaranteedDate
  } = useApp();

  // ── Screen navigation ──────────────────────────────────────────────────────
  const [screen, setScreen] = useState<AppScreen>('home');
  const [selectedCountry, setSelectedCountry] = useState<CountryVisaInfo | null>(null);
  const [selectedOption, setSelectedOption] = useState<VisaOption | null>(null);
  const [visaFlow, setVisaFlow] = useState<'evisa' | 'sticker'>('evisa');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ── OCR State ───────────────────────────────────────────────────────────────
  const [selectedSample, setSelectedSample] = useState<SamplePassport>(SAMPLE_PASSPORTS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [ocrResult, setOcrResult] = useState<PassportOCRData | null>(null);

  // ── Application form ────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    nationality: '',
    dob: '',
    expiryDate: '',
    gender: 'M' as 'M' | 'F',
    travelDate: new Date().toISOString().split('T')[0],
    email: '',
    phone: ''
  });

  // Sticker visa doorstep fields
  const [doorstepData, setDoorstepData] = useState<DoorstepAddress>({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    pincode: '',
    pickupSlot: 'morning'
  });

  // ── Tracker State ───────────────────────────────────────────────────────────
  const [currentApplication, setCurrentApplication] = useState<VisaApplicationRecord | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingLookupResult, setTrackingLookupResult] = useState<VisaApplicationRecord | null | 'not_found'>(null);

  // ── Filter & Search Logic ───────────────────────────────────────────────────
  const filteredCountries = visaDestinations.filter(c => {
    const matchesSearch = c.countryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCountryFlag = (countryId?: string) => {
    return visaDestinations.find(d => d.id === countryId)?.flag || '🛂';
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSelectCountry = (c: CountryVisaInfo) => {
    setSelectedCountry(c);
    setSelectedOption(c.options[0] || null);
    setVisaFlow('evisa');
    setOcrCompleted(false);
    setOcrResult(null);
    setFormData(f => ({ ...f, fullName: '', passportNumber: '', nationality: '', dob: '', expiryDate: '' }));
    setScreen('country_detail');
  };

  const handleStartOCR = (sample: SamplePassport) => {
    setSelectedSample(sample);
    setIsScanning(true);
    setOcrCompleted(false);
    setTimeout(() => {
      setIsScanning(false);
      setOcrCompleted(true);
      setOcrResult(sample.data);
      setFormData(f => ({
        ...f,
        fullName: sample.data.fullName,
        passportNumber: sample.data.passportNumber,
        nationality: sample.data.nationality,
        dob: sample.data.dob,
        expiryDate: sample.data.expiryDate,
        gender: sample.data.gender as 'M' | 'F'
      }));
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, 2000);
  };

  const handleSubmitApplication = () => {
    if (!selectedCountry || !selectedOption) return;
    const govFee = selectedOption.govFee;
    const platformFee = adminVisaConfig.globalPlatformFeeUSD;
    const courierFee = visaFlow === 'sticker' ? adminVisaConfig.doorstepCourierFeeUSD : 0;
    const guaranteedDate = calculateGuaranteedDate(selectedCountry.guaranteeSlaDays || 5);
    const appData: Partial<VisaApplicationRecord> = {
      applicantName: formData.fullName || 'Demo Traveler',
      applicantEmail: formData.email || 'traveler@demo.com',
      applicantPhone: formData.phone || '+91 98765 43210',
      countryId: selectedCountry.id,
      country: selectedCountry.countryName,
      visaType: selectedOption.title,
      flowType: visaFlow,
      passportNumber: formData.passportNumber || 'K18492048',
      submissionDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      govFeeUSD: govFee,
      platformFeeUSD: platformFee,
      totalAmountUSD: govFee + platformFee + courierFee,
      guaranteedDeliveryDate: guaranteedDate,
      status: 'ocr_verified',
      doorstepAddress: visaFlow === 'sticker' ? doorstepData : undefined
    };
    const created = createVisaApplication(appData);
    setCurrentApplication(created);

    // Simulate status progression
    setTimeout(() => {
      setCurrentApplication(prev => prev ? { ...prev, status: 'embassy_processing' } : prev);
    }, 1800);
    setTimeout(() => {
      setCurrentApplication(prev => {
        const updated = prev ? { ...prev, status: 'approved' as const } : prev;
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        return updated;
      });
    }, 4000);

    setScreen('tracker');
  };

  const handleDownloadVisaSlip = () => {
    if (!currentApplication) return;
    const doc = new jsPDF();
    doc.setFillColor(26, 9, 109);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL ELECTRONIC VISA (e-VISA) APPROVAL', 14, 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ref: ${currentApplication.trackingId} | Powered by Atlys (atlys.com/en-IN)`, 14, 27);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text('VISA HOLDER DETAILS', 14, 48);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Full Name: ${currentApplication.applicantName}`, 14, 56);
    doc.text(`Passport Number: ${currentApplication.passportNumber}`, 14, 63);
    doc.text(`Destination: ${currentApplication.country}`, 14, 70);
    doc.text(`Visa Type: ${currentApplication.visaType}`, 110, 56);
    doc.text(`Guaranteed By: ${currentApplication.guaranteedDeliveryDate || 'N/A'}`, 110, 63);
    doc.text(`Total Paid: USD ${currentApplication.totalAmountUSD || 0}`, 110, 70);
    doc.text(`Status: APPROVED & ISSUED`, 110, 77);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 85, 196, 85);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('This visa is electronically authenticated. Carry this PDF during international travel.', 14, 94);
    doc.text('Powered by Atlys | atlys.com/en-IN | Official TravelPulse Visa Partner', 14, 101);
    doc.save(`eVisa_${currentApplication.trackingId}.pdf`);
  };

  const handleTrackLookup = () => {
    const found = visaApplications.find(a =>
      a.trackingId.toLowerCase() === trackingInput.toLowerCase()
    );
    setTrackingLookupResult(found || 'not_found');
  };

  // ── Category badge colors ───────────────────────────────────────────────────
  const categoryBadge = (cat: string) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      instant_evisa: { label: '⚡ Instant e-Visa', color: '#059669', bg: 'rgba(5,150,105,0.12)' },
      popular: { label: '🔥 Popular', color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
      sticker: { label: '📮 Sticker Visa', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
      on_arrival: { label: '🛬 On Arrival', color: '#0284c7', bg: 'rgba(2,132,199,0.12)' }
    };
    const b = map[cat] || { label: cat, color: '#64748b', bg: 'rgba(100,116,139,0.12)' };
    return (
      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: b.color, background: b.bg, padding: '2px 8px', borderRadius: 20 }}>
        {b.label}
      </span>
    );
  };

  const statusStep = (app: VisaApplicationRecord) => {
    const steps = [
      { key: 'docs_uploaded', label: 'Application Registered', desc: 'Passport biodata & OCR verified' },
      { key: 'ocr_verified', label: 'Documents Verified', desc: visaFlow === 'sticker' ? 'Doorstep courier scheduled' : 'AI document review passed' },
      { key: 'embassy_processing', label: 'Gov / Embassy Processing', desc: 'Submitted to immigration authority' },
      { key: 'approved', label: visaFlow === 'sticker' ? 'Stamped & Dispatched' : 'e-Visa Issued', desc: visaFlow === 'sticker' ? 'Insured doorstep return delivery' : 'PDF e-Visa ready for download' }
    ];
    const order = ['draft', 'docs_uploaded', 'ocr_verified', 'embassy_processing', 'approved'];
    const currentIdx = order.indexOf(app.status);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {steps.map((s, i) => {
          const stepOrderIdx = order.indexOf(s.key);
          const done = currentIdx >= stepOrderIdx && stepOrderIdx !== -1;
          const active = currentIdx === stepOrderIdx;
          return (
            <div key={s.key} style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${done ? 'rgba(16,185,129,0.4)' : active ? 'rgba(59,130,246,0.5)' : 'var(--border-dark)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: done ? '#34d399' : active ? '#60a5fa' : 'var(--text-dim)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                {done ? <CheckCircle2 size={16} /> : active ? <Clock size={16} /> : <ShieldCheck size={16} />}
                {i + 1}. {s.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.desc}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN: HOME — Destination Discovery
  // ═══════════════════════════════════════════════════════════════════════════
  if (screen === 'home') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #7c3aed 100%)',
        borderRadius: 'var(--radius-xl)', padding: '2.5rem',
        border: '1px solid rgba(124,58,237,0.4)',
        boxShadow: '0 8px 30px rgba(124,58,237,0.25)'
      }}>
        <div style={{ maxWidth: 820 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            <Sparkles size={14} /> OFFICIAL ATLYS PARTNER (atlys.com/en-IN) · 99.4% APPROVAL RATE · ON-TIME GUARANTEE
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff', letterSpacing: '-0.02em' }}>
            Get Visas On Time to 120+ Destinations
          </h1>
          <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Instant e-Visa PDF delivery + Embassy Sticker Visa with doorstep passport pickup. Powered by Atlys — India's #1 visa platform.
            {adminVisaConfig.onTimeGuaranteeActive && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '2px 10px', borderRadius: 20, fontWeight: 700, marginLeft: 10, fontSize: '0.85rem' }}>
                <ShieldCheck size={12} /> On-Time Delivery Guaranteed
              </span>
            )}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { icon: '⚡', label: 'Instant e-Visa', sub: 'PDF in hours' },
              { icon: '📮', label: 'Sticker Visa', sub: 'Doorstep pickup' },
              { icon: '🔍', label: 'Passport OCR', sub: '2-sec MRZ scan' },
              { icon: '🛡️', label: 'Atlys Assure', sub: 'Refund on delay' }
            ].map(f => (
              <div key={f.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1.25rem', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: '1.2rem' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{f.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#c4b5fd' }}>{f.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 32 }}
              placeholder="Search destination (e.g. Dubai, UK, Thailand…)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['all', 'popular', 'instant_evisa', 'sticker', 'on_arrival'] as FilterCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '0.45rem 1rem', borderRadius: 20, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  border: `2px solid ${filterCategory === cat ? '#7c3aed' : 'var(--border-color)'}`,
                  background: filterCategory === cat ? 'rgba(124,58,237,0.1)' : 'transparent',
                  color: filterCategory === cat ? '#7c3aed' : 'var(--text-muted)'
                }}
              >
                {cat === 'all' ? 'All' : cat === 'instant_evisa' ? '⚡ Instant e-Visa' : cat === 'popular' ? '🔥 Popular' : cat === 'sticker' ? '📮 Sticker Visa' : '🛬 On Arrival'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Track Existing Application */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={16} style={{ color: '#7c3aed' }} /> Track Existing Application
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, minWidth: 200 }}
            placeholder="Enter Tracking ID (e.g. ATLYS-IN-482910)"
            value={trackingInput}
            onChange={e => setTrackingInput(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleTrackLookup}>Track →</button>
        </div>
        {trackingLookupResult === 'not_found' && (
          <div style={{ marginTop: '0.75rem', color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={14} /> No application found with that tracking ID.
          </div>
        )}
        {trackingLookupResult && trackingLookupResult !== 'not_found' && (
          <div style={{ marginTop: '0.75rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: '#059669' }}>✅ Found: {trackingLookupResult.trackingId}</div>
            <div style={{ marginTop: 4, color: 'var(--text-main)' }}>
              {getCountryFlag(trackingLookupResult.countryId)} {trackingLookupResult.country} · {trackingLookupResult.visaType} · Status: <strong>{trackingLookupResult.status}</strong>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 4 }}>
              Applicant: {trackingLookupResult.applicantName} · Guaranteed by: {trackingLookupResult.guaranteedDeliveryDate || 'Standard Processing'}
            </div>
          </div>
        )}
      </div>

      {/* Destination Grid */}
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe size={20} style={{ color: '#7c3aed' }} />
          <span>Select Travel Destination</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>({filteredCountries.length} Available)</span>
        </h3>

        {filteredCountries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '1rem' }}>
            No destinations found for "{searchQuery}"
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {filteredCountries.map(c => {
              const basePrice = c.options[0] ? (c.options[0].govFee + adminVisaConfig.globalPlatformFeeUSD) : 0;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectCountry(c)}
                  className="card"
                  style={{
                    cursor: 'pointer', padding: '1.25rem',
                    transition: 'var(--transition)',
                    borderLeft: `4px solid #7c3aed`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                    <div style={{ fontSize: '2.2rem', lineHeight: 1 }}>{c.flag}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-heading)' }}>{c.countryName}</div>
                      {c.tagline && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.tagline}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                    <div>
                      {categoryBadge(c.category || 'popular')}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#7c3aed', fontSize: '1rem' }}>{formatPrice(basePrice)}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>onwards</div>
                    </div>
                  </div>
                  {c.fastestTurnaround && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                      <Zap size={11} /> {c.fastestTurnaround}
                    </div>
                  )}
                  {adminVisaConfig.onTimeGuaranteeActive && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>
                      <ShieldCheck size={11} /> On-Time Guarantee
                    </div>
                  )}
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
                    View & Apply <ArrowRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN: COUNTRY DETAIL
  // ═══════════════════════════════════════════════════════════════════════════
  if (screen === 'country_detail' && selectedCountry) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setScreen('home')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ChevronLeft size={14} /> Back to All Destinations
        </button>
        <span>/ {selectedCountry.flag} {selectedCountry.countryName}</span>
      </div>

      {/* Country Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #7c3aed 100%)',
        borderRadius: 'var(--radius-xl)', padding: '2rem',
        border: '1px solid rgba(124,58,237,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: '4rem', lineHeight: 1 }}>{selectedCountry.flag}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800 }}>{selectedCountry.countryName} Visa</h2>
              {categoryBadge(selectedCountry.category || 'popular')}
            </div>
            {selectedCountry.tagline && <p style={{ color: '#c4b5fd', fontSize: '0.95rem', marginBottom: 10 }}>{selectedCountry.tagline}</p>}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.85rem' }}>
              {selectedCountry.fastestTurnaround && (
                <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={12} /> {selectedCountry.fastestTurnaround}</span>
              )}
              {selectedCountry.guaranteeSlaDays && (
                <span style={{ color: '#93c5fd', display: 'flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={12} /> SLA: {selectedCountry.guaranteeSlaDays} business days</span>
              )}
              {selectedCountry.rejectionRefundPolicy && (
                <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} /> {selectedCountry.rejectionRefundPolicy}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Flow Toggle */}
      {selectedCountry.supportsStickerVisa && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-heading)' }}>Choose Visa Delivery Method</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { key: 'evisa', label: '🌐 Instant e-Visa (100% Online PDF)' },
              { key: 'sticker', label: '📮 Embassy Sticker Visa (Doorstep Pickup)' }
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setVisaFlow(opt.key as 'evisa' | 'sticker')}
                style={{
                  padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                  border: `2px solid ${visaFlow === opt.key ? '#7c3aed' : 'var(--border-color)'}`,
                  background: visaFlow === opt.key ? 'rgba(124,58,237,0.1)' : 'transparent',
                  color: visaFlow === opt.key ? '#7c3aed' : 'var(--text-main)'
                }}
              >{opt.label}</button>
            ))}
          </div>
          {visaFlow === 'sticker' && (
            <div style={{ marginTop: '1rem', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ fontWeight: 800, color: '#d97706', fontSize: '0.9rem', marginBottom: 6 }}>Atlys Doorstep Sticker Visa Concierge:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div>📦 <strong>1.</strong> Doorstep passport pickup from home/office</div>
                <div>🏛️ <strong>2.</strong> Embassy/VFS appointment & submission</div>
                <div>⚡ <strong>3.</strong> Sticker visa affixed by consulate</div>
                <div>🏠 <strong>4.</strong> Insured tracked return delivery</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visa Type + Requirements Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Visa Options */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#7c3aed', fontWeight: 700 }}>
            Visa Options for {selectedCountry.countryName}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {selectedCountry.options.map(opt => {
              const isSelected = selectedOption?.id === opt.id;
              const total = opt.govFee + adminVisaConfig.globalPlatformFeeUSD;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt)}
                  style={{
                    padding: '1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition)',
                    border: `1px solid ${isSelected ? '#7c3aed' : 'var(--border-color)'}`,
                    background: isSelected ? 'rgba(124,58,237,0.08)' : 'var(--bg-card-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-heading)' }}>{opt.title}</span>
                    <span style={{ fontWeight: 800, color: '#7c3aed', fontSize: '1.1rem' }}>{formatPrice(total)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>Validity: <strong>{opt.validityDays}d</strong></span>
                    <span>Stay: <strong>{opt.maxStayDays}d</strong></span>
                    <span>Entry: <strong>{opt.entryType}</strong></span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: '0.72rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {opt.processingTimeStandard}
                  </div>
                  <div style={{ marginTop: 4, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Gov Fee: {formatPrice(opt.govFee)} + Platform: {formatPrice(adminVisaConfig.globalPlatformFeeUSD)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Document Checklist */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#7c3aed', fontWeight: 700 }}>
            Document Checklist & Requirements
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {selectedCountry.requirements.map(req => (
              <div key={req.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ color: 'var(--text-heading)' }}>{req.title}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {req.description} · Format: {req.acceptedFormats}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-card-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-heading)' }}>ICAO Biometric Photo:</strong> Plain white background, 70-80% face coverage, no headgear (unless religious), neutral expression.
          </div>
          {selectedCountry.vfsCenters && selectedCountry.vfsCenters.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-heading)', marginBottom: 6 }}>VFS Centres in India:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedCountry.vfsCenters.map(city => (
                  <span key={city} style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{city}</span>
                ))}
              </div>
            </div>
          )}
          {adminVisaConfig.onTimeGuaranteeActive && selectedCountry.guaranteeSlaDays && (
            <div style={{ marginTop: '1rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 700, color: '#059669', marginBottom: 2 }}>🛡️ On-Time Guarantee Active</div>
              <div style={{ color: 'var(--text-muted)' }}>
                Guaranteed delivery by {calculateGuaranteedDate(selectedCountry.guaranteeSlaDays)}. 
                {selectedCountry.rejectionRefundPolicy && ` ${selectedCountry.rejectionRefundPolicy}`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticker Visa Doorstep Form */}
      {visaFlow === 'sticker' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#d97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Truck size={18} /> Doorstep Pickup Address Details
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {[
              { label: 'Contact Full Name', key: 'fullName', placeholder: 'Full name for pickup' },
              { label: 'Phone Number', key: 'phone', placeholder: '+91 XXXXX XXXXX' },
              { label: 'Address Line', key: 'addressLine', placeholder: 'Flat / Building / Street' },
              { label: 'City', key: 'city', placeholder: 'Mumbai / Delhi / Bangalore' },
              { label: 'Pin Code', key: 'pincode', placeholder: '400001' }
            ].map(field => (
              <div key={field.key} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{field.label}</label>
                <input
                  type="text"
                  className="form-input"
                  value={doorstepData[field.key as keyof DoorstepAddress]}
                  onChange={e => setDoorstepData({ ...doorstepData, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pickup Slot</label>
              <select
                className="form-select"
                value={doorstepData.pickupSlot}
                onChange={e => setDoorstepData({ ...doorstepData, pickupSlot: e.target.value })}
              >
                <option value="morning">Morning (9 AM – 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM – 4 PM)</option>
                <option value="evening">Evening (4 PM – 7 PM)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={() => setScreen('home')}>
          ← All Destinations
        </button>
        <button
          className="btn btn-primary"
          style={{ background: '#7c3aed', borderColor: '#7c3aed', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => setScreen('ocr_form')}
          disabled={!selectedOption}
        >
          Proceed to Passport Scan <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN: PASSPORT OCR + APPLICATION FORM
  // ═══════════════════════════════════════════════════════════════════════════
  if (screen === 'ocr_form' && selectedCountry && selectedOption) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setScreen('country_detail')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ChevronLeft size={14} /> Back to {selectedCountry.countryName}
        </button>
        <span>/ Passport OCR & Application</span>
      </div>

      {/* Summary card */}
      <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ fontSize: '2.5rem' }}>{selectedCountry.flag}</div>
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-heading)', fontSize: '1.05rem' }}>{selectedCountry.countryName} — {selectedOption.title}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {visaFlow === 'sticker' ? '📮 Sticker Visa (Doorstep)' : '🌐 Instant e-Visa'} · 
            Total: <strong style={{ color: '#7c3aed' }}>{formatPrice(selectedOption.govFee + adminVisaConfig.globalPlatformFeeUSD + (visaFlow === 'sticker' ? adminVisaConfig.doorstepCourierFeeUSD : 0))}</strong>
          </div>
        </div>
        {adminVisaConfig.onTimeGuaranteeActive && selectedCountry.guaranteeSlaDays && (
          <div style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 700, color: '#059669' }}>🛡️ Guaranteed by</div>
            <div style={{ color: 'var(--text-heading)', fontWeight: 800 }}>{calculateGuaranteedDate(selectedCountry.guaranteeSlaDays)}</div>
          </div>
        )}
      </div>

      {/* OCR Scanner */}
      <div className="card" style={{ padding: '1.5rem', border: '1px solid rgba(124,58,237,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Scan size={22} color="#7c3aed" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI Passport OCR Auto-Fill (~2s)</h3>
              <span style={{ fontSize: '0.7rem', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>MRZ SCANNER</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Select a demo passport — fields auto-populate in 2 seconds. <span style={{ color: '#7c3aed', fontWeight: 600 }}>🔒 Document Vault — stored for future applications</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SAMPLE_PASSPORTS.map(s => (
              <button
                key={s.id}
                className={`btn btn-sm ${selectedSample.id === s.id ? 'btn-primary' : 'btn-secondary'}`}
                style={selectedSample.id === s.id ? { background: '#7c3aed', borderColor: '#7c3aed' } : {}}
                onClick={() => handleStartOCR(s)}
                disabled={isScanning}
              >
                {s.label.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Scanner Viewport */}
          <div className="ocr-scanner-container" style={{ minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            {isScanning && <div className="ocr-laser-line" />}
            <div className="scanner-overlay-grid" />
            <div style={{ zIndex: 5, textAlign: 'center', padding: '1rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: isScanning ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: isScanning ? '#7c3aed' : 'var(--text-muted)' }}>
                <Scan size={28} />
              </div>
              {isScanning ? (
                <div>
                  <div style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1rem', marginBottom: 4 }}>Scanning ICAO MRZ...</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Normalizing · Validating checksums · ~2s</div>
                </div>
              ) : ocrCompleted ? (
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
                    <CheckCircle2 size={18} /> Biometric Data Extracted!
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Confidence: <strong style={{ color: '#7c3aed' }}>{ocrResult?.confidenceScore}%</strong> (ICAO Doc 9303)
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-heading)', marginBottom: 8 }}>Ready: {selectedSample.label}</div>
                  <button className="btn btn-sm btn-primary" style={{ background: '#7c3aed', borderColor: '#7c3aed' }} onClick={() => handleStartOCR(selectedSample)}>
                    Run 2-Second AI Scan
                  </button>
                </div>
              )}
            </div>
            {ocrResult && (
              <div style={{ width: '100%', background: 'rgba(0,0,0,0.7)', borderTop: '1px solid var(--border-dark)', padding: '0.5rem 1rem', fontFamily: 'monospace', fontSize: '0.72rem', color: '#a78bfa', letterSpacing: '0.08em' }}>
                <div>{ocrResult.mrzLine1}</div>
                <div>{ocrResult.mrzLine2}</div>
              </div>
            )}
          </div>

          {/* Auto-filled Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name (Auto-Filled)</label>
                <input type="text" className="form-input" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="AHMED AL-MANSOOR" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Passport No.</label>
                <input type="text" className="form-input" value={formData.passportNumber} onChange={e => setFormData({ ...formData, passportNumber: e.target.value })} placeholder="K18492048" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nationality</label>
                <input type="text" className="form-input" value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })} placeholder="INDIAN" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-input" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Passport Expiry</label>
                <input type="date" className="form-input" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Gender</label>
                <select className="form-select" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })}>
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="traveler@email.com" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone</label>
                <input type="tel" className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Travel Date</label>
              <input type="date" className="form-input" value={formData.travelDate} onChange={e => setFormData({ ...formData, travelDate: e.target.value })} />
            </div>

            {/* Pricing Summary */}
            <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>Government Fee</span>
                <span style={{ fontWeight: 700 }}>{formatPrice(selectedOption.govFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>Atlys Platform Fee</span>
                <span style={{ fontWeight: 700 }}>{formatPrice(adminVisaConfig.globalPlatformFeeUSD)}</span>
              </div>
              {visaFlow === 'sticker' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Doorstep Courier Fee</span>
                  <span style={{ fontWeight: 700 }}>{formatPrice(adminVisaConfig.doorstepCourierFeeUSD)}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 6, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-heading)' }}>Total</span>
                <span style={{ fontWeight: 800, color: '#7c3aed', fontSize: '1.1rem' }}>
                  {formatPrice(selectedOption.govFee + adminVisaConfig.globalPlatformFeeUSD + (visaFlow === 'sticker' ? adminVisaConfig.doorstepCourierFeeUSD : 0))}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, background: '#7c3aed', borderColor: '#7c3aed' }}
                onClick={handleSubmitApplication}
                disabled={isScanning || !formData.passportNumber}
              >
                {visaFlow === 'sticker' ? '📮 Submit & Schedule Pickup' : '🌐 Submit e-Visa Application'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => { setFormData({ fullName: '', passportNumber: '', nationality: '', dob: '', expiryDate: '', gender: 'M', travelDate: new Date().toISOString().split('T')[0], email: '', phone: '' }); setOcrCompleted(false); setOcrResult(null); }}
                title="Reset Form"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN: LIVE APPLICATION TRACKER
  // ═══════════════════════════════════════════════════════════════════════════
  if (screen === 'tracker' && currentApplication) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setScreen('home')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Home size={14} /> Back to Home
        </button>
      </div>

      {/* Celebration banner if approved */}
      {currentApplication.status === 'approved' && (
        <div style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid rgba(16,185,129,0.4)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>
          <h2 style={{ color: '#34d399', fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>
            {currentApplication.flowType === 'sticker' ? 'Sticker Visa Ready for Dispatch!' : 'e-Visa Approved & Issued!'}
          </h2>
          <p style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>
            {currentApplication.flowType === 'sticker'
              ? 'Your stamped passport will be delivered to your doorstep shortly.'
              : 'Your official e-Visa PDF is ready. Download and carry it during travel.'}
          </p>
        </div>
      )}

      {/* Tracking Card */}
      <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #7c3aed' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 700 }}>LIVE APPLICATION TRACKER</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 4 }}>
              Tracking ID: <span style={{ color: '#7c3aed' }}>{currentApplication.trackingId}</span>
            </h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {getCountryFlag(currentApplication.countryId)} {currentApplication.country} · {currentApplication.visaType} ·
              {currentApplication.flowType === 'sticker' ? ' 📮 Sticker Visa' : ' 🌐 e-Visa'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {currentApplication.status === 'approved' && (
              <>
                <button className="btn btn-sm btn-primary" style={{ background: '#7c3aed', borderColor: '#7c3aed', display: 'flex', alignItems: 'center', gap: 6 }} onClick={handleDownloadVisaSlip}>
                  <Download size={14} /> Download e-Visa PDF
                </button>
                <button className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => openModal('package_delivery', { quoteNumber: currentApplication.trackingId, clientName: currentApplication.applicantName })}>
                  <Share2 size={14} /> WhatsApp Alert
                </button>
              </>
            )}
          </div>
        </div>

        {/* 4-Stage Timeline */}
        {statusStep(currentApplication)}

        {/* Application Details */}
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Applicant', value: currentApplication.applicantName },
            { label: 'Passport No.', value: currentApplication.passportNumber },
            { label: 'Gov Fee', value: formatPrice(currentApplication.govFeeUSD || 0) },
            { label: 'Platform Fee', value: formatPrice(currentApplication.platformFeeUSD || 0) },
            { label: 'Total Paid', value: formatPrice(currentApplication.totalAmountUSD || 0) },
            { label: 'Guaranteed Delivery', value: currentApplication.guaranteedDeliveryDate || 'N/A' },
            { label: 'Submitted', value: currentApplication.submissionDate || 'Recently' }
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.9rem' }}>{item.value || '—'}</div>
            </div>
          ))}
        </div>

        {/* Sticker visa doorstep info */}
        {currentApplication.flowType === 'sticker' && currentApplication.doorstepAddress && (
          <div style={{ marginTop: '1.5rem', background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#d97706', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Truck size={16} /> Doorstep Pickup Address
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.7 }}>
              {currentApplication.doorstepAddress.fullName} · {currentApplication.doorstepAddress.phone}<br />
              {currentApplication.doorstepAddress.addressLine}, {currentApplication.doorstepAddress.city} — {currentApplication.doorstepAddress.pincode}<br />
              Slot: <strong>{currentApplication.doorstepAddress.pickupSlot}</strong>
            </div>
          </div>
        )}

        {/* Support */}
        <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <ShieldCheck size={14} style={{ color: '#7c3aed' }} />
          Need help? Call Atlys Support: <strong style={{ color: 'var(--text-heading)' }}>{adminVisaConfig.supportHelpline}</strong>
          or WhatsApp: <strong style={{ color: '#059669' }}>{adminVisaConfig.whatsappSupportNumber}</strong>
        </div>
      </div>
    </div>
  );

  // Fallback
  return <div onClick={() => setScreen('home')} style={{ cursor: 'pointer', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading… click to go home.</div>;
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_VISA_COUNTRIES } from '../../data/mockData';
import { SAMPLE_PASSPORTS, SamplePassport } from '../../data/ocrSamples';
import { CountryVisaInfo, VisaOption, PassportOCRData, VisaApplicationStatus } from '../../types';
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
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';

export const VisaModule: React.FC = () => {
  const { formatPrice, openModal } = useApp();

  const [countries] = useState<CountryVisaInfo[]>(INITIAL_VISA_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<CountryVisaInfo>(countries[0]);
  const [selectedOption, setSelectedOption] = useState<VisaOption>(countries[0].options[0]);
  
  // OCR Scanner State (~2s target from spec 15.4)
  const [selectedSample, setSelectedSample] = useState<SamplePassport>(SAMPLE_PASSPORTS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [ocrResult, setOcrResult] = useState<PassportOCRData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    nationality: '',
    dob: '',
    expiryDate: '',
    gender: 'M',
    travelDate: '2026-11-15'
  });

  // Photo ICAO validation state
  const [photoValidated, setPhotoValidated] = useState(true);

  // Live Application Tracker State (visa2fly.com feature)
  const [applicationStatus, setApplicationStatus] = useState<VisaApplicationStatus>('draft');
  const [trackingId, setTrackingId] = useState<string>('');

  const handleStartOCR = (sample: SamplePassport) => {
    setSelectedSample(sample);
    setIsScanning(true);
    setOcrCompleted(false);

    // 2-second high-precision simulated OCR scan
    setTimeout(() => {
      setIsScanning(false);
      setOcrCompleted(true);
      setOcrResult(sample.data);
      setFormData({
        fullName: sample.data.fullName,
        passportNumber: sample.data.passportNumber,
        nationality: sample.data.nationality,
        dob: sample.data.dob,
        expiryDate: sample.data.expiryDate,
        gender: sample.data.gender,
        travelDate: '2026-11-15'
      });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, 2000);
  };

  const handleSubmitApplication = () => {
    const newTrackingId = `V2F-${Math.floor(100000 + Math.random() * 900000)}`;
    setTrackingId(newTrackingId);
    setApplicationStatus('ocr_verified');

    // Simulate real-time pipeline progression to embassy processing and approval
    setTimeout(() => {
      setApplicationStatus('embassy_processing');
    }, 1500);

    setTimeout(() => {
      setApplicationStatus('approved');
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    }, 3500);
  };

  const handleDownloadVisaSlip = () => {
    const doc = new jsPDF();
    doc.setFillColor(26, 9, 109);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`OFFICIAL ELECTRONIC VISA (e-VISA) APPROVAL`, 14, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Application Reference: ${trackingId || 'V2F-982104'} | Authority: ${selectedCountry.countryName} MOFA`, 14, 27);

    // Traveler details
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text('VISA HOLDER DETAILS', 14, 48);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Full Name: ${formData.fullName || 'AHMED ABDULLAH AL-MANSOOR'}`, 14, 56);
    doc.text(`Passport Number: ${formData.passportNumber || 'K18492048'}`, 14, 63);
    doc.text(`Nationality: ${formData.nationality || 'SAUDI ARABIA'}`, 14, 70);
    doc.text(`Date of Birth: ${formData.dob || '1988-04-14'}`, 14, 77);

    doc.text(`Visa Type: ${selectedOption.title}`, 110, 56);
    doc.text(`Validity: ${selectedOption.validityDays} Days`, 110, 63);
    doc.text(`Max Stay: ${selectedOption.maxStayDays} Days (${selectedOption.entryType} Entry)`, 110, 70);
    doc.text(`Status: OFFICIALLY ISSUED & VALIDATED`, 110, 77);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 85, 196, 85);

    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('This document is electronically authenticated by border control biometric scanners.', 14, 94);
    doc.text('Carry a printed copy or digital PDF on your mobile device during international boarding.', 14, 100);

    doc.save(`Official_eVisa_${formData.passportNumber || 'K18492048'}.pdf`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(26, 9, 109, 0.95) 0%, rgba(42, 157, 143, 0.8) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          border: '1px solid rgba(42, 157, 143, 0.4)',
          boxShadow: 'var(--shadow-teal)'
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            <Sparkles size={14} /> BENCHMARKED FROM VISA2FLY.COM
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Global AI Visa Desk & Instant OCR Extraction
          </h1>

          <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: 1.6 }}>
            Instant visa eligibility, 2-second AI Passport MRZ auto-fill, ICAO biometric photo validation, and real-time embassy progression tracking.
          </p>
        </div>
      </div>

      {/* Country Selector Grid */}
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>1. Select Travel Destination</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({countries.length} Available Countries)</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {countries.map((c) => {
            const isSelected = selectedCountry.id === c.id;
            return (
              <div 
                key={c.id}
                onClick={() => {
                  setSelectedCountry(c);
                  setSelectedOption(c.options[0]);
                }}
                className={`glass-card ${isSelected ? 'glass-card-teal' : ''}`}
                style={{
                  cursor: 'pointer',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderColor: isSelected ? 'var(--visa-teal)' : undefined
                }}
              >
                <div style={{ fontSize: '2rem' }}>{c.flag}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{c.countryName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    From {formatPrice(c.options[0].govFee + c.options[0].platformFee)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visa Options & Instant Eligibility Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Visa Type Selector */}
        <div className="glass-card">
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--visa-teal)' }}>
            Available Visa Categories for {selectedCountry.countryName}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {selectedCountry.options.map((opt) => {
              const isSelected = selectedOption.id === opt.id;
              const totalCost = opt.govFee + opt.platformFee;

              return (
                <div 
                  key={opt.id}
                  onClick={() => setSelectedOption(opt)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--visa-teal)' : 'var(--border-dark)'}`,
                    background: isSelected ? 'rgba(42, 157, 143, 0.12)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{opt.title}</span>
                    <span style={{ fontWeight: 800, color: 'var(--visa-teal)', fontSize: '1.1rem' }}>
                      {formatPrice(totalCost)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>Validity: <strong>{opt.validityDays} Days</strong></span>
                    <span>•</span>
                    <span>Stay: <strong>{opt.maxStayDays} Days</strong></span>
                    <span>•</span>
                    <span>Entry: <strong>{opt.entryType}</strong></span>
                  </div>

                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Standard Processing: {opt.processingTimeStandard}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Required Documents Checklist (visa2fly benchmark) */}
        <div className="glass-card">
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--visa-teal)' }}>
            Document Checklist & Eligibility Rules
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {selectedCountry.requirements.map((req) => (
              <div key={req.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} color="var(--visa-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#ffffff' }}>{req.title}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {req.description} • Format: {req.acceptedFormats}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: '#ffffff' }}>ICAO Biometric Photo Standard:</strong> Plain white background, 70-80% face coverage, no headgear unless religious, neutral expression.
          </div>
        </div>
      </div>

      {/* 2-Second AI Passport OCR Auto-Fill Section (Spec 15.4) */}
      <div className="glass-card" style={{ border: '1px solid rgba(42, 157, 143, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scan size={22} color="var(--visa-teal)" />
              <h3 style={{ fontSize: '1.25rem' }}>AI Passport OCR Auto-Fill Scanner (~2s Target)</h3>
              <span className="badge badge-teal">SPEC 15.4 COMPLIANT</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Select a demo passport scan or upload to extract biometric MRZ fields into the visa application instantly.
            </p>
          </div>

          {/* Sample Passports Quick Selector */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {SAMPLE_PASSPORTS.map((s) => (
              <button 
                key={s.id}
                className={`btn btn-sm ${selectedSample.id === s.id ? 'btn-primary-teal' : 'btn-secondary'}`}
                onClick={() => handleStartOCR(s)}
                disabled={isScanning}
              >
                {s.label.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Scanner Viewport with Laser Beam Animation */}
          <div className="ocr-scanner-container" style={{ minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            {isScanning && <div className="ocr-laser-line" />}
            <div className="scanner-overlay-grid" />

            <div style={{ zIndex: 5, textAlign: 'center', padding: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: isScanning ? 'rgba(42, 157, 143, 0.25)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: isScanning ? 'var(--visa-teal)' : 'var(--text-muted)' }}>
                <Scan size={28} />
              </div>

              {isScanning ? (
                <div>
                  <div style={{ fontWeight: 700, color: '#5eead4', fontSize: '1.05rem', marginBottom: '4px' }}>
                    Scanning ICAO Machine-Readable Zone (MRZ)...
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Normalizing perspective • Validating checksums • OCR Target ~2s
                  </div>
                </div>
              ) : ocrCompleted ? (
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>
                    <CheckCircle2 size={18} /> Biometric Data Successfully Extracted!
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Confidence Score: <strong style={{ color: '#5eead4' }}>{ocrResult?.confidenceScore}%</strong> (ICAO Doc 9303 Compliant)
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                    Ready to Scan: {selectedSample.label}
                  </div>
                  <button 
                    className="btn btn-primary-teal btn-sm"
                    onClick={() => handleStartOCR(selectedSample)}
                  >
                    Run 2-Second AI Scan
                  </button>
                </div>
              )}
            </div>

            {/* Extracted MRZ Preview */}
            {ocrResult && (
              <div style={{ width: '100%', background: 'rgba(0,0,0,0.7)', borderTop: '1px solid var(--border-dark)', padding: '0.5rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#5eead4', letterSpacing: '0.1em' }}>
                <div>{ocrResult.mrzLine1}</div>
                <div>{ocrResult.mrzLine2}</div>
              </div>
            )}
          </div>

          {/* Form Auto-Populated by OCR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name (Auto-Filled)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. AHMED AL-MANSOOR" 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Passport No.</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.passportNumber} 
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                  placeholder="K18492048" 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nationality</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.nationality} 
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="SAUDI ARABIA" 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date of Birth</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.dob} 
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Passport Expiry Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.expiryDate} 
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Gender</label>
                <select 
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })}
                >
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                className="btn btn-primary-teal" 
                style={{ flex: 1 }}
                onClick={handleSubmitApplication}
                disabled={isScanning || !formData.passportNumber}
              >
                Submit e-Visa Application
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setFormData({ fullName: '', passportNumber: '', nationality: '', dob: '', expiryDate: '', gender: 'M', travelDate: '2026-11-15' });
                  setOcrCompleted(false);
                  setOcrResult(null);
                }}
                title="Reset Form"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Real-Time Application Tracker (Benchmarked from Visa2Fly) */}
      {applicationStatus !== 'draft' && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--visa-teal)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--visa-teal)', fontWeight: 700 }}>
                LIVE EMBASSY PROCESSING PIPELINE
              </div>
              <h3 style={{ fontSize: '1.3rem' }}>
                Application Tracking ID: <span style={{ color: '#ffffff' }}>{trackingId}</span>
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {applicationStatus === 'approved' && (
                <>
                  <button className="btn btn-sm btn-primary-teal" onClick={handleDownloadVisaSlip}>
                    <Download size={14} /> Download Official e-Visa PDF
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => openModal('package_delivery', { quoteNumber: trackingId, clientName: formData.fullName })}
                  >
                    <Share2 size={14} /> Send WhatsApp Alert
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Step Progress Stepper */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', position: 'relative' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                <CheckCircle2 size={16} /> 1. Bio Submitted
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Passport biodata received</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                <CheckCircle2 size={16} /> 2. AI OCR Validated
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MRZ checksums verified 100%</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: applicationStatus === 'embassy_processing' || applicationStatus === 'approved' ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid var(--border-dark)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: applicationStatus === 'approved' ? '#34d399' : '#60a5fa', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                {applicationStatus === 'approved' ? <CheckCircle2 size={16} /> : <Clock size={16} />} 3. Embassy Review
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MOFA consular visa gate</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: applicationStatus === 'approved' ? '1px solid #10b981' : '1px solid var(--border-dark)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: applicationStatus === 'approved' ? '#34d399' : 'var(--text-dim)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                {applicationStatus === 'approved' ? <CheckCircle2 size={16} color="#10b981" /> : <ShieldCheck size={16} />} 4. e-Visa Issued
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {applicationStatus === 'approved' ? 'Ready for International Travel' : 'Awaiting confirmation'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

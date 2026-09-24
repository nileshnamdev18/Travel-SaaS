import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingRecord, BookingPassenger } from '../../types';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Plane, 
  Building, 
  Sparkles, 
  FileText, 
  Palmtree, 
  Download, 
  CreditCard, 
  User, 
  Calendar, 
  ArrowRight,
  Shield,
  Coffee,
  Luggage,
  Sparkle
} from 'lucide-react';
import { PdfEngine } from '../../services/pdfGenerator';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const { 
    activeCheckout, 
    closeCheckout, 
    formatPrice, 
    corporatePolicy, 
    addBooking,
    activeRole,
    activeCurrency,
    convertPrice,
    getMarkupAdjustedPrice
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Add-ons state
  const [selectedAddons, setSelectedAddons] = useState<Array<{ name: string; priceUSD: number }>>([
    { name: 'Comprehensive Travel Insurance & Flight Delay Cover', priceUSD: 29 }
  ]);

  // Passenger state
  const [passenger, setPassenger] = useState<BookingPassenger>({
    fullName: 'Ahmed Al-Mansoor',
    email: 'ahmed.mansoor@apexenergy.com',
    phone: '+966 50 123 4567',
    passportNumber: 'N9812480',
    nationality: 'Saudi Arabia',
    dateOfBirth: '1985-06-14',
    specialRequests: 'Halal meal preference, aisle seat if available.'
  });

  const [paymentMethod, setPaymentMethod] = useState<'Corporate Credit Line' | 'Corporate Card' | 'Personal Visa' | 'Apple Pay'>('Corporate Credit Line');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  if (!activeCheckout.isOpen || !activeCheckout.item) {
    return null;
  }

  const { item, vertical } = activeCheckout;

  // Calculate Base Price based on vertical
  let basePriceUSD = 0;
  let itemTitle = '';
  let itemSubtitle = '';
  let itemImage = '';
  let datesLabel = '15 Oct 2026 - 22 Oct 2026';

  if (vertical === 'flight') {
    basePriceUSD = getMarkupAdjustedPrice(item.basePriceUSD, 'flights');
    itemTitle = `${item.origin} → ${item.destination} (${item.airline})`;
    itemSubtitle = `${item.cabinClass} Class • Flight ${item.airlineCode} • ${item.duration} (${item.stops === 0 ? 'Non-Stop' : '1 Stop'})`;
    itemImage = item.airlineLogo || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80';
    datesLabel = `${item.departureDate} • Departs ${item.departureTime}`;
  } else if (vertical === 'hotel') {
    basePriceUSD = getMarkupAdjustedPrice(item.basePriceUSD, 'hotels') * 3; // 3 nights default
    itemTitle = item.name;
    itemSubtitle = `${item.city}, ${item.country} • ${item.distanceToHaramLabel || item.distanceToCenter} • 3 Nights`;
    itemImage = item.heroImage;
    datesLabel = '18 Oct 2026 - 21 Oct 2026 (3 Nights)';
  } else if (vertical === 'umrah') {
    const rawCost = item.pricingPerPax ? item.pricingPerPax.double : 1450;
    basePriceUSD = getMarkupAdjustedPrice(rawCost, 'umrah');
    itemTitle = item.title;
    itemSubtitle = `Makkah (${item.makkahHotel?.distanceLabel || 'Near Haram'}) + Madinah Stay`;
    itemImage = item.image;
    datesLabel = item.departureDates ? item.departureDates[0] : '15 Oct 2026 (14 Days)';
  } else if (vertical === 'visa') {
    const rawCost = item.options ? item.options[0].govFee + item.options[0].platformFee : 120;
    basePriceUSD = getMarkupAdjustedPrice(rawCost, 'visas');
    itemTitle = `${item.countryName} Express Travel Visa`;
    itemSubtitle = 'Biometric OCR Verified • Nusuk / ICAO Compliant';
    itemImage = item.bannerImage;
    datesLabel = 'Standard Processing (3-5 Days)';
  } else if (vertical === 'holiday') {
    basePriceUSD = getMarkupAdjustedPrice(item.basePrice || 1200, 'holidays');
    itemTitle = item.title;
    itemSubtitle = `${item.destination} • ${item.durationDays} Days / ${item.durationDays - 1} Nights`;
    itemImage = item.heroImage;
    datesLabel = '20 Oct 2026 - 27 Oct 2026';
  } else {
    basePriceUSD = 950;
    itemTitle = 'Corporate MICE & Group Package';
    itemSubtitle = 'Delegate logistics and conference itinerary';
    itemImage = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80';
  }

  const addonsTotalUSD = selectedAddons.reduce((sum, a) => sum + a.priceUSD, 0);
  const totalAmountUSD = basePriceUSD + addonsTotalUSD;

  // Policy validation
  let isInPolicy = true;
  let policyViolationReason = '';

  if (vertical === 'flight') {
    if (basePriceUSD > corporatePolicy.maxFlightBudgetUSD) {
      isInPolicy = false;
      policyViolationReason = `Flight fare ($${basePriceUSD}) exceeds company cap ($${corporatePolicy.maxFlightBudgetUSD}).`;
    }
    if (item.cabinClass && item.cabinClass !== corporatePolicy.allowedCabinClass && corporatePolicy.allowedCabinClass === 'Economy') {
      isInPolicy = false;
      policyViolationReason = `${item.cabinClass} Class requested, but policy only permits ${corporatePolicy.allowedCabinClass}.`;
    }
  } else if (vertical === 'hotel') {
    const nightly = basePriceUSD / 3;
    if (nightly > corporatePolicy.maxHotelNightlyUSD) {
      isInPolicy = false;
      policyViolationReason = `Nightly hotel rate ($${Math.round(nightly)}) exceeds company cap ($${corporatePolicy.maxHotelNightlyUSD}/night).`;
    }
  }

  const handleToggleAddon = (name: string, priceUSD: number) => {
    if (selectedAddons.some(a => a.name === name)) {
      setSelectedAddons(prev => prev.filter(a => a.name !== name));
    } else {
      setSelectedAddons(prev => [...prev, { name, priceUSD }]);
    }
  };

  const handleAutoFillProfile = () => {
    setPassenger({
      fullName: 'Ahmed Al-Mansoor',
      email: 'ahmed.mansoor@apexenergy.com',
      phone: '+966 50 123 4567',
      passportNumber: 'N9812480',
      nationality: 'Saudi Arabia',
      dateOfBirth: '1985-06-14',
      specialRequests: 'Halal meal preference, window seat.'
    });
  };

  const handleConfirmReservation = () => {
    const bookingStatus = isInPolicy ? 'confirmed' : 'pending_approval';
    const refCode = `TP-${(vertical || 'SRV').toUpperCase().slice(0, 2)}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      referenceCode: refCode,
      vertical: vertical || 'flight',
      title: itemTitle,
      subtitle: itemSubtitle,
      imageUrl: itemImage,
      bookingDate: new Date().toISOString().slice(0, 10),
      travelDates: datesLabel,
      passenger,
      paxCount: 1,
      totalAmountUSD,
      appliedCurrency: activeCurrency,
      convertedAmount: convertPrice(totalAmountUSD),
      status: bookingStatus,
      policyCompliance: {
        inPolicy: isInPolicy,
        reason: isInPolicy ? 'Compliant with corporate limits' : policyViolationReason,
        approvedBy: isInPolicy ? 'Automated Policy Engine' : undefined,
        approvalDate: isInPolicy ? new Date().toISOString().slice(0, 10) : undefined
      },
      addons: selectedAddons,
      paymentMethod,
      details: {
        rawItemId: item.id,
        vertical
      }
    };

    addBooking(newBooking);
    setConfirmedBooking(newBooking);
    setStep(4);

    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="modal-backdrop" onClick={closeCheckout}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '780px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-blue">ENTERPRISE CHECKOUT</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PCI-DSS Secure • 256-Bit SSL</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-heading)' }}>
              Complete Your Reservation
            </h2>
          </div>
          <button className="modal-close-btn" onClick={closeCheckout}>
            <X size={20} />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '0.75rem 1rem', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
          {[
            { num: 1, label: 'Trip & Add-ons' },
            { num: 2, label: 'Passenger' },
            { num: 3, label: 'Policy & Pay' },
            { num: 4, label: 'Confirmed' }
          ].map((s) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: step >= s.num ? 'var(--brand-blue)' : 'var(--border-color)',
                  color: step >= s.num ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: step === s.num ? 700 : 500, color: step === s.num ? 'var(--text-heading)' : 'var(--text-muted)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ================= STEP 1: ITEM SUMMARY & ADDONS ================= */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Selected Item Preview Card */}
            <div style={{ display: 'flex', gap: '1.25rem', padding: '1rem', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <img 
                src={itemImage} 
                alt={itemTitle} 
                style={{ width: '110px', height: '85px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                    {itemTitle}
                  </h3>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-blue)' }}>
                      {formatPrice(basePriceUSD)}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Base Price</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {itemSubtitle}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '8px' }}>
                  <Calendar size={14} color="var(--brand-blue)" />
                  <span>{datesLabel}</span>
                </div>
              </div>
            </div>

            {/* Travel Add-ons Selection */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--gold-500)" />
                Recommended Premium Travel Add-ons
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  {
                    name: 'Comprehensive Travel Insurance & Flight Delay Cover',
                    priceUSD: 29,
                    desc: 'Medical evacuation up to $500,000, trip cancellation and lost baggage protection.'
                  },
                  {
                    name: 'Airport VIP Fast-Track & Lounge Access',
                    priceUSD: 45,
                    desc: 'Priority immigration clearance, quiet business lounge, gourmet dining & high-speed WiFi.'
                  },
                  {
                    name: 'Additional 23kg Checked Luggage Allowance',
                    priceUSD: 35,
                    desc: 'Pre-book extra baggage at 40% discount vs airline airport counter rates.'
                  },
                  {
                    name: 'Dedicated Private Chauffeur Airport Transfer',
                    priceUSD: 65,
                    desc: 'Executive sedan waiting in arrival hall with nameboard and flight tracking.'
                  }
                ].map((addon) => {
                  const isChecked = selectedAddons.some(a => a.name === addon.name);
                  return (
                    <div 
                      key={addon.name}
                      onClick={() => handleToggleAddon(addon.name, addon.priceUSD)}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${isChecked ? 'var(--brand-blue)' : 'var(--border-color)'}`,
                        background: isChecked ? 'var(--brand-blue-light, rgba(37, 99, 235, 0.05))' : 'var(--bg-card)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => {}} 
                          style={{ width: '18px', height: '18px', accentColor: 'var(--brand-blue)' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-heading)' }}>
                            {addon.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {addon.desc}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-blue)', whiteSpace: 'nowrap' }}>
                        +{formatPrice(addon.priceUSD)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 1 Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Estimated Cost: </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)' }}>{formatPrice(totalAmountUSD)}</span>
              </div>
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                <span>Continue to Passenger Details</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PASSENGER DETAILS ================= */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                  Primary Traveler Information
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ensure details match traveler’s government passport exactly for boarding/check-in.
                </p>
              </div>
              <button 
                type="button" 
                className="btn btn-sm btn-secondary" 
                onClick={handleAutoFillProfile}
                title="Fill from Corporate Profile / Passport Vault"
              >
                <User size={14} />
                <span>Auto-fill from Profile</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Legal Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={passenger.fullName}
                  onChange={(e) => setPassenger({ ...passenger, fullName: e.target.value })}
                  placeholder="e.g. Ahmed Al-Mansoor"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Corporate Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={passenger.email}
                  onChange={(e) => setPassenger({ ...passenger, email: e.target.value })}
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mobile Phone Number</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  value={passenger.phone}
                  onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })}
                  placeholder="+966 50 123 4567"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Passport / ID Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={passenger.passportNumber}
                  onChange={(e) => setPassenger({ ...passenger, passportNumber: e.target.value })}
                  placeholder="e.g. N9812480"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nationality</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={passenger.nationality}
                  onChange={(e) => setPassenger({ ...passenger, nationality: e.target.value })}
                  placeholder="e.g. Saudi Arabia"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date of Birth</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={passenger.dateOfBirth}
                  onChange={(e) => setPassenger({ ...passenger, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Special In-Flight or Dietary Requests</label>
              <textarea 
                className="form-input" 
                rows={2}
                value={passenger.specialRequests}
                onChange={(e) => setPassenger({ ...passenger, specialRequests: e.target.value })}
                placeholder="Halal meal, wheelchair assistance, high floor room, etc."
              />
            </div>

            {/* Step 2 Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  if (!passenger.fullName || !passenger.email) {
                    alert('Please provide passenger name and email.');
                    return;
                  }
                  setStep(3);
                }}
              >
                <span>Continue to Policy & Payment</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: POLICY CHECK & PAYMENT ================= */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Corporate Policy Assessment Card */}
            <div 
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: isInPolicy ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${isInPolicy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.4)'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                {isInPolicy ? (
                  <>
                    <CheckCircle2 size={18} color="var(--color-success)" />
                    <strong style={{ color: 'var(--color-success)', fontSize: '0.95rem' }}>
                      IN-POLICY BOOKING (AUTO-APPROVED)
                    </strong>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={18} color="var(--color-warning)" />
                    <strong style={{ color: 'var(--color-warning)', fontSize: '0.95rem' }}>
                      OUT-OF-POLICY (REQUIRES MANAGER APPROVAL)
                    </strong>
                  </>
                )}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {isInPolicy 
                  ? `Reservation total ($${totalAmountUSD}) falls strictly within ${corporatePolicy.companyName}’s travel spending guidelines. Upon booking, ticket/voucher will be instantly confirmed.`
                  : `${policyViolationReason} This reservation will be routed directly to the Corporate Travel Manager approval queue for executive review.`
                }
              </p>
            </div>

            {/* Price Breakdown */}
            <div style={{ background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Financial Summary
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '4px 0', color: 'var(--text-main)' }}>
                <span>Base Service Fare</span>
                <span>{formatPrice(basePriceUSD)}</span>
              </div>
              {selectedAddons.map(a => (
                <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '3px 0', color: 'var(--text-muted)' }}>
                  <span>+ {a.name}</span>
                  <span>{formatPrice(a.priceUSD)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '3px 0', color: 'var(--text-muted)' }}>
                <span>Taxes, Aviation Security & Service Surcharges</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Included</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', color: 'var(--text-heading)' }}>
                <span>Total Payable Amount</span>
                <span style={{ color: 'var(--brand-blue)' }}>{formatPrice(totalAmountUSD)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Select Corporate Tender / Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { id: 'Corporate Credit Line', label: 'Corporate Billing Credit Line', desc: 'Invoiced to company central treasury account' },
                  { id: 'Corporate Card', label: 'Company Corporate Card', desc: 'Direct charge to Apex Global Travel Card' },
                  { id: 'Personal Visa', label: 'Personal Card (Expense Back)', desc: 'Generate itemized VAT receipt for reimbursement' },
                  { id: 'Apple Pay', label: 'Apple Pay / Digital Wallet', desc: 'Instant biometric one-tap authorization' }
                ].map((pm) => (
                  <div 
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${paymentMethod === pm.id ? 'var(--brand-blue)' : 'var(--border-color)'}`,
                      background: paymentMethod === pm.id ? 'var(--brand-blue-light, rgba(37, 99, 235, 0.05))' : 'var(--bg-card)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-heading)' }}>
                      {pm.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {pm.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3 Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleConfirmReservation}
                style={{ background: isInPolicy ? 'var(--brand-blue)' : 'var(--gold-500)' }}
              >
                <CheckCircle2 size={16} />
                <span>{isInPolicy ? `Confirm & Pay ${formatPrice(totalAmountUSD)}` : 'Submit for Manager Approval'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CONFIRMATION & PDF VOUCHER ================= */}
        {step === 4 && confirmedBooking && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem', padding: '1rem 0' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: confirmedBooking.status === 'confirmed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: confirmedBooking.status === 'confirmed' ? 'var(--color-success)' : 'var(--color-warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className={`badge ${confirmedBooking.status === 'confirmed' ? 'badge-emerald' : 'badge-gold'}`}>
                {confirmedBooking.status === 'confirmed' ? 'RESERVATION CONFIRMED' : 'APPROVAL PENDING'}
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-heading)' }}>
                {confirmedBooking.status === 'confirmed' ? 'Your Journey is Officially Booked!' : 'Request Sent to Corporate Travel Manager'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '520px' }}>
                {confirmedBooking.status === 'confirmed'
                  ? `Booking reference code is ${confirmedBooking.referenceCode}. A confirmation email has been dispatched to ${confirmedBooking.passenger.email}.`
                  : `Your trip was flagged for out-of-policy review (${confirmedBooking.policyCompliance.reason}). Travel manager has been notified via dashboard.`
                }
              </p>
            </div>

            {/* Booking Summary Box */}
            <div 
              style={{
                width: '100%',
                background: 'var(--bg-card-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                border: '1px solid var(--border-color)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Booking Reference (PNR)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-blue)', letterSpacing: '0.05em' }}>
                    {confirmedBooking.referenceCode}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Charged</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                    {formatPrice(confirmedBooking.totalAmountUSD)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Passenger: </span>
                  <strong>{confirmedBooking.passenger.fullName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Service: </span>
                  <strong>{confirmedBooking.title}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Dates: </span>
                  <strong>{confirmedBooking.travelDates}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Payment: </span>
                  <strong>{confirmedBooking.paymentMethod}</strong>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button 
                className="btn btn-primary"
                onClick={() => PdfEngine.generateBookingVoucher(confirmedBooking)}
              >
                <Download size={16} />
                <span>Download Official PDF Voucher</span>
              </button>
              <button 
                className="btn btn-secondary"
                onClick={closeCheckout}
              >
                Close & Return to Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

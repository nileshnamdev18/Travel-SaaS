import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UmrahPackage, RoomSharingType } from '../../types';
import { 
  Building, 
  MapPin, 
  Users, 
  Bus, 
  Check, 
  Calendar, 
  Sparkles, 
  Download, 
  Share2, 
  ShieldCheck, 
  Plane,
  ChevronRight,
  Filter
} from 'lucide-react';
import { PdfEngine } from '../../services/pdfGenerator';
import confetti from 'canvas-confetti';

export const UmrahModule: React.FC = () => {
  const { umrahPackages, formatPrice, openModal, openCheckout, getMarkupAdjustedPrice } = useApp();

  const [bookingMode, setBookingMode] = useState<'fixed' | 'custom'>('fixed');
  const [selectedSharing, setSelectedSharing] = useState<RoomSharingType>('quad');
  const [distanceFilter, setDistanceFilter] = useState<'all' | 'under50' | 'under300' | 'shuttle'>('all');
  const [paxCount, setPaxCount] = useState<number>(4);
  const [selectedPackage, setSelectedPackage] = useState<UmrahPackage>(umrahPackages[0]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Filter packages based on proximity
  const filteredPackages = umrahPackages.filter(pkg => {
    if (distanceFilter === 'under50') return pkg.makkahHotel.distanceMeters <= 50;
    if (distanceFilter === 'under300') return pkg.makkahHotel.distanceMeters <= 300;
    if (distanceFilter === 'shuttle') return pkg.makkahHotel.isShuttleService;
    return true;
  });

  const getPricePerPax = (pkg: UmrahPackage) => {
    const raw = pkg.pricingPerPax[selectedSharing];
    return getMarkupAdjustedPrice(raw, 'umrah');
  };

  const handleConfirmBooking = () => {
    openCheckout(selectedPackage, 'umrah');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Header with Spiritual Theme */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(11, 59, 44, 0.9) 0%, rgba(20, 31, 54, 0.95) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          border: '1px solid rgba(197, 160, 89, 0.3)',
          boxShadow: 'var(--shadow-gold)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(197, 160, 89, 0.2)', color: 'var(--gold-300)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', border: '1px solid rgba(197, 160, 89, 0.4)' }}>
            <Sparkles size={14} /> BENCHMARKED FROM UMRAHCENTER.COM
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Corporate & Group Umrah Ecosystem
          </h1>

          <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Seamless spiritual journeys with guaranteed Haram courtyard proximity, certified Mutawwif scholars, Nusuk permit automation, and group allocations.
          </p>

          {/* Mode Switcher: Fixed vs Customized Builder */}
          <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.4)', padding: '5px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-dark)' }}>
            <button 
              className={`portal-tab ${bookingMode === 'fixed' ? 'active-b2c' : ''}`}
              onClick={() => setBookingMode('fixed')}
            >
              <Calendar size={16} />
              <span>Fixed Group Departures</span>
            </button>
            <button 
              className={`portal-tab ${bookingMode === 'custom' ? 'active-b2c' : ''}`}
              onClick={() => setBookingMode('custom')}
            >
              <Sparkles size={16} />
              <span>Customized Umrah Builder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Configuration Bar */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          {/* Haram Proximity Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Filter size={16} color="var(--gold-400)" />
              <span>Makkah Haram Proximity:</span>
            </div>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                className={`btn btn-sm ${distanceFilter === 'all' ? 'btn-primary-teal' : 'btn-secondary'}`}
                onClick={() => setDistanceFilter('all')}
              >
                All Distances
              </button>
              <button 
                className={`btn btn-sm ${distanceFilter === 'under50' ? 'btn-primary-gold' : 'btn-secondary'}`}
                onClick={() => setDistanceFilter('under50')}
              >
                &lt; 50m (Clock Tower)
              </button>
              <button 
                className={`btn btn-sm ${distanceFilter === 'under300' ? 'btn-primary-teal' : 'btn-secondary'}`}
                onClick={() => setDistanceFilter('under300')}
              >
                &lt; 300m Walking
              </button>
              <button 
                className={`btn btn-sm ${distanceFilter === 'shuttle' ? 'btn-primary-teal' : 'btn-secondary'}`}
                onClick={() => setDistanceFilter('shuttle')}
              >
                Free 24/7 Shuttle
              </button>
            </div>
          </div>

          {/* Room Occupancy Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Users size={16} color="var(--gold-400)" />
              <span>Room Sharing:</span>
            </div>

            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
              {(['quad', 'triple', 'double', 'single'] as RoomSharingType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedSharing(type);
                    if (type === 'quad') setPaxCount(4);
                    else if (type === 'triple') setPaxCount(3);
                    else if (type === 'double') setPaxCount(2);
                    else setPaxCount(1);
                  }}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: selectedSharing === type ? 'var(--gold-500)' : 'transparent',
                    color: selectedSharing === type ? '#000000' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Package Grid & Detailed Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {filteredPackages.map((pkg) => {
          const pricePerPax = getPricePerPax(pkg);
          const isSelected = selectedPackage.id === pkg.id;

          return (
            <div 
              key={pkg.id}
              className={`glass-card ${isSelected ? 'glass-card-gold' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--gold-400)' : undefined
              }}
              onClick={() => setSelectedPackage(pkg)}
            >
              <div>
                {/* Header Image & Badges */}
                <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.25rem' }}>
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
                  
                  {pkg.badge && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span className="badge badge-gold">{pkg.badge}</span>
                    </div>
                  )}

                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                      {pkg.durationNightsMakkah}N Makkah • {pkg.durationNightsMadinah}N Madinah
                    </div>
                    <div className="badge badge-emerald">
                      <ShieldCheck size={12} /> Nusuk {pkg.nusukPermitSyncStatus}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#ffffff' }}>
                  {pkg.title}
                </h3>

                {/* Hotel Proximities (umrahcenter.com feature) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.85rem' }}>
                    <MapPin size={16} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>Makkah:</strong> {pkg.makkahHotel.name}
                      <div style={{ fontSize: '0.75rem', color: 'var(--gold-300)' }}>
                        {pkg.makkahHotel.distanceLabel}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.85rem' }}>
                    <Building size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>Madinah:</strong> {pkg.madinahHotel.name}
                      <div style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>
                        {pkg.madinahHotel.distanceLabel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Departure Details */}
                {pkg.departureDates && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <Calendar size={14} color="var(--gold-400)" />
                    <span>Next Departures: <strong>{pkg.departureDates.slice(0, 2).join(', ')}</strong></span>
                  </div>
                )}

                {pkg.flightIncluded && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    <Plane size={14} color="#60a5fa" />
                    <span>Aviation Block: {pkg.airline}</span>
                  </div>
                )}
              </div>

              {/* Price & Action Footer */}
              <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Per Pilgrim ({selectedSharing} Sharing)
                    </span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold-400)' }}>
                      {formatPrice(pricePerPax)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Total ({paxCount} Pax)
                    </span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                      {formatPrice(pricePerPax * paxCount)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary-gold" 
                    style={{ flex: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPackage(pkg);
                      handleConfirmBooking();
                    }}
                  >
                    Confirm Reservation
                  </button>

                  <button 
                    className="btn btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      PdfEngine.generateItineraryVoucher(pkg, paxCount, 'Ahmed Al-Mansoor');
                    }}
                    title="Download Official PDF Voucher (Sec 6)"
                  >
                    <Download size={16} />
                  </button>

                  <button 
                    className="btn btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal('package_delivery', pkg);
                    }}
                    title="Dispatch via WhatsApp Business (Sec 6 & 11)"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Package Full Itinerary & Spiritual Logistics Breakdown */}
      {selectedPackage && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--gold-500)', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gold-400)', fontWeight: 700, textTransform: 'uppercase' }}>
                Comprehensive Pilgrimage Breakdown
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>{selectedPackage.title}</h3>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn btn-sm btn-outline-gold"
                onClick={() => {
                  const manifestList = [
                    { name: 'Dr. Tariq Al-Hashimi', passport: 'K8920149', roomType: `${selectedSharing.toUpperCase()} Room 402`, busNo: 'Coach A-01 (Makkah VIP)' },
                    { name: 'Mrs. Noura Al-Hashimi', passport: 'K8920150', roomType: `${selectedSharing.toUpperCase()} Room 402`, busNo: 'Coach A-01 (Makkah VIP)' },
                    { name: 'Zayd Al-Hashimi', passport: 'K8920151', roomType: `${selectedSharing.toUpperCase()} Room 402`, busNo: 'Coach A-01 (Makkah VIP)' },
                    { name: 'Mariam Al-Hashimi', passport: 'K8920152', roomType: `${selectedSharing.toUpperCase()} Room 402`, busNo: 'Coach A-01 (Makkah VIP)' }
                  ];
                  PdfEngine.generateGroupManifest(selectedPackage.title, manifestList);
                }}
              >
                <Download size={14} /> Download Passenger Manifest PDF
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Ziyarah Sites Included */}
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--gold-300)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bus size={16} /> Guided Ziyarah Excursions (Mutawwif Led)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedPackage.ziyarahSites.map((site) => (
                  <div key={site.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <Check size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>[{site.city}] {site.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {site.description} ({site.durationHours} hrs)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Inclusions & Logistics */}
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--gold-300)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} /> Pilgrimage Compliance & Logistics
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                  <strong style={{ color: '#ffffff' }}>Nusuk Permit Automation:</strong> Electronic Umrah slot and Rawdah Riyadh al-Jannah authorization pre-synced with Saudi MOFA.
                </div>
                <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                  <strong style={{ color: '#ffffff' }}>5L Sealed Zamzam:</strong> Factory-packaged and tagged with passenger barcode for return flight transport.
                </div>
                <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                  <strong style={{ color: '#ffffff' }}>AC High-Speed Coach Transfers:</strong> Direct Jeddah Airport ↔ Makkah ↔ Madinah Haramain High Speed Rail & VIP buses.
                </div>
              </div>
            </div>
          </div>

          {bookingConfirmed && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#10b981', color: '#000000', padding: '6px', borderRadius: '50%' }}>
                  <Check size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#34d399', fontSize: '1rem' }}>Reservation Confirmed & PNR Held!</h4>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                    Voucher generated with digital QR code. Milestone tracker initialized in Operations Desk.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-sm btn-primary-gold"
                  onClick={() => PdfEngine.generateItineraryVoucher(selectedPackage, paxCount, 'Ahmed Al-Mansoor')}
                >
                  <Download size={14} /> Download Voucher PDF
                </button>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => openModal('package_delivery', selectedPackage)}
                >
                  <Share2 size={14} /> Send WhatsApp Alert
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

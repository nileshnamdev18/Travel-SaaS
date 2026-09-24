import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_HOLIDAYS } from '../../data/mockData';
import { HolidayPackage, ActivityOption } from '../../types';
import { 
  Palmtree, 
  Repeat, 
  Check, 
  Clock, 
  Calendar, 
  Sparkles, 
  Download, 
  Share2, 
  MapPin, 
  Building2,
  DollarSign
} from 'lucide-react';
import { PdfEngine } from '../../services/pdfGenerator';
import confetti from 'canvas-confetti';

export const HolidaysModule: React.FC = () => {
  const { formatPrice, openModal } = useApp();

  const [packages, setPackages] = useState<HolidayPackage[]>(INITIAL_HOLIDAYS);
  const [selectedPackage, setSelectedPackage] = useState<HolidayPackage>(INITIAL_HOLIDAYS[0]);
  const [swappingDay, setSwappingDay] = useState<number | null>(null);

  // Swap activity on a specific day
  const handleSwapActivity = (dayNumber: number, newActivity: ActivityOption) => {
    const updatedDays = selectedPackage.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          currentActivity: newActivity
        };
      }
      return day;
    });

    // Recalculate package price with deltas
    const newPrice = selectedPackage.basePrice + newActivity.priceDelta;
    const updatedPackage: HolidayPackage = {
      ...selectedPackage,
      days: updatedDays,
      basePrice: newPrice
    };

    setSelectedPackage(updatedPackage);
    setPackages(prev => prev.map(p => p.id === updatedPackage.id ? updatedPackage : p));
    setSwappingDay(null);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(13, 148, 136, 0.8) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          border: '1px solid rgba(42, 157, 143, 0.4)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            <Palmtree size={14} /> DUAL-PATH HOLIDAYS & MODULAR SWAP ENGINE
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff' }}>
            Curated Holidays & Real-Time Itinerary Customizer
          </h1>

          <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: 1.6 }}>
            Swap excursions, upgrade mountain gondolas or helicopter tours, and watch package pricing recalculate in real-time.
          </p>
        </div>
      </div>

      {/* Package Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {packages.map((pkg) => {
          const isSelected = selectedPackage.id === pkg.id;
          return (
            <div 
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`glass-card ${isSelected ? 'glass-card-teal' : ''}`}
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--visa-teal)' : undefined,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem' }}>
                  <img src={pkg.heroImage} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#ffffff' }}>
                    {pkg.destination} • {pkg.durationDays} Days
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{pkg.title}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                  {pkg.highlights.map((h, i) => (
                    <span key={i} className="badge badge-teal" style={{ fontSize: '0.65rem' }}>{h}</span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Starting from</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--visa-teal)' }}>
                    {formatPrice(pkg.basePrice)}
                  </div>
                </div>

                <button 
                  className={`btn btn-sm ${isSelected ? 'btn-primary-teal' : 'btn-secondary'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPackage(pkg);
                  }}
                >
                  {isSelected ? 'Customizing Itinerary' : 'Select Package'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Day-by-Day Modular Swap & Upgrade Builder */}
      {selectedPackage && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--visa-teal)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--visa-teal)', fontWeight: 700, textTransform: 'uppercase' }}>
                Modular Day-by-Day "Swap / Upgrade" Engine
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>{selectedPackage.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Click "Swap Activity" on any day to modify excursions with instant price recalculation.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Live Calculated Price:</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--visa-teal)' }}>
                  {formatPrice(selectedPackage.basePrice)}
                </div>
              </div>

              <button 
                className="btn btn-primary-teal"
                onClick={() => PdfEngine.generateItineraryVoucher(selectedPackage, 2, 'Ahmed Al-Mansoor')}
              >
                <Download size={16} /> Download Itinerary PDF
              </button>
            </div>
          </div>

          {/* Days List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {selectedPackage.days.map((day) => (
              <div 
                key={day.dayNumber}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-dark)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-teal">Day {day.dayNumber}</span>
                    <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>{day.dayTitle}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({day.destination})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Building2 size={14} color="var(--visa-teal)" />
                    <span>Lodging: <strong>{day.hotelName}</strong> ({day.hotelTier})</span>
                  </div>
                </div>

                {/* Current Active Activity */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(42, 157, 143, 0.08)', border: '1px solid rgba(42, 157, 143, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img 
                      src={day.currentActivity.image} 
                      alt={day.currentActivity.title} 
                      style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} 
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                        {day.currentActivity.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '500px' }}>
                        {day.currentActivity.description}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--visa-teal)', marginTop: '4px' }}>
                        Duration: {day.currentActivity.duration} • Included in Base
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => setSwappingDay(swappingDay === day.dayNumber ? null : day.dayNumber)}
                  >
                    <Repeat size={14} /> Swap / Upgrade Activity
                  </button>
                </div>

                {/* Swap Alternatives Drawer */}
                {swappingDay === day.dayNumber && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-dark-strong)' }}>
                    <h5 style={{ fontSize: '0.85rem', color: 'var(--gold-400)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      Alternative Activity Modules for Day {day.dayNumber}:
                    </h5>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                      {day.alternativeActivities.map((alt) => (
                        <div 
                          key={alt.id}
                          style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-dark)',
                            background: 'rgba(255,255,255,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '0.5rem'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>
                              <span>{alt.title}</span>
                              <span style={{ color: '#34d399' }}>+{formatPrice(alt.priceDelta)}</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {alt.description}
                            </p>
                          </div>

                          <button 
                            className="btn btn-sm btn-primary-teal"
                            onClick={() => handleSwapActivity(day.dayNumber, alt)}
                          >
                            Apply Swap (+{formatPrice(alt.priceDelta)})
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FlightOption } from '../../types';
import { 
  Plane, 
  ArrowRight, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Luggage, 
  Zap, 
  Calendar,
  Users,
  Award,
  ArrowLeftRight,
  BadgePercent,
  Check,
  CheckCircle2,
  Utensils
} from 'lucide-react';

interface AirportInfo {
  code: string;
  city: string;
  name: string;
  country: string;
}

const AIRPORTS: AirportInfo[] = [
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj Intl', country: 'India' },
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi Intl', country: 'India' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda Intl', country: 'India' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'UAE' },
  { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz Intl (Umrah Gateway)', country: 'Saudi Arabia' },
  { code: 'RUH', city: 'Riyadh', name: 'King Khalid Intl', country: 'Saudi Arabia' },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'United Kingdom' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport', country: 'Singapore' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl', country: 'United States' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle Airport', country: 'France' }
];

export const FlightsModule: React.FC = () => {
  const { flights, formatPrice, openCheckout, getMarkupAdjustedPrice } = useApp();

  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');
  const [specialFare, setSpecialFare] = useState<'regular' | 'armed_forces' | 'student' | 'senior' | 'corporate'>('regular');
  
  const [origin, setOrigin] = useState<string>('BOM');
  const [destination, setDestination] = useState<string>('DXB');
  const [departureDate, setDepartureDate] = useState<string>('2026-10-15');
  const [returnDate, setReturnDate] = useState<string>('2026-10-22');
  
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [cabinClass, setCabinClass] = useState<string>('Economy');
  const [isTravellerOpen, setIsTravellerOpen] = useState<boolean>(false);

  // Filters
  const [filterStops, setFilterStops] = useState<'all' | 'direct' | 'onestop'>('all');
  const [filterAirline, setFilterAirline] = useState<string>('all');
  const [filterRefundable, setFilterRefundable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');
  
  // Active calendar date
  const [activeCalendarDate, setActiveCalendarDate] = useState<string>('2026-10-15');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Swap airports
  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // 7-day Fare calendar items
  const calendarFares = [
    { dateStr: '2026-10-13', day: 'Tue', priceUSD: 210, isLowest: false },
    { dateStr: '2026-10-14', day: 'Wed', priceUSD: 185, isLowest: false },
    { dateStr: '2026-10-15', day: 'Thu', priceUSD: 172, isLowest: true },
    { dateStr: '2026-10-16', day: 'Fri', priceUSD: 195, isLowest: false },
    { dateStr: '2026-10-17', day: 'Sat', priceUSD: 220, isLowest: false },
    { dateStr: '2026-10-18', day: 'Sun', priceUSD: 205, isLowest: false },
    { dateStr: '2026-10-19', day: 'Mon', priceUSD: 180, isLowest: false }
  ];

  // Exclusive promotional coupons
  const promoCoupons = [
    {
      code: 'PULSEAI',
      title: 'Flat ₹1,500 / $25 OFF',
      subtitle: 'On International Flights & Umrah Sectors',
      tag: 'HOT DEAL',
      minSpend: 'No Min Booking'
    },
    {
      code: 'FLYDIRECT',
      title: 'Zero Convenience Fee',
      subtitle: 'Valid on Domestic & Gulf Direct Flights',
      tag: 'INSTANT SAVING',
      minSpend: 'UPI & Corporate Cards'
    },
    {
      code: 'HOLYUMRAH',
      title: 'Flat $150 OFF / Pilgrim',
      subtitle: 'Direct Saudia Group PNR & Clock Tower',
      tag: 'PILGRIMAGE',
      minSpend: 'Umrah Package'
    },
    {
      code: 'CORP12',
      title: 'Corporate 12% Cashback',
      subtitle: 'For Verified SME & Corporate Travelers',
      tag: 'CORPORATE',
      minSpend: 'Business Class'
    }
  ];

  // Popular routes
  const popularRoutes = [
    { from: 'BOM', to: 'DXB', fromCity: 'Mumbai', toCity: 'Dubai', fromPrice: 195, duration: '3h 20m', tag: 'High Frequency' },
    { from: 'DEL', to: 'LHR', fromCity: 'Delhi', toCity: 'London', fromPrice: 420, duration: '9h 15m', tag: 'Non-Stop' },
    { from: 'BOM', to: 'JED', fromCity: 'Mumbai', toCity: 'Jeddah', fromPrice: 310, duration: '5h 45m', tag: 'Umrah Corridor' },
    { from: 'DEL', to: 'BOM', fromCity: 'Delhi', toCity: 'Mumbai', fromPrice: 75, duration: '2h 15m', tag: 'Trunk Route' },
    { from: 'BLR', to: 'SIN', fromCity: 'Bengaluru', toCity: 'Singapore', fromPrice: 240, duration: '4h 30m', tag: 'Fastest' }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  // Filter flights
  const filteredFlights = flights
    .filter(f => {
      if (origin && f.origin !== origin && flights.some(x => x.origin === origin)) {
        if (f.origin !== origin) return false;
      }
      if (destination && f.destination !== destination && flights.some(x => x.destination === destination)) {
        if (f.destination !== destination) return false;
      }
      if (filterStops === 'direct' && f.stops !== 0) return false;
      if (filterStops === 'onestop' && f.stops !== 1) return false;
      if (filterAirline !== 'all' && f.airline !== filterAirline) return false;
      if (filterRefundable && !f.refundable) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return getMarkupAdjustedPrice(a.basePriceUSD, 'flights') - getMarkupAdjustedPrice(b.basePriceUSD, 'flights');
      return parseInt(a.duration) - parseInt(b.duration);
    });

  const availableAirlines = [...new Set(flights.map(f => f.airline))];

  const originAirport = AIRPORTS.find(a => a.code === origin) || { code: origin, city: origin, name: 'Airport', country: '' };
  const destAirport = AIRPORTS.find(a => a.code === destination) || { code: destination, city: destination, name: 'Airport', country: '' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Search Container */}
      <div className="travel-hero-container">
        <div className="travel-hero-bg-overlay" />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                <Zap size={13} color="var(--gold-400)" />
                <span>TRAVELPULSE AI DIRECT GDS CONNECT • LOWEST FARE GUARANTEED</span>
              </div>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Book Cheap Domestic & International Flights
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '640px' }}>
                Compare live airline inventory across IndiGo, Emirates, Saudia, Air India & 100+ carriers. Corporate policy auto-compliance enabled.
              </p>
            </div>

            {/* Quick Trust Pill */}
            <div style={{ 
              background: 'rgba(0, 0, 0, 0.25)', 
              backdropFilter: 'blur(10px)', 
              padding: '10px 16px', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Award size={28} color="var(--gold-400)" />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>Global Travel SaaS Leader</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>Over 250,000 Corporate Journeys</div>
              </div>
            </div>
          </div>

          {/* Signature Search Console */}
          <div className="travel-search-card">
            {/* Trip Type Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'oneway', label: 'One Way' },
                  { id: 'roundtrip', label: 'Round Trip' },
                  { id: 'multicity', label: 'Multi-City' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTripType(t.id as any)}
                    style={{
                      padding: '0.45rem 1.1rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      border: tripType === t.id ? '1px solid var(--brand-accent)' : '1px solid var(--border-color)',
                      background: tripType === t.id ? 'var(--brand-accent)' : 'var(--bg-card-subtle)',
                      color: tripType === t.id ? '#ffffff' : 'var(--text-main)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Direct Flight Deals & Corporate Concessions
              </div>
            </div>

            {/* Special Fares Radio Row */}
            <div className="special-fares-container">
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Select Special Fare:
              </span>
              {[
                { id: 'regular', label: 'Regular Fare', sub: 'Standard baggage' },
                { id: 'armed_forces', label: 'Armed Forces', sub: 'Up to 50% Off' },
                { id: 'student', label: 'Student', sub: 'Extra 10kg Baggage' },
                { id: 'senior', label: 'Senior Citizen', sub: 'Up to 15% Off' },
                { id: 'corporate', label: 'Corporate Special', sub: 'Free Meal & Seats' }
              ].map(f => (
                <div 
                  key={f.id}
                  className={`special-fare-badge ${specialFare === f.id ? 'selected' : ''}`}
                  onClick={() => setSpecialFare(f.id as any)}
                >
                  <input 
                    type="radio" 
                    name="specialFare" 
                    checked={specialFare === f.id} 
                    onChange={() => setSpecialFare(f.id as any)} 
                    style={{ accentColor: 'var(--brand-accent)', cursor: 'pointer' }}
                  />
                  <span><strong>{f.label}</strong> ({f.sub})</span>
                </div>
              ))}
            </div>

            {/* Interactive Search Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr auto 1.2fr 1fr 1.1fr auto', gap: '0.75rem', alignItems: 'center' }}>
              {/* FROM */}
              <div 
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)', 
                  background: 'var(--bg-card)', 
                  cursor: 'pointer' 
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  From (Departure City)
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-heading)' }}>{origin}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{originAirport.city}</span>
                </div>
                <select 
                  value={origin} 
                  onChange={(e) => setOrigin(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    outline: 'none',
                    cursor: 'pointer',
                    marginTop: '2px'
                  }}
                >
                  {AIRPORTS.map(a => (
                    <option key={a.code} value={a.code}>
                      {a.code} - {a.city}, {a.name} ({a.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwapAirports}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card-subtle)',
                  color: 'var(--brand-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                title="Swap Origin and Destination"
              >
                <ArrowLeftRight size={16} />
              </button>

              {/* TO */}
              <div 
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)', 
                  background: 'var(--bg-card)', 
                  cursor: 'pointer' 
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  To (Destination City)
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-heading)' }}>{destination}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{destAirport.city}</span>
                </div>
                <select 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    outline: 'none',
                    cursor: 'pointer',
                    marginTop: '2px'
                  }}
                >
                  {AIRPORTS.map(a => (
                    <option key={a.code} value={a.code}>
                      {a.code} - {a.city}, {a.name} ({a.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* DEPARTURE DATE */}
              <div 
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)', 
                  background: 'var(--bg-card)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Depart Date
                  </span>
                  {tripType === 'roundtrip' && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Return Date
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <input 
                    type="date" 
                    value={departureDate} 
                    onChange={(e) => { setDepartureDate(e.target.value); setActiveCalendarDate(e.target.value); }}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--text-heading)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  {tripType === 'roundtrip' && (
                    <>
                      <span style={{ color: 'var(--border-strong)' }}>|</span>
                      <input 
                        type="date" 
                        value={returnDate} 
                        onChange={(e) => setReturnDate(e.target.value)}
                        style={{
                          flex: 1,
                          border: 'none',
                          background: 'transparent',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: 'var(--text-heading)',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      />
                    </>
                  )}
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--color-success)', fontWeight: 600, marginTop: '2px' }}>
                  Lowest: $172 Available
                </div>
              </div>

              {/* TRAVELLERS & CLASS */}
              <div 
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)', 
                  background: 'var(--bg-card)', 
                  position: 'relative' 
                }}
              >
                <div 
                  onClick={() => setIsTravellerOpen(!isTravellerOpen)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Traveller & Cabin
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '2px' }}>
                    {adults + children} Traveller{adults + children > 1 ? 's' : ''}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {cabinClass}
                  </div>
                </div>

                {/* Popover */}
                {isTravellerOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      width: '280px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '1rem',
                      zIndex: 100
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Adults (12+ yrs)</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button 
                          className="btn btn-sm btn-secondary" 
                          disabled={adults <= 1}
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          style={{ width: '28px', height: '28px', padding: 0, justifyContent: 'center' }}
                        >-</button>
                        <span style={{ fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>{adults}</span>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => setAdults(adults + 1)}
                          style={{ width: '28px', height: '28px', padding: 0, justifyContent: 'center' }}
                        >+</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Children (2-12 yrs)</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button 
                          className="btn btn-sm btn-secondary" 
                          disabled={children <= 0}
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          style={{ width: '28px', height: '28px', padding: 0, justifyContent: 'center' }}
                        >-</button>
                        <span style={{ fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>{children}</span>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => setChildren(children + 1)}
                          style={{ width: '28px', height: '28px', padding: 0, justifyContent: 'center' }}
                        >+</button>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Cabin Class</label>
                      <select 
                        className="form-select" 
                        value={cabinClass} 
                        onChange={(e) => setCabinClass(e.target.value)}
                        style={{ fontSize: '0.85rem' }}
                      >
                        <option>Economy</option>
                        <option>Premium Economy</option>
                        <option>Business</option>
                        <option>First Class</option>
                      </select>
                    </div>

                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => setIsTravellerOpen(false)}
                      style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
                    >
                      Apply Travellers
                    </button>
                  </div>
                )}
              </div>

              {/* SEARCH BUTTON */}
              <button 
                className="travel-btn-primary"
                onClick={() => {
                  const el = document.getElementById('flight-results-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Plane size={18} />
                <span>SEARCH FLIGHTS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Lowest Fare Matrix Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            <Calendar size={16} color="var(--brand-accent)" />
            <span>Lowest Fare Calendar Matrix ({origin} ⇄ {destination})</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Prices updated live every 15 minutes
          </span>
        </div>

        <div className="travel-fare-calendar">
          {calendarFares.map((f) => (
            <div 
              key={f.dateStr}
              className={`fare-date-chip ${f.isLowest ? 'lowest' : ''} ${activeCalendarDate === f.dateStr ? 'active' : ''}`}
              onClick={() => {
                setActiveCalendarDate(f.dateStr);
                setDepartureDate(f.dateStr);
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {f.day}, {f.dateStr.slice(8)} Oct
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: f.isLowest ? 'var(--color-success)' : 'var(--text-heading)', marginTop: '2px' }}>
                {formatPrice(f.priceUSD)}
              </div>
              {f.isLowest && (
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-success)', background: 'rgba(16,185,129,0.1)', borderRadius: '3px', marginTop: '2px', padding: '1px 3px' }}>
                  LOWEST FARE
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exclusive Flash Offers & Coupons Carousel */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BadgePercent size={20} color="var(--brand-accent)" />
              Exclusive Flash Offers & Travel Coupons
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Apply promo codes at checkout for instant discounts on domestic & international flights
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {promoCoupons.map((coupon) => (
            <div key={coupon.code} className="travel-deal-box">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="travel-deal-tag">{coupon.tag}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{coupon.minSpend}</span>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {coupon.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {coupon.subtitle}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.9rem', color: 'var(--brand-accent)' }}>
                  {coupon.code}
                </div>
                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  style={{
                    background: copiedCoupon === coupon.code ? 'var(--color-success)' : 'var(--bg-card-subtle)',
                    color: copiedCoupon === coupon.code ? '#fff' : 'var(--text-main)',
                    border: '1px solid var(--border-color)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'var(--transition)'
                  }}
                >
                  {copiedCoupon === coupon.code ? (
                    <>
                      <Check size={12} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <span>Copy Code</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Results Section with Sidebar */}
      <div id="flight-results-section" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Sidebar Filters */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--brand-accent)" />
            Filter Flight Results
          </h3>

          {/* Stops */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="form-label" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Number of Stops</div>
            {[
              { val: 'all', label: 'All Flights' },
              { val: 'direct', label: 'Direct Non-Stop Only' },
              { val: 'onestop', label: '1 Stop Connect' }
            ].map(s => (
              <label key={s.val} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '0.86rem', color: 'var(--text-main)' }}>
                <input 
                  type="radio" 
                  name="stops" 
                  checked={filterStops === s.val}
                  onChange={() => setFilterStops(s.val as any)}
                  style={{ accentColor: 'var(--brand-accent)' }}
                />
                {s.label}
              </label>
            ))}
          </div>

          {/* Airline */}
          <div style={{ marginBottom: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div className="form-label" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Airlines</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '0.86rem', color: 'var(--text-main)' }}>
              <input type="radio" name="airline" checked={filterAirline === 'all'} onChange={() => setFilterAirline('all')} style={{ accentColor: 'var(--brand-accent)' }} />
              All Carriers
            </label>
            {availableAirlines.map(a => (
              <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '0.86rem', color: 'var(--text-main)' }}>
                <input type="radio" name="airline" checked={filterAirline === a} onChange={() => setFilterAirline(a)} style={{ accentColor: 'var(--brand-accent)' }} />
                {a}
              </label>
            ))}
          </div>

          {/* Refundable */}
          <div style={{ marginBottom: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', color: 'var(--text-main)' }}>
              <input 
                type="checkbox" 
                checked={filterRefundable} 
                onChange={(e) => setFilterRefundable(e.target.checked)} 
                style={{ accentColor: 'var(--brand-accent)' }}
              />
              <span>Refundable Fares Only</span>
            </label>
          </div>

          {/* Sorting */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div className="form-label" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Sort Results By</div>
            <select className="form-select" style={{ fontSize: '0.85rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="price">Lowest Airfare First</option>
              <option value="duration">Fastest / Shortest Duration</option>
            </select>
          </div>
        </div>

        {/* Flight Cards Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Active Corporate Policy Banner */}
          <div style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(37, 99, 235, 0.06)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.84rem',
            color: 'var(--brand-blue)'
          }}>
            <ShieldCheck size={18} />
            <span>
              <strong>Corporate Auto-Approval Active:</strong> Economy class tickets up to $750 are auto-approved per company travel policy. Instant e-ticket issued on booking.
            </span>
          </div>

          {filteredFlights.map((flight) => {
            const adjustedPrice = getMarkupAdjustedPrice(flight.basePriceUSD, 'flights');
            return (
              <FlightResultCard 
                key={flight.id} 
                flight={flight} 
                adjustedPrice={adjustedPrice}
                formatPrice={formatPrice}
                onBook={() => openCheckout(flight, 'flight')}
              />
            );
          })}

          {filteredFlights.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
              <Plane size={48} color="var(--brand-accent)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '1.1rem', color: 'var(--text-heading)', fontWeight: 800 }}>No flights found matching criteria</p>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Try switching stops or selecting all carriers above.</p>
            </div>
          )}
        </div>
      </div>

      {/* Popular Flight Routes Grid */}
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            Popular Domestic & International Flight Sectors
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Book the highest-demanded business, pilgrimage, and vacation corridors with TravelPulse special corporate & retail net fares
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {popularRoutes.map((route) => (
            <div 
              key={`${route.from}-${route.to}`}
              className="card"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onClick={() => {
                setOrigin(route.from);
                setDestination(route.to);
                const el = document.getElementById('flight-results-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', background: 'rgba(37,99,235,0.1)', color: 'var(--brand-blue)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                  {route.tag}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{route.duration}</span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                {route.fromCity} ({route.from}) → {route.toCity} ({route.to})
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fares From</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--brand-accent)' }}>
                  {formatPrice(route.fromPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Book With TravelPulse AI (Trust Signals) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="trust-badge-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(250,58,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-accent)' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-heading)', fontSize: '0.95rem' }}>Enterprise Travel Cloud</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Intelligent policy governance and multi-airline aggregation</div>
          </div>
        </div>

        <div className="trust-badge-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(5,150,105,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald-600)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-heading)', fontSize: '0.95rem' }}>IATA & Nusuk Authorized</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>100% genuine inventory directly from global aviation & hotel GDS</div>
          </div>
        </div>

        <div className="trust-badge-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-blue)' }}>
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-heading)', fontSize: '0.95rem' }}>Instant Refunds & PNR</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Automated instant cancellation and fast refunds directly to original source</div>
          </div>
        </div>

        <div className="trust-badge-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(217,119,6,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-500)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-heading)', fontSize: '0.95rem' }}>24/7 Human Concierge</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Direct phone assistance and airport emergency desk in 8 languages</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FlightResultCardProps {
  flight: FlightOption;
  adjustedPrice: number;
  formatPrice: (n: number) => string;
  onBook: () => void;
}

const FlightResultCard: React.FC<FlightResultCardProps> = ({ flight, adjustedPrice, formatPrice, onBook }) => {
  return (
    <div 
      className="card"
      style={{
        padding: '1.25rem 1.5rem',
        border: flight.inPolicy ? '1px solid var(--border-color)' : '1px solid rgba(245, 158, 11, 0.4)',
        transition: 'var(--transition)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        {/* Carrier Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '160px' }}>
          <img 
            src={flight.airlineLogo} 
            alt={flight.airline} 
            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-heading)', fontSize: '0.95rem' }}>{flight.airline}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              {flight.airlineCode} • {flight.cabinClass}
            </div>
          </div>
        </div>

        {/* Schedule & Stops */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'center' }}>
          {/* Departure */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-heading)' }}>
              {flight.departureTime}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {flight.origin} ({flight.originCity})
            </div>
          </div>

          {/* Flight Path Graphic */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '110px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{flight.duration}</span>
            <div style={{ width: '100%', height: '2px', background: 'var(--border-strong)', position: 'relative', margin: '6px 0' }}>
              <Plane size={14} color="var(--brand-accent)" style={{ position: 'absolute', top: '-6px', left: 'calc(50% - 7px)' }} />
            </div>
            <span style={{ 
              fontSize: '0.72rem', 
              color: flight.stops === 0 ? 'var(--color-success)' : 'var(--color-warning)', 
              fontWeight: 700 
            }}>
              {flight.stops === 0 ? 'Direct Non-Stop' : `${flight.stops} Stop`}
            </span>
          </div>

          {/* Arrival */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-heading)' }}>
              {flight.arrivalTime}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {flight.destination} ({flight.destinationCity})
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div style={{ textAlign: 'right', minWidth: '150px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-accent)', letterSpacing: '-0.02em' }}>
            {formatPrice(adjustedPrice)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            per adult • all taxes incl.
          </div>
          <button 
            className="btn btn-primary"
            onClick={onBook}
            style={{ 
              background: 'var(--brand-btn-gradient)', 
              padding: '0.55rem 1.4rem', 
              fontSize: '0.88rem', 
              fontWeight: 800,
              width: '100%',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(250,58,58,0.3)'
            }}
          >
            Book Flight
          </button>
        </div>
      </div>

      {/* Perks, Baggage & Corporate Policy Strip */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '1rem', 
        paddingTop: '0.75rem', 
        borderTop: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.76rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Luggage size={13} color="var(--brand-blue)" />
            {flight.baggageAllowance}
          </span>
          <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Utensils size={13} color="var(--gold-500)" />
            Complimentary Dining
          </span>
          <span style={{ color: flight.refundable ? 'var(--color-success)' : 'var(--text-muted)', fontWeight: 600 }}>
            {flight.refundable ? '✓ Refundable Fare' : 'Non-Refundable'}
          </span>
        </div>

        <div>
          {flight.inPolicy ? (
            <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} />
              <span>In Policy (Auto-Approved)</span>
            </span>
          ) : (
            <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={12} />
              <span>Policy Limit Exceeded</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

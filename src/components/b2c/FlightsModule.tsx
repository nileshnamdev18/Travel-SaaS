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
  Leaf,
  RefreshCw,
  Star,
  Clock,
  ChevronDown
} from 'lucide-react';

export const FlightsModule: React.FC = () => {
  const { flights, formatPrice, openCheckout, getMarkupAdjustedPrice } = useApp();

  const [searchParams, setSearchParams] = useState({
    origin: 'LHR',
    destination: 'DXB',
    departure: '2026-10-14',
    returnDate: '',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'oneway'
  });

  const [filterStops, setFilterStops] = useState<'all' | 'direct' | 'onestop'>('all');
  const [filterAirline, setFilterAirline] = useState<string>('all');
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');

  const origins = ['LHR', 'DXB', 'JFK', 'DEL', 'SIN', 'CDG'];
  const destinations = ['DXB', 'LHR', 'JED', 'SIN', 'CDG', 'DPS', 'HND'];

  const filteredFlights = flights
    .filter(f => {
      if (filterStops === 'direct' && f.stops !== 0) return false;
      if (filterStops === 'onestop' && f.stops !== 1) return false;
      if (filterAirline !== 'all' && f.airline !== filterAirline) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return getMarkupAdjustedPrice(a.basePriceUSD, 'flights') - getMarkupAdjustedPrice(b.basePriceUSD, 'flights');
      return parseInt(a.duration) - parseInt(b.duration);
    });

  const airlines = [...new Set(flights.map(f => f.airline))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brand-blue) 0%, #1e40af 60%, #0d9488 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=60) center/cover', opacity: 0.18 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Zap size={13} />
            <span>REAL-TIME PRICING • IATA/GDS SYNC</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Global Flights
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', maxWidth: '540px' }}>
            Compare fares across 100+ airlines. Corporate policy compliance checks built-in — in-policy fares highlighted automatically.
          </p>
        </div>
      </div>

      {/* Search Box */}
      <div className="card" style={{ padding: '1.5rem' }}>
        {/* Trip Type Toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          {['oneway', 'roundtrip'].map((t) => (
            <button
              key={t}
              onClick={() => setSearchParams({ ...searchParams, tripType: t })}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: searchParams.tripType === t ? '1px solid var(--brand-blue)' : '1px solid var(--border-color)',
                background: searchParams.tripType === t ? 'var(--brand-blue)' : 'var(--bg-card-subtle)',
                color: searchParams.tripType === t ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {t === 'oneway' ? 'One Way' : 'Round Trip'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">From</label>
            <select className="form-select" value={searchParams.origin} onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}>
              {origins.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">To</label>
            <select className="form-select" value={searchParams.destination} onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}>
              {destinations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Depart Date</label>
            <input type="date" className="form-input" value={searchParams.departure} onChange={(e) => setSearchParams({ ...searchParams, departure: e.target.value })} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Cabin Class</label>
            <select className="form-select" value={searchParams.cabinClass} onChange={(e) => setSearchParams({ ...searchParams, cabinClass: e.target.value })}>
              <option>Economy</option>
              <option>Premium Economy</option>
              <option>Business</option>
              <option>First</option>
            </select>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => setHasSearched(true)}
            style={{ padding: '0.7rem 1.5rem', whiteSpace: 'nowrap' }}
          >
            <Plane size={16} />
            <span>Search Flights</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Sidebar Filters */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} />
            Refine Results
          </h3>

          <div style={{ marginBottom: '1.25rem' }}>
            <div className="form-label" style={{ marginBottom: '0.5rem' }}>Stops</div>
            {[
              { val: 'all', label: 'All Flights' },
              { val: 'direct', label: 'Direct Only' },
              { val: 'onestop', label: '1 Stop' }
            ].map(s => (
              <label key={s.val} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                <input 
                  type="radio" 
                  name="stops" 
                  checked={filterStops === s.val}
                  onChange={() => setFilterStops(s.val as any)}
                  style={{ accentColor: 'var(--brand-blue)' }}
                />
                {s.label}
              </label>
            ))}
          </div>

          <div>
            <div className="form-label" style={{ marginBottom: '0.5rem' }}>Airline</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-main)' }}>
              <input type="radio" name="airline" checked={filterAirline === 'all'} onChange={() => setFilterAirline('all')} style={{ accentColor: 'var(--brand-blue)' }} />
              All Airlines
            </label>
            {airlines.map(a => (
              <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                <input type="radio" name="airline" checked={filterAirline === a} onChange={() => setFilterAirline(a)} style={{ accentColor: 'var(--brand-blue)' }} />
                {a}
              </label>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div className="form-label" style={{ marginBottom: '0.5rem' }}>Sort By</div>
            <select className="form-select" style={{ fontSize: '0.85rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="price">Lowest Price</option>
              <option value="duration">Shortest Duration</option>
            </select>
          </div>
        </div>

        {/* Flight Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Corporate Policy Info Banner */}
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(37, 99, 235, 0.06)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: 'var(--brand-blue)'
          }}>
            <ShieldCheck size={15} />
            <span><strong>Corporate Policy Active:</strong> Economy flights up to $750 per booking are automatically approved. Business class requires manager sign-off.</span>
          </div>

          {filteredFlights.map((flight) => {
            const adjustedPrice = getMarkupAdjustedPrice(flight.basePriceUSD, 'flights');
            return (
              <FlightCard 
                key={flight.id} 
                flight={flight} 
                adjustedPrice={adjustedPrice}
                formatPrice={formatPrice}
                onBook={() => openCheckout(flight, 'flight')}
              />
            );
          })}

          {filteredFlights.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Plane size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>No flights match your filters.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try adjusting airline or stop filters above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface FlightCardProps {
  flight: FlightOption;
  adjustedPrice: number;
  formatPrice: (n: number) => string;
  onBook: () => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, adjustedPrice, formatPrice, onBook }) => {
  return (
    <div 
      className="card"
      style={{
        padding: '1.25rem',
        border: flight.inPolicy ? '1px solid var(--border-color)' : '1px solid rgba(245, 158, 11, 0.4)',
        transition: 'var(--transition)',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        {/* Airline & Route */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          {/* Airline Block */}
          <div style={{ textAlign: 'center', minWidth: '70px' }}>
            <img 
              src={flight.airlineLogo} 
              alt={flight.airline}
              style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
            />
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px', fontWeight: 600 }}>
              {flight.airlineCode}
            </div>
          </div>

          {/* Departure */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>
              {flight.departureTime}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-blue)' }}>
              {flight.origin}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {flight.departureDate}
            </div>
          </div>

          {/* Duration / Stops */}
          <div style={{ flex: 1, textAlign: 'center', padding: '0 1rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {flight.duration}
            </div>
            <div style={{ position: 'relative', height: '2px', background: 'var(--border-color)' }}>
              <Plane size={14} color="var(--brand-blue)" style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: flight.stops === 0 ? 'var(--color-success)' : 'var(--color-warning)', marginTop: '4px', fontWeight: 600 }}>
              {flight.stops === 0 ? 'Non-Stop' : `${flight.stops} Stop`}
              {flight.stopCities && flight.stopCities.length > 0 && (
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 400 }}>
                  {flight.stopCities[0]}
                </div>
              )}
            </div>
          </div>

          {/* Arrival */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>
              {flight.arrivalTime}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-blue)' }}>
              {flight.destination}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {flight.cabinClass}
            </div>
          </div>
        </div>

        {/* Pricing & Booking */}
        <div style={{ textAlign: 'right', minWidth: '160px' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>
            {formatPrice(adjustedPrice)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            per person • {flight.baggageAllowance}
          </div>
          
          {/* Policy Badge */}
          {flight.inPolicy ? (
            <span className="policy-badge-in" style={{ marginBottom: '8px', display: 'inline-flex' }}>
              <ShieldCheck size={11} />
              In Policy
            </span>
          ) : (
            <span className="policy-badge-out" style={{ marginBottom: '8px', display: 'inline-flex' }}>
              <AlertTriangle size={11} />
              Needs Approval
            </span>
          )}

          <div style={{ marginBottom: '10px' }}></div>

          <button 
            className="btn btn-primary btn-sm"
            onClick={onBook}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Select Flight
          </button>

          {/* Quick Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            <span style={{ color: flight.refundable ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {flight.refundable ? '✓ Refundable' : '✗ Non-Refund'}
            </span>
            <span>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Leaf size={10} color="var(--color-success)" />
              {flight.carbonKg}kg CO₂
            </span>
            <span>·</span>
            <span>{flight.seatsAvailable} seats left</span>
          </div>
        </div>
      </div>

      {/* Policy Note */}
      {flight.policyNote && (
        <div style={{
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.78rem',
          color: flight.inPolicy ? 'var(--color-success)' : 'var(--color-warning)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {flight.inPolicy ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
          {flight.policyNote}
        </div>
      )}
    </div>
  );
};

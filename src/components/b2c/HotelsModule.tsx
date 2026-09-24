import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HotelOption, HotelRoomTier } from '../../types';
import { 
  Building, 
  Star, 
  MapPin, 
  Wifi, 
  Coffee, 
  ShieldCheck, 
  AlertTriangle, 
  Filter, 
  Search,
  ChevronDown,
  ChevronUp,
  Heart,
  Award
} from 'lucide-react';

export const HotelsModule: React.FC = () => {
  const { hotels, formatPrice, openCheckout, getMarkupAdjustedPrice, corporatePolicy } = useApp();

  const [searchCity, setSearchCity] = useState('');
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [filterNearHaram, setFilterNearHaram] = useState(false);
  const [filterInPolicy, setFilterInPolicy] = useState(false);
  const [expandedHotel, setExpandedHotel] = useState<string | null>(null);

  const cities = [...new Set(hotels.map(h => h.city))];

  const filteredHotels = hotels.filter(h => {
    if (searchCity && h.city !== searchCity) return false;
    if (filterStars && h.starRating < filterStars) return false;
    if (filterNearHaram && !h.distanceToHaramMeters) return false;
    if (filterInPolicy && !h.inPolicy) return false;
    return true;
  });

  const getReviewLabel = (score: number) => {
    if (score >= 9.5) return 'Exceptional';
    if (score >= 9.0) return 'Superb';
    if (score >= 8.5) return 'Fabulous';
    if (score >= 8.0) return 'Very Good';
    return 'Good';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0d9488 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '45%', background: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60) center/cover', opacity: 0.2 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Award size={13} />
            <span>1M+ VERIFIED GUEST REVIEWS • FREE CANCELLATION ON MOST ROOMS</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            World-Class Hotels
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', maxWidth: '540px' }}>
            From Haram-courtyard suites in Makkah to iconic beachfront villas in Bali — discover premium stays with real-time corporate policy checking.
          </p>
        </div>
      </div>

      {/* Search & Filter Row */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Destination City</label>
            <select className="form-select" value={searchCity} onChange={(e) => setSearchCity(e.target.value)}>
              <option value="">All Destinations</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Check-In Date</label>
            <input type="date" className="form-input" defaultValue="2026-10-15" />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Check-Out Date</label>
            <input type="date" className="form-input" defaultValue="2026-10-18" />
          </div>

          <button className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', whiteSpace: 'nowrap' }}>
            <Search size={16} />
            <span>Search Hotels</span>
          </button>
        </div>

        {/* Quick Filter Toggles */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {[5, 4, 3].map(stars => (
            <button
              key={stars}
              onClick={() => setFilterStars(filterStars === stars ? null : stars)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: filterStars === stars ? '1px solid var(--gold-500)' : '1px solid var(--border-color)',
                background: filterStars === stars ? 'rgba(217, 119, 6, 0.1)' : 'var(--bg-card-subtle)',
                color: filterStars === stars ? 'var(--gold-500)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {stars}★ & Above
            </button>
          ))}
          <button
            onClick={() => setFilterNearHaram(!filterNearHaram)}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: filterNearHaram ? '1px solid var(--visa-teal)' : '1px solid var(--border-color)',
              background: filterNearHaram ? 'rgba(13, 148, 136, 0.1)' : 'var(--bg-card-subtle)',
              color: filterNearHaram ? 'var(--visa-teal)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            Near Haram Only
          </button>
          <button
            onClick={() => setFilterInPolicy(!filterInPolicy)}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: filterInPolicy ? '1px solid var(--color-success)' : '1px solid var(--border-color)',
              background: filterInPolicy ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card-subtle)',
              color: filterInPolicy ? 'var(--color-success)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ShieldCheck size={13} />
            In-Policy Only
          </button>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {/* Policy Notice */}
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(13, 148, 136, 0.06)',
          border: '1px solid rgba(13, 148, 136, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: 'var(--visa-teal)'
        }}>
          <ShieldCheck size={15} />
          <span>
            <strong>Policy Cap: ${corporatePolicy.maxHotelNightlyUSD}/night.</strong> Hotels with green shields are auto-approved. Others require manager sign-off.
          </span>
        </div>

        {filteredHotels.map((hotel) => {
          const adjustedPrice = getMarkupAdjustedPrice(hotel.basePriceUSD, 'hotels');
          const isExpanded = expandedHotel === hotel.id;

          return (
            <div key={hotel.id} className="card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {/* Hero Image */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img 
                    src={hotel.heroImage} 
                    alt={hotel.name}
                    style={{ width: '220px', height: '170px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <button style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <Heart size={14} color="#ef4444" />
                  </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      {/* Stars */}
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                        {Array.from({ length: hotel.starRating }).map((_, i) => (
                          <Star key={i} size={13} fill="var(--gold-500)" color="var(--gold-500)" />
                        ))}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '4px' }}>
                        {hotel.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <MapPin size={13} color="var(--brand-blue)" />
                        <span>{hotel.address}</span>
                      </div>
                      {hotel.distanceToHaramLabel && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--visa-teal)', marginTop: '4px', fontWeight: 600 }}>
                          <span>🕌</span>
                          <span>{hotel.distanceToHaramLabel}</span>
                        </div>
                      )}
                    </div>

                    {/* Review Score & Price */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', marginBottom: '6px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {getReviewLabel(hotel.reviewScore)}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {hotel.reviewCount.toLocaleString()} reviews
                          </div>
                        </div>
                        <div style={{
                          background: 'var(--brand-blue)',
                          color: '#fff',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 800,
                          fontSize: '1rem'
                        }}>
                          {hotel.reviewScore}
                        </div>
                      </div>

                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>
                        {formatPrice(adjustedPrice)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        per night · incl. taxes
                      </div>

                      {hotel.inPolicy ? (
                        <span className="policy-badge-in">
                          <ShieldCheck size={11} />
                          In Corporate Policy
                        </span>
                      ) : (
                        <span className="policy-badge-out">
                          <AlertTriangle size={11} />
                          Approval Required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {hotel.tags.map(tag => (
                      <span key={tag} className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Amenities Preview */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {hotel.amenities.slice(0, 4).map(a => (
                      <span key={a} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ color: 'var(--color-success)' }}>✓</span> {a}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => openCheckout(hotel, 'hotel')}
                    >
                      Reserve Room
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setExpandedHotel(isExpanded ? null : hotel.id)}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      <span>{isExpanded ? 'Less Details' : 'View Rooms'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Room Tiers */}
              {isExpanded && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.75rem' }}>
                    Available Room Types
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem' }}>
                    {hotel.rooms.map((room) => {
                      const roomPrice = getMarkupAdjustedPrice(room.pricePerNightUSD, 'hotels');
                      return (
                        <div key={room.id} style={{
                          background: 'var(--bg-card-subtle)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem',
                          display: 'flex',
                          gap: '0.75rem'
                        }}>
                          <img 
                            src={room.image} 
                            alt={room.title}
                            style={{ width: '80px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                              {room.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                              {room.bedType} · Max {room.maxGuests} guests
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                              {room.freeBreakfast && (
                                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  <Coffee size={10} /> Breakfast Incl.
                                </span>
                              )}
                              {room.freeCancellation && (
                                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--brand-blue)' }}>
                                  ✓ Free Cancellation
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand-blue)' }}>
                                {formatPrice(roomPrice)}
                                <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>/night</span>
                              </div>
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => openCheckout({ ...hotel, basePriceUSD: room.pricePerNightUSD }, 'hotel')}
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredHotels.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Building size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>No hotels match your filters.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try changing the destination or remove star rating filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

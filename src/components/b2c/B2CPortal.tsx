import React, { useState } from 'react';
import { FlightsModule } from './FlightsModule';
import { HotelsModule } from './HotelsModule';
import { UmrahModule } from './UmrahModule';
import { VisaModule } from './VisaModule';
import { HolidaysModule } from './HolidaysModule';
import { MiceModule } from './MiceModule';
import { 
  Plane, 
  Building, 
  Sparkles, 
  FileText, 
  Palmtree, 
  Briefcase,
  Flame,
  BadgePercent
} from 'lucide-react';

type VerticalType = 'flights' | 'hotels' | 'holidays' | 'umrah' | 'visa' | 'mice';

export const B2CPortal: React.FC = () => {
  const [activeVertical, setActiveVertical] = useState<VerticalType>('flights');

  const services: { 
    id: VerticalType; 
    label: string; 
    icon: React.ReactNode; 
    tag?: string; 
    tagColor?: string;
  }[] = [
    { id: 'flights', label: 'Flights', icon: <Plane size={18} />, tag: 'Cheapest Fares', tagColor: 'var(--brand-accent)' },
    { id: 'hotels', label: 'Hotels', icon: <Building size={18} />, tag: 'Up to 25% Off' },
    { id: 'holidays', label: 'Holidays', icon: <Palmtree size={18} />, tag: 'Custom Tour' },
    { id: 'umrah', label: 'Umrah & Hajj', icon: <Sparkles size={18} color="var(--gold-500)" />, tag: 'Nusuk Sync', tagColor: 'var(--emerald-600)' },
    { id: 'visa', label: 'e-Visas & OCR', icon: <FileText size={18} />, tag: '24h Express' },
    { id: 'mice', label: 'M.I.C.E. Corporate', icon: <Briefcase size={18} />, tag: 'Group RFP' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Universal Travel Services Navigation Bar */}
      <div 
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '0.65rem 1rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="travel-services-bar">
          {services.map(s => {
            const isActive = activeVertical === s.id;
            return (
              <button
                key={s.id}
                className={`travel-service-item ${isActive ? (s.id === 'umrah' ? 'active-umrah' : 'active') : ''}`}
                onClick={() => setActiveVertical(s.id)}
              >
                {s.icon}
                <span>{s.label}</span>
                {s.tag && (
                  <span 
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      background: isActive ? 'rgba(255,255,255,0.25)' : (s.tagColor ? `${s.tagColor}15` : 'var(--bg-card-subtle)'),
                      color: isActive ? '#ffffff' : (s.tagColor || 'var(--text-muted)'),
                      marginLeft: '2px',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {s.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Vertical */}
      {activeVertical === 'flights' && <FlightsModule />}
      {activeVertical === 'hotels' && <HotelsModule />}
      {activeVertical === 'holidays' && <HolidaysModule />}
      {activeVertical === 'umrah' && <UmrahModule />}
      {activeVertical === 'visa' && <VisaModule />}
      {activeVertical === 'mice' && <MiceModule />}
    </div>
  );
};

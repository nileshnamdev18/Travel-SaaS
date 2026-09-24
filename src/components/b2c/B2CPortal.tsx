import React, { useState } from 'react';
import { FlightsModule } from './FlightsModule';
import { HotelsModule } from './HotelsModule';
import { UmrahModule } from './UmrahModule';
import { VisaModule } from './VisaModule';
import { HolidaysModule } from './HolidaysModule';
import { MiceModule } from './MiceModule';
import { Plane, Building, Sparkles, FileText, Palmtree, Briefcase } from 'lucide-react';

type VerticalType = 'flights' | 'hotels' | 'umrah' | 'visa' | 'holidays' | 'mice';

export const B2CPortal: React.FC = () => {
  const [activeVertical, setActiveVertical] = useState<VerticalType>('flights');

  const verticals: { id: VerticalType; label: string; icon: React.ReactNode; activeClass: string }[] = [
    { id: 'flights', label: 'Flights', icon: <Plane size={16} />, activeClass: 'active' },
    { id: 'hotels', label: 'Hotels', icon: <Building size={16} />, activeClass: 'active' },
    { id: 'umrah', label: 'Corporate Umrah', icon: <Sparkles size={16} color="var(--gold-500)" />, activeClass: 'active-umrah' },
    { id: 'visa', label: 'Global Visas & OCR', icon: <FileText size={16} />, activeClass: 'active' },
    { id: 'holidays', label: 'Holidays', icon: <Palmtree size={16} />, activeClass: 'active' },
    { id: 'mice', label: 'M.I.C.E. Copilot', icon: <Briefcase size={16} />, activeClass: 'active' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Verticals Navigation */}
      <div className="verticals-nav">
        {verticals.map(v => (
          <button
            key={v.id}
            className={`vertical-pill ${activeVertical === v.id ? `active ${v.activeClass}` : ''}`}
            onClick={() => setActiveVertical(v.id)}
          >
            {v.icon}
            <span>{v.label}</span>
          </button>
        ))}
      </div>

      {/* Render Active Vertical */}
      {activeVertical === 'flights' && <FlightsModule />}
      {activeVertical === 'hotels' && <HotelsModule />}
      {activeVertical === 'umrah' && <UmrahModule />}
      {activeVertical === 'visa' && <VisaModule />}
      {activeVertical === 'holidays' && <HolidaysModule />}
      {activeVertical === 'mice' && <MiceModule />}
    </div>
  );
};

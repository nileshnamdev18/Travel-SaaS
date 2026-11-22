import React, { useState } from 'react';
import { FlightsModule } from './FlightsModule';
import { HotelsModule } from './HotelsModule';
// import { UmrahModule } from './UmrahModule'; // COMMENTED OUT - not in scope for this version
import { VisaModule } from './VisaModule';
import { HolidaysModule } from './HolidaysModule';
// import { MiceModule } from './MiceModule'; // COMMENTED OUT - not in scope for this version
import { ChatbotModule } from './ChatbotModule';
import { CustomTripModule } from './CustomTripModule';
import { 
  Plane, 
  Building, 
  Sparkles, 
  FileText, 
  Palmtree, 
  MessageSquare
} from 'lucide-react';

type VerticalType = 'flights' | 'hotels' | 'visa' | 'holidays' | 'chatbot' | 'custom_trip';

export const B2CPortal: React.FC = () => {
  const [activeVertical, setActiveVertical] = useState<VerticalType>('flights');

  const services: { 
    id: VerticalType; 
    label: string; 
    icon: React.ReactNode; 
    tag?: string; 
    tagColor?: string;
  }[] = [
    { id: 'flights', label: 'Flights', icon: <Plane size={18} />, tag: 'Akbar Travels', tagColor: '#c0392b' },
    { id: 'hotels', label: 'Hotels', icon: <Building size={18} />, tag: 'Akbar Travels' },
    { id: 'visa', label: 'e-Visa & OCR', icon: <FileText size={18} />, tag: 'Atlys Partner', tagColor: '#7c3aed' },
    { id: 'holidays', label: 'Holiday Packages', icon: <Palmtree size={18} />, tag: 'TravelPulse', tagColor: '#d97706' },
    { id: 'chatbot', label: 'Get Quote', icon: <MessageSquare size={18} />, tag: 'WhatsApp', tagColor: '#25D366' },
    { id: 'custom_trip', label: 'Customize Trip', icon: <Sparkles size={18} />, tag: 'AI Agent', tagColor: '#7c3aed' },
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
                className={`travel-service-item ${isActive ? 'active' : ''}`}
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
      {activeVertical === 'visa' && <VisaModule />}
      {activeVertical === 'holidays' && <HolidaysModule />}
      {activeVertical === 'chatbot' && <ChatbotModule />}
      {activeVertical === 'custom_trip' && <CustomTripModule />}
      {/* {activeVertical === 'umrah' && <UmrahModule />} */}
      {/* {activeVertical === 'mice' && <MiceModule />} */}
    </div>
  );
};

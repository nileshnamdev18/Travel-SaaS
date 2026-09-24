import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NavigationBar } from './components/common/NavigationBar';
import { NotificationModal } from './components/common/NotificationModal';
import { AuditLogDrawer } from './components/common/AuditLogDrawer';
import { CheckoutModal } from './components/common/CheckoutModal';
import { MyTripsDrawer } from './components/common/MyTripsDrawer';
import { B2CPortal } from './components/b2c/B2CPortal';
import { B2BAgencyPanel } from './components/b2b/B2BAgencyPanel';
import { SuperAdminPanel } from './components/admin/SuperAdminPanel';
import { Sparkles, Shield, Heart, Compass } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activePortal } = useApp();

  return (
    <div className="app-container">
      {/* Persistent Universal Navigation */}
      <NavigationBar />

      {/* Main Content Area */}
      <main className="main-content">
        {activePortal === 'b2c' && <B2CPortal />}
        {activePortal === 'b2b' && <B2BAgencyPanel />}
        {activePortal === 'admin' && <SuperAdminPanel />}
      </main>

      {/* Comprehensive Travel SaaS OTA Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-color)', 
        padding: '3.5rem 1.5rem 2rem', 
        background: 'var(--bg-card)', 
        marginTop: '5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Top Brand Strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #032559 0%, #fa3a3a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 900
                }}>
                  <Compass size={18} />
                </div>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>TRAVEL</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--brand-accent)', letterSpacing: '-0.02em' }}>PULSE</span>
                <span style={{ fontSize: '0.65rem', background: 'rgba(37,99,235,0.1)', color: 'var(--brand-blue)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                  Global Platform • SaaS
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '600px' }}>
                TravelPulse AI is a global enterprise & consumer travel booking platform. Book cheap flight tickets, domestic and international hotels, curated holidays, holy Umrah packages, and instant global visas with corporate travel policy governance.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-heading)' }}>Global Concierge</div>
                <div style={{ color: 'var(--brand-accent)', fontWeight: 700, marginTop: '2px' }}>+1 (800) 550-7857</div>
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-heading)' }}>Direct Support</div>
                <div style={{ color: 'var(--brand-blue)', fontWeight: 700, marginTop: '2px' }}>+91 22 4066 6400</div>
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-heading)' }}>WhatsApp Desk</div>
                <div style={{ color: 'var(--color-success)', fontWeight: 700, marginTop: '2px' }}>+1 (555) 019-2834</div>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', fontSize: '0.82rem' }}>
            {/* Col 1: Domestic Routes */}
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Domestic Flights
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                <li>Flights to Mumbai (BOM)</li>
                <li>Flights to New Delhi (DEL)</li>
                <li>Flights to Bengaluru (BLR)</li>
                <li>Flights to Goa (GOI)</li>
                <li>Flights to Hyderabad (HYD)</li>
                <li>Flights to Chennai (MAA)</li>
              </ul>
            </div>

            {/* Col 2: International Routes */}
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                International Flights
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                <li>Mumbai to Dubai Flights</li>
                <li>Delhi to London Heathrow</li>
                <li>Mumbai to Jeddah (Umrah)</li>
                <li>Delhi to Bangkok Flights</li>
                <li>Bengaluru to Singapore</li>
                <li>Kochi to Doha Flights</li>
              </ul>
            </div>

            {/* Col 3: Holy Umrah & Ziyarah */}
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Holy Umrah Packages
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                <li>5-Star Clock Tower Umrah</li>
                <li>Super Saver 14-Day Group</li>
                <li>Customized Family Umrah</li>
                <li>Saudi Nusuk Permit Sync</li>
                <li>Makkah to Madinah Transfers</li>
                <li>Direct Saudia Umrah PNR</li>
              </ul>
            </div>

            {/* Col 4: Corporate & Security */}
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Corporate B2B & Governance
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                <li>Corporate Travel Approvals</li>
                <li>Automated Policy Cap Engine</li>
                <li>SME Credit Line & Wallet</li>
                <li>IATA Accredited Platform</li>
                <li>256-Bit SSL & PCI-DSS Token</li>
                <li>Instant Automated Refunds</li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Badges */}
          <div style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '1.5rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <div>
              © 2026 TravelPulse AI Inc. All rights reserved. Enterprise Global Travel Management System.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms & Conditions</span>
              <span>•</span>
              <span>User Agreement</span>
              <span>•</span>
              <span>IATA No: 14-3 0184 2</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Universal Modals & Drawers */}
      <NotificationModal />
      <AuditLogDrawer />
      <CheckoutModal />
      <MyTripsDrawer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

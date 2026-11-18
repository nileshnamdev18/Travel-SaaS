import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NavigationBar } from './components/common/NavigationBar';
import { NotificationModal } from './components/common/NotificationModal';
import { AuditLogDrawer } from './components/common/AuditLogDrawer';
import { CheckoutModal } from './components/common/CheckoutModal';
import { MyTripsDrawer } from './components/common/MyTripsDrawer';
import { B2CPortal } from './components/b2c/B2CPortal';
// import { B2BAgencyPanel } from './components/b2b/B2BAgencyPanel'; // B2B Panel commented out - not needed
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
        {(activePortal === 'customer' || (activePortal as string) === 'b2c') && <B2CPortal />}
        {/* B2B Portal commented out - not needed */}
        {/* {activePortal === 'b2b' && <B2BAgencyPanel />} */}
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
                  Global Platform â€¢ SaaS
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '600px' }}>
                TravelPulse AI is your all-in-one travel booking platform. Find cheap flights, hotels, curated holiday packages, instant e-Visas, and get personalized trip quotes — all in one place.
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

            {/* Col 3: Holiday Packages */}
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Holiday Packages
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                <li>Maldives Beach Retreats</li>
                <li>Europe Multi-City Tours</li>
                <li>Dubai Luxury Packages</li>
                <li>Thailand Family Holidays</li>
                <li>Kashmir Honeymoon Tours</li>
                <li>Bali All-Inclusive Deals</li>
              </ul>
            </div>

            {/* Col 4: Customer Support */}
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Support & Security
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                <li>24x7 Customer Support</li>
                <li>WhatsApp Travel Assistance</li>
                <li>Instant Refunds & Rebooking</li>
                <li>IATA Accredited Platform</li>
                <li>256-Bit SSL & PCI-DSS</li>
                <li>Secure Payment Gateway</li>
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
              Â© 2026 TravelPulse AI Inc. All rights reserved. Your trusted travel booking partner.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Privacy Policy</span>
              <span>â€¢</span>
              <span>Terms & Conditions</span>
              <span>â€¢</span>
              <span>User Agreement</span>
              <span>â€¢</span>
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




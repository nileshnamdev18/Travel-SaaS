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
import { Sparkles, Shield, Heart } from 'lucide-react';

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

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-dark)', padding: '2rem 1.5rem', background: 'rgba(5, 8, 14, 0.95)', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#ffffff' }}>
              <Sparkles size={16} color="var(--gold-400)" />
              <span>TRAVELPULSE AI</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 400 }}>Dual-Mode B2B/B2C Architecture</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Compliant with PCI-DSS Tokenization, ICAO Doc 9303 Biometric Standards, and Saudi MOFA Nusuk Protocol.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>UmrahCenter & Visa2Fly Benchmarked Architecture</span>
            <span>•</span>
            <span>Version 1.0 (Phase 1 Engineering Build)</span>
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

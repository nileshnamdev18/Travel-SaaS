import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Download, 
  Send, 
  CheckCheck, 
  Smartphone, 
  Mail, 
  Share2, 
  CheckCircle2, 
  FileCheck 
} from 'lucide-react';
import { PdfEngine } from '../../services/pdfGenerator';
import confetti from 'canvas-confetti';

export const NotificationModal: React.FC = () => {
  const { activeModal, closeModal, updateQuotationDelivery } = useApp();
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'email' | 'download'>('whatsapp');
  const [recipientPhone, setRecipientPhone] = useState('+966 50 123 4567');
  const [recipientEmail, setRecipientEmail] = useState('traveler.client@domain.com');
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'sending' | 'delivered'>('idle');

  if (activeModal.type !== 'package_delivery') return null;

  const quoteOrPkg = activeModal.data;

  const handleDownloadPdf = () => {
    if (quoteOrPkg && 'quoteNumber' in quoteOrPkg) {
      PdfEngine.generateWhiteLabelQuotation(quoteOrPkg);
      updateQuotationDelivery(quoteOrPkg.id, 'download');
    } else if (quoteOrPkg) {
      PdfEngine.generateItineraryVoucher(quoteOrPkg, 2, 'Ahmed Al-Mansoor');
    }
  };

  const handleSimulateSend = (channel: 'whatsapp' | 'email') => {
    setDispatchStatus('sending');
    setTimeout(() => {
      setDispatchStatus('delivered');
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      if (quoteOrPkg && 'id' in quoteOrPkg) {
        updateQuotationDelivery(quoteOrPkg.id, channel);
      }
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'rgba(42, 157, 143, 0.2)', padding: '6px', borderRadius: '8px', color: 'var(--visa-teal)' }}>
              <Share2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Dynamic Package & Quotation Dispatch</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Multi-Channel Delivery Engine (WhatsApp Business API, Email & PDF - Sec 6)
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        {/* Channel Selection Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button 
            className="btn btn-sm"
            onClick={() => { setSelectedChannel('whatsapp'); setDispatchStatus('idle'); }}
            style={{
              flex: 1,
              background: selectedChannel === 'whatsapp' ? 'rgba(37, 211, 102, 0.15)' : 'transparent',
              borderColor: selectedChannel === 'whatsapp' ? '#25D366' : 'transparent',
              color: selectedChannel === 'whatsapp' ? '#25D366' : 'var(--text-muted)'
            }}
          >
            <Smartphone size={16} />
            <span>WhatsApp Business API</span>
          </button>

          <button 
            className="btn btn-sm"
            onClick={() => { setSelectedChannel('email'); setDispatchStatus('idle'); }}
            style={{
              flex: 1,
              background: selectedChannel === 'email' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              borderColor: selectedChannel === 'email' ? '#3B82F6' : 'transparent',
              color: selectedChannel === 'email' ? '#93c5fd' : 'var(--text-muted)'
            }}
          >
            <Mail size={16} />
            <span>Official Email Dispatch</span>
          </button>

          <button 
            className="btn btn-sm"
            onClick={() => { setSelectedChannel('download'); setDispatchStatus('idle'); }}
            style={{
              flex: 1,
              background: selectedChannel === 'download' ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
              borderColor: selectedChannel === 'download' ? 'var(--gold-500)' : 'transparent',
              color: selectedChannel === 'download' ? 'var(--gold-300)' : 'var(--text-muted)'
            }}
          >
            <Download size={16} />
            <span>Instant PDF Download</span>
          </button>
        </div>

        {/* Channel Body */}
        {selectedChannel === 'whatsapp' && (
          <div>
            <div className="form-group">
              <label className="form-label">Recipient Mobile (Editable to redirect to End-Client)</label>
              <input 
                type="text" 
                className="form-input" 
                value={recipientPhone} 
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="+966 50 XXX XXXX"
              />
            </div>

            {/* WhatsApp Phone Mock Preview */}
            <div style={{ background: '#0b141a', border: '1px solid #1f2c34', borderRadius: '14px', padding: '1rem', marginTop: '1rem', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #1f2c34', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                  WA
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e9edef' }}>TravelPulse Business Dispatch (Verified)</div>
                  <div style={{ fontSize: '0.7rem', color: '#8696a0' }}>Active API Gateway v2.4</div>
                </div>
              </div>

              {/* Message Bubble */}
              <div style={{ background: '#005c4b', color: '#e9edef', padding: '0.75rem 1rem', borderRadius: '8px 8px 0 8px', maxWidth: '85%', marginLeft: 'auto', fontSize: '0.85rem' }}>
                <p>Assalamu Alaikum / Greetings! 🌟</p>
                <p style={{ marginTop: '4px' }}>
                  Here is your official travel proposal & confirmed package documentation from <strong>{quoteOrPkg?.agencyBrandingSnapshot?.agencyName || 'Al-Safwa Global Travel'}</strong>.
                </p>
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '6px 10px', borderRadius: '6px', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck size={20} color="#25D366" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>Package_Proposal_Official.pdf</div>
                    <div style={{ fontSize: '0.7rem', color: '#aebac1' }}>1.4 MB • Complete with Itinerary & QR Code</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#aebac1', marginTop: '4px' }}>
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <CheckCheck size={14} color="#53bdeb" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button 
                className="btn btn-primary-teal" 
                onClick={() => handleSimulateSend('whatsapp')}
                disabled={dispatchStatus === 'sending'}
              >
                {dispatchStatus === 'sending' ? (
                  <span>Dispatching via WhatsApp API...</span>
                ) : dispatchStatus === 'delivered' ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Dispatched & Read Receipt Logged!
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Send size={16} /> Send via WhatsApp Business
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {selectedChannel === 'email' && (
          <div>
            <div className="form-group">
              <label className="form-label">Recipient Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={recipientEmail} 
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-dark)', borderRadius: '10px', padding: '1rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Subject: <strong>Your Confirmed Travel Package Quotation #{quoteOrPkg?.quoteNumber || 'REF-2026-99'}</strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Attaching official PDF document with encrypted security watermark and dynamic QR code.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button 
                className="btn btn-primary-teal"
                onClick={() => handleSimulateSend('email')}
                disabled={dispatchStatus === 'sending'}
              >
                {dispatchStatus === 'sending' ? (
                  <span>Sending Branded Email...</span>
                ) : dispatchStatus === 'delivered' ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Email Delivered Successfully!
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Send size={16} /> Send Branded Email
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {selectedChannel === 'download' && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--gold-400)' }}>
              <Download size={32} />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Direct Vector PDF Export</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              High-resolution print-ready PDF generated directly in-browser using the client-side vector engine.
            </p>
            <button className="btn btn-primary-gold btn-lg" onClick={handleDownloadPdf}>
              <Download size={18} /> Download Generated PDF Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

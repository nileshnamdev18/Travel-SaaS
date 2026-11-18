import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Download, 
  CheckCircle2, 
  User, 
  Bot, 
  Sparkles,
  Calendar,
  Users,
  MapPin,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface LeadInquiry {
  id: string;
  name: string;
  phone: string;
  travelType: 'Domestic' | 'International';
  destination: string;
  travelDates: string;
  travelers: string;
  service: string;
  notes: string;
  timestamp: string;
}

const WHATSAPP_SUPPORT_NUMBER = '919876543210'; // Akbar Travels / TravelPulse Desk

export const ChatbotModule: React.FC = () => {
  const [inquiries, setInquiries] = useState<LeadInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('tp_chatbot_inquiries');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 'inq-101',
        name: 'Rahul Sharma',
        phone: '+91 98201 54321',
        travelType: 'Domestic',
        destination: 'Goa',
        travelDates: '10 Dec - 15 Dec 2026',
        travelers: '2 Adults',
        service: 'Flights + Hotel',
        notes: 'Near Baga beach, morning flight preference',
        timestamp: '2026-11-14 14:30'
      },
      {
        id: 'inq-102',
        name: 'Priya Mehta',
        phone: '+91 98112 98765',
        travelType: 'International',
        destination: 'Dubai, UAE',
        travelDates: '22 Dec - 28 Dec 2026',
        travelers: '4 (Family)',
        service: 'Visa + Holiday Package',
        notes: 'Desert safari and Burj Khalifa tickets required',
        timestamp: '2026-11-15 09:15'
      }
    ];
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    travelType: 'Domestic' as 'Domestic' | 'International',
    destination: '',
    travelDates: '',
    travelers: '2 Adults',
    service: 'Flights + Hotel',
    notes: ''
  });

  const [submittedLead, setSubmittedLead] = useState<LeadInquiry | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to Akbar Travels & TravelPulse 24x7 Travel Desk. Share your trip details below to get an instant WhatsApp quote and export your inquiry.',
      time: 'Just now'
    }
  ]);

  const saveInquiries = (updated: LeadInquiry[]) => {
    setInquiries(updated);
    try {
      localStorage.setItem('tp_chatbot_inquiries', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.destination.trim()) {
      alert('Please fill in your Name, Phone Number, and Destination.');
      return;
    }

    const newInquiry: LeadInquiry = {
      id: `inq-${Date.now()}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      travelType: formData.travelType,
      destination: formData.destination.trim(),
      travelDates: formData.travelDates.trim() || 'Flexible dates',
      travelers: formData.travelers,
      service: formData.service,
      notes: formData.notes.trim() || 'No special requirements',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    const updated = [newInquiry, ...inquiries];
    saveInquiries(updated);
    setSubmittedLead(newInquiry);

    // Add to chat conversation
    setChatHistory(prev => [
      ...prev,
      {
        sender: 'user',
        text: `Trip Inquiry: ${newInquiry.travelType} to ${newInquiry.destination} for ${newInquiry.name} (${newInquiry.phone}). Dates: ${newInquiry.travelDates}. Service: ${newInquiry.service}`,
        time: 'Just now'
      },
      {
        sender: 'bot',
        text: `Thank you ${newInquiry.name}! Your inquiry for ${newInquiry.destination} (${newInquiry.travelType}) has been logged successfully. An Akbar Travels agent will reach out via WhatsApp at ${newInquiry.phone}. You can also click below to chat on WhatsApp immediately!`,
        time: 'Just now'
      }
    ]);

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleOpenWhatsApp = (lead: LeadInquiry) => {
    const message = 
      `*New Travel Inquiry - Akbar Travels / TravelPulse*%0A%0A` +
      `*Name:* ${encodeURIComponent(lead.name)}%0A` +
      `*Phone:* ${encodeURIComponent(lead.phone)}%0A` +
      `*Trip Type:* ${encodeURIComponent(lead.travelType)}%0A` +
      `*Destination:* ${encodeURIComponent(lead.destination)}%0A` +
      `*Dates:* ${encodeURIComponent(lead.travelDates)}%0A` +
      `*Travelers:* ${encodeURIComponent(lead.travelers)}%0A` +
      `*Service Required:* ${encodeURIComponent(lead.service)}%0A` +
      `*Notes:* ${encodeURIComponent(lead.notes)}%0A%0A` +
      `Please provide the best quote and flight/hotel availability!`;

    window.open(`https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${message}`, '_blank');
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      alert('No inquiries to export.');
      return;
    }

    const headers = ['Inquiry ID', 'Customer Name', 'Phone Number', 'Trip Type', 'Destination', 'Travel Dates', 'Travelers', 'Service Required', 'Notes', 'Submission Timestamp'];
    
    const rows = inquiries.map(i => [
      `"${i.id}"`,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.phone.replace(/"/g, '""')}"`,
      `"${i.travelType}"`,
      `"${i.destination.replace(/"/g, '""')}"`,
      `"${i.travelDates.replace(/"/g, '""')}"`,
      `"${i.travelers.replace(/"/g, '""')}"`,
      `"${i.service.replace(/"/g, '""')}"`,
      `"${i.notes.replace(/"/g, '""')}"`,
      `"${i.timestamp}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TravelPulse_Akbar_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteInquiry = (id: string) => {
    const updated = inquiries.filter(i => i.id !== id);
    saveInquiries(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #128C7E 0%, #075E54 50%, #032559 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <MessageSquare size={14} />
              Akbar Travels 24x7 WhatsApp Desk & CRM
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
              Travel Inquiry & WhatsApp Lead Bot
            </h1>
            <p style={{ fontSize: '0.95rem', opacity: 0.9, maxWidth: '600px', marginTop: '0.5rem', lineHeight: 1.5 }}>
              Enter traveler details, select domestic or international travel, send straight to official WhatsApp, and export full leads to a spreadsheet CSV.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                color: '#075E54',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <FileSpreadsheet size={18} color="#075E54" />
              Export Inquiries (CSV)
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Inquiry Form */}
        <div 
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(37,211,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#25D366" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                Submit Travel Requirements
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Get direct agent response via WhatsApp & Email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Trip Type Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '6px' }}>
                Trip Classification *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, travelType: 'Domestic' }))}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${formData.travelType === 'Domestic' ? '#25D366' : 'var(--border-color)'}`,
                    background: formData.travelType === 'Domestic' ? 'rgba(37,211,102,0.1)' : 'var(--bg-card-subtle)',
                    color: formData.travelType === 'Domestic' ? '#075E54' : 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>🇮🇳 Domestic (India)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, travelType: 'International' }))}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${formData.travelType === 'International' ? '#25D366' : 'var(--border-color)'}`,
                    background: formData.travelType === 'International' ? 'rgba(37,211,102,0.1)' : 'var(--bg-card-subtle)',
                    color: formData.travelType === 'International' ? '#075E54' : 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>🌍 International</span>
                </button>
              </div>
            </div>

            {/* Name & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            {/* Destination & Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Destination City/Country *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dubai / Goa / Srinagar"
                  value={formData.destination}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Preferred Travel Dates
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15 Dec - 22 Dec 2026"
                  value={formData.travelDates}
                  onChange={e => setFormData({ ...formData, travelDates: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            {/* Travelers & Service */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Number of Travelers
                </label>
                <select
                  value={formData.travelers}
                  onChange={e => setFormData({ ...formData, travelers: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="Solo (1 Traveler)">Solo (1 Traveler)</option>
                  <option value="2 Adults (Couple/Friends)">2 Adults (Couple/Friends)</option>
                  <option value="3-4 Adults (Family/Group)">3-4 Adults (Family/Group)</option>
                  <option value="Family with Kids">Family with Kids</option>
                  <option value="Group 5+ People">Group 5+ People</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Service Desired
                </label>
                <select
                  value={formData.service}
                  onChange={e => setFormData({ ...formData, service: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="Flights + Hotel">Flights + Hotel</option>
                  <option value="Flights Only">Flights Only (Akbar Travels)</option>
                  <option value="Hotels Only">Hotels Only</option>
                  <option value="Visa Only (Atlys)">Visa Only (Atlys e-Visa/Sticker)</option>
                  <option value="Holiday Package (Thomas Cook)">Holiday Package (Thomas Cook)</option>
                  <option value="All-Inclusive Customized Tour">All-Inclusive Customized Tour</option>
                </select>
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                Additional Notes / Preferences (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Budget per person, 4-star hotel, meal preference, need stroller/wheelchair..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  resize: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#25D366',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37,211,102,0.35)',
                transition: 'var(--transition)'
              }}
            >
              <Send size={18} />
              Submit & Send to WhatsApp
            </button>
          </form>

          {/* Direct WhatsApp CTA when submitted */}
          {submittedLead && (
            <div 
              style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(37,211,102,0.1)',
                border: '1px solid rgba(37,211,102,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#075E54', fontWeight: 800, fontSize: '0.95rem' }}>
                <CheckCircle2 size={18} color="#25D366" />
                Inquiry Logged! Connect Directly on WhatsApp:
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Inquiry registered for <strong>{submittedLead.name}</strong> ({submittedLead.destination}). Click below to start chatting with our reservation desk instantly with your pre-filled inquiry.
              </p>
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(submittedLead)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer'
                }}
              >
                <Phone size={16} />
                Open in WhatsApp Now (+91 98765 43210)
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Desk Chat Assistant & Exported Inquiries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Live Chat Window */}
          <div 
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              height: '380px'
            }}
          >
            <div style={{ background: '#075E54', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Akbar Travels AI Concierge</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Active • Automated Quote Generator</div>
              </div>
            </div>

            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'var(--bg-card-subtle)' }}>
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: msg.sender === 'user' ? '#DCF8C6' : 'var(--bg-card)',
                    color: msg.sender === 'user' ? '#000000' : 'var(--text-main)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    lineHeight: 1.45,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats & WhatsApp Direct Help */}
          <div 
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Leads Logged in CSV</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#075E54' }}>{inquiries.length} Inquiries</div>
            </div>
            <button
              onClick={handleExportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(7,94,84,0.1)',
                color: '#075E54',
                border: '1px solid #075E54',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Download size={15} />
              Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div 
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
              Captured Inquiries Log
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              All captured leads are stored locally and included in CSV exports
            </span>
          </div>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#075E54',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            <Download size={14} />
            Download CSV ({inquiries.length})
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Customer</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Contact</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Trip Type</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Destination</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Dates & Pax</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Service</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inq => (
                <tr key={inq.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                    {inq.name}
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>{inq.timestamp}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#075E54', fontWeight: 600 }}>
                    {inq.phone}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span 
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: inq.travelType === 'Domestic' ? 'rgba(37,99,235,0.1)' : 'rgba(217,119,6,0.1)',
                        color: inq.travelType === 'Domestic' ? '#2563eb' : '#d97706'
                      }}
                    >
                      {inq.travelType}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                    {inq.destination}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
                    <div>{inq.travelDates}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{inq.travelers}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)', fontSize: '0.8rem' }}>
                    {inq.service}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenWhatsApp(inq)}
                        title="Chat on WhatsApp"
                        style={{
                          background: '#25D366',
                          color: '#ffffff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        <Phone size={12} /> WhatsApp
                      </button>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        title="Remove"
                        style={{
                          background: 'transparent',
                          color: 'var(--text-muted)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

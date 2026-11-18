import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Calendar, 
  MapPin, 
  Clock, 
  Check, 
  DollarSign, 
  Share2, 
  Download, 
  RefreshCw,
  Palmtree,
  Building,
  Plane,
  Heart,
  Bot,
  User,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

interface DayPlan {
  dayNumber: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  hotel: string;
  meals: string;
}

interface CustomItinerary {
  id: string;
  destination: string;
  country: string;
  duration: string;
  theme: string;
  estimatedCostUSD: number;
  highlightSummary: string;
  flightRecommendation: string;
  hotelRecommendation: string;
  days: DayPlan[];
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  itinerary?: CustomItinerary;
  timestamp: string;
}

const PRESET_ITINERARIES: Record<string, CustomItinerary> = {
  dubai: {
    id: 'itin-dubai',
    destination: 'Dubai & Abu Dhabi',
    country: 'United Arab Emirates',
    duration: '5 Days / 4 Nights',
    theme: 'Luxury, Desert Safari & Futuristic Architecture',
    estimatedCostUSD: 1150,
    highlightSummary: 'Burj Khalifa At The Top (124th floor), 4x4 Desert Dune Bashing with BBQ dinner, Sheikh Zayed Grand Mosque tour, and Dubai Marina luxury yacht cruise.',
    flightRecommendation: 'Emirates or IndiGo direct flight from BOM/DEL to DXB',
    hotelRecommendation: 'JW Marriott Marquis Dubai (5-Star Luxury)',
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Dubai & Marina Dhow Cruise',
        morning: 'Touch down at DXB airport, airport chauffeur transfer & check-in.',
        afternoon: 'Relax by the infinity pool, visit JBR The Walk beachfront promenade.',
        evening: 'Marina Luxury Dhow Cruise with international 5-star buffet and live Tanoura dance under city lights.',
        hotel: 'JW Marriott Marquis Dubai',
        meals: 'Dinner Included'
      },
      {
        dayNumber: 2,
        title: 'Modern Marvels & Burj Khalifa',
        morning: 'Tour Dubai Mall, Dubai Aquarium & Underwater Zoo tunnel walkthrough.',
        afternoon: 'Ascend to Burj Khalifa 124th/125th observation deck for panoramic skyline views.',
        evening: 'Watch the world-famous Dubai Fountain show followed by fine dining at Downtown Dubai.',
        hotel: 'JW Marriott Marquis Dubai',
        meals: 'Breakfast Included'
      },
      {
        dayNumber: 3,
        title: 'Red Dunes Desert Safari with Bedouin Camp',
        morning: 'Old Dubai walking tour: Al Fahidi Historical Neighborhood, Spice Souk & Gold Souk via Abra boat.',
        afternoon: '4x4 Land Cruiser pickup for high-dune bashing in the Lahbab Desert, sandboarding & camel riding.',
        evening: 'Lavish Arabic BBQ dinner under starry desert skies, belly dance, fire show and shisha lounge.',
        hotel: 'JW Marriott Marquis Dubai',
        meals: 'Breakfast & BBQ Dinner Included'
      },
      {
        dayNumber: 4,
        title: 'Abu Dhabi Cultural Day Trip',
        morning: 'Drive along the Persian Gulf to Abu Dhabi, visit the awe-inspiring Sheikh Zayed Grand Mosque.',
        afternoon: 'Visit Louvre Abu Dhabi or Ferrari World on Yas Island.',
        evening: 'Scenic drive along Corniche Beach and return to Dubai for evening shopping.',
        hotel: 'JW Marriott Marquis Dubai',
        meals: 'Breakfast Included'
      },
      {
        dayNumber: 5,
        title: 'Souvenir Shopping & Departure',
        morning: 'Breakfast and leisure at Palm Jumeirah The Pointe or Miracle Garden.',
        afternoon: 'Private airport transfer to DXB for your return flight home.',
        evening: 'Board flight back with cherished memories.',
        hotel: 'Check-out',
        meals: 'Breakfast Included'
      }
    ]
  },
  goa: {
    id: 'itin-goa',
    destination: 'North & South Goa Beach Holiday',
    country: 'India',
    duration: '4 Days / 3 Nights',
    theme: 'Beaches, Water Sports & Portuguese Heritage',
    estimatedCostUSD: 420,
    highlightSummary: 'Baga & Calangute beach vibes, Dudhsagar Waterfalls jeep safari, Old Goa churches, and sunset catamaran cruise on the Mandovi River.',
    flightRecommendation: 'Direct flight to Goa MOPA (GOX) or Dabolim (GOI)',
    hotelRecommendation: 'Taj Fort Aguada Resort & Spa (5-Star)',
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & North Goa Beach Sunset',
        morning: 'Arrival at Goa airport, private taxi transfer to seaside resort.',
        afternoon: 'Unwind at Baga Beach, sip refreshing coconut water, beach shack lunch.',
        evening: 'Sunset drinks at Thalassa or Curlies, explore vibrant night flea market.',
        hotel: 'Taj Fort Aguada',
        meals: 'Dinner Included'
      },
      {
        dayNumber: 2,
        title: 'Water Sports Adventure & Fort Aguada',
        morning: 'Parasailing, jet ski, banana boat ride and bumper tube ride at Calangute.',
        afternoon: 'Visit 17th-century Portuguese Fort Aguada and lighthouse with Arabian Sea views.',
        evening: 'Sunset Mandovi River Cruise with live Goan folk dance and DJ music.',
        hotel: 'Taj Fort Aguada',
        meals: 'Breakfast Included'
      },
      {
        dayNumber: 3,
        title: 'Old Goa Heritage & South Goa Peace',
        morning: 'Explore Basilica of Bom Jesus and Se Cathedral in Old Goa.',
        afternoon: 'Tour Sahakari Spice Farm with traditional authentic Goan buffet lunch.',
        evening: 'Leisure stroll along Palolem Beach or candle-light dinner on the sand.',
        hotel: 'Taj Fort Aguada',
        meals: 'Breakfast & Traditional Lunch Included'
      },
      {
        dayNumber: 4,
        title: 'Dudhsagar Jeep Safari & Departure',
        morning: 'Optional early morning Jeep drive to Dudhsagar Waterfalls or Panjim Latin Quarter walk.',
        afternoon: 'Pick up cashew nuts, feni, and Goan souvenirs, airport drop for return flight.',
        evening: 'Fly home with sun-kissed memories.',
        hotel: 'Check-out',
        meals: 'Breakfast Included'
      }
    ]
  },
  kashmir: {
    id: 'itin-kashmir',
    destination: 'Srinagar, Gulmarg & Pahalgam Paradise',
    country: 'India',
    duration: '6 Days / 5 Nights',
    theme: 'Snow Mountains, Houseboat, Gondola & Valleys',
    estimatedCostUSD: 680,
    highlightSummary: 'Dal Lake shikara ride with luxury heritage houseboat stay, Gulmarg Gondola Cable Car Ride (Phase 1 & 2), Betaab Valley and Aru Valley in Pahalgam.',
    flightRecommendation: 'Direct flight from Delhi or Mumbai to Srinagar (SXR)',
    hotelRecommendation: 'Mascot Heritage Houseboat & The Khyber Himalayan Resort',
    days: [
      {
        dayNumber: 1,
        title: 'Dal Lake Arrival & Royal Shikara Ride',
        morning: 'Arrive at Srinagar airport with warm Kashmiri Kahwa welcome. Transfer to Dal Lake.',
        afternoon: 'Check-in to ornate carved cedarwood Luxury Houseboat.',
        evening: '2-hour tranquil Shikara ride across Dal Lake, floating market & Char Chinar at sunset.',
        hotel: 'Mascot Heritage Houseboat, Srinagar',
        meals: 'Traditional Kashmiri Dinner'
      },
      {
        dayNumber: 2,
        title: 'Mughal Gardens & Old City Handicrafts',
        morning: 'Visit Shalimar Bagh, Nishat Bagh, and Chashme Shahi terraced gardens.',
        afternoon: 'Walk through Lal Chowk and Kashmiri artisan workshops (Pashmina shawls, walnut wood).',
        evening: 'Relax on the houseboat deck with views of Zabarwan mountain range.',
        hotel: 'Mascot Heritage Houseboat, Srinagar',
        meals: 'Breakfast & Dinner Included'
      },
      {
        dayNumber: 3,
        title: 'Gulmarg Meadow of Flowers & Gondola Ride',
        morning: 'Scenic mountain drive to Gulmarg (8,825 ft altitude).',
        afternoon: 'Ride the world highest Gondola cable car up to Apharwat Peak (Phase 1 & Phase 2 snow zone).',
        evening: 'Snow sledging or golf course stroll, stay in Alpine mountain lodge.',
        hotel: 'The Khyber Resort / Alpine Lodge, Gulmarg',
        meals: 'Breakfast & Dinner Included'
      },
      {
        dayNumber: 4,
        title: 'Pahalgam Valley of Shepherds',
        morning: 'Drive through saffron fields of Pampore and Apple orchards towards Pahalgam.',
        afternoon: 'Visit Lidder River, stroll along pine forests and mountain streams.',
        evening: 'Campfire and authentic Wazwan dinner under mountain stars.',
        hotel: 'Pahalgam Pines Resort',
        meals: 'Breakfast & Dinner Included'
      },
      {
        dayNumber: 5,
        title: 'Betaab Valley & Aru Valley Pony Excursion',
        morning: 'Jeep excursion to Betaab Valley (named after the Bollywood film) and Chandanwari.',
        afternoon: 'Pony ride or light hike through Aru Valley wildflower meadows.',
        evening: 'Return to Srinagar for farewell dinner.',
        hotel: 'Srinagar Boutique Hotel',
        meals: 'Breakfast & Dinner Included'
      },
      {
        dayNumber: 6,
        title: 'Departure with Cherished Memories',
        morning: 'Breakfast and early morning floating flower market visit.',
        afternoon: 'Transfer to Srinagar Airport for departure.',
        evening: 'Arrive home after exploring Jannat-e-Kashmir.',
        hotel: 'Check-out',
        meals: 'Breakfast Included'
      }
    ]
  }
};

export const CustomTripModule: React.FC = () => {
  const { formatPrice, openCheckout } = useApp();
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Hello! I am your AI Custom Trip Designer at TravelPulse & Akbar Travels.\n\nTell me where you want to travel, how many days, budget, or who is traveling (e.g. "Plan a 5-day luxury trip to Dubai for 2", "Goa beach trip 4 days", "Kashmir family tour 6 days"). I will generate a comprehensive day-by-day itinerary instantly!',
      timestamp: 'Just now'
    }
  ]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSendQuery = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      let matchedItinerary: CustomItinerary = PRESET_ITINERARIES.dubai;

      if (lower.includes('goa') || lower.includes('beach') || lower.includes('sea')) {
        matchedItinerary = PRESET_ITINERARIES.goa;
      } else if (lower.includes('kashmir') || lower.includes('srinagar') || lower.includes('snow') || lower.includes('gulmarg') || lower.includes('mountain')) {
        matchedItinerary = PRESET_ITINERARIES.kashmir;
      } else if (lower.includes('dubai') || lower.includes('uae') || lower.includes('abu dhabi') || lower.includes('desert') || lower.includes('burj')) {
        matchedItinerary = PRESET_ITINERARIES.dubai;
      } else {
        // Fallback or custom tailored response
        matchedItinerary = {
          ...PRESET_ITINERARIES.dubai,
          id: `custom-${Date.now()}`,
          destination: query.slice(0, 30),
          highlightSummary: `Personalized AI itinerary designed for "${query}" with curated sightseeing, flights via Akbar Travels, and handpicked 4-star hotels.`
        };
      }

      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: `Here is your tailor-made customized itinerary for ${matchedItinerary.destination} (${matchedItinerary.duration})! Review the day-by-day plan below. You can book directly or request modifications.`,
        itinerary: matchedItinerary,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, aiReply]);
      setIsGenerating(false);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    }, 1200);
  };

  const handleBookItinerary = (itinerary: CustomItinerary) => {
    openCheckout({
      id: itinerary.id,
      title: `${itinerary.destination} Custom Tour`,
      subtitle: `${itinerary.duration} • ${itinerary.theme}`,
      heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      basePriceUSD: itinerary.estimatedCostUSD,
      inPolicy: true
    }, 'holiday');
  };

  const handleShareWhatsApp = (itinerary: CustomItinerary) => {
    const text = 
      `*My Custom Travel Itinerary - ${itinerary.destination}*%0A` +
      `*Duration:* ${itinerary.duration}%0A` +
      `*Estimated Cost:* $${itinerary.estimatedCostUSD} per person%0A` +
      `*Highlights:* ${itinerary.highlightSummary}%0A` +
      `*Flight Note:* ${itinerary.flightRecommendation}%0A%0A` +
      `Generated by TravelPulse AI & Akbar Travels Partner.`;

    window.open(`https://wa.me/916263573606?text=${text}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #032559 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          color: '#ffffff',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            AI Travel Agent & Itinerary Architect
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
            Customize Your Dream Trip with AI
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, maxWidth: '650px', marginTop: '0.5rem', lineHeight: 1.5 }}>
            Chat directly with our conversational travel planner. State your interests, destinations, dates, and budget — get comprehensive day-by-day itineraries, flight recommendations, and instant booking quotes.
          </p>

          {/* Quick Prompts */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            {[
              '🇦🇪 5-Day Luxury Dubai Vacation',
              '🌴 4-Day Goa Beach & Water Sports',
              '🏔️ 6-Day Kashmir Snow & Houseboat',
              '🏰 5-Day Rajasthan Heritage Forts',
              '🏝️ 6-Day Bali Tropical Retreat'
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSendQuery(prompt)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '600px'
        }}
      >
        {/* Chat Messages */}
        <div style={{ flex: 1, padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-card-subtle)' }}>
          {messages.map(msg => (
            <div 
              key={msg.id} 
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: msg.itinerary ? '100%' : '80%',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: msg.sender === 'user' ? 'var(--brand-accent)' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}
              >
                {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <div 
                  style={{
                    background: msg.sender === 'user' ? 'var(--brand-accent)' : 'var(--bg-card)',
                    color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    boxShadow: 'var(--shadow-sm)',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                </div>

                {/* Render Itinerary Card if present */}
                {msg.itinerary && (
                  <div 
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1.75rem',
                      boxShadow: 'var(--card-shadow)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.5rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    {/* Itinerary Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.72rem', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                            AI GENERATED ITINERARY
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{msg.itinerary.duration}</span>
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-heading)', margin: '6px 0 2px' }}>
                          {msg.itinerary.destination}
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--brand-accent)', fontWeight: 600, margin: 0 }}>
                          Theme: {msg.itinerary.theme}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Estimated Cost / Person</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--brand-accent)' }}>
                          {formatPrice(msg.itinerary.estimatedCostUSD)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 700 }}>
                          All-Inclusive (Hotel + Tours + Transfers)
                        </div>
                      </div>
                    </div>

                    {/* Flight & Hotel Recommendations Strip */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Plane size={20} color="var(--brand-blue)" />
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recommended Flights</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-heading)' }}>{msg.itinerary.flightRecommendation}</div>
                        </div>
                      </div>

                      <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Building size={20} color="var(--brand-accent)" />
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Accommodation</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-heading)' }}>{msg.itinerary.hotelRecommendation}</div>
                        </div>
                      </div>
                    </div>

                    {/* Day-by-Day Timeline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                        Day-by-Day Plan
                      </h3>

                      {msg.itinerary.days.map(day => (
                        <div 
                          key={day.dayNumber}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            position: 'relative'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                D{day.dayNumber}
                              </span>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                                {day.title}
                              </h4>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                              {day.meals}
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.82rem' }}>
                            <div style={{ background: 'var(--bg-card-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                              <div style={{ fontWeight: 700, color: 'var(--brand-accent)', marginBottom: '2px' }}>🌅 Morning</div>
                              <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.4 }}>{day.morning}</p>
                            </div>
                            <div style={{ background: 'var(--bg-card-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                              <div style={{ fontWeight: 700, color: 'var(--brand-blue)', marginBottom: '2px' }}>☀️ Afternoon</div>
                              <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.4 }}>{day.afternoon}</p>
                            </div>
                            <div style={{ background: 'var(--bg-card-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                              <div style={{ fontWeight: 700, color: '#7c3aed', marginBottom: '2px' }}>🌙 Evening</div>
                              <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.4 }}>{day.evening}</p>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px' }}>
                            <Building size={13} /> Stay: <strong>{day.hotel}</strong>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Booking Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                      <button
                        onClick={() => handleShareWhatsApp(msg.itinerary!)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(37,211,102,0.1)',
                          color: '#075E54',
                          border: '1px solid #25D366',
                          padding: '0.65rem 1.25rem',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Share2 size={15} color="#25D366" />
                        Share on WhatsApp
                      </button>

                      <button
                        onClick={() => handleBookItinerary(msg.itinerary!)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'linear-gradient(135deg, #032559 0%, #fa3a3a 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.65rem 1.75rem',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(250,58,58,0.3)'
                        }}
                      >
                        <Sparkles size={16} />
                        Book This Trip ({formatPrice(msg.itinerary.estimatedCostUSD)})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <RefreshCw size={16} className="spinning" />
              <span>AI Agent is curating flights, hotels, and sightseeing activities...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div 
          style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '12px'
          }}
        >
          <input
            type="text"
            placeholder="Type your trip request (e.g., 'Plan a 5-day honeymoon in Kashmir' or 'Budget trip to Goa')..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSendQuery();
            }}
            style={{
              flex: 1,
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSendQuery()}
            disabled={!inputQuery.trim() || isGenerating}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.85rem 1.75rem',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: !inputQuery.trim() || isGenerating ? 'not-allowed' : 'pointer',
              opacity: !inputQuery.trim() || isGenerating ? 0.6 : 1,
              boxShadow: '0 4px 12px rgba(124,58,237,0.3)'
            }}
          >
            <Send size={16} />
            <span>Plan Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
};

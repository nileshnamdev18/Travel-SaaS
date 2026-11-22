/**
 * Seed script: seeds MongoDB with admin user, demo customer, rich holiday packages with full day itineraries, and dynamic admin config.
 * Run: ts-node src/scripts/seed.ts
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.model';
import { HolidayPackage } from '../models/HolidayPackage.model';
import { AdminConfig } from '../models/AdminConfig.model';

dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelpulse';

const SEED_PACKAGES = [
  {
    title: 'Kashmir Majestic Valleys & Alpine Gondola Odyssey',
    destination: 'Kashmir, India',
    destinationType: 'domestic',
    region: 'North India',
    theme: 'honeymoon',
    category: 'Customized',
    durationDays: 6,
    durationNights: 5,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad', 'Kolkata'],
    basePrice: 650,
    wholesaleCost: 510,
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582650625119-3a31f841839d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: [
      'Luxury Dal Lake Houseboat Stay with Shikara Ride',
      'Gulmarg Gondola Cable Car Ride to Snow Glaciers',
      'Pahalgam Betaab Valley & Aru River Woods',
      'Saffron Heritage Walk in Pampore'
    ],
    inclusions: [
      'Return Airport Transfers in AC Sedan/Innova',
      '5 Nights Stay in 4-Star & Heritage Houseboat',
      'Daily Breakfast & Dinners (MAP Plan)',
      'Gulmarg Gondola Phase 1 Ticket Included',
      '1 Hour Sunset Shikara Ride on Dal Lake',
      'Dedicated Hindi / English Speaking Tour Driver'
    ],
    exclusions: [
      'Domestic Airfare to/from Srinagar',
      'Personal Pony Treks in Pahalgam/Gulmarg',
      'Travel Insurance and Personal Tips'
    ],
    hotelTiers: { standard: 'Grand Mumtaz Houseboat', deluxe: 'Radisson Srinagar', luxury: 'The Khyber Himalayan Resort' },
    isBestSeller: true,
    isFeatured: true,
    isTrending: false,
    rating: 4.8,
    reviewCount: 342,
    discountPercent: 10,
    cancellationPolicy: 'Free cancellation up to 15 days before departure.',
    tags: ['Honeymoon', 'Adventure', 'Group Tours'],
    sortOrder: 1,
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival in Srinagar & Dal Lake Sunset Shikara',
        destination: 'Srinagar',
        currentActivity: {
          title: 'Sunset Shikara Cruise across Floating Gardens',
          duration: '2 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=500&q=80',
          description: 'Glide peacefully across serene waters.'
        },
        alternativeActivities: [
          {
            title: 'Old City Artisan & Pashmina Weaver Trail',
            duration: '3 Hours',
            priceDelta: 25,
            image: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=500&q=80',
            description: 'Visit century-old wooden mosques.'
          }
        ],
        hotelName: 'Mascot Heritage Luxury Houseboat',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'Gulmarg Meadow of Flowers & Snow Glaciers',
        destination: 'Gulmarg',
        currentActivity: {
          title: 'Gulmarg Gondola Cable Car (Phase 1 Kongdoori)',
          duration: '4 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1582650625119-3a31f841839d?auto=format&fit=crop&w=500&q=80',
          description: 'Ascend to 10,000 feet.'
        },
        alternativeActivities: [
          {
            title: 'High-Altitude Gondola Phase 2 Apharwat Peak',
            duration: 'Full Day',
            priceDelta: 45,
            image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&q=80',
            description: 'Reach perpetual alpine glaciers.'
          }
        ],
        hotelName: 'The Khyber Himalayan Resort & Spa',
        hotelTier: 'Luxury 5-Star',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 3,
        dayTitle: 'Pahalgam Valley of Shepherds & River Woods',
        destination: 'Pahalgam',
        currentActivity: {
          title: 'Betaab Valley & Aru Pine Woods Excursion',
          duration: '5 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
          description: 'Picturesque valley.'
        },
        alternativeActivities: [],
        hotelName: 'Pahalgam Hotel Lidder Riverside',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 4,
        dayTitle: 'Baisaran Mini Switzerland Valley Trek',
        destination: 'Pahalgam',
        currentActivity: {
          title: 'Baisaran Valley Meadow Trek',
          duration: '4 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=500&q=80',
          description: 'Lush alpine meadows surrounded by snow-capped peaks.'
        },
        alternativeActivities: [],
        hotelName: 'Pahalgam Hotel Lidder Riverside',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 5,
        dayTitle: 'Mughal Gardens of Nishat & Shalimar Srinagar',
        destination: 'Srinagar',
        currentActivity: {
          title: 'Royal Mughal Terraced Gardens Heritage Walk',
          duration: '3 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=500&q=80',
          description: 'Historic fountains and Persian architecture.'
        },
        alternativeActivities: [],
        hotelName: 'Radisson Srinagar',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 6,
        dayTitle: 'Shankaracharya Temple & Departure',
        destination: 'Srinagar',
        currentActivity: {
          title: 'Shankaracharya Hilltop Shrine & Airport Drop',
          duration: '2 Hours',
          priceDelta: 0,
          description: 'Panoramic views of Srinagar city before your flight.'
        },
        alternativeActivities: [],
        hotelName: 'N/A (Departure)',
        hotelTier: 'Standard',
        mealsIncluded: ['Breakfast']
      }
    ]
  },
  {
    title: 'Dazzling Dubai & Abu Dhabi Grand Extravaganza',
    destination: 'Dubai, UAE',
    destinationType: 'international',
    region: 'Middle East',
    theme: 'family',
    category: 'Fixed Departure',
    durationDays: 5,
    durationNights: 4,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai'],
    basePrice: 780,
    wholesaleCost: 610,
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: [
      'Burj Khalifa 124th Floor Observation Deck',
      'Red Dune Desert Safari with BBQ Dinner',
      'Marina Dhow Cruise with Live Tanoura Show',
      'Full Day Abu Dhabi Tour & Sheikh Zayed Mosque'
    ],
    inclusions: [
      '4 Nights in 4-Star Hotel with Daily Breakfast',
      'Burj Khalifa 124th Floor Non-Prime Entry Ticket',
      '4x4 Desert Safari with Belly Dance & Tanoura',
      'Dubai Marina Luxury Dhow Cruise Dinner',
      'Full Day Abu Dhabi Tour & Grand Mosque Entry'
    ],
    exclusions: ['Tourism Dirham Tax', 'UAE Tourist Visa', 'Personal Shopping'],
    hotelTiers: { standard: 'Howard Johnson Bur Dubai', deluxe: 'JW Marriott Marquis Dubai', luxury: 'Atlantis The Palm' },
    isBestSeller: true,
    isFeatured: true,
    isTrending: true,
    rating: 4.7,
    reviewCount: 420,
    discountPercent: 12,
    cancellationPolicy: '100% refund up to 10 days before departure.',
    tags: ['Family', 'Luxury', 'International'],
    sortOrder: 2,
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival in Dubai & Marina Dhow Cruise Dinner',
        destination: 'Dubai',
        currentActivity: {
          title: 'Dubai Marina Luxury Glass Dhow Cruise Dinner',
          duration: '3 Hours',
          priceDelta: 0,
          description: 'Sail amidst illuminated skyscrapers with international buffet.'
        },
        alternativeActivities: [],
        hotelName: 'Novotel Dubai Al Barsha',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'Dubai City Tour & Burj Khalifa 124th Floor',
        destination: 'Dubai',
        currentActivity: {
          title: 'Burj Khalifa Observation Deck & Dubai Mall Fountain Show',
          duration: '5 Hours',
          priceDelta: 0,
          description: 'World highest observation deck and choreographed musical fountains.'
        },
        alternativeActivities: [],
        hotelName: 'Novotel Dubai Al Barsha',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 3,
        dayTitle: 'Red Dune Desert Safari & Bedouin Camp BBQ',
        destination: 'Dubai',
        currentActivity: {
          title: '4x4 Dune Bashing, Camel Ride & Fire Show Dinner',
          duration: '6 Hours',
          priceDelta: 0,
          description: 'Exciting desert safari with traditional feast under the stars.'
        },
        alternativeActivities: [],
        hotelName: 'Novotel Dubai Al Barsha',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 4,
        dayTitle: 'Abu Dhabi Grand Tour & BAPS Hindu Mandir',
        destination: 'Abu Dhabi',
        currentActivity: {
          title: 'Sheikh Zayed Mosque & Abu Dhabi Heritage Village',
          duration: '8 Hours',
          priceDelta: 0,
          description: 'Stunning white marble architectural marvel.'
        },
        alternativeActivities: [],
        hotelName: 'Novotel Dubai Al Barsha',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 5,
        dayTitle: 'Souk Madinat & Departure Transfer',
        destination: 'Dubai',
        currentActivity: {
          title: 'Gold & Spice Souks Shopping and Airport Drop',
          duration: '4 Hours',
          priceDelta: 0,
          description: 'Traditional market shopping before return flight.'
        },
        alternativeActivities: [],
        hotelName: 'N/A (Departure)',
        hotelTier: 'Standard',
        mealsIncluded: ['Breakfast']
      }
    ]
  },
  {
    title: 'Enchanting Kerala: Munnar Tea Hills & Alleppey Houseboat',
    destination: 'Kerala, India',
    destinationType: 'domestic',
    region: 'South India',
    theme: 'family',
    category: 'Customized',
    durationDays: 5,
    durationNights: 4,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai'],
    basePrice: 520,
    wholesaleCost: 390,
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Munnar Tea Plantations', 'Thekkady Wildlife Boating', 'Alleppey Houseboat Cruise', 'Kalaripayattu Martial Arts Show'],
    inclusions: ['4 Nights Accommodation', 'All Meals on Houseboat', 'AC Private Cab', 'Periyar Lake Boat Safari'],
    exclusions: ['Airfare', 'Spice Plantation entry'],
    hotelTiers: { standard: 'Amber Dale Munnar', deluxe: 'Fragrant Nature Munnar', luxury: 'Kumarakom Lake Resort' },
    isBestSeller: true,
    isFeatured: false,
    isTrending: false,
    rating: 4.6,
    reviewCount: 280,
    discountPercent: 15,
    cancellationPolicy: 'Free cancellation up to 7 days before check-in.',
    tags: ['Backwaters', 'Nature', 'Family'],
    sortOrder: 3,
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Cochin Arrival & Scenic Drive to Munnar Tea Hills',
        destination: 'Munnar',
        currentActivity: { title: 'Cheeyappara & Valara Waterfalls Stopover', duration: '5 Hours', priceDelta: 0, description: 'Scenic drive through misty Western Ghats.' },
        alternativeActivities: [],
        hotelName: 'Amber Dale Resort Munnar',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'Munnar Tea Gardens & Eravikulam National Park',
        destination: 'Munnar',
        currentActivity: { title: 'Nilgiri Tahr Sanctuary & Tea Museum Tour', duration: '6 Hours', priceDelta: 0, description: 'Walk through rolling green estates and learn artisanal tea processing.' },
        alternativeActivities: [],
        hotelName: 'Amber Dale Resort Munnar',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 3,
        dayTitle: 'Thekkady Periyar Wildlife Sanctuary & Spice Plantation',
        destination: 'Thekkady',
        currentActivity: { title: 'Periyar Lake Boating & Organic Spice Plantation Trail', duration: '5 Hours', priceDelta: 0, description: 'Spot wild elephants and learn about cardamom and cloves.' },
        alternativeActivities: [],
        hotelName: 'Greenwoods Resort Thekkady',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 4,
        dayTitle: 'Alleppey Luxury Houseboat Backwater Cruise',
        destination: 'Alleppey',
        currentActivity: { title: 'Private Houseboat Cruise through Palm-fringed Canals', duration: 'Full Day', priceDelta: 0, description: 'Authentic Kerala lunch and dinner prepared on board.' },
        alternativeActivities: [],
        hotelName: 'Lakes & Lagoons Premium Houseboat',
        hotelTier: 'Luxury 5-Star',
        mealsIncluded: ['Breakfast', 'Lunch', 'Dinner']
      },
      {
        dayNumber: 5,
        dayTitle: 'Cochin Heritage Fort & Airport Departure',
        destination: 'Cochin',
        currentActivity: { title: 'Fort Kochi Chinese Fishing Nets & Jew Town Souvenirs', duration: '3 Hours', priceDelta: 0, description: 'Colonial heritage walk before flight home.' },
        alternativeActivities: [],
        hotelName: 'N/A (Departure)',
        hotelTier: 'Standard',
        mealsIncluded: ['Breakfast']
      }
    ]
  },
  {
    title: 'Bali: Island of Gods — Ubud Villas & Seminyak Beaches',
    destination: 'Bali, Indonesia',
    destinationType: 'international',
    region: 'Southeast Asia',
    theme: 'honeymoon',
    category: 'Customized',
    durationDays: 7,
    durationNights: 6,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'],
    basePrice: 850,
    wholesaleCost: 650,
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Private Infinity Pool Villa in Ubud', 'Tegallalang Rice Terrace Sunrise Trek', 'Mount Batur Volcanic Hike', 'Seminyak Beach Club Sunset'],
    inclusions: ['6 Nights Private Pool Villa', 'Daily Breakfast & 3 Dinners', 'All Airport Transfers', 'Mount Batur Trek with Guide'],
    exclusions: ['International Airfare', 'Indonesian Visa on Arrival', 'Personal Spa Expenses'],
    hotelTiers: { standard: 'Alaya Resort Ubud', deluxe: 'The Layar Villas Seminyak', luxury: 'Four Seasons Jimbaran Bay' },
    isBestSeller: true,
    isFeatured: true,
    isTrending: true,
    rating: 4.9,
    reviewCount: 512,
    discountPercent: 8,
    cancellationPolicy: 'Free cancellation up to 14 days before departure.',
    tags: ['Honeymoon', 'Beach', 'Luxury'],
    sortOrder: 4,
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival in Denpasar & Ubud Rainforest Villa Check-in',
        destination: 'Ubud',
        currentActivity: { title: 'Private Candlelight Balinese Dinner at Villa', duration: '2 Hours', priceDelta: 0, description: 'Relax after flight in luxury tropical seclusion.' },
        alternativeActivities: [],
        hotelName: 'Alaya Resort Ubud',
        hotelTier: 'Luxury 5-Star',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'Tegallalang Emerald Rice Terraces & Famous Jungle Swing',
        destination: 'Ubud',
        currentActivity: { title: 'Jungle Swing & Kintamani Volcano View Lunch', duration: '6 Hours', priceDelta: 0, description: 'Iconic panoramic photo opportunities.' },
        alternativeActivities: [],
        hotelName: 'Alaya Resort Ubud',
        hotelTier: 'Luxury 5-Star',
        mealsIncluded: ['Breakfast', 'Lunch']
      },
      {
        dayNumber: 3,
        dayTitle: 'Tirta Empul Holy Water Temple & Sacred Monkey Forest',
        destination: 'Ubud',
        currentActivity: { title: 'Spiritual Cleansing Blessing & Art Market Walk', duration: '5 Hours', priceDelta: 0, description: 'Centuries-old purification ritual.' },
        alternativeActivities: [],
        hotelName: 'Alaya Resort Ubud',
        hotelTier: 'Luxury 5-Star',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 4,
        dayTitle: 'Transfer to Seminyak & Sunset at Tanah Lot Ocean Temple',
        destination: 'Seminyak',
        currentActivity: { title: 'Tanah Lot Temple Sunset Ocean Watch', duration: '4 Hours', priceDelta: 0, description: 'Majestic sea temple perched on offshore rock.' },
        alternativeActivities: [],
        hotelName: 'The Layar Villas Seminyak',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 5,
        dayTitle: 'Nusa Penida Island Day Cruise by Speedboat',
        destination: 'Nusa Penida',
        currentActivity: { title: 'Kelingking T-Rex Beach & Angel Billabong Snorkel', duration: '8 Hours', priceDelta: 0, description: 'Crystal-clear waters and dramatic cliffs.' },
        alternativeActivities: [],
        hotelName: 'The Layar Villas Seminyak',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Lunch']
      },
      {
        dayNumber: 6,
        dayTitle: 'Uluwatu Cliff Temple & Kecak Fire Dance Show',
        destination: 'Uluwatu',
        currentActivity: { title: 'Sunset Kecak Performance & Jimbaran Seafood Dinner', duration: '5 Hours', priceDelta: 0, description: 'Dramatic ocean cliff amphitheater show.' },
        alternativeActivities: [],
        hotelName: 'The Layar Villas Seminyak',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 7,
        dayTitle: 'Seminyak Leisure & Airport Departure',
        destination: 'Seminyak',
        currentActivity: { title: 'Souvenir Shopping & Airport Drop', duration: '3 Hours', priceDelta: 0, description: 'Pick up authentic Balinese handicrafts.' },
        alternativeActivities: [],
        hotelName: 'N/A (Departure)',
        hotelTier: 'Standard',
        mealsIncluded: ['Breakfast']
      }
    ]
  },
  {
    title: 'Swiss Alps & Paris Romantic Grand Tour',
    destination: 'Switzerland & France',
    destinationType: 'international',
    region: 'Europe',
    theme: 'honeymoon',
    category: 'Group Tour',
    durationDays: 10,
    durationNights: 9,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad'],
    basePrice: 2200,
    wholesaleCost: 1750,
    heroImage: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=900&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Jungfraujoch Top of Europe by Rail', 'Lake Geneva Scenic Cruise', 'Eiffel Tower Summit', 'Versailles Palace & Gardens'],
    inclusions: ['9 Nights 4-Star Hotels', 'Daily Breakfast', 'All Coach Transfers', 'Hindi/English Tour Manager', 'Jungfraujoch Rail Pass'],
    exclusions: ['International Flights', 'Schengen Visa', 'Personal Shopping'],
    hotelTiers: { standard: 'Ibis Hotels Switzerland & Paris', deluxe: 'Mövenpick Hotels', luxury: 'Baur au Lac Zürich & George V Paris' },
    isBestSeller: false,
    isFeatured: true,
    isTrending: false,
    rating: 4.8,
    reviewCount: 195,
    discountPercent: 5,
    cancellationPolicy: '75% refund up to 20 days before departure.',
    tags: ['Honeymoon', 'Europe', 'Group Tours', 'Culture'],
    sortOrder: 5,
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival in Zurich & Swiss Countryside Welcome',
        destination: 'Zurich',
        currentActivity: { title: 'Lake Zurich Orientation & Welcome Fondue Dinner', duration: '3 Hours', priceDelta: 0, description: 'Traditional Swiss cheese fondue dinner.' },
        alternativeActivities: [],
        hotelName: 'Mövenpick Hotel Zurich Airport',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'Rhine Falls & Medieval Lucerne Lion Monument',
        destination: 'Lucerne',
        currentActivity: { title: 'Rhine Falls Boat Ride & Chapel Bridge Walk', duration: '6 Hours', priceDelta: 0, description: 'Largest waterfall in Europe and historic covered bridge.' },
        alternativeActivities: [],
        hotelName: 'Hotel Astoria Lucerne',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 3,
        dayTitle: 'Jungfraujoch: Top of Europe Alpine Rail Journey',
        destination: 'Interlaken',
        currentActivity: { title: 'Cogwheel Train to Jungfraujoch Glacier & Ice Palace', duration: '8 Hours', priceDelta: 0, description: 'Spectacular alpine observatory at 3,454m.' },
        alternativeActivities: [],
        hotelName: 'Hotel Astoria Lucerne',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 4,
        dayTitle: 'Mount Titlis Rotating Cable Car & Glacier Cave',
        destination: 'Engelberg',
        currentActivity: { title: 'Titlis Rotair 360-degree Gondola & Cliff Walk', duration: '6 Hours', priceDelta: 0, description: 'Europe highest suspension bridge experience.' },
        alternativeActivities: [],
        hotelName: 'Hotel Astoria Lucerne',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 5,
        dayTitle: 'TGV High-Speed Bullet Train to Paris City of Lights',
        destination: 'Paris',
        currentActivity: { title: 'Romantic Seine River Evening Illumination Cruise', duration: '4 Hours', priceDelta: 0, description: 'View Notre-Dame and Louvre from glass boat.' },
        alternativeActivities: [],
        hotelName: 'Novotel Paris Centre Tour Eiffel',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 6,
        dayTitle: 'Eiffel Tower Top Level & Grand Paris City Tour',
        destination: 'Paris',
        currentActivity: { title: 'Eiffel Tower Summit Access & Champs-Élysées Walk', duration: '6 Hours', priceDelta: 0, description: 'Breathtaking 360-degree vista of Paris.' },
        alternativeActivities: [],
        hotelName: 'Novotel Paris Centre Tour Eiffel',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 7,
        dayTitle: 'Versailles Royal Palace & Hall of Mirrors',
        destination: 'Versailles',
        currentActivity: { title: 'Château de Versailles Guided Stately Tour', duration: '5 Hours', priceDelta: 0, description: 'French monarchy grandeur and landscaped gardens.' },
        alternativeActivities: [],
        hotelName: 'Novotel Paris Centre Tour Eiffel',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 8,
        dayTitle: 'Louvre Museum Treasures & Montmartre Artists Village',
        destination: 'Paris',
        currentActivity: { title: 'Mona Lisa Masterpiece Walk & Sacré-Cœur Funicular', duration: '6 Hours', priceDelta: 0, description: 'Art, bohemian cafes and cobblestone lanes.' },
        alternativeActivities: [],
        hotelName: 'Novotel Paris Centre Tour Eiffel',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 9,
        dayTitle: 'Disneyland Paris Magic Kingdom Celebration',
        destination: 'Marne-la-Vallée',
        currentActivity: { title: 'Disneyland 1-Day 1-Park Pass & Night Fireworks', duration: 'Full Day', priceDelta: 0, description: 'Thrilling rides and Disney character parade.' },
        alternativeActivities: [],
        hotelName: 'Novotel Paris Centre Tour Eiffel',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 10,
        dayTitle: 'Parisian Croissant Breakfast & CDG Airport Departure',
        destination: 'Paris',
        currentActivity: { title: 'Final Souvenir Shopping & Departure Transfer', duration: '3 Hours', priceDelta: 0, description: 'Sweet memories of European capitals.' },
        alternativeActivities: [],
        hotelName: 'N/A (Departure)',
        hotelTier: 'Standard',
        mealsIncluded: ['Breakfast']
      }
    ]
  },
  {
    title: 'Himachal Hills: Shimla, Manali & Solang Valley Circuit',
    destination: 'Himachal Pradesh, India',
    destinationType: 'domestic',
    region: 'North India',
    theme: 'adventure',
    category: 'Group Tour',
    durationDays: 8,
    durationNights: 7,
    departureCities: ['Delhi', 'Chandigarh', 'Mumbai', 'Kolkata'],
    basePrice: 490,
    wholesaleCost: 380,
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1582650625119-3a31f841839d?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Rohtang Pass Snow Point', 'Solang Valley Adventure Sports', 'Shimla Heritage Mall Road', 'Kullu River Rafting'],
    inclusions: ['7 Nights Hotels & Camps', 'Breakfast + Dinner', 'AC Traveller/Tempo for all transfers', 'Rohtang Pass Permit'],
    exclusions: ['Airfare to Delhi/Chandigarh', 'Adventure sports fees'],
    hotelTiers: { standard: 'Hotel Apple Country Manali', deluxe: 'Span Resort & Spa Kullu', luxury: 'Manu Allaya Manali' },
    isBestSeller: false,
    isFeatured: false,
    isTrending: true,
    rating: 4.5,
    reviewCount: 220,
    discountPercent: 6,
    cancellationPolicy: 'Free cancellation up to 10 days.',
    tags: ['Adventure', 'Mountains', 'Group Tours'],
    sortOrder: 6,
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Delhi / Chandigarh to Shimla Scenic Ridge Drive',
        destination: 'Shimla',
        currentActivity: { title: 'Heritage Mall Road & Christ Church Evening Stroll', duration: '4 Hours', priceDelta: 0, description: 'Colonial British summer capital charm.' },
        alternativeActivities: [],
        hotelName: 'Hotel Willow Banks Shimla',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'Kufri Snow View Point & Himalayan Nature Park',
        destination: 'Kufri',
        currentActivity: { title: 'Kufri Fun World & Mahasu Peak Yak Ride', duration: '5 Hours', priceDelta: 0, description: 'Snow points and panoramic Himalayan views.' },
        alternativeActivities: [],
        hotelName: 'Hotel Willow Banks Shimla',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 3,
        dayTitle: 'Shimla to Manali via Kullu Valley & Beas River',
        destination: 'Manali',
        currentActivity: { title: 'Kullu Shawl Weaving Center & White Water Rafting', duration: '7 Hours', priceDelta: 0, description: 'Exciting rapids and local artisan crafts.' },
        alternativeActivities: [],
        hotelName: 'Hotel Apple Country Manali',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 4,
        dayTitle: 'Solang Valley Adventure Arena & Zorbing',
        destination: 'Solang Valley',
        currentActivity: { title: 'Paragliding, Cable Car & Snow Activities', duration: '6 Hours', priceDelta: 0, description: 'Adventure hub with thrill sports.' },
        alternativeActivities: [],
        hotelName: 'Hotel Apple Country Manali',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 5,
        dayTitle: 'Rohtang Pass & Atal Tunnel Marvel',
        destination: 'Rohtang',
        currentActivity: { title: 'Rohtang Snow Point & Atal Tunnel Engineering Walk', duration: '7 Hours', priceDelta: 0, description: '13,058 ft mountain pass with perennial snow.' },
        alternativeActivities: [],
        hotelName: 'Hotel Apple Country Manali',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 6,
        dayTitle: 'Manali Old Town, Hadimba Temple & Vashisht Hot Springs',
        destination: 'Manali',
        currentActivity: { title: 'Centuries-old Cedar Wooden Temple & Sulphur Baths', duration: '4 Hours', priceDelta: 0, description: 'Spiritual cedar forests and natural mineral springs.' },
        alternativeActivities: [],
        hotelName: 'Hotel Apple Country Manali',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 7,
        dayTitle: 'Manali to Chandigarh via Pandoh Dam',
        destination: 'Chandigarh',
        currentActivity: { title: 'Rock Garden & Sukhna Lake Evening Sunset', duration: '6 Hours', priceDelta: 0, description: 'World-famous sculpture park made from recycled ceramics.' },
        alternativeActivities: [],
        hotelName: 'The Lalit Chandigarh',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 8,
        dayTitle: 'Chandigarh to Delhi Airport Departure',
        destination: 'Delhi',
        currentActivity: { title: 'Smooth Highway Return & Airport Drop', duration: '4 Hours', priceDelta: 0, description: 'Depart with unforgettable Himalayan memories.' },
        alternativeActivities: [],
        hotelName: 'N/A (Departure)',
        hotelTier: 'Standard',
        mealsIncluded: ['Breakfast']
      }
    ]
  },
  {
    title: 'Thailand: Bangkok Temples, Phuket Beach & Phi Phi Island',
    destination: 'Thailand',
    destinationType: 'international',
    region: 'Southeast Asia',
    theme: 'adventure',
    category: 'Fixed Departure',
    durationDays: 7,
    durationNights: 6,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata'],
    basePrice: 720,
    wholesaleCost: 560,
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Grand Palace & Wat Pho Bangkok', 'Phi Phi Islands Speed Boat Tour', 'Phuket Old Town Walk', 'Maya Bay Blue Lagoon'],
    inclusions: ['6 Nights 4-Star Hotels', 'Daily Breakfast', 'Speed Boat Island Hopping', 'All Airport Transfers', 'Hindi Speaking Guide'],
    exclusions: ['International Flights', 'Thailand Visa on Arrival', 'Personal Expenses'],
    hotelTiers: { standard: 'Novotel Bangkok Sukhumvit', deluxe: 'JW Marriott Phuket', luxury: 'Anantara Phuket Villas' },
    isBestSeller: true,
    isFeatured: false,
    isTrending: true,
    rating: 4.7,
    reviewCount: 389,
    discountPercent: 10,
    cancellationPolicy: '100% refund up to 12 days before departure.',
    tags: ['Beach', 'Adventure', 'International'],
    sortOrder: 7,
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival in Bangkok & Chao Phraya Dinner Cruise',
        destination: 'Bangkok',
        currentActivity: { title: 'White Orchid Chao Phraya River Cruise Dinner', duration: '3 Hours', priceDelta: 0, description: 'Illuminated temples and live Thai classical dance.' },
        alternativeActivities: [],
        hotelName: 'Novotel Bangkok Sukhumvit 20',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'Bangkok Golden Buddha & Reclining Buddha Temples',
        destination: 'Bangkok',
        currentActivity: { title: 'Wat Pho & Wat Traimit Guided Heritage Walk', duration: '5 Hours', priceDelta: 0, description: '5.5 ton solid gold Buddha statue.' },
        alternativeActivities: [],
        hotelName: 'Novotel Bangkok Sukhumvit 20',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 3,
        dayTitle: 'Flight to Phuket & Patong Beach Sunset',
        destination: 'Phuket',
        currentActivity: { title: 'Patong Beach Walk & Bangla Road Evening Vibes', duration: '3 Hours', priceDelta: 0, description: 'Lively beachfront and bustling night bazaars.' },
        alternativeActivities: [],
        hotelName: 'Crest Resort & Pool Villas Phuket',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 4,
        dayTitle: 'Phi Phi Islands & Maya Bay by Speedboat',
        destination: 'Phi Phi Islands',
        currentActivity: { title: 'Snorkeling at Coral Bay & Maya Beach Visit', duration: '7 Hours', priceDelta: 0, description: 'Turquoise waters, colorful marine life, and limestone karsts.' },
        alternativeActivities: [],
        hotelName: 'Crest Resort & Pool Villas Phuket',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Lunch']
      },
      {
        dayNumber: 5,
        dayTitle: 'James Bond Island & Phang Nga Bay Sea Canoe',
        destination: 'Phang Nga',
        currentActivity: { title: 'Sea Canoe through Hidden Limestone Caves', duration: '6 Hours', priceDelta: 0, description: 'Famous needle rock island and mangrove forests.' },
        alternativeActivities: [],
        hotelName: 'Crest Resort & Pool Villas Phuket',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Lunch']
      },
      {
        dayNumber: 6,
        dayTitle: 'Phuket Big Buddha & Old Sino-Portuguese Town',
        destination: 'Phuket',
        currentActivity: { title: '45-meter Marble Big Buddha Viewpoint & Old Town Cafes', duration: '5 Hours', priceDelta: 0, description: 'Colonial heritage shophouses and island panoramic viewpoints.' },
        alternativeActivities: [],
        hotelName: 'Crest Resort & Pool Villas Phuket',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 7,
        dayTitle: 'Phuket Souvenir Shopping & Departure Flight',
        destination: 'Phuket',
        currentActivity: { title: 'Cashew Nut Factory & Airport Transfer', duration: '3 Hours', priceDelta: 0, description: 'Pick up duty-free souvenirs before your flight.' },
        alternativeActivities: [],
        hotelName: 'N/A (Departure)',
        hotelTier: 'Standard',
        mealsIncluded: ['Breakfast']
      }
    ]
  },
  {
    title: 'Golden Triangle India: Delhi, Agra Taj Mahal & Jaipur Palace',
    destination: 'Delhi — Agra — Jaipur, India',
    destinationType: 'domestic',
    region: 'North India',
    theme: 'family',
    category: 'Fixed Departure',
    durationDays: 6,
    durationNights: 5,
    departureCities: ['Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata'],
    basePrice: 380,
    wholesaleCost: 290,
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Taj Mahal Sunrise Private Tour', 'Jaipur Amber Fort Elephant Ride', 'Delhi Red Fort & Qutub Minar', 'Agra Fort Heritage Walk'],
    inclusions: ['5 Nights 4-Star Hotels', 'Daily Breakfast', 'All monument entry tickets', 'AC Car with English driver', 'Taj Mahal Guide'],
    exclusions: ['Airfare', 'Personal tips', 'Lunch & Dinner (except at heritage dinner)'],
    hotelTiers: { standard: 'The Trident Hotels', deluxe: 'ITC Hotels Portfolio', luxury: 'Oberoi Amarvilas Agra' },
    isBestSeller: false,
    isFeatured: false,
    isTrending: false,
    rating: 4.6,
    reviewCount: 310,
    discountPercent: 8,
    cancellationPolicy: 'Free cancellation up to 7 days.',
    tags: ['Culture', 'Heritage', 'Family', 'Group Tours'],
    sortOrder: 8,
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival in Delhi & Historic Old Delhi Tour',
        destination: 'Delhi',
        currentActivity: { title: 'Chandni Chowk Cycle Rickshaw & Jama Masjid Walk', duration: '4 Hours', priceDelta: 0, description: 'Sensory journey through Mughal spice markets.' },
        alternativeActivities: [],
        hotelName: 'The Lalit New Delhi',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'New Delhi Monuments & Yamuna Expressway to Agra',
        destination: 'Agra',
        currentActivity: { title: 'Qutub Minar & Humayun Tomb Heritage Drive', duration: '5 Hours', priceDelta: 0, description: 'UNESCO heritage sites and smooth expressway transfer.' },
        alternativeActivities: [],
        hotelName: 'ITC Mughal Agra',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 3,
        dayTitle: 'Sunrise at Taj Mahal & Agra Fort Red Sandstone Marvel',
        destination: 'Agra',
        currentActivity: { title: 'VIP Sunrise Tour of Taj Mahal & Marble Inlay Workshop', duration: '6 Hours', priceDelta: 0, description: 'Pristine white marble glow at golden hour.' },
        alternativeActivities: [],
        hotelName: 'ITC Mughal Agra',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 4,
        dayTitle: 'Fatehpur Sikri Ghost City & Pink City Jaipur',
        destination: 'Jaipur',
        currentActivity: { title: 'Buland Darwaza Gateway & Chokhi Dhani Rajasthani Village', duration: '6 Hours', priceDelta: 0, description: 'Folk dance, puppet shows and authentic thali feast.' },
        alternativeActivities: [],
        hotelName: 'Hilton Jaipur',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 5,
        dayTitle: 'Amber Fort Royal Jeep Ride & City Palace Museums',
        destination: 'Jaipur',
        currentActivity: { title: 'Hawa Mahal Photo Stop & Jantar Mantar Observatory', duration: '6 Hours', priceDelta: 0, description: 'Maharajas royal palaces and astronomical wonders.' },
        alternativeActivities: [],
        hotelName: 'Hilton Jaipur',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 6,
        dayTitle: 'Johari Bazaar Gems & Delhi Airport Return',
        destination: 'Delhi',
        currentActivity: { title: 'Handicraft Textile Shopping & Airport Drop', duration: '5 Hours', priceDelta: 0, description: 'Smooth highway return to Delhi terminal.' },
        alternativeActivities: [],
        hotelName: 'N/A (Departure)',
        hotelTier: 'Standard',
        mealsIncluded: ['Breakfast']
      }
    ]
  },
  {
    title: 'Vietnam: Hanoi Old Quarter, Ha Long Bay & Hoi An Lanterns',
    destination: 'Vietnam',
    destinationType: 'international',
    region: 'Southeast Asia',
    theme: 'adventure',
    category: 'Group Tour',
    durationDays: 9,
    durationNights: 8,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'],
    basePrice: 980,
    wholesaleCost: 760,
    heroImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Ha Long Bay 2-Day Luxury Cruise', 'Hoi An Ancient Town Lantern Festival Walk', 'Hanoi Hoan Kiem Lake Sunrise', 'Mekong Delta Sampan Boat'],
    inclusions: ['8 Nights Hotels + Overnight Cruise Cabin', 'Breakfast Daily + 4 Dinners', 'All Domestic Flights (Hanoi-Da Nang-Ho Chi Minh)', 'Vietnam E-Visa Assistance'],
    exclusions: ['International Airfare', 'Personal Expenses', 'Shopping'],
    hotelTiers: { standard: 'Novotel Hanoi & Da Nang', deluxe: 'Fusion Maia Da Nang', luxury: 'Four Seasons The Nam Hai Hoi An' },
    isBestSeller: false,
    isFeatured: true,
    isTrending: false,
    rating: 4.8,
    reviewCount: 265,
    discountPercent: 7,
    cancellationPolicy: '70% refund up to 15 days before departure.',
    tags: ['Adventure', 'Culture', 'International'],
    sortOrder: 9,
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Welcome to Hanoi & French Quarter Evening Stroll',
        destination: 'Hanoi',
        currentActivity: { title: 'Egg Coffee Tasting & Water Puppet Theater Show', duration: '3 Hours', priceDelta: 0, description: 'Traditional Vietnamese puppetry and culinary heritage.' },
        alternativeActivities: [],
        hotelName: 'Silk Path Hotel Hanoi',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'Hanoi Temple of Literature & Ho Chi Minh Mausoleum',
        destination: 'Hanoi',
        currentActivity: { title: 'First University of Vietnam & One Pillar Pagoda', duration: '5 Hours', priceDelta: 0, description: 'Rich architectural and historical exploration.' },
        alternativeActivities: [],
        hotelName: 'Silk Path Hotel Hanoi',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 3,
        dayTitle: 'Ha Long Bay Overnight Luxury Cruise & Kayaking',
        destination: 'Ha Long Bay',
        currentActivity: { title: 'Sail through Emerald Waters & Sung Sot Cave Exploration', duration: 'Full Day', priceDelta: 0, description: 'Karst limestone towers and sunset deck party.' },
        alternativeActivities: [],
        hotelName: 'Paradise Elegance Ha Long Cruise',
        hotelTier: 'Luxury 5-Star',
        mealsIncluded: ['Breakfast', 'Lunch', 'Dinner']
      },
      {
        dayNumber: 4,
        dayTitle: 'Ha Long Tai Chi Sunrise & Flight to Da Nang',
        destination: 'Da Nang',
        currentActivity: { title: 'Morning Tai Chi on Deck & Dragon Bridge Fire Show', duration: '5 Hours', priceDelta: 0, description: 'Dramatic weekend dragon bridge illumination.' },
        alternativeActivities: [],
        hotelName: 'Novotel Da Nang Premier',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 5,
        dayTitle: 'Ba Na Hills & Golden Giant Hands Bridge',
        destination: 'Da Nang',
        currentActivity: { title: 'World Longest Cable Car & Giant Stone Hands Walkway', duration: '6 Hours', priceDelta: 0, description: 'Iconic architectural marvel suspended in the clouds.' },
        alternativeActivities: [],
        hotelName: 'Novotel Da Nang Premier',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Lunch']
      },
      {
        dayNumber: 6,
        dayTitle: 'Hoi An Ancient Lantern Town & Japanese Bridge',
        destination: 'Hoi An',
        currentActivity: { title: 'Silk Lantern Making Workshop & Night River Boat', duration: '5 Hours', priceDelta: 0, description: 'Release floating candle lanterns on the Thu Bon River.' },
        alternativeActivities: [],
        hotelName: 'Anantara Hoi An Resort',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 7,
        dayTitle: 'Flight to Ho Chi Minh City & War Remnants Museum',
        destination: 'Ho Chi Minh',
        currentActivity: { title: 'Notre-Dame Cathedral Basilica & Ben Thanh Night Market', duration: '5 Hours', priceDelta: 0, description: 'Vibrant energy of southern Vietnam metropolis.' },
        alternativeActivities: [],
        hotelName: 'Pullman Saigon Centre',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast']
      },
      {
        dayNumber: 8,
        dayTitle: 'Cu Chi Guerrilla Tunnels & Mekong Delta Sampan Boat',
        destination: 'Mekong Delta',
        currentActivity: { title: 'Jungle Underground Tunnels & Coconut Candy Village', duration: '7 Hours', priceDelta: 0, description: 'Cruising through narrow jungle waterways.' },
        alternativeActivities: [],
        hotelName: 'Pullman Saigon Centre',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Lunch']
      },
      {
        dayNumber: 9,
        dayTitle: 'Saigon Cafe Culture & Tan Son Nhat Airport Departure',
        destination: 'Ho Chi Minh',
        currentActivity: { title: 'Vietnamese Filter Coffee & Airport Drop', duration: '3 Hours', priceDelta: 0, description: 'Farewell to Vietnam.' },
        alternativeActivities: [],
        hotelName: 'N/A (Departure)',
        hotelTier: 'Standard',
        mealsIncluded: ['Breakfast']
      }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // 1. Create/update super admin
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@travelpulse.in';
    const adminPass = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({ name: 'Super Admin', email: adminEmail, password: adminPass, role: 'super_admin' });
      console.log('✅ Super admin created:', adminEmail);
    } else {
      console.log('ℹ️  Super admin already exists:', adminEmail);
    }

    // 2. Upsert rich holiday packages
    for (const pkg of SEED_PACKAGES) {
      await HolidayPackage.findOneAndUpdate(
        { title: pkg.title },
        { $set: pkg },
        { upsert: true, new: true }
      );
    }
    const count = await HolidayPackage.countDocuments();
    console.log(`✅ All ${count} holiday packages updated with full day-by-day itineraries & ratings`);

    // 3. Upsert global holiday config with rich marketing fields
    await AdminConfig.findOneAndUpdate(
      { key: 'holiday_global_config' },
      {
        $set: {
          key: 'holiday_global_config',
          partnerMarkupPercent: 15,
          groupDiscountPercent: 8,
          tourManagerIncludedByDefault: true,
          supportHelpline: '1800-209-9100',
          whatsappInquiryNumber: '+919222211100',
          enableInstantBooking: true,
          heroHeadline: 'Explore Handcrafted Holidays Across the World',
          heroSubheading:
            'Discover breathtaking holidays from majestic Kashmir & tropical Kerala to glamorous Dubai & the Swiss Alps. Guaranteed 4★ stays, authentic meals, and customizable day itineraries.',
          featuredDestinations: [
            {
              name: 'Kashmir',
              imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=300&q=80'
            },
            {
              name: 'Kerala',
              imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=300&q=80'
            },
            {
              name: 'Dubai',
              imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80'
            },
            {
              name: 'Europe',
              imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80'
            },
            {
              name: 'Thailand',
              imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=300&q=80'
            },
            {
              name: 'Bali',
              imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80'
            },
            {
              name: 'Ladakh',
              imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=300&q=80'
            },
            {
              name: 'Himachal',
              imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f841839d?auto=format&fit=crop&w=300&q=80'
            }
          ],
          announcementBanner: '🎉 Summer Special Offer: Flat 10% OFF on European & Domestic Group Tours!',
          announcementBannerEnabled: true,
          assuranceTitle: '140+ Years of Heritage & Seamless Holiday Assurance',
          assuranceBadges: ['All Meals Included Options', 'Flexi-Cancellation & Reschedule', '24/7 Dedicated Tour Manager'],
          trustPillars: [
            {
              icon: 'shield',
              title: '140+ Years of Heritage',
              description: "Trusted by 3 crore+ Indians since 1881 — India's original travel brand."
            },
            {
              icon: 'star',
              title: 'Award-Winning Packages',
              description: 'Winner of 15+ national travel excellence awards for best holiday value.'
            },
            {
              icon: 'users',
              title: 'Expert Tour Managers',
              description: 'Every group tour comes with a dedicated Hindi/English speaking tour manager.'
            },
            {
              icon: 'map',
              title: '500+ Destinations',
              description: 'From Leh to Lisbon — we craft journeys to 500+ global destinations.'
            },
            {
              icon: 'phone',
              title: '24/7 Holiday Helpdesk',
              description: 'Round-the-clock support — our specialists are always a call away.'
            }
          ],
          loyaltyPointsRate: 0.05,
          hotelTierMultiplierComfort: 0.9,
          hotelTierMultiplierSuperior: 1.0,
          hotelTierMultiplierLuxury: 1.35
        }
      },
      { upsert: true, new: true }
    );
    console.log('✅ Admin config seeded with dynamic marketing & pricing properties');

    console.log('\n🎉 Seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();

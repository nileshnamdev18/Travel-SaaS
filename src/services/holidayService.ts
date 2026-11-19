import {
  HolidayPackage,
  HolidayBookingRecord,
  AdminHolidayConfig,
  HolidayBookingStatus,
  DayItinerary,
  ActivityOption
} from '../types';
import { packagesApi, bookingsApi, configApi } from './apiClient';

// ======================== INITIAL SEED PACKAGES (Thomas Cook India Benchmark) ========================

export const INITIAL_THOMASCOOK_PACKAGES: HolidayPackage[] = [
  {
    id: 'kashmir-majestic',
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
      'Travel Insurance and Personal Tips',
      'Gondola Phase 2 High Altitude Ticket'
    ],
    hotelTiers: {
      standard: 'Grand Mumtaz / Mascot Houseboat',
      deluxe: 'Radisson Srinagar / Pahalgam Hotel',
      luxury: 'The Khyber Himalayan Resort & Spa Gulmarg'
    },
    isBestSeller: true,
    isFeatured: true,
    discountPercent: 10,
    cancellationPolicy: 'Free cancellation up to 15 days before departure.',
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival in Srinagar & Dal Lake Sunset Shikara',
        destination: 'Srinagar',
        currentActivity: {
          id: 'act-shikara',
          title: 'Sunset Shikara Cruise across Floating Gardens',
          duration: '2 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=500&q=80',
          description: 'Glide peacefully across serene waters witnessing majestic mountain reflections.'
        },
        alternativeActivities: [
          {
            id: 'act-heritage-walk',
            title: 'Old City Artisan & Pashmina Weaver Trail',
            duration: '3 Hours',
            priceDelta: 25,
            image: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=500&q=80',
            description: 'Visit century-old wooden mosques and meet master silk carpet weavers.'
          },
          {
            id: 'act-heli-flight',
            title: 'Private Srinagar City Helicopter Scenic Tour',
            duration: '30 Mins',
            priceDelta: 160,
            image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=500&q=80',
            description: 'Aerial panoramic vantage of Shankaracharya Temple and Zabarwan range.'
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
          id: 'act-gondola-p1',
          title: 'Gulmarg Gondola Cable Car (Phase 1 Kongdoori)',
          duration: '4 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1582650625119-3a31f841839d?auto=format&fit=crop&w=500&q=80',
          description: 'Ascend to 10,000 feet amidst pine forests and snowy alpine meadows.'
        },
        alternativeActivities: [
          {
            id: 'act-gondola-p2',
            title: 'High-Altitude Gondola Phase 2 Apharwat Peak (13,780 ft)',
            duration: 'Full Day',
            priceDelta: 45,
            image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&q=80',
            description: 'Reach the edge of perpetual alpine glaciers with guided safety escort.'
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
          id: 'act-betaab',
          title: 'Betaab Valley & Aru Pine Woods Excursion',
          duration: '5 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
          description: 'Picturesque valley framed by babbling streams and snow-clad peaks.'
        },
        alternativeActivities: [
          {
            id: 'act-pony-baisaran',
            title: 'Equestrian Pony Trek to Baisaran Mini-Switzerland',
            duration: '3.5 Hours',
            priceDelta: 30,
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80',
            description: 'Trek up emerald hill glades with panoramic views of the Lidder Valley.'
          }
        ],
        hotelName: 'Pahalgam Hotel Lidder Riverside',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      }
    ]
  },
  {
    id: 'dubai-dazzling',
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
      'Burj Khalifa 124th Floor Observation Deck & Dubai Mall',
      'Red Dune Desert Safari with BBQ Dinner & Tanoura Show',
      'Luxury Marina Dhow Cruise with International Buffet',
      'Full Day Abu Dhabi Tour & Sheikh Zayed Grand Mosque'
    ],
    inclusions: [
      '4 Nights in 4-Star City Center Hotel (Deira/Bur Dubai)',
      'Daily International Buffet Breakfast',
      'Burj Khalifa At The Top Non-Prime Entry Ticket',
      '4x4 Land Cruiser Dune Bashing with BBQ Dinner',
      'Abu Dhabi City Tour & Grand Mosque Entry',
      'All Sightseeing in Air-Conditioned Coach'
    ],
    exclusions: [
      'Tourism Dirham Tax (payable directly to hotel)',
      'UAE Tourist Visa (can be bundled via Atlys Visa Desk)',
      'Personal Shopping and Alcoholic Beverages'
    ],
    hotelTiers: {
      standard: 'Howard Johnson Bur Dubai',
      deluxe: 'JW Marriott Marquis Dubai',
      luxury: 'Atlantis, The Palm'
    },
    isBestSeller: true,
    isTrending: true,
    discountPercent: 12,
    cancellationPolicy: '100% refund up to 10 days before flight date.',
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival in Dubai & Marina Dhow Cruise',
        destination: 'Dubai Marina',
        currentActivity: {
          id: 'act-dhow',
          title: 'Dubai Marina Luxury Glass Dhow Cruise with Buffet',
          duration: '3 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500&q=80',
          description: 'Sail amidst illuminated futuristic skyscrapers with live saxophone performance.'
        },
        alternativeActivities: [
          {
            id: 'act-yacht',
            title: 'Private 50-Foot Yacht Tour past Ain Dubai',
            duration: '2 Hours',
            priceDelta: 95,
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80',
            description: 'VIP private boat cruise along JBR beachfront and Bluewaters Island.'
          }
        ],
        hotelName: 'Novotel Bur Dubai',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'Burj Khalifa Sky Deck & Desert Safari',
        destination: 'Downtown & Lahbab Dunes',
        currentActivity: {
          id: 'act-burj-desert',
          title: 'Burj Khalifa Level 124 & 4x4 Desert Safari BBQ',
          duration: 'Full Day',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=500&q=80',
          description: 'Panoramic views from the world tallest building followed by thrilling desert dune bashing.'
        },
        alternativeActivities: [
          {
            id: 'act-quad-bike',
            title: 'Add 350cc Desert Quad Biking Experience',
            duration: '45 Mins',
            priceDelta: 40,
            image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=500&q=80',
            description: 'Conquer red dunes on high-performance all-terrain quad bikes.'
          }
        ],
        hotelName: 'Novotel Bur Dubai',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      }
    ]
  },
  {
    id: 'kerala-backwaters',
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
    galleryImages: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: [
      'Munnar Misty Rolling Tea Plantations & Mattupetty Dam',
      'Thekkady Periyar Wildlife Sanctuary Boating',
      'Exclusive Overnight Deluxe Alleppey Houseboat with All Meals',
      'Authentic Kalaripayattu Martial Arts & Kathakali Dance Show'
    ],
    inclusions: [
      '4 Nights Accommodation (Munnar + Thekkady + Alleppey Houseboat)',
      'Breakfasts at all hotels + All Meals on Houseboat',
      'AC Private Cab for all Transfers & Sightseeing',
      'Periyar Lake Boat Safari Entry Tickets'
    ],
    exclusions: ['Airfare / Train tickets to Cochin', 'Spice Plantation tour entry'],
    hotelTiers: {
      standard: 'Amber Dale Munnar',
      deluxe: 'Fragrant Nature Munnar',
      luxury: 'Kumarakom Lake Resort'
    },
    isBestSeller: true,
    discountPercent: 15,
    cancellationPolicy: 'Free cancellation up to 7 days before check-in.',
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Cochin Arrival & Scenic Drive to Munnar Hills',
        destination: 'Munnar',
        currentActivity: {
          id: 'act-cheeyappara',
          title: 'Cheeyappara Waterfalls & Valara Cascades Stopover',
          duration: '4 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=500&q=80',
          description: 'Wind through mist-covered Western Ghats with panoramic views of cascading waterfalls.'
        },
        alternativeActivities: [],
        hotelName: 'Tea County Resort Munnar',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'Overnight Cruise across Alleppey Backwaters',
        destination: 'Alleppey',
        currentActivity: {
          id: 'act-houseboat',
          title: 'Traditional Kettuvallam Private Houseboat Cruise',
          duration: 'Overnight',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=80',
          description: 'Drift past paddy fields, coconut palms, and rural village life with personal chef on board.'
        },
        alternativeActivities: [],
        hotelName: 'Alleppey Premium Houseboat',
        hotelTier: 'Luxury 5-Star',
        mealsIncluded: ['Breakfast', 'Lunch', 'Dinner']
      }
    ]
  },
  {
    id: 'europe-swiss-paris',
    title: 'Swiss Alps & Paris Romantic Grandeur',
    destination: 'Switzerland & France',
    destinationType: 'international',
    region: 'Europe',
    theme: 'honeymoon',
    category: 'Group Tour',
    durationDays: 8,
    durationNights: 7,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru'],
    basePrice: 1650,
    wholesaleCost: 1320,
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: [
      'Paris Eiffel Tower 2nd Level & Seine River Illuminations Cruise',
      'Full Day Disneyland Paris Magic Kingdom Pass',
      'Mt Titlis Revolving Rotair Cable Car & Cliff Walk',
      'Lucerne Chapel Bridge, Lion Monument & Zurich Lake Promenade'
    ],
    inclusions: [
      '7 Nights in 4-Star European Hotels',
      'Continental Buffet Breakfasts Daily + 5 Indian Dinners',
      'Eiffel Tower Level 2 Entry & Seine Cruise Tickets',
      'Mt Titlis Cable Car & Ice Flyer Excursion',
      'TGV High Speed Train from Paris to Basel',
      'Thomas Cook Professional Tour Manager throughout the tour'
    ],
    exclusions: ['Schengen Tourist Visa Fee', 'City Tourist Taxes'],
    hotelTiers: {
      standard: 'Novotel Paris Porte de Versailles / B&B Zurich',
      deluxe: 'Mercure Paris Centre Tour Eiffel / Radisson Blu Lucerne',
      luxury: 'Grand Hotel des Bains Kempinski St. Moritz'
    },
    isBestSeller: true,
    isFeatured: true,
    discountPercent: 8,
    cancellationPolicy: 'Refundable up to 21 days before departure.',
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Bonjour Paris: Eiffel Tower & Seine Cruise',
        destination: 'Paris',
        currentActivity: {
          id: 'act-eiffel',
          title: 'Eiffel Tower Level 2 Panoramic Vista & Seine River Cruise',
          duration: '4 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80',
          description: 'Gaze out across the City of Light from the Eiffel Tower followed by a romantic sunset cruise.'
        },
        alternativeActivities: [
          {
            id: 'act-louvre',
            title: 'Louvre Museum Mona Lisa Guided Skip-The-Line Tour',
            duration: '3 Hours',
            priceDelta: 65,
            image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=500&q=80',
            description: 'Explore masterworks in the world most celebrated palace of fine arts.'
          }
        ],
        hotelName: 'Courtyard by Marriott Paris',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2,
        dayTitle: 'Swiss Alps Wonder: Mt Titlis Glacier Experience',
        destination: 'Engelberg & Lucerne',
        currentActivity: {
          id: 'act-titlis',
          title: 'Mt Titlis Rotair Cable Car, Ice Cave & Suspension Cliff Walk',
          duration: 'Full Day',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=500&q=80',
          description: 'Ascend to 10,000 feet in the world first revolving cable car to experience eternal snow and ice.'
        },
        alternativeActivities: [],
        hotelName: 'Radisson Blu Hotel Lucerne',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      }
    ]
  },
  {
    id: 'thailand-tropical',
    title: 'Thailand Beach Bliss & City Lights: Phuket & Bangkok',
    destination: 'Phuket & Bangkok, Thailand',
    destinationType: 'international',
    region: 'Southeast Asia',
    theme: 'adventure',
    category: 'Customized',
    durationDays: 5,
    durationNights: 4,
    departureCities: ['Mumbai', 'Delhi', 'Kolkata', 'Bengaluru', 'Chennai'],
    basePrice: 480,
    wholesaleCost: 360,
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: [
      'Phi Phi Islands & Maya Bay by Luxury Speedboat with Buffet Lunch',
      'Phuket Fantasea Cultural Theme Show with Royal Feast',
      'Bangkok Reclining Buddha & Golden Temple City Tour',
      'Chao Phraya Princess Dinner Cruise with Live Band'
    ],
    inclusions: [
      '2 Nights Phuket 4-Star Resort + 2 Nights Bangkok Hotel',
      'Daily Buffet Breakfasts + Phi Phi Island Lunch',
      'Speedboat transfers to Phi Phi, Maya Bay and snorkeling gear',
      'Bangkok Temples Tour & Airport Transfers'
    ],
    exclusions: ['National Marine Park fee (approx 400 THB)'],
    hotelTiers: {
      standard: 'Best Western Patong / Ramada Bangkok',
      deluxe: 'Amari Phuket / The Berkeley Hotel Pratunam',
      luxury: 'Banyan Tree Phuket / The Peninsula Bangkok'
    },
    isBestSeller: true,
    discountPercent: 18,
    cancellationPolicy: 'Free cancellation up to 7 days before travel.',
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Phi Phi Islands & Coral Reef Snorkel Adventure',
        destination: 'Phi Phi & Maya Bay',
        currentActivity: {
          id: 'act-phiphi',
          title: 'Speedboat Excursion to Phi Phi Don, Phi Phi Leh & Maya Bay',
          duration: 'Full Day',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=500&q=80',
          description: 'Swim in crystal emerald waters and sunbathe on Leonardo DiCaprio famous Maya Beach.'
        },
        alternativeActivities: [],
        hotelName: 'Centara Grand Beach Resort Phuket',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Lunch']
      }
    ]
  },
  {
    id: 'ladakh-high-passes',
    title: 'Leh-Ladakh Pangong Lake & Nubra Valley High Expedition',
    destination: 'Ladakh, India',
    destinationType: 'domestic',
    region: 'North India',
    theme: 'adventure',
    category: 'Group Tour',
    durationDays: 6,
    durationNights: 5,
    departureCities: ['Delhi', 'Mumbai', 'Chandigarh'],
    basePrice: 590,
    wholesaleCost: 440,
    heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: [
      'Drive across Khardung La (World Highest Motorable Road at 17,982 ft)',
      'Double-Humped Bactrian Camel Ride on Hunder Sand Dunes',
      'Overnight Luxury Camp on the Shores of Pangong Tso Blue Lake',
      'Thiksey & Hemis Historic Buddhist Monasteries'
    ],
    inclusions: [
      '5 Nights Stay in Leh Hotels & Pangong Lake Swiss Camps',
      'Buffet Breakfast & Warm Himalayan Dinners',
      'Oxygen Cylinder Equipped 4x4 Vehicle throughout Tour',
      'Inner Line Permits and Wildlife Fees Included'
    ],
    exclusions: ['Airfare to Leh Kushok Bakula Airport'],
    hotelTiers: {
      standard: 'Hotel Singge Palace Leh / Pangong Camp',
      deluxe: 'The Grand Dragon Ladakh',
      luxury: 'Chamba Camp Thiksey (Luxury Glamping)'
    },
    isFeatured: true,
    discountPercent: 10,
    cancellationPolicy: 'Free cancellation up to 14 days before tour.',
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Pangong Tso Color-Changing High Altitude Lake',
        destination: 'Pangong Tso',
        currentActivity: {
          id: 'act-pangong',
          title: 'Sunset at 14,270 ft Pangong Lake & Stargazing',
          duration: 'Overnight',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=500&q=80',
          description: 'Marvel as lake waters shift from deep turquoise to azure beneath crystalline starry skies.'
        },
        alternativeActivities: [],
        hotelName: 'Pangong Sarai Luxury Camps',
        hotelTier: 'Superior',
        mealsIncluded: ['Breakfast', 'Dinner']
      }
    ]
  },
  {
    id: 'bali-luxury',
    title: 'Bali Tropical Luxury: Ubud Terraces & Uluwatu Clifftops',
    destination: 'Bali, Indonesia',
    destinationType: 'international',
    region: 'Southeast Asia',
    theme: 'luxury',
    category: 'Customized',
    durationDays: 7,
    durationNights: 6,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Kolkata'],
    basePrice: 890,
    wholesaleCost: 710,
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: [
      'Private Infinity Pool Villa in Ubud Jungle Sanctuary',
      'Nusa Penida Kelingking T-Rex Beach Fastboat Tour',
      'Uluwatu Clifftop Sunset & Sacred Kecak Fire Dance',
      'Floating Breakfast & 2-Hour Balinese Hot Stone Spa'
    ],
    inclusions: [
      '3 Nights Pool Villa Ubud + 3 Nights 5-Star Beach Resort Seminyak',
      'Daily Floating Breakfasts & Afternoon Teas',
      'Private AC Car with English-speaking Balinese Guide',
      'Full Day Nusa Penida Island Speedboat Tour & Island Snorkeling'
    ],
    exclusions: ['Bali Visa On Arrival ($35 payable at Denpasar Airport)'],
    hotelTiers: {
      standard: 'The Kayon Jungle Resort Ubud',
      deluxe: 'Four Seasons Resort Bali at Sayan',
      luxury: 'Bulgari Resort Bali'
    },
    isBestSeller: true,
    discountPercent: 14,
    cancellationPolicy: 'Free cancellation up to 10 days before check-in.',
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival in Denpasar & Ubud Rainforest Welcome',
        destination: 'Ubud',
        currentActivity: {
          id: 'act-ubud-walk',
          title: 'Tegallalang Emerald Rice Terraces & Jungle Swing',
          duration: '3 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=500&q=80',
          description: 'Wander sculpted rice paddies and experience the world-famous jungle swing.'
        },
        alternativeActivities: [
          {
            id: 'act-ubud-spa',
            title: 'Royal Balinese Herbal Boreh 2-Hour Spa Ritual',
            duration: '2 Hours',
            priceDelta: 50,
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80',
            description: 'Relax with traditional volcanic warm clay wrap and flower petal bath.'
          }
        ],
        hotelName: 'The Kayon Jungle Resort Ubud',
        hotelTier: 'Luxury 5-Star',
        mealsIncluded: ['Dinner']
      }
    ]
  },
  {
    id: 'vietnam-heritage',
    title: 'Vietnam Heritage & Halong Bay Luxury Cruise',
    destination: 'Hanoi & Halong Bay, Vietnam',
    destinationType: 'international',
    region: 'Southeast Asia',
    theme: 'family',
    category: 'Customized',
    durationDays: 6,
    durationNights: 5,
    departureCities: ['Mumbai', 'Delhi', 'Kolkata'],
    basePrice: 720,
    wholesaleCost: 550,
    heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: [
      'Overnight 5-Star Halong Bay Cruise with Limestone Island Kayaking',
      'Hanoi French Colonial Quarter & Water Puppet Show',
      'Ba Na Hills Golden Giant Hand Bridge in Da Nang',
      'Lantern-Lit Historic Night Walk in Ancient Hoi An Town'
    ],
    inclusions: [
      '5 Nights Accommodation including Overnight Halong Bay Cruise',
      'All Meals on Cruise (Seafood & Asian Buffets) + Daily Breakfasts',
      'Ba Na Hills Cable Car & Golden Bridge Entry',
      'Private Airport Transfers throughout'
    ],
    exclusions: ['Vietnam e-Visa ($25 via Atlys Portal)'],
    hotelTiers: {
      standard: 'Silk Path Hotel Hanoi / Mon Cheri Cruise',
      deluxe: 'InterContinental Hanoi Westlake / Stellar of the Seas Cruise',
      luxury: 'Sofitel Legend Metropole Hanoi'
    },
    isTrending: true,
    discountPercent: 12,
    cancellationPolicy: 'Free cancellation up to 12 days before arrival.',
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Overnight 5-Star Halong Bay Limestone Cruise',
        destination: 'Halong Bay',
        currentActivity: {
          id: 'act-halong',
          title: 'Kayaking in Luon Cave & Sunset Deck Party',
          duration: 'Overnight',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=500&q=80',
          description: 'Sail through thousands of jagged limestone karsts with cooking class and night squid fishing.'
        },
        alternativeActivities: [],
        hotelName: 'Mon Cheri 5-Star Luxury Cruise',
        hotelTier: 'Luxury 5-Star',
        mealsIncluded: ['Lunch', 'Dinner']
      }
    ]
  }
];

// ======================== INITIAL SEED BOOKINGS ========================

export const INITIAL_THOMASCOOK_BOOKINGS: HolidayBookingRecord[] = [
  {
    id: 'tc-bk-101',
    bookingReference: 'TC-IN-984210',
    packageId: 'kashmir-majestic',
    packageTitle: 'Kashmir Majestic Valleys & Alpine Gondola Odyssey',
    destination: 'Kashmir, India',
    destinationType: 'domestic',
    customerName: 'Rohit Sharma & Family',
    customerEmail: 'rohit.sharma@gmail.com',
    customerPhone: '+91 98201 44521',
    departureCity: 'Mumbai',
    travelDate: '2026-12-10',
    paxAdults: 2,
    paxChildren: 1,
    selectedHotelTier: 'Superior',
    totalAmountUSD: 1625,
    wholesaleCostUSD: 1275,
    markupAmountUSD: 350,
    status: 'confirmed',
    customNotes: 'Requested river-facing room in Pahalgam and extra shikara hour in Srinagar.',
    createdAt: '2026-11-12 14:20'
  },
  {
    id: 'tc-bk-102',
    bookingReference: 'TC-IN-492108',
    packageId: 'dubai-dazzling',
    packageTitle: 'Dazzling Dubai & Abu Dhabi Grand Extravaganza',
    destination: 'Dubai, UAE',
    destinationType: 'international',
    customerName: 'Ananya Verma',
    customerEmail: 'ananya.verma@outlook.com',
    customerPhone: '+91 99304 88129',
    departureCity: 'Delhi',
    travelDate: '2026-12-24',
    paxAdults: 2,
    paxChildren: 0,
    selectedHotelTier: 'Luxury 5-Star',
    totalAmountUSD: 1950,
    wholesaleCostUSD: 1525,
    markupAmountUSD: 425,
    status: 'quote_sent',
    customNotes: 'Honeymoon couple. Requested Burj Khalifa sunset slot and private yacht upgrade.',
    createdAt: '2026-11-14 11:05'
  },
  {
    id: 'tc-bk-103',
    bookingReference: 'TC-IN-310928',
    packageId: 'europe-swiss-paris',
    packageTitle: 'Swiss Alps & Paris Romantic Grandeur',
    destination: 'Switzerland & France',
    destinationType: 'international',
    customerName: 'Dr. Vikram Malhotra',
    customerEmail: 'vikram.malhotra@apollo.org',
    customerPhone: '+91 98410 72109',
    departureCity: 'Bengaluru',
    travelDate: '2027-01-15',
    paxAdults: 4,
    paxChildren: 0,
    selectedHotelTier: 'Superior',
    totalAmountUSD: 6600,
    wholesaleCostUSD: 5280,
    markupAmountUSD: 1320,
    status: 'inquiry_received',
    customNotes: 'Group departure with Hindi Tour Manager. Vegetarian Indian meals requested.',
    createdAt: '2026-11-15 09:30'
  }
];

// ======================== INITIAL ADMIN CONFIG ========================

export const INITIAL_ADMIN_HOLIDAY_CONFIG: AdminHolidayConfig = {
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
    { name: 'Kashmir', imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=300&q=80' },
    { name: 'Kerala', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=300&q=80' },
    { name: 'Dubai', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80' },
    { name: 'Europe', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80' },
    { name: 'Thailand', imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=300&q=80' },
    { name: 'Bali', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80' }
  ],
  announcementBanner: '🎉 Summer Special Offer: Flat 10% OFF on European & Domestic Group Tours!',
  announcementBannerEnabled: true,
  assuranceTitle: '140+ Years of Heritage & Seamless Holiday Assurance',
  assuranceBadges: ['All Meals Included Options', 'Flexi-Cancellation & Reschedule', '24/7 Dedicated Tour Manager'],
  trustPillars: [
    { icon: 'shield', title: '140+ Years of Heritage', description: "Trusted by 3 crore+ Indians since 1881 — India's original travel brand." },
    { icon: 'star', title: 'Award-Winning Packages', description: 'Winner of 15+ national travel excellence awards for best holiday value.' },
    { icon: 'users', title: 'Expert Tour Managers', description: 'Every group tour comes with a dedicated Hindi/English speaking tour manager.' },
    { icon: 'map', title: '500+ Destinations', description: 'From Leh to Lisbon — we craft journeys to 500+ global destinations.' },
    { icon: 'phone', title: '24/7 Holiday Helpdesk', description: 'Round-the-clock support — our specialists are always a call away.' }
  ],
  loyaltyPointsRate: 0.05,
  hotelTierMultiplierComfort: 0.9,
  hotelTierMultiplierSuperior: 1.0,
  hotelTierMultiplierLuxury: 1.35
};

// ======================== SERVICE CLASS ========================

class HolidayBackendService {
  private STORAGE_KEY_PACKAGES = 'thomascook_holiday_packages_db';
  private STORAGE_KEY_BOOKINGS = 'thomascook_holiday_bookings_db';
  private STORAGE_KEY_CONFIG = 'thomascook_holiday_admin_config_db';

  constructor() {
    this.syncFromBackend();
  }

  /**
   * Syncs packages and config from Express + MongoDB backend
   */
  public async syncFromBackend(): Promise<void> {
    try {
      const res = await packagesApi.list({ limit: 50 });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: HolidayPackage[] = res.data.map(p => ({
          id: p._id || (p as any).id,
          title: p.title,
          destination: p.destination,
          destinationType: p.destinationType,
          region: p.region || '',
          theme: (p.theme as any) || 'family',
          category: (p.category as any) || 'Customized',
          durationDays: p.durationDays,
          durationNights: p.durationNights,
          departureCities: p.departureCities || ['Mumbai', 'Delhi'],
          basePrice: p.basePrice,
          wholesaleCost: (p as any).wholesaleCost || Math.round(p.basePrice * 0.78),
          heroImage: p.heroImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
          galleryImages: p.galleryImages || [],
          highlights: p.highlights || [],
          inclusions: p.inclusions || [],
          exclusions: p.exclusions || [],
          hotelTiers: {
            standard: p.hotelTiers?.standard || 'Standard Quality Accommodations',
            deluxe: p.hotelTiers?.deluxe || 'Deluxe 4-Star Accommodations',
            luxury: p.hotelTiers?.luxury || 'Luxury 5-Star Accommodations'
          },
          isBestSeller: p.isBestSeller || false,
          isFeatured: p.isFeatured || false,
          isTrending: p.isTrending || false,
          rating: p.rating ?? 4.5,
          reviewCount: p.reviewCount ?? 120,
          discountPercent: p.discountPercent || 0,
          cancellationPolicy: p.cancellationPolicy || 'Standard cancellation policy applies.',
          days: (p.days as any) || []
        }));
        this.savePackages(mapped);
      }
    } catch {
      // offline dev mode: local storage used
    }

    try {
      const cfgRes = await configApi.getPublic();
      if (cfgRes && cfgRes.success && cfgRes.data) {
        const current = this.getAdminConfig();
        // Normalize featuredDestinations: may be string[] or {name, imageUrl}[]
        const rawFeatured = (cfgRes.data as any).featuredDestinations;
        const normalizedFeatured: Array<{ name: string; imageUrl: string }> = Array.isArray(rawFeatured)
          ? rawFeatured.map((d: any) =>
              typeof d === 'string' ? { name: d, imageUrl: '' } : d
            )
          : [];
        const merged: AdminHolidayConfig = {
          ...current,
          ...(cfgRes.data as any),
          featuredDestinations: normalizedFeatured
        };
        this.saveAdminConfig(merged);
      }
    } catch {
      // offline
    }
  }

  // 1. Packages CRUD
  public getPackages(): HolidayPackage[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_PACKAGES);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
    this.savePackages(INITIAL_THOMASCOOK_PACKAGES);
    return INITIAL_THOMASCOOK_PACKAGES;
  }

  public getPackageById(id: string): HolidayPackage | undefined {
    return this.getPackages().find(p => p.id === id);
  }

  public savePackages(packages: HolidayPackage[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_PACKAGES, JSON.stringify(packages));
    } catch (e) {
      // ignore
    }
  }

  public updatePackage(id: string, updates: Partial<HolidayPackage>): HolidayPackage[] {
    const list = this.getPackages();
    const updated = list.map(p => p.id === id ? { ...p, ...updates } : p);
    this.savePackages(updated);

    // Sync to Express MongoDB
    packagesApi.patch(id, updates as any).catch(() => {
      // offline fallback
    });

    return updated;
  }

  public addPackage(newPkg: HolidayPackage): HolidayPackage[] {
    const list = this.getPackages();
    const updated = [newPkg, ...list];
    this.savePackages(updated);

    // Sync to Express MongoDB
    packagesApi.create(newPkg as any).catch(() => {
      // offline fallback
    });

    return updated;
  }

  public deletePackage(id: string): HolidayPackage[] {
    const list = this.getPackages();
    const updated = list.filter(p => p.id !== id);
    this.savePackages(updated);

    // Sync to Express MongoDB
    packagesApi.remove(id).catch(() => {
      // offline fallback
    });

    return updated;
  }

  // 2. Bookings / Inquiries CRUD
  public getBookings(): HolidayBookingRecord[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_BOOKINGS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
    this.saveBookings(INITIAL_THOMASCOOK_BOOKINGS);
    return INITIAL_THOMASCOOK_BOOKINGS;
  }

  public saveBookings(bookings: HolidayBookingRecord[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      // ignore
    }
  }

  public createBooking(booking: Partial<HolidayBookingRecord>): HolidayBookingRecord {
    const bookings = this.getBookings();
    const bookingReference = `TC-IN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: HolidayBookingRecord = {
      id: `tc-bk-${Date.now()}`,
      bookingReference,
      packageId: booking.packageId || 'kashmir-majestic',
      packageTitle: booking.packageTitle || 'Holiday Package',
      destination: booking.destination || 'India',
      destinationType: booking.destinationType || 'domestic',
      customerName: booking.customerName || 'Guest Traveler',
      customerEmail: booking.customerEmail || 'traveler@gmail.com',
      customerPhone: booking.customerPhone || '+91 98765 43210',
      departureCity: booking.departureCity || 'Mumbai',
      travelDate: booking.travelDate || new Date().toISOString().split('T')[0],
      paxAdults: booking.paxAdults || 2,
      paxChildren: booking.paxChildren || 0,
      selectedHotelTier: booking.selectedHotelTier || 'Superior',
      totalAmountUSD: booking.totalAmountUSD || 800,
      wholesaleCostUSD: booking.wholesaleCostUSD || 650,
      markupAmountUSD: booking.markupAmountUSD || 150,
      status: booking.status || 'inquiry_received',
      customNotes: booking.customNotes || 'Inquiry created via Thomas Cook online portal.',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    const updated = [newRecord, ...bookings];
    this.saveBookings(updated);

    // Sync to Express MongoDB
    if (booking.packageId) {
      bookingsApi.create({
        packageId: booking.packageId,
        customerPhone: booking.customerPhone || '+91 98765 43210',
        travelDateFrom: booking.travelDate || new Date().toISOString(),
        adults: booking.paxAdults || 2,
        children: booking.paxChildren || 0,
        departureCitySelected: booking.departureCity || 'Mumbai',
        specialRequests: booking.customNotes
      }).catch(() => {
        // offline fallback
      });
    }

    return newRecord;
  }

  public updateBookingStatus(
    bookingReference: string,
    status: HolidayBookingStatus,
    note?: string
  ): HolidayBookingRecord[] {
    const list = this.getBookings();
    const updated = list.map(b => {
      if (b.bookingReference === bookingReference || b.id === bookingReference) {
        return {
          ...b,
          status,
          customNotes: note ? `${b.customNotes || ''} | ${note}` : b.customNotes
        };
      }
      return b;
    });
    this.saveBookings(updated);

    // Sync to Express MongoDB
    const target = list.find(b => b.bookingReference === bookingReference || b.id === bookingReference);
    if (target) {
      bookingsApi.updateStatus(target.id, status, note).catch(() => {});
    }

    return updated;
  }

  // 3. Admin Configuration
  public getAdminConfig(): AdminHolidayConfig {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_CONFIG);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
    this.saveAdminConfig(INITIAL_ADMIN_HOLIDAY_CONFIG);
    return INITIAL_ADMIN_HOLIDAY_CONFIG;
  }

  public saveAdminConfig(cfg: AdminHolidayConfig): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_CONFIG, JSON.stringify(cfg));
    } catch (e) {
      // ignore
    }

    // Sync to Express MongoDB
    configApi.update(cfg as any).catch(() => {});
  }

  public calculatePackageSellingPrice(basePrice: number, partnerMarkupPercent: number): number {
    return Math.round(basePrice * (1 + partnerMarkupPercent / 100));
  }
}

export const holidayBackend = new HolidayBackendService();

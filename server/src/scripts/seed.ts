/**
 * Seed script: seeds MongoDB with admin user, holiday packages, and default config.
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
    durationDays: 6, durationNights: 5,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad', 'Kolkata'],
    basePrice: 650, wholesaleCost: 510,
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
    isBestSeller: true, isFeatured: true, isTrending: false,
    discountPercent: 10,
    cancellationPolicy: 'Free cancellation up to 15 days before departure.',
    tags: ['Honeymoon', 'Adventure', 'Group Tours'],
    sortOrder: 1,
    days: [
      {
        dayNumber: 1, dayTitle: 'Arrival in Srinagar & Dal Lake Sunset Shikara', destination: 'Srinagar',
        currentActivity: { title: 'Sunset Shikara Cruise across Floating Gardens', duration: '2 Hours', priceDelta: 0, image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=500&q=80', description: 'Glide peacefully across serene waters.' },
        alternativeActivities: [{ title: 'Old City Artisan & Pashmina Weaver Trail', duration: '3 Hours', priceDelta: 25, image: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=500&q=80', description: 'Visit century-old wooden mosques.' }],
        hotelName: 'Mascot Heritage Luxury Houseboat', hotelTier: 'Superior', mealsIncluded: ['Dinner']
      },
      {
        dayNumber: 2, dayTitle: 'Gulmarg Meadow of Flowers & Snow Glaciers', destination: 'Gulmarg',
        currentActivity: { title: 'Gulmarg Gondola Cable Car (Phase 1 Kongdoori)', duration: '4 Hours', priceDelta: 0, image: 'https://images.unsplash.com/photo-1582650625119-3a31f841839d?auto=format&fit=crop&w=500&q=80', description: 'Ascend to 10,000 feet.' },
        alternativeActivities: [{ title: 'High-Altitude Gondola Phase 2 Apharwat Peak', duration: 'Full Day', priceDelta: 45, image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&q=80', description: 'Reach perpetual alpine glaciers.' }],
        hotelName: 'The Khyber Himalayan Resort & Spa', hotelTier: 'Luxury 5-Star', mealsIncluded: ['Breakfast', 'Dinner']
      },
      {
        dayNumber: 3, dayTitle: 'Pahalgam Valley of Shepherds & River Woods', destination: 'Pahalgam',
        currentActivity: { title: 'Betaab Valley & Aru Pine Woods Excursion', duration: '5 Hours', priceDelta: 0, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80', description: 'Picturesque valley.' },
        alternativeActivities: [],
        hotelName: 'Pahalgam Hotel Lidder Riverside', hotelTier: 'Superior', mealsIncluded: ['Breakfast', 'Dinner']
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
    durationDays: 5, durationNights: 4,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai'],
    basePrice: 780, wholesaleCost: 610,
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Burj Khalifa 124th Floor Observation Deck', 'Red Dune Desert Safari with BBQ Dinner', 'Marina Dhow Cruise', 'Full Day Abu Dhabi Tour'],
    inclusions: ['4 Nights in 4-Star Hotel', 'Daily Breakfast', 'Burj Khalifa Entry', '4x4 Dune Bashing', 'Abu Dhabi City Tour'],
    exclusions: ['Tourism Dirham Tax', 'UAE Tourist Visa', 'Personal Shopping'],
    hotelTiers: { standard: 'Howard Johnson Bur Dubai', deluxe: 'JW Marriott Marquis Dubai', luxury: 'Atlantis The Palm' },
    isBestSeller: true, isFeatured: true, isTrending: true,
    discountPercent: 12,
    cancellationPolicy: '100% refund up to 10 days before departure.',
    tags: ['Family', 'Luxury', 'International'],
    sortOrder: 2,
    days: []
  },
  {
    title: 'Enchanting Kerala: Munnar Tea Hills & Alleppey Houseboat',
    destination: 'Kerala, India',
    destinationType: 'domestic',
    region: 'South India',
    theme: 'family',
    category: 'Customized',
    durationDays: 5, durationNights: 4,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai'],
    basePrice: 520, wholesaleCost: 390,
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Munnar Tea Plantations', 'Thekkady Wildlife Boating', 'Alleppey Houseboat', 'Kalaripayattu Show'],
    inclusions: ['4 Nights Accommodation', 'All Meals on Houseboat', 'AC Private Cab', 'Periyar Lake Boat Safari'],
    exclusions: ['Airfare', 'Spice Plantation entry'],
    hotelTiers: { standard: 'Amber Dale Munnar', deluxe: 'Fragrant Nature Munnar', luxury: 'Kumarakom Lake Resort' },
    isBestSeller: true, isFeatured: false, isTrending: false,
    discountPercent: 15,
    cancellationPolicy: 'Free cancellation up to 7 days before check-in.',
    tags: ['Backwaters', 'Nature', 'Family'],
    sortOrder: 3,
    days: []
  },
  {
    title: 'Bali: Island of Gods — Ubud Villas & Seminyak Beaches',
    destination: 'Bali, Indonesia',
    destinationType: 'international',
    region: 'Southeast Asia',
    theme: 'honeymoon',
    category: 'Customized',
    durationDays: 7, durationNights: 6,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'],
    basePrice: 850, wholesaleCost: 650,
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Private Infinity Pool Villa in Ubud', 'Tegallalang Rice Terrace Sunrise Trek', 'Mount Batur Volcanic Hike', 'Seminyak Beach Club Sunset'],
    inclusions: ['6 Nights Private Pool Villa', 'Daily Breakfast & 3 Dinners', 'All Airport Transfers', 'Mount Batur Trek with Guide'],
    exclusions: ['International Airfare', 'Indonesian Visa on Arrival', 'Personal Spa Expenses'],
    hotelTiers: { standard: 'Alaya Resort Ubud', deluxe: 'The Layar Villas Seminyak', luxury: 'Four Seasons Jimbaran Bay' },
    isBestSeller: true, isFeatured: true, isTrending: true,
    discountPercent: 8,
    cancellationPolicy: 'Free cancellation up to 14 days before departure.',
    tags: ['Honeymoon', 'Beach', 'Luxury'],
    sortOrder: 4,
    days: []
  },
  {
    title: 'Swiss Alps & Paris Romantic Grand Tour',
    destination: 'Switzerland & France',
    destinationType: 'international',
    region: 'Europe',
    theme: 'honeymoon',
    category: 'Group Tour',
    durationDays: 10, durationNights: 9,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad'],
    basePrice: 2200, wholesaleCost: 1750,
    heroImage: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=900&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Jungfraujoch Top of Europe by Rail', 'Lake Geneva Scenic Cruise', 'Eiffel Tower Summit', 'Versailles Palace & Gardens'],
    inclusions: ['9 Nights 4-Star Hotels', 'Daily Breakfast', 'All Coach Transfers', 'Hindi/English Tour Manager', 'Jungfraujoch Rail Pass'],
    exclusions: ['International Flights', 'Schengen Visa', 'Personal Shopping'],
    hotelTiers: { standard: 'Ibis Hotels Switzerland & Paris', deluxe: 'Mövenpick Hotels', luxury: 'Baur au Lac Zürich & George V Paris' },
    isBestSeller: false, isFeatured: true, isTrending: false,
    discountPercent: 5,
    cancellationPolicy: '75% refund up to 20 days before departure.',
    tags: ['Honeymoon', 'Europe', 'Group Tours', 'Culture'],
    sortOrder: 5,
    days: []
  },
  {
    title: 'Himachal Hills: Shimla, Manali & Spiti Valley Circuit',
    destination: 'Himachal Pradesh, India',
    destinationType: 'domestic',
    region: 'North India',
    theme: 'adventure',
    category: 'Group Tour',
    durationDays: 8, durationNights: 7,
    departureCities: ['Delhi', 'Chandigarh', 'Mumbai', 'Kolkata'],
    basePrice: 490, wholesaleCost: 380,
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
    galleryImages: [],
    highlights: ['Rohtang Pass Snow Point', 'Solang Valley Adventure Sports', 'Shimla Heritage Mall Road', 'Spiti Monastery Trail'],
    inclusions: ['7 Nights Hotels & Camps', 'Breakfast + Dinner', 'AC Traveller/Tempo for all transfers', 'Rohtang Pass Permit'],
    exclusions: ['Airfare to Delhi/Chandigarh', 'Adventure sports fees'],
    hotelTiers: { standard: 'Hotel Apple Country Manali', deluxe: 'Span Resort & Spa Kullu', luxury: 'Manu Allaya Manali' },
    isBestSeller: false, isFeatured: false, isTrending: true,
    discountPercent: 6,
    cancellationPolicy: 'Free cancellation up to 10 days.',
    tags: ['Adventure', 'Mountains', 'Group Tours'],
    sortOrder: 6,
    days: []
  },
  {
    title: 'Thailand: Bangkok Temples, Phuket Beach & Phi Phi Island',
    destination: 'Thailand',
    destinationType: 'international',
    region: 'Southeast Asia',
    theme: 'adventure',
    category: 'Fixed Departure',
    durationDays: 7, durationNights: 6,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata'],
    basePrice: 720, wholesaleCost: 560,
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80',
    galleryImages: [],
    highlights: ['Grand Palace & Wat Pho Bangkok', 'Phi Phi Islands Speed Boat Tour', 'Phuket Old Town Walk', 'Maya Bay Blue Lagoon'],
    inclusions: ['6 Nights 4-Star Hotels', 'Daily Breakfast', 'Speed Boat Island Hopping', 'All Airport Transfers', 'Hindi Speaking Guide'],
    exclusions: ['International Flights', 'Thailand Visa on Arrival', 'Personal Expenses'],
    hotelTiers: { standard: 'Novotel Bangkok Sukhumvit', deluxe: 'JW Marriott Phuket', luxury: 'Anantara Phuket Villas' },
    isBestSeller: true, isFeatured: false, isTrending: true,
    discountPercent: 10,
    cancellationPolicy: '100% refund up to 12 days before departure.',
    tags: ['Beach', 'Adventure', 'International'],
    sortOrder: 7,
    days: []
  },
  {
    title: 'Golden Triangle India: Delhi, Agra Taj Mahal & Jaipur Palace',
    destination: 'Delhi — Agra — Jaipur, India',
    destinationType: 'domestic',
    region: 'North India',
    theme: 'family',
    category: 'Fixed Departure',
    durationDays: 6, durationNights: 5,
    departureCities: ['Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata'],
    basePrice: 380, wholesaleCost: 290,
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
    galleryImages: [],
    highlights: ['Taj Mahal Sunrise Private Tour', 'Jaipur Amber Fort Elephant Ride', 'Delhi Red Fort & Qutub Minar', 'Agra Fort Heritage Walk'],
    inclusions: ['5 Nights 4-Star Hotels', 'Daily Breakfast', 'All monument entry tickets', 'AC Car with English driver', 'Taj Mahal Guide'],
    exclusions: ['Airfare', 'Personal tips', 'Lunch & Dinner (except at heritage dinner)'],
    hotelTiers: { standard: 'The Trident Hotels', deluxe: 'ITC Hotels Portfolio', luxury: 'Oberoi Amarvilas Agra' },
    isBestSeller: false, isFeatured: false, isTrending: false,
    discountPercent: 8,
    cancellationPolicy: 'Free cancellation up to 7 days.',
    tags: ['Culture', 'Heritage', 'Family', 'Group Tours'],
    sortOrder: 8,
    days: []
  },
  {
    title: 'Vietnam: Hanoi Old Quarter, Ha Long Bay & Hoi An Lanterns',
    destination: 'Vietnam',
    destinationType: 'international',
    region: 'Southeast Asia',
    theme: 'adventure',
    category: 'Group Tour',
    durationDays: 9, durationNights: 8,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'],
    basePrice: 980, wholesaleCost: 760,
    heroImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80',
    galleryImages: [],
    highlights: ['Ha Long Bay 2-Day Luxury Cruise', 'Hoi An Ancient Town Lantern Festival Walk', 'Hanoi Hoan Kiem Lake Sunrise', 'Mekong Delta Sampan Boat'],
    inclusions: ['8 Nights Hotels + Overnight Cruise Cabin', 'Breakfast Daily + 4 Dinners', 'All Domestic Flights (Hanoi-Da Nang-Ho Chi Minh)', 'Vietnam E-Visa Assistance'],
    exclusions: ['International Airfare', 'Personal Expenses', 'Shopping'],
    hotelTiers: { standard: 'Novotel Hanoi & Da Nang', deluxe: 'Fusion Maia Da Nang', luxury: 'Four Seasons The Nam Hai Hoi An' },
    isBestSeller: false, isFeatured: true, isTrending: false,
    discountPercent: 7,
    cancellationPolicy: '70% refund up to 15 days before departure.',
    tags: ['Adventure', 'Culture', 'International'],
    sortOrder: 9,
    days: []
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

    // Also create a demo customer
    const custEmail = 'customer@travelpulse.in';
    const existing = await User.findOne({ email: custEmail });
    if (!existing) {
      await User.create({ name: 'Demo Customer', email: custEmail, password: 'Customer@123', role: 'customer', phone: '+91 98765 43210' });
      console.log('✅ Demo customer created:', custEmail);
    }

    // 2. Seed packages (skip if already populated)
    const pkgCount = await HolidayPackage.countDocuments();
    if (pkgCount === 0) {
      await HolidayPackage.insertMany(SEED_PACKAGES);
      console.log(`✅ ${SEED_PACKAGES.length} holiday packages seeded`);
    } else {
      console.log(`ℹ️  Packages already exist (${pkgCount}). Skipping package seed.`);
    }

    // 3. Seed default admin config
    const cfgExists = await AdminConfig.findOne({ key: 'holiday_global_config' });
    if (!cfgExists) {
      await AdminConfig.create({
        key: 'holiday_global_config',
        partnerMarkupPercent: 15,
        groupDiscountPercent: 8,
        tourManagerIncludedByDefault: true,
        supportHelpline: '1800-209-9100',
        whatsappInquiryNumber: '919222211100',
        enableInstantBooking: true,
        heroHeadline: 'Discover India & the World',
        heroSubheading: 'Award-Winning Holiday Packages Since 1881',
        featuredDestinations: ['Kashmir', 'Kerala', 'Goa', 'Himachal', 'Dubai', 'Bali', 'Europe', 'Thailand', 'Vietnam'],
        announcementBannerEnabled: false
      });
      console.log('✅ Admin config seeded');
    } else {
      console.log('ℹ️  Admin config already exists. Skipping.');
    }

    console.log('\n🎉 Seed complete!\n');
    console.log('  Super Admin:   admin@travelpulse.in  /  Admin@123');
    console.log('  Demo Customer: customer@travelpulse.in  /  Customer@123');
    console.log('  API server:    http://localhost:5000');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();

import { Router, Response } from 'express';
import multer from 'multer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported'));
    }
  }
});

// Destination image fallbacks
const DESTINATION_IMAGES: Record<string, { hero: string; gallery: string[] }> = {
  kashmir: {
    hero: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582650625119-3a31f841839d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  kerala: {
    hero: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
    ]
  },
  dubai: {
    hero: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80'
    ]
  },
  bali: {
    hero: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80'
    ]
  },
  europe: {
    hero: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  switzerland: {
    hero: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=800&q=80'
    ]
  },
  thailand: {
    hero: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=80'
    ]
  },
  goa: {
    hero: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80'
    ]
  },
  ladakh: {
    hero: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
    ]
  },
  default: {
    hero: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'
    ]
  }
};

const DOMESTIC_KEYWORDS = [
  'india', 'kashmir', 'kerala', 'goa', 'ladakh', 'himachal', 'manali', 'shimla',
  'rajasthan', 'jaipur', 'udaipur', 'andaman', 'ooty', 'uttarakhand', 'rishikesh',
  'sikkim', 'darjeeling', 'coorg', 'munnar', 'srinagar', 'leh'
];

interface ExtractedDay {
  dayNumber: number;
  dayTitle: string;
  destination: string;
  hotelName: string;
  hotelTier: string;
  mealsIncluded: string[];
  currentActivity: {
    title: string;
    duration: string;
    priceDelta: number;
    description: string;
  };
  alternativeActivities: Array<{
    title: string;
    duration: string;
    priceDelta: number;
    description: string;
  }>;
}

// ─── POST /api/packages/extract-from-pdf ───────────────────────────────────────
router.post(
  '/extract-from-pdf',
  authenticate,
  requireAdmin,
  upload.single('file'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file || !req.file.buffer) {
        res.status(400).json({ success: false, message: 'Please upload a valid PDF file' });
        return;
      }

      const pdfData = await pdfParse(req.file.buffer);
      const rawText = pdfData.text || '';

      if (!rawText.trim()) {
        res.status(400).json({
          success: false,
          message: 'Unable to extract text from the PDF. It may be scanned or image-based.'
        });
        return;
      }

      const lines: string[] = rawText
        .split('\n')
        .map((l: string) => l.trim())
        .filter((l: string) => l.length > 0);

      // 1. Extract Title
      let title = '';
      const titleLineMatch = lines.find((l: string) =>
        /^(?:package|tour|trip|holiday)\s*title[:\-]\s*(.+)/i.test(l)
      );
      if (titleLineMatch) {
        title = titleLineMatch.replace(/^(?:package|tour|trip|holiday)\s*title[:\-]\s*/i, '').trim();
      } else {
        // Pick the first substantive title line (skip metadata)
        const candidate = lines.find((l: string) =>
          l.length > 8 &&
          l.length < 90 &&
          !/^(page|date|tour code|booking|itinerary|brochure)/i.test(l)
        );
        title = candidate || 'Extracted Holiday Package';
      }

      // 2. Extract Duration
      let durationNights = 4;
      let durationDays = 5;
      const durationPattern1 = /(\d+)\s*(?:Nights?|N)\s*(?:[/&,\-+]|\s+and\s+)?\s*(\d+)\s*(?:Days?|D)/i;
      const durationPattern2 = /(\d+)\s*(?:Days?|D)\s*(?:[/&,\-+]|\s+and\s+)?\s*(\d+)\s*(?:Nights?|N)/i;
      const durationSingle = /(\d+)\s*(?:Days?|D)/i;

      for (const line of lines) {
        const m1 = line.match(durationPattern1);
        if (m1) {
          durationNights = parseInt(m1[1]);
          durationDays = parseInt(m1[2]);
          break;
        }
        const m2 = line.match(durationPattern2);
        if (m2) {
          durationDays = parseInt(m2[1]);
          durationNights = parseInt(m2[2]);
          break;
        }
      }

      // 3. Extract Destination
      let destination = '';
      const destMatch = lines.find((l: string) =>
        /^(?:destination|location|sector|places covered)[:\-]\s*(.+)/i.test(l)
      );
      if (destMatch) {
        destination = destMatch.replace(/^(?:destination|location|sector|places covered)[:\-]\s*/i, '').trim();
      } else {
        // Search known destinations
        const searchPool = rawText.toLowerCase();
        for (const [key] of Object.entries(DESTINATION_IMAGES)) {
          if (key !== 'default' && searchPool.includes(key)) {
            destination = key.charAt(0).toUpperCase() + key.slice(1);
            break;
          }
        }
        if (!destination) {
          destination = 'Scenic Wonderland';
        }
      }

      // Destination Type
      const isDomestic = DOMESTIC_KEYWORDS.some(kw =>
        destination.toLowerCase().includes(kw) || rawText.toLowerCase().includes(kw)
      );
      const destinationType: 'domestic' | 'international' = isDomestic ? 'domestic' : 'international';

      // 4. Extract Price
      let basePrice = 650;
      const priceRegex = /(?:₹|Rs\.?|INR|\$|USD)\s*([\d,]+)/gi;
      let pMatch;
      const foundPrices: number[] = [];
      while ((pMatch = priceRegex.exec(rawText)) !== null) {
        const cleaned = parseInt(pMatch[1].replace(/,/g, ''));
        if (cleaned > 100 && cleaned < 1000000) {
          foundPrices.push(cleaned);
        }
      }
      if (foundPrices.length > 0) {
        // If INR, convert to approximate USD (1 USD ~ 83 INR) or take direct USD
        const firstPrice = foundPrices[0];
        if (firstPrice > 5000) {
          basePrice = Math.round(firstPrice / 83);
        } else {
          basePrice = firstPrice;
        }
      }

      // 5. Extract Inclusions & Exclusions
      const inclusions: string[] = [];
      const exclusions: string[] = [];
      const highlights: string[] = [];

      let currentSection: 'none' | 'inclusions' | 'exclusions' | 'highlights' = 'none';

      for (const line of lines) {
        if (/^(?:package\s+)?inclusions?|what's\s+included|inclusions\s*:/i.test(line)) {
          currentSection = 'inclusions';
          continue;
        }
        if (/^(?:package\s+)?exclusions?|what's\s+(?:not\s+included|excluded)|exclusions\s*:/i.test(line)) {
          currentSection = 'exclusions';
          continue;
        }
        if (/^highlights?|key\s+attractions?|tour\s+highlights?\s*:/i.test(line)) {
          currentSection = 'highlights';
          continue;
        }
        if (/^(?:day\s*\d+|itinerary|terms\s*&?\s*conditions|cancellation)/i.test(line)) {
          currentSection = 'none';
        }

        const isBullet = /^([•\-*✓\d+\.]|[A-Z]\))\s+(.+)/.exec(line);
        const itemText = isBullet ? isBullet[2].trim() : line.trim();

        if (itemText.length > 5 && itemText.length < 150) {
          if (currentSection === 'inclusions' && inclusions.length < 10) {
            inclusions.push(itemText);
          } else if (currentSection === 'exclusions' && exclusions.length < 8) {
            exclusions.push(itemText);
          } else if (currentSection === 'highlights' && highlights.length < 8) {
            highlights.push(itemText);
          }
        }
      }

      // Default fallbacks if PDF lacked explicitly structured sections
      if (inclusions.length === 0) {
        inclusions.push(
          'Accommodation in premium verified hotels',
          'Daily buffet breakfast and select gourmet dinners',
          'All sightseeing & transfers in private AC vehicle',
          'Dedicated Hindi / English speaking tour manager',
          'All applicable monument entry permits and taxes'
        );
      }
      if (exclusions.length === 0) {
        exclusions.push(
          'Personal expenses, laundry, tips and telephone calls',
          'Optional adventure activities and camera tickets',
          'Airfare or train fare unless specifically stated'
        );
      }
      if (highlights.length === 0) {
        highlights.push(
          `Curated discovery of iconic sights in ${destination}`,
          'Handpicked 4-star stays with breakfast & dinner',
          'Scenic guided excursions with photo stops'
        );
      }

      // 6. Extract Day-by-Day Itinerary
      const days: ExtractedDay[] = [];
      let currentDay: ExtractedDay | null = null;

      for (const line of lines) {
        const dayMatch = /^Day\s*(\d+)[:\-\s]+(.*)/i.exec(line);
        if (dayMatch) {
          if (currentDay) {
            days.push(currentDay);
          }
          const dNum = parseInt(dayMatch[1]);
          const dTitle = dayMatch[2].trim() || `Arrival & Sightseeing in ${destination}`;
          currentDay = {
            dayNumber: dNum,
            dayTitle: dTitle,
            destination: destination,
            hotelName: `${destination} Grand Resort`,
            hotelTier: 'Superior',
            mealsIncluded: dNum === 1 ? ['Dinner'] : ['Breakfast', 'Dinner'],
            currentActivity: {
              title: dTitle,
              duration: '4-6 Hours',
              priceDelta: 0,
              description: 'Guided excursion and curated leisure exploration.'
            },
            alternativeActivities: []
          };
          continue;
        }

        if (currentDay) {
          // Check for meals mentioned
          const lower = line.toLowerCase();
          if (lower.includes('breakfast') && !currentDay.mealsIncluded.includes('Breakfast')) {
            currentDay.mealsIncluded.push('Breakfast');
          }
          if (lower.includes('lunch') && !currentDay.mealsIncluded.includes('Lunch')) {
            currentDay.mealsIncluded.push('Lunch');
          }
          if (lower.includes('dinner') && !currentDay.mealsIncluded.includes('Dinner')) {
            currentDay.mealsIncluded.push('Dinner');
          }

          // Check for hotel mentioned
          const hotelMatch = /(?:stay\s+at|hotel|resort)[:\-]?\s*([A-Za-z0-9\s&]+(?:hotel|resort|palace|inn|villas?))/i.exec(line);
          if (hotelMatch && hotelMatch[1].length < 50) {
            currentDay.hotelName = hotelMatch[1].trim();
          }

          // Check for activity description
          if (line.length > 25 && line.length < 250 && !line.startsWith('Day')) {
            if (currentDay.currentActivity.description === 'Guided excursion and curated leisure exploration.') {
              currentDay.currentActivity.description = line;
            }
          }
        }
      }
      if (currentDay) {
        days.push(currentDay);
      }

      // If no day headings found in PDF, synthesize days according to durationDays
      if (days.length === 0) {
        for (let i = 1; i <= durationDays; i++) {
          days.push({
            dayNumber: i,
            dayTitle: i === 1 ? `Arrival in ${destination}` : i === durationDays ? `Departure & Return Home` : `${destination} Sightseeing & Local Experiences`,
            destination: destination,
            hotelName: `${destination} Grand Heritage Resort`,
            hotelTier: 'Superior',
            mealsIncluded: i === 1 ? ['Dinner'] : ['Breakfast', 'Dinner'],
            currentActivity: {
              title: i === 1 ? `Welcome & Evening Leisure` : i === durationDays ? 'Morning Souvenir Walk & Airport Transfer' : 'Full Day Curated Tour',
              duration: '4 Hours',
              priceDelta: 0,
              description: `Enjoy memorable experiences in ${destination}.`
            },
            alternativeActivities: []
          });
        }
      }

      // 7. Select Hero & Gallery Images
      let imgData = DESTINATION_IMAGES['default'];
      for (const [key, val] of Object.entries(DESTINATION_IMAGES)) {
        if (destination.toLowerCase().includes(key)) {
          imgData = val;
          break;
        }
      }

      const extractedPackage = {
        title,
        destination,
        destinationType,
        region: destinationType === 'domestic' ? 'India' : 'International',
        theme: 'family',
        category: 'Customized',
        durationDays: days.length > 0 ? days.length : durationDays,
        durationNights: durationNights || Math.max(1, durationDays - 1),
        departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad'],
        basePrice,
        wholesaleCost: Math.round(basePrice * 0.78),
        heroImage: imgData.hero,
        galleryImages: imgData.gallery,
        highlights,
        inclusions,
        exclusions,
        hotelTiers: {
          standard: `${destination} City Comfort Hotel`,
          deluxe: `${destination} Premium Grand Suites`,
          luxury: `${destination} Palace & Luxury Resort`
        },
        days,
        isBestSeller: true,
        isFeatured: true,
        isTrending: false,
        rating: 4.6,
        reviewCount: 142,
        discountPercent: 10,
        cancellationPolicy: 'Free cancellation up to 15 days before departure.',
        tags: [destinationType === 'domestic' ? 'India' : 'International', 'Handcrafted', 'Popular']
      };

      res.json({
        success: true,
        message: 'Holiday package successfully extracted from PDF brochure',
        data: extractedPackage,
        rawTextSnippet: rawText.substring(0, 400)
      });
    } catch (err: any) {
      console.error('PDF extraction error:', err);
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to parse PDF brochure'
      });
    }
  }
);

export default router;

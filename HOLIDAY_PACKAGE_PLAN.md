# Holiday Package — End-to-End Working Plan

Goal: make the Holiday Package vertical fully functional following a standard travel-booking process (Discover → Detail → Customize → Book → Pay → Confirm → Track → Fulfill → Review), backed by Express + MongoDB, with the frontend as a thin client over the API.

## Implementation Progress

### Phase 0 (P0) — ✅ Done
- Guest booking endpoint (optional auth), public track endpoint.
- Server-computed selling price; markup no longer leaked to public config.
- Activity swaps persisted into booking payload.
- Tracker wired to backend (field-mapped); admin bookings loaded from backend; status updates by Mongo _id.
- Hotel-tier enum mapping frontend↔backend; type alignment.
- Duration display fixed; markup leakage removed from customer UI.
- Booking/payment ref reconciliation: backend ref stored locally for tracking/payment.
- Real customer name/email/phone collected in drawer (no more hardcoded identity).
- Payment verify enforces ownership + Razorpay signature.
- Admin booking list shows computed wholesale/markup; header count uses API list.
- Package id lifecycle reconciled via post-create sync.
- Client/server/admin price formulas aligned (discount applied everywhere).

### Phase 1 — ✅ Done (core)
- ✅ Payment scaffold + Razorpay checkout widget + signature/ownership verification.
- ✅ Email notifications (Nodemailer) on booking create + status change.
- ✅ Lead capture persisted (Lead model + /api/leads, callback form wired).
- ✅ JWT secret fallback aligned; CORS origin configurable.
- ✅ PDF extraction defaults no longer pollute catalog (isBestSeller/isFeatured false).
- ⬜ useHolidayApi migration (still syncs into localStorage) — optional refactor.

### Phase 2 — ✅ Done (core)
- ✅ Image upload endpoint + admin UI button.
- ✅ Reviews & ratings (model, endpoints, aggregate, PDP UI, verified-booking gating).
- ✅ Availability/departures (model, endpoint, seat decrement, drawer selector, priceOverride applied).
- ✅ Server-side search wired into listing UI (debounced).
- ✅ Empty state for no results.
- ✅ Real rating/reviewCount shown on PDP.
- ✅ featuredDestinations imageUrl normalization.
- ⬜ Pagination UI controls.

### Phase 3 — 🟡 Partially done
- ✅ Test framework installed (Vitest + Supertest); 3 backend smoke tests + 1 frontend test passing.
- ✅ Form validation (phone/email/date/name) on callback + drawer.
- ✅ holidayBackend constructor no longer fires duplicate sync.
- ✅ Review aggregation validates ObjectId.
- ⬜ Loading/error states UI, observability, performance, broader test coverage.

## Current State (already working)

- Backend: `HolidayPackage` / `HolidayBooking` / `AdminConfig` models, CRUD routes, JWT + 2-role RBAC, search/filter/pagination, PDF brochure extraction, soft delete.
- Frontend: `HolidaysModule` (listing, PDP, itinerary, activity swap, price calculator drawer, PDF brochure, WhatsApp inquiry, callback lead, booking tracker), `SuperAdminPanel` (package builder, config, bookings).
- Sync: `holidayBackend.syncFromBackend()` runs on mount; localStorage fallback for offline dev.

## Phase 0 — Stabilize & single source of truth (P0)

1. **Migrate `HolidaysModule` to `useHolidayApi`** instead of `useApp()` local state. Remove dual state; backend becomes source of truth. Wire `fetchPackages`, `fetchFeatured`, `fetchPackageById`, `fetchConfig`, `applyFilters`, `setPage`.
2. **Fix pricing authority.** Public config endpoint strips `partnerMarkupPercent`, so client markup is stale/zero. Either (a) compute selling price on backend and return it, or (b) add an authenticated `pricingPreview` endpoint. Frontend `getPackageSellingPrice` must use server-provided value, not local config.
3. **Clean seed data.** Remove test package "HOLIDAY PACKAGE MASTER DATASHEET - TEST SAMPLEnil"; re-seed via `server/src/scripts/seed.ts` with verified data. Add `npm run seed` to dev workflow.
4. **Align types.** `hotelTier` enum (`Comfort|Superior|Luxury 5-Star` vs model `standard|deluxe|luxury`), `ActivityOption.id` (required on frontend, optional on backend), `DayItinerary.destination`. Add shared types or zod validation.
5. **Wire activity swaps into booking payload.** `handleSwapActivity` only mutates local PDP state; pass `activitySwaps` to `createBooking`. Persist swaps on backend (already supported).
6. **Auth gate for booking.** Backend requires login. Decide: guest inquiry endpoint (no auth, creates lead) OR login modal before booking. Implement chosen path and surface errors (currently swallowed).

## Phase 1 — Complete booking lifecycle (P1)

7. **My Bookings / Tracker.** Wire `fetchMyBookings` + backend `/bookings/my` into Tracker tab; replace local `holidayBookings` lookup. Show status timeline.
8. **Admin booking workflow.** Ensure status transitions (inquiry_received → customizing → quote_sent → confirmed → cancelled → completed) are actionable in `SuperAdminPanel` with notes; sync to backend via `bookingsApi.updateStatus`.
9. **Quote & payment.** Add quote generation (PDF) with validity; integrate payment gateway (Razorpay/Stripe) for confirmed bookings; store payment status/ref on `HolidayBooking`. Add `paymentStatus` field to model.
10. **Notifications.** Email (Nodemailer) + WhatsApp (template) on booking created/status changed; in-app toast instead of `alert()`.

## Phase 2 — Discovery & content (P2)

11. **Server-side search & filters in UI.** Debounced search box → `packagesApi.list({ search })`; pagination controls wired to `setPage`.
12. **Image uploads.** Replace URL paste with multipart upload to cloud storage (Cloudinary/S3) in package builder; store returned URLs.
13. **Reviews & ratings.** Add `Review` model + submit endpoint (post-trip, verified booking); aggregate into `rating`/`reviewCount`; render on PDP.
14. **Availability & departures.** Add `Departure` sub-doc (date, seats, price override); decrement seats on booking; show "X seats left".

## Phase 3 — Quality & ops (P3)

15. **Validation.** express-validator on all routes (done for packages/bookings partially); add frontend form validation (phone/email/date).
16. **Error handling & loading states.** Skeletons, empty states, retry; surface API errors to user (not console only).
17. **Tests.** Backend: route tests (supertest) for packages/bookings/config; frontend: Vitest for pricing calc & filters. Add to CI.
18. **Observability.** Structured logging (pino), request IDs, error tracking; health check already exists.
19. **Performance.** Indexes (done), lean queries (done), image lazy-loading, code-split HolidaysModule.

## Standard process flow (target UX)

1. **Discover**: home → featured + popular destinations → filtered listing (search, dest type, theme, category, price, sort) → pagination.
2. **Detail (PDP)**: gallery, overview, itinerary timeline, inclusions/exclusions, highlights, assurance, price card.
3. **Customize**: swap day activities (price delta), choose departure city, date, hotel tier, pax → live total.
4. **Book**: lead capture / login → create booking (inquiry_received) → confirmation ref + PDF voucher.
5. **Pay**: quote → payment → confirmed.
6. **Track**: My Bookings with status timeline; admin updates statuses with notes.
7. **Fulfill**: voucher, itinerary PDF, tour manager contact.
8. **Review**: post-trip rating + review.

## Acceptance criteria

- Customer can browse, filter, paginate packages from backend without local seed fallback in production.
- PDP loads by id/slug from backend; activity swap persists into booking.
- Booking creates a real backend record (auth or guest) and returns a reference; tracker shows it.
- Admin can CRUD packages (incl. PDF extract) and manage booking statuses; changes reflect on customer side after refresh.
- Selling price matches backend calculation; no markup leakage to public config.
- `npm run build` (frontend + server) and `npm run lint` pass; smoke test of full flow passes.

## Risks / open decisions

- Guest vs authenticated booking (affects data model & privacy).
- Payment provider & currency handling (USD vs INR display).
- Image storage provider (cost/limits).
- Whether to keep localStorage offline fallback in production (recommend: dev only).

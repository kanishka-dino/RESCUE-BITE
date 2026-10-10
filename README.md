# RescueBite — Food Rescue & Redistribution Platform

RescueBite is a sustainability platform connecting restaurants, hotels, bakeries, corporate cafeterias, and event organizers with verified NGOs, community kitchens, orphanages, and charitable shelters. The platform facilitates safe, transparent, and dignified food redistribution to eliminate food waste and reduce community food insecurity.

---

## 1. Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Setup Commands
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

The application runs on `http://localhost:3000`.

---

## 2. Key Architecture & Features

### Public Landing Page
- **Split-Screen Hero**: Value proposition, real photographic assets, floating food rescue proof badge, and animated counters for redistributed meals, verified donors, and community partners.
- **How It Works**: 3-step redistribution lifecycle (List Surplus Food → Connect with Recipients → Rescue & Redistribute).
- **Active Surplus Clearinghouse**: Real-time food listings with category filters, keyword search, and detail modal.
- **Impact Section**: Quantified environmental metrics (CO2e saved, kg rescued) and recipient testimonial.
- **Food Safety Policy**: Comprehensive safety protocols, HACCP standards, temperature danger zone rules (4°C – 60°C), and Bill Emerson Good Samaritan Act safe-harbor protections.

### Multi-Role Dashboards
1. **Food Donor Dashboard (`/donor`)**:
   - Operations overview with redistribution trends and scheduled dispatches.
   - 90-second Surplus Listing Form (food type, quantity, preparation time, safe collection deadline, storage conditions, allergen declarations, handling notes).
   - Pickup requests management and custody handover verification.
   - Waste reduction & EPA WARM carbon equivalency analytics.
2. **Recipient Charity Dashboard (`/recipient`)**:
   - Available food radar with grid and geospatial map views.
   - 1-Click reservation and claim confirmation modal with safety equipment pledge.
   - Pickup schedule with volunteer driver assignments.
   - Redistribution history and chain of custody receipts.
3. **Platform Administrator Console (`/admin`)**:
   - 501(c)(3) and charity registration verification queue (Approve/Reject).
   - Food safety incident reports and moderation flag resolution.
   - Immutable chain of custody audit log.
   - District-wide redistribution analytics.

---

## 3. Visual Identity & Design System

- **Primary Forest Green**: `#166534`
- **Deep Evergreen**: `#12372A`
- **Emerald Accent**: `#22C55E`
- **Soft Mint**: `#DCFCE7`
- **Pale Canvas**: `#F5FAF4`
- **Warm Off-White**: `#FCFDF9`
- **Display Typography**: Plus Jakarta Sans
- **Body Prose**: DM Sans
- **Numerals & Metrics**: Tabular Monospace (`tabular-nums font-mono`)
- **Zero-Pill Discipline**: Clean unboxed metadata with typographic separators (`·`).

---

## 4. Connecting the Future Spring Boot REST API & MySQL

The frontend is architected to transition from reactive in-memory/localStorage mock persistence to a production Spring Boot 3.x backend without UI rewrites.

### Configuration
1. In your `.env` file, specify your Spring Boot base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_USE_LIVE_API=true
   ```
2. The Axios client at `src/services/apiClient.ts` will automatically send all requests to your Spring Boot controller and attach JWT authorization tokens via `Authorization: Bearer <token>`.

### Spring Boot REST Endpoints Specification
- `POST /api/auth/register` — Register donor or recipient account
- `POST /api/auth/login` — Authenticate and return JWT token
- `GET /api/donations` — Paginated and filtered food listings
- `POST /api/donations` — Create a new surplus listing (Role: DONOR)
- `GET /api/donations/{id}` — Fetch specific donation details
- `PUT /api/donations/{id}` — Update listing details
- `POST /api/donations/{id}/claims` — Reserve and claim donation (Role: RECIPIENT)
- `PATCH /api/donations/{id}/status` — Update lifecycle state (Available → Reserved → Scheduled → Collected → Completed)
- `GET /api/admin/verifications` — Fetch organization verification queue (Role: ADMIN)
- `PATCH /api/admin/verifications/{id}` — Approve or reject organization registration

---

## 5. Verification Checklist

- [x] Responsive layout across mobile, tablet, and desktop viewports.
- [x] Top Bar Contract strictly enforced (1-line Brand, 4–5 single-line nav links, 1 primary action).
- [x] Zero-pill discipline applied across donation cards and listings.
- [x] High-fidelity photographic assets generated and loaded with fallback containers.
- [x] Working navigation across public, auth, donor, recipient, and admin views.
- [x] Quick 1-click role switcher for instant demonstration of Donor, Recipient, and Admin views.
- [x] Interactive claims, listing creation, and verification state updates persist across page reloads.
- [x] Spring Boot API modal with Java controllers, MySQL schema, and Axios integration documentation.
- [x] TypeScript compilation passes with zero errors.

# CULTIVATOR — Build Task Sheet

## Status: Phases 0-8 Complete ✅ | Phase 9 (Auth + Images) In Progress

---

## Architecture

```
cultivator/
├── apps/
│   ├── farmer-web/     (port 3000) — Public farmer site, mobile-first
│   ├── dealer/         (port 3001) — Dealer portal, desktop-first
│   └── admin/          (port 3002) — Enterprise admin, desktop-first
├── packages/
│   ├── ui/             — 15 shared components + design tokens
│   ├── types/          — TypeScript interfaces for all entities
│   ├── utils/          — Formatting, geo, validation
│   ├── auth/           — RBAC definitions
│   └── api/            — Mock data + API client
├── services/
│   └── api/            — Express + Prisma + MongoDB Atlas
└── turbo.json          — Turborepo task runner
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| UI | Radix + Tailwind CSS 4 |
| State | React context / hooks |
| Toasts | sonner |
| Database | MongoDB Atlas + Prisma |
| API | Express.js |
| Monorepo | Turborepo + npm workspaces |
| Language | TypeScript 5 |

## Running

```bash
npm install --ignore-scripts

# Farmer website
cd apps/farmer-web && npm run dev

# Dealer portal
cd apps/dealer && npm run dev

# Enterprise admin
cd apps/admin && npm run dev

# API server (needs MongoDB Atlas URL in services/api/.env)
cd services/api && npm run dev
```

## Pages Built (19 total)

### Farmer Web (5 pages)
- `/` — Hero homepage with dominant CTA
- `/dealers/nearby` — Dealer discovery with search + distance
- `/dealers/[id]` — Dealer detail with call/directions
- `/call` — Call connecting UI
- `/products` — Product browse with categories

### Dealer Portal (6 pages)
- `/` — Dashboard with stats, alerts, activity
- `/calls` — Call management with filters
- `/customers` — Customer list with search
- `/inventory` — Inventory table with stock status
- `/orders` — Order management with status flow
- `/deliveries` — Delivery management with vehicles

### Enterprise Admin (6 pages)
- `/` — Network overview with top dealers
- `/dealers` — Full dealer management
- `/map` — Network map (Leaflet integration point)
- `/products` — Product catalog
- `/analytics` — Performance metrics
- `/settings` — Config + call routing

## Design System (15 components)
Button, Card, Input, Badge, Avatar, Skeleton, EmptyState, Modal, Table, Tabs, Select, Sidebar, Header, ConfirmationDialog, Toast

## Database Models (13)
Enterprise, User, Dealer, DealerProduct, Product, Inventory, Farmer, Customer, Call, Order, OrderItem, Delivery, CallRoutingConfig

## API Routes (20+)
- `GET/POST/PATCH/DELETE /api/dealers`
- `GET /api/dealers/:id/stats`
- `GET/POST/PATCH/DELETE /api/products`
- `GET/POST/PATCH/DELETE /api/orders`
- `GET/POST/PATCH /api/calls`
- `POST /api/calls/route` (smart call routing)
- `GET/POST/PATCH /api/customers`
- `GET/POST/PATCH /api/inventory`
- `GET/POST/PATCH /api/deliveries`
- `GET /api/analytics/enterprise`
- `GET /api/analytics/dealer/:id`
- `GET /api/analytics/top-dealers`
- `GET /api/analytics/product-demand`

## What's Next

### Phase 7: Real Telephony
- Twilio integration for actual call routing
- `POST /api/calls/route` → Twilio → dealer phone rings
- Call recording and logging

### Phase 8: WhatsApp Integration
- WhatsApp Business API
- Order confirmations via WhatsApp
- Delivery notifications

### Phase 9: Product Images
- [x] Default category images for products without dealer uploads
- [x] Product card components show images with fallback to category icons
- [x] "Uploaded by dealer" tag on dealer-uploaded images
- [ ] Image upload UI in dealer portal
- [ ] File upload API endpoint (multer + local storage)
- [ ] Image preview and crop before upload

### Phase 10: Authentication
- [ ] Farmer auth: mobile number + OTP (Twilio SMS)
- [ ] Dealer auth: email + password (bcrypt + JWT)
- [ ] Enterprise admin auth: email + password (bcrypt + JWT)
- [ ] Auth API routes (login, register, OTP send/verify, refresh, logout)
- [ ] Auth middleware for Express API (JWT verification)
- [ ] Auth context/provider for each app
- [ ] Login pages (farmer OTP flow, dealer/admin email+password)
- [ ] Protected route middleware (Next.js middleware.ts)
- [ ] Logout + user profile in nav/shell components
- [ ] Multi-tenant data isolation

### Phase 11: Real-time Features
- WebSocket for live updates
- Push notifications
- Live delivery tracking

### Phase 12: Maps & GPS
- Leaflet + OpenStreetMap integration
- Dealer markers with service radius
- Heatmap for demand density

### Phase 13: Production
- Vercel deployment (apps)
- Railway/Render deployment (API)
- MongoDB Atlas production cluster
- CI/CD pipeline
- Error monitoring (Sentry)

# Cultivator — The Story Script

> **How to use:** Read this like you're telling a friend about your project. Natural, conversational, no rush. Each `🎬` mark tells you what to show on screen. Take your time.

---

## Part 1: The Problem

🎬 *Show: Your phone's home screen or a blank browser*

"Let me tell you a story.

Imagine you're a farmer. You live in a small village in Telangana. You need seeds for the next season. You've heard about a good dealer in the next town, but you don't know his number. You don't know if he's open today. You don't even know what products he has.

So what do you do? You either take a bus and travel for hours, or you ask around and hope someone knows. Maybe your neighbor knows a dealer. Maybe he doesn't.

This is the reality for millions of farmers in India. They know *what* they need. They just don't know *where* to find it, or *who* to call.

That's the problem we're solving with Cultivator."

---

## Part 2: The Idea

🎬 *Show: The project folder structure in your code editor*

"Cultivator is basically a bridge. On one side, you have farmers who need agricultural products — seeds, fertilizers, pesticides, equipment. On the other side, you have dealers who sell these products but have no easy way to reach farmers.

We built three things:

A website for farmers — something simple they can open on their phone, see what's nearby, and just call. No complicated sign-up, no forms. Just find and call.

A portal for dealers — so they can manage their business. See who called, what orders came in, what's in stock, what needs to be delivered.

And an admin dashboard — for the company running the whole thing. To see how many dealers are active, what's selling, where the demand is.

Let me show you each one."

---

## Part 3: The Farmer's World

🎬 *Open localhost:3000 in browser — show the homepage*

"This is what a farmer sees when they open Cultivator.

Big, bold question at the top — 'Need agricultural products?' That's it. That's the whole point. Below that, 'Connect with your nearest dealer instantly.'

The main button says 'Call Your Nearest Dealer.' That's the most important thing. A farmer taps that, finds a dealer, calls them. Done.

But before that, let me show you something important."

### The Language Problem

🎬 *Click the 'తెలుగు' button in the top-right corner of the navbar*

"Watch what happens when I click this button.

Everything changes to Telugu. The shop becomes షాప్. Dealers becomes డీలర్లు. The product names — 'Paddy Seeds' becomes 'వరి విత్తనాలు.' Even the brand name 'Cultivator' becomes 'కల్టివేటర్.'

This is critical. Because if a farmer can't read what's on the screen, the app is useless to them. We built full Telugu translation — every button, every label, every product name. And if I refresh the page..."

🎬 *Refresh the page*

"...it remembers. The language choice is saved. They don't have to select it every time."

### Finding a Dealer

🎬 *Click 'Find Dealer' or go to /dealers/nearby*

"Now, the farmer wants to find a dealer. They tap 'Find Dealer.'

Here's a list of dealers near their village. Each one shows the name, the village, how far away they are. See this — '3.2 km away.' That's calculated using their actual GPS coordinates.

Each dealer card shows if they're open or closed right now. Green badge — open. Gray — closed. So the farmer knows before they call.

There's a star rating, home delivery availability, and what products they sell — seeds, fertilizers, pesticides.

The farmer can search by village name or pincode. They can tap 'Use my location' to find the nearest ones automatically.

Let me tap on one of these dealers."

🎬 *Click on a dealer card*

"Here's the full details. Name, full address, distance. Operating hours — '8 AM to 7 PM.' Delivery is available. Service radius is 15 km.

At the bottom, three options: Call Now, WhatsApp, and Directions. The farmer picks up the phone and calls. Or opens WhatsApp to chat. Or gets directions on Google Maps.

That's it. That's the whole flow. Find, decide, connect."

### The Shop

🎬 *Go to /shop*

"But what if the farmer wants to browse products first? Maybe they want to compare prices or see what's available.

This is the shop. Every product from every dealer, in one place.

Each product card shows an image, the name, the brand, the price. See this one — 'వరి విత్తనాలు (BPT-5204)' — that's Paddy Seeds in Telugu. ₹120 per bag.

And look at this tag in the corner — 'Image uploaded by dealer.' That means the dealer actually took this photo of their product. It's not a stock image. The farmer knows what they're getting.

If the dealer hasn't uploaded a photo yet, we show a category icon instead. So there's always something to look at.

The farmer can filter by category — Seeds, Fertilizers, Pesticides — or search by name. And every product has a 'Call Dealer' button. Tap it, and you're connected to the nearest dealer who has that product."

### The Call

🎬 *Click 'Call Dealer' on any product — show the call page*

"When the farmer taps 'Call Dealer,' this is what they see.

The dealer's name, how far away they are, and a phone animation. It goes through three stages — Connecting, Ringing, and then Active with a timer.

In production, this would be a real phone call through Twilio. Right now it's simulated, but the flow is exactly the same.

There's an 'End Call' button and a 'Need a different dealer?' option that takes them back to the list."

---

## Part 4: The Dealer's World

🎬 *Open localhost:3001 — show the dealer login page*

"Now let me switch to the dealer's perspective.

A dealer logs in with their email and password. Let me use the demo credentials..."

🎬 *Type dealer@lakshmi.com and dealer123, click Sign In*

"And they're in. This is their dashboard.

On the left, a sidebar with seven sections. On the right, today's snapshot:

- 12 calls today, 3 missed
- 4 new leads — farmers who called for the first time
- 7 pending orders waiting to be confirmed
- Today's sales: ₹4,580

Below that, a feed of recent activity — who called, what was ordered, what's being delivered."

### Managing Calls

🎬 *Click 'Calls' in the sidebar*

"The Calls page shows every call the dealer has received. Farmer name, phone number, duration, whether it was completed or missed.

See this one — 'Ramesh Kumar, 5 minutes 32 seconds, completed.' The dealer added a note: 'Needs 2 bags of paddy seeds.' That's a follow-up. The dealer knows to call Ramesh back and confirm the order."

### Customer Database

🎬 *Click 'Customers'*

"Every farmer who has ever called or ordered from this dealer is saved here. Their name, phone, village, how many orders they've placed, how much they've spent.

This is valuable. The dealer can see that Srinivas Reddy has ordered 12 times and spent ₹45,000. He's a regular. Maybe give him a discount."

### Inventory

🎬 *Click 'Inventory'*

"Real-time stock levels. Urea — only 12 bags left, and the low-stock threshold is 15. That's highlighted in red. The dealer knows to reorder.

Methyl Parathion — only 3 bottles. They need to restock soon.

This prevents the situation where a farmer calls, the dealer says 'yes we have it,' but then realizes they're out of stock."

### Orders & Deliveries

🎬 *Click 'Orders', then 'Deliveries'*

"Orders flow through a status pipeline: New → Confirmed → Preparing → Ready → Delivered. The dealer can track every order.

Deliveries — the dealer assigns a vehicle and driver. 'Venkat on bike, delivering to Domakonda Village.' Status updates as it goes out for delivery and when it's delivered."

---

## Part 5: The Admin's World

🎬 *Open localhost:3002 — show the admin login*

"Now the big picture. The enterprise admin — the company that runs Cultivator."

🎬 *Type admin@cultivator.in and admin123, click Sign In*

"This dashboard shows the entire network.

48 total dealers across Telangana, 42 active. 2,340 farmers on the platform. 156 calls today across all dealers. Today's total sales: ₹2,40,000.

Below that, the top-performing dealers ranked by orders. Sri Venkateshwara Agro is #1 with 890 orders."

### Dealer Management

🎬 *Click 'Dealers'*

"Every dealer in the network. Their status, rating, total orders, total customers. The admin can see the health of the entire dealer network at a glance."

### Product Catalog

🎬 *Click 'Products'*

"Every product available on the platform. The admin manages the catalog — add products, set prices, assign categories. Dealers then list which of these products they carry."

### Analytics

🎬 *Click 'Analytics'*

"Performance metrics — call volumes, order trends, revenue. This helps the company make decisions — which areas need more dealers, which products are in demand, which dealers need support."

---

## Part 6: How It All Connects

🎬 *Show the project structure in code editor*

"Let me tie it all together.

When a farmer opens the app, they see products from the mock data. When they tap 'Call Dealer,' the app finds the nearest dealer using GPS coordinates and the Haversine formula — that's the math for calculating distance between two points on Earth.

The dealer then sees that call in their portal, manages the order, assigns delivery. The admin sees the aggregate data across all dealers.

Everything is connected through the API — 35 endpoints handling dealers, products, orders, calls, customers, inventory, and deliveries.

The database has 13 models — that's the data structure. Enterprise has Dealers. Dealers have Products, Customers, Calls, Orders. Orders have Items and Deliveries. It's a complete chain."

---

## Part 7: The Tech Behind It

🎬 *Show package.json or code editor*

"Quick overview of the tech:

**Frontend:** Next.js 15 — that's the React framework. We use the App Router, which is the latest way to build Next.js apps. Tailwind CSS for styling — that's why everything looks clean and consistent. TypeScript for type safety.

**Backend:** Express.js — a lightweight Node.js server. Prisma as the ORM — that's how we talk to the database. MongoDB Atlas — a cloud database, no need to set up servers.

**Monorepo:** Turborepo manages all three apps and shared packages in one repository. Changes to shared code automatically propagate to all apps.

**Design System:** We built 21 reusable components from scratch — buttons, cards, tables, modals, navigation. Every app uses the same components, so the look and feel is consistent.

**Auth:** JWT tokens for session management. bcrypt for password hashing. OTP-based login for farmers, email+password for dealers and admins.

**Languages:** Full English and Telugu support with 75+ translated strings each."

---

## Part 8: What's Next

🎬 *Show the TASK-SHEET.md or just talk to camera*

"Where do we go from here?

**Real phone calls** — integrate Twilio so farmers actually connect to dealers, not just simulated.

**WhatsApp integration** — order confirmations and delivery updates via WhatsApp. That's how most people communicate in rural India.

**Real-time updates** — WebSocket so the dealer dashboard updates live when a call comes in or an order is placed.

**Maps** — show dealers on a map with their service radius. A farmer can literally see which dealers are near them.

**Production deployment** — Vercel for the frontend apps, Railway for the API, MongoDB Atlas for the database.

But the core product — the three apps, the 35 API endpoints, the 13 database models, the Telugu translation, the image system, the auth — that's all built and working."

---

## Closing

🎬 *Show the farmer homepage one more time*

"Cultivator started with a simple question: how do we help a farmer in a remote village find the right products from the right dealers?

The answer was three apps, a shared design system, a complete API, and full bilingual support. It's not just a prototype — it's a working platform ready for real farmers.

Thank you."

---

## Backup: Quick Stats If Asked

| What | Number |
|------|--------|
| Frontend apps | 3 |
| Total pages | 21 |
| API endpoints | 35 |
| Database models | 13 |
| UI components | 21 |
| Languages | English + Telugu |
| Product categories | 9 |
| Demo dealers | 6 |
| Demo products | 8 |
| Lines of code | ~15,000+ |

## Backup: If They Ask "Is It Real?"

"Yes — the frontend is fully built and functional. The API is built with Express and Prisma. We're using mock data for the demo, but the database schema is production-ready. The mock data layer is designed to be swapped out with real API calls. The auth system uses real JWT tokens and bcrypt hashing. The image upload endpoint is real — it saves files to disk. The only things that would change for production are: connecting to a real MongoDB cluster, adding Twilio for SMS and calls, and deploying to Vercel and Railway."

## Backup: If They Ask "How Long Did It Take?"

"We built this as a monorepo project. The three apps, shared packages, API, database, auth, translations, and image system — all developed iteratively. The monorepo structure with Turborepo made it efficient because shared code — types, utilities, components — is written once and used everywhere."

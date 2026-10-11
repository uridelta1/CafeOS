# CafeOS — Café Management System

A full-stack café operations and point-of-sale MVP built with **React + Tailwind CSS + Express + MongoDB/Mongoose**. It uses page-based routing and a feature-oriented frontend/backend structure.

## Included pages

- **Dashboard** — today's sales, orders, average order value, low-stock count, revenue chart, recent orders and quick actions.
- **Sales overview** — selectable 7/14/30-day reporting periods, revenue charts, top-selling items, order-level report and CSV export.
- **Store manager dashboard** — live order queue, order status controls, low-stock alerts, shift checklist and quick checkout.
- **Billing / POS** — product search/categories, cart quantities, dine-in/takeaway/delivery, table number, discounts, tax based on settings, payment method and stock-validated checkout.
- **Orders** — searchable/filterable order history, status changes and CSV export.
- **Menu management** — create/edit/delete menu items, categories, prices, availability and stock thresholds.
- **Inventory** — stock alerts, stock adjustment, inventory valuation and low-stock filter.
- **Settings** — café profile, contact details, tax/currency, receipt footer, opening hours, low-stock default and a live receipt preview. Settings are saved to MongoDB and used by new bills.

## Requirements

- Node.js 20+ recommended
- MongoDB local or MongoDB Atlas connection string

## Run on Windows

1. Extract the project ZIP.
2. Open PowerShell in the extracted `CafeOS` folder.
3. Install root tools and both apps:

```powershell
npm install
npm --prefix server install
npm --prefix client install
```

4. Create `.env` from the example:

```powershell
Copy-Item .env.example .env
```

5. Edit `.env` and set `MONGODB_URI` to your MongoDB local URI or Atlas connection string. Example local URI:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/cafeos
```

6. Start MongoDB if running locally, then start both applications:

```powershell
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check: http://localhost:4000/api/health

On the first start, `SEED_DEMO_DATA=true` inserts sample menu items when the products collection is empty. Change it to `false` if you don't want demo menu items.

## Simple folder structure

```text
CafeOS/
├── client/
│   └── src/
│       ├── pages/       # Dashboard, POS, Orders, Menu, Inventory, Sales, Settings
│       ├── components/  # Shared and feature UI components
│       ├── hooks/       # React hooks
│       ├── api/         # Frontend API calls
│       ├── app/         # Routes and Redux/store setup
│       ├── utils/       # Shared helpers
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
├── server/
│   └── src/
│       ├── routes/      # Express routes
│       ├── controllers/ # Request handlers
│       ├── services/    # Business logic
│       ├── models/      # Mongoose models
│       ├── config/      # Database connection
│       ├── middleware/  # Express middleware
│       ├── utils/       # Seed/demo data helpers
│       ├── app.js
│       └── server.js
├── .env.example
├── package.json
└── PRD.md
```

The app code has been moved into these simpler folders and relative imports updated to match.

## Main API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| GET/POST | `/api/products` | List and create menu/inventory items |
| PATCH/DELETE | `/api/products/:id` | Update/delete a menu item |
| GET/POST | `/api/orders` | List orders and create a bill/order |
| PATCH | `/api/orders/:id` | Update order/payment status or notes |
| GET | `/api/analytics/overview` | Dashboard and sales report metrics |
| GET/PUT | `/api/settings` | Read/save café preferences |
| POST | `/api/auth/login` | Login service endpoint |
| POST | `/api/auth/register` | Register a staff account endpoint |
| GET/POST | `/api/users` | List/create staff records |

## Important MVP notes

- This is a portfolio MVP. Authentication routes are scaffolded but are **not yet connected to a login UI or enforced as middleware**. Do not expose this version publicly with real business data until access control, authorization, rate limiting, and production secrets are configured.
- Payment methods are recorded for a bill; this does not integrate with a payment gateway or charge cards/UPI.
- Tax percentage is applied to the discounted subtotal. Service charge is saved in settings but is not included in totals yet.
- Stock is checked and decremented during checkout. For high-concurrency production usage, wrap checkout/inventory updates in a MongoDB transaction on a replica set.
- Reports are calculated from stored orders. CSV exports are generated in the browser.

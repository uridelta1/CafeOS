# CafeOS — Product Requirements Document

**Version:** 1.1 · **Status:** Portfolio MVP · **Target build:** 1–2 weeks

## 1. Product summary

CafeOS is a responsive web-based café operations system for a small café owner, store manager and cashier. It brings daily performance, sales reporting, order workflow, menu availability, inventory and billing into one interface. Billing/POS is a core feature within the management system rather than a separate application.

## 2. Goals

- Make it fast to create an itemized customer bill and record payment method.
- Give owners a reliable view of daily and period sales based on saved orders.
- Help store managers act on new orders and low-stock items from one page.
- Keep menu, inventory and settings data persisted in MongoDB.
- Demonstrate full-stack skills: REST API design, reusable React components, page routing, schema modeling, validation, data visualization and error states.

## 3. Users and roles

- **Owner:** reviews sales, manages café settings, menu and inventory.
- **Store manager:** oversees order queue, shift activity and stock alerts.
- **Cashier:** creates bills and updates order status.

Role-based authorization is a production requirement, but this MVP only scaffolds the authentication endpoints; enforcement is a follow-up task.

## 4. Scope and requirements

### 4.1 Dashboard
- Display today's paid revenue, paid order count, average order value and low-stock count.
- Show a 7-day revenue chart, recent orders, menu snapshot and shortcuts.
- Load data from MongoDB-backed API, with loading/error/empty states.

### 4.2 Sales overview
- Display gross sales, paid orders, average ticket and units sold.
- Allow 7-, 14- and 30-day reporting periods.
- Chart daily sales, rank top-selling items and list order-level sales.
- Export the currently filtered order report to CSV.

### 4.3 Store manager dashboard
- Show today's sales, active order queue, low-stock alerts and completed orders.
- Update order status: New → Preparing → Ready → Completed; allow cancellation.
- Link to all orders, inventory and POS.
- Provide a lightweight shift checklist.

### 4.4 Billing / POS
- Search/filter available menu items by category.
- Add/remove cart items and adjust quantities within available stock.
- Support dine-in, takeaway and delivery; capture table number for dine-in.
- Record cash/card/UPI as payment method.
- Apply a discount, calculate tax using the saved café tax rate, compute total and persist the order.
- Reject empty carts, invalid quantities, unavailable items and insufficient stock.
- Decrement product stock after successful checkout and provide printable receipt action.

### 4.5 Orders
- Show recent orders, items, amount, payment method, order type and status.
- Search by order number/item and filter by status.
- Update order and payment status; export orders to CSV.

### 4.6 Menu management
- Create, edit, search, hide/show and delete menu items.
- Track name, description, category, price, stock, low-stock threshold and availability.
- Validate required names and non-negative price/stock values.

### 4.7 Inventory
- Display current stock, threshold, status and retail-value estimate.
- Filter low-stock items and search by name/category.
- Adjust stock up or down, preventing negative stock.

### 4.8 Settings
- Persist café name, address, phone, email, currency, tax rate, service charge, receipt footer, default low-stock threshold and opening hours.
- Validate settings and show save/error/unsaved states.
- Preview receipt layout and indicate that tax settings affect future orders only.

## 5. Technical architecture

- **Frontend:** React, Vite, Tailwind CSS, React Router, Recharts, Lucide icons, Axios.
- **Backend:** Node.js, Express, Mongoose, REST APIs, centralized error middleware.
- **Database:** MongoDB collections for products, orders, settings and staff users.
- **Structure:** feature-based folders for components/hooks/API on the client and model/service/controller/routes on the server.
- **Configuration:** `.env` for MongoDB URI, server port, client origin and secrets; `.env` must not be committed.

## 6. Data model

- **Product:** name, category, description, price, stock, lowStockAt, unit, image, available, timestamps.
- **Order:** unique order number, embedded item snapshots, subtotal, discount, tax rate, tax, total, order type, table, payment method/status, order status, notes, timestamps.
- **Settings:** café profile, currency/tax/service charge, receipt footer, stock threshold, opening/closing hours.
- **StaffUser:** name, unique email, password hash (auth user model), role and active status.

Order item snapshots retain item name and price at checkout so later menu edits do not rewrite past receipts.

## 7. Primary routes

- `/` — Dashboard
- `/sales` — Sales overview
- `/manager` — Store manager dashboard
- `/billing` — POS
- `/orders` — Order management
- `/menu` — Menu management
- `/inventory` — Inventory
- `/settings` — Settings

## 8. Acceptance criteria

- All primary pages have their own route and work on desktop/mobile layouts.
- Sales overview totals are derived from saved paid orders and date selection updates the displayed results.
- Settings can be loaded, edited and saved to MongoDB; reloading the page preserves the saved values.
- Store manager can change order statuses and see low-stock items.
- Checkout persists the order, calculates subtotal/discount/tax/total and reduces stock; insufficient stock is rejected.
- Menu changes persist and reflect in POS and inventory.
- API errors are displayed instead of silently failing.
- Setup instructions explain MongoDB configuration and local run commands.

## 9. Out of scope for this MVP

- Live payment gateway, GST-compliant invoicing/legal tax advice, barcode scanner, printer integrations, kitchen display hardware, multi-branch tenancy, real-time websockets, employee attendance/payroll, and enforced production authentication/authorization.

## 10. Suggested delivery plan

1. **Days 1–2:** app shell, routing, Express setup, MongoDB connection, core models.
2. **Days 3–4:** menu and inventory CRUD.
3. **Days 5–6:** POS checkout, order storage and status workflow.
4. **Days 7–8:** sales analytics, charts, date periods and CSV export.
5. **Days 9–10:** store manager dashboard, settings persistence and receipt preview.
6. **Days 11–14:** validation, responsive polish, error/empty states, testing, README and deployment.

## 11. Known MVP limitations

- Authentication service endpoints exist but login UI and protected route middleware are not yet connected.
- Payment method is recorded only; no external payment is taken.
- Service charge is saved but not included in bill totals.
- Checkout stock updates should use MongoDB transactions for safe concurrent production checkout.

# Restaurant POS System - Product Epics

## Epic 1: POS & Ordering

**Goal:** Implement core POS flow for dine-in, takeout, and delivery orders with modifiers, split bills, discounts, and offline support.

### Story 1.1 — Create and Manage Orders

**As a** cashier/server
**I want to** create orders for dine-in, takeout, and delivery
**so that** the kitchen and billing systems receive accurate instructions.

**Acceptance Criteria:**
- Able to add menu items, modifiers, notes
- Order types selectable (dine-in / takeout / delivery)
- Order status transitions: Draft → Confirmed → In Progress → Completed
- Data persisted locally when offline

### Story 1.2 — Apply Discounts & Vouchers

**As a** cashier
**I want to** apply discounts, promotions, and vouchers to orders
**so that** customers receive accurate billing.

**Acceptance Criteria:**
- Support percentage and fixed amount discounts
- Validation rules for promo codes
- Discounts reflected in payment summary & receipts

### Story 1.3 — Split Bill / Merge Tables

**As a** cashier
**I want to** split or merge orders for tables
**so that** groups can pay separately or together.

**Acceptance Criteria:**
- Split by item, amount, or headcount
- Merge multiple table bills into one
- Order records remain consistent post-merge

### Story 1.4 — Offline Mode

**As a** restaurant manager
**I want to** keep using POS even without internet
**so that** business operations continue during downtime.

**Acceptance Criteria:**
- Orders and payments cached locally
- Background sync retries when back online
- Conflict resolution rules defined for duplicate orders

---

## 🪑 Epic 2: Table & Reservation Management

**Goal:** Manage floor plan, reservations, queueing, and server assignment.

### Story 2.1 — Floor Plan Editor

**As a** manager
**I want to** configure tables in a visual layout
**so that** staff can easily track table status.

**Acceptance Criteria:**
- Drag-drop UI for layout
- Table properties (capacity, section) editable
- Layout persists per branch

### Story 2.2 — Table Status Tracking

**As a** server
**I want to** see live table statuses
**so that** I know which tables are available, occupied, or need cleaning.

**Acceptance Criteria:**
- Status changes triggered by order state & manual override
- Color-coded indicators
- Real-time updates across all terminals

### Story 2.3 — Reservation & Queue System

**As a** host
**I want to** accept reservations and manage queues
**so that** I can manage peak hours efficiently.

**Acceptance Criteria:**
- Online and walk-in bookings
- Estimated wait times
- SMS/notification updates when table is ready

---

## 🍽️ Epic 3: Menu Management

**Goal:** Manage centralized menus with categories, modifiers, real-time updates.

### Story 3.1 — CRUD Menu Items

**As a** manager
**I want to** create and edit menu items with categories, images, pricing
**so that** customers and staff see updated information.

**Acceptance Criteria:**
- Support categories, time-based menus, modifiers
- Image upload & storage
- Real-time propagation to POS & customer apps

### Story 3.2 — Allergen & Nutritional Info

**As a** customer
**I want to** view allergen and nutritional information
**so that** I can make informed ordering decisions.

**Acceptance Criteria:**
- Allergen tags visible in POS and customer app
- Data stored at item level

---

## 🧍 Epic 4: Customer Management & Engagement

### Story 4.1 — Customer Profiles & Order History

**As a** system
**I want to** store customer order history
**so that** we can offer personalized experiences.

**Acceptance Criteria:**
- Link customer ID to all orders
- Show past orders and preferences in CRM panel

### Story 4.2 — Loyalty & Rewards

**As a** customer
**I want to** earn and redeem loyalty points
**so that** I feel rewarded for returning.

**Acceptance Criteria:**
- Points accrual rules configurable
- Redemption options apply to POS & online orders

### Story 4.3 — Automated Marketing

**As a** marketer
**I want to** send automated offers based on events (e.g., birthday)
**so that** engagement increases.

**Acceptance Criteria:**
- Event triggers integrated with SMS/email provider
- Offer templates configurable in admin panel

---

## 👨‍🍳 Epic 5: Kitchen Display System (KDS)

### Story 5.1 — Digital Kitchen Tickets

**As a** chef
**I want to** receive orders digitally by station
**so that** I can prepare food efficiently.

**Acceptance Criteria:**
- Orders routed by category (e.g., drinks, mains)
- Prep timer starts upon order confirmation
- Mark complete (bump) with timestamps

### Story 5.2 — Alerts for Prep Delays

**As a** kitchen staff
**I want to** be notified if prep time exceeds SLA
**so that** delays can be managed.

---

## 📦 Epic 6: Inventory & Supply Management

### Story 6.1 — Real-Time Stock Tracking

**As a** system
**I want to** auto-deduct ingredient stocks when orders are completed
**so that** inventory remains accurate.

**Acceptance Criteria:**
- Ingredient mapping to menu items
- Deduction triggered post-payment
- Low-stock alerts triggered on threshold

### Story 6.2 — Purchase Orders & Reorders

**As a** purchasing officer
**I want to** create and manage POs for suppliers
**so that** stock can be replenished on time.

---

## 💼 Epic 7: Staff & Shift Management

### Story 7.1 — Employee Profiles & Roles

**As an** admin
**I want to** manage employee records with roles and permissions
**so that** I can control access.

### Story 7.2 — Shift Scheduling & Time-in/out

**As a** manager
**I want to** schedule shifts and track attendance
**so that** staffing is efficient.

---

## 📊 Epic 8: Reports & Analytics

### Story 8.1 — Sales & Inventory Reports

**As a** business owner
**I want to** view daily sales, top-selling items, and inventory usage
**so that** I can make data-driven decisions.

**Acceptance Criteria:**
- Daily, category, branch filters
- Export to CSV/PDF
- Accessible in admin dashboard

### Story 8.2 — Customer & Peak Hour Analytics

**As a** manager
**I want to** see trends in customer behavior and peak times
**so that** I can adjust staffing and promos accordingly.

---

## 🌐 Epic 9: Online Ordering & Delivery

### Story 9.1 — Customer Online Ordering

**As a** customer
**I want to** place orders via web or mobile app
**so that** I can order remotely.

**Acceptance Criteria:**
- Browse menu, customize order, choose pickup/delivery
- Real-time sync with kitchen and POS
- Order status updates

### Story 9.2 — Delivery Partner Integration

**As a** system
**I want to** sync orders with Grab/Foodpanda
**so that** online channels are unified.

---

## 💳 Epic 10: Payments & Billing

### Story 10.1 — Multi-Mode Payment

**As a** cashier
**I want to** accept cash, card, QR, and split payments
**so that** customers have flexible options.

### Story 10.2 — Refunds & Tax Configuration

**As an** admin
**I want to** manage refunds and tax settings
**so that** financials remain accurate.

---

## 🏢 Epic 11: Multi-Branch / Franchise

### Story 11.1 — Centralized Menu & Pricing

**As a** franchise owner
**I want to** push menu updates to all branches
**so that** consistency is maintained.

### Story 11.2 — Branch Reporting

**As a** head office
**I want to** view branch-wise sales and inventory
**so that** I can track performance.

---

## 🛠️ Epic 12: System Administration & Integrations

### Story 12.1 — RBAC & Audit Trails

**As a** system admin
**I want to** define roles and track actions
**so that** security and compliance are ensured.

### Story 12.2 — API Integrations

**As a** developer
**I want to** integrate accounting, CRM, and loyalty systems
**so that** data flows seamlessly.

---

## Epic 13: Advanced Features (Optional)

### Story 13.1 — AI Demand Forecasting

**As a** manager
**I want to** see sales and stock forecasts
**so that** I can prepare inventory and staffing.

### Story 13.2 — QR Ordering & Kiosks

**As a** diner
**I want to** order from my table via QR code or kiosk
**so that** service is faster and contactless.

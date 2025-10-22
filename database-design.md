# Database Design
## RestoPlus - PostgreSQL Schema with Row-Level Security

**Version:** 1.0
**Last Updated:** 2025-10-21
**Database:** PostgreSQL 15+
**Multi-Tenancy:** Row-Level Security (RLS)

---

## 1. Database Architecture Overview

### 1.1 Design Principles

1. **Single Database, Multiple Schemas**: One PostgreSQL database with separate schemas per domain
2. **Row-Level Security (RLS)**: All tenant-scoped tables use RLS for data isolation
3. **UUID Primary Keys**: For distributed system compatibility and security
4. **Soft Deletes**: Most tables use `deleted_at` for audit trails
5. **Audit Columns**: Created/updated timestamps and user tracking
6. **Indexing Strategy**: Optimized for common query patterns
7. **Constraints**: Enforced at database level for data integrity
8. **Cross-Schema References**: Foreign keys can reference across schemas where needed

### 1.2 Schema Organization

```
restoplus_db (Single PostgreSQL Database)
│
├── admin           # Administration & Configuration Schema
│   ├── branches
│   ├── system_configs
│   ├── integrations
│   └── audit_logs
│
├── staff           # Staff & Operations Schema
│   ├── employees
│   ├── roles
│   └── shifts
│
├── orders          # Customer & Orders Schema
│   ├── customers
│   ├── menu_categories
│   ├── menu_items
│   ├── modifier_groups
│   ├── modifiers
│   ├── menu_item_modifiers
│   ├── tables
│   ├── reservations
│   ├── orders
│   └── order_items
│
├── kitchen         # Kitchen & Fulfillment Schema
│   ├── kitchen_stations
│   ├── kitchen_tickets
│   └── prep_items
│
├── billing         # Sales & Payments Schema
│   ├── bills
│   ├── bill_items
│   ├── discounts
│   ├── applied_discounts
│   ├── payments
│   ├── payment_splits
│   └── refunds
│
├── inventory       # Inventory & Procurement Schema
│   ├── inventory_items
│   ├── recipes
│   ├── recipe_ingredients
│   ├── stock_movements
│   ├── suppliers
│   ├── purchase_orders
│   └── purchase_order_items
│
├── crm             # Customer Engagement Schema
│   ├── loyalty_accounts
│   ├── loyalty_transactions
│   ├── campaigns
│   ├── campaign_deliveries
│   └── feedback
│
└── analytics       # Reporting & Analytics Schema (Data Warehouse)
    ├── daily_sales_summary
    ├── product_performance
    ├── customer_analytics
    └── hourly_traffic
```

**Benefits of Schema-Based Approach:**
- ✅ Simplified backup/restore (single database)
- ✅ Cross-schema queries and JOINs when needed
- ✅ Easier transaction management across domains
- ✅ Single connection pool
- ✅ Simpler deployment and migrations
- ✅ Better resource utilization
- ✅ Easier to implement distributed transactions if needed

---

## 2. Schema Setup & Initialization

### 2.1 Create Schemas

```sql
-- Create all schemas
CREATE SCHEMA IF NOT EXISTS admin;
CREATE SCHEMA IF NOT EXISTS staff;
CREATE SCHEMA IF NOT EXISTS orders;
CREATE SCHEMA IF NOT EXISTS kitchen;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Set search path for easier querying (optional)
-- Each service can set its own search path
ALTER DATABASE restoplus_db SET search_path TO public, admin, staff, orders, kitchen, billing, inventory, crm, analytics;
```

### 2.2 Schema Permissions

```sql
-- Create service roles
CREATE ROLE order_service WITH LOGIN PASSWORD 'secure_password';
CREATE ROLE kitchen_service WITH LOGIN PASSWORD 'secure_password';
CREATE ROLE billing_service WITH LOGIN PASSWORD 'secure_password';
CREATE ROLE staff_service WITH LOGIN PASSWORD 'secure_password';
CREATE ROLE inventory_service WITH LOGIN PASSWORD 'secure_password';
CREATE ROLE crm_service WITH LOGIN PASSWORD 'secure_password';
CREATE ROLE analytics_service WITH LOGIN PASSWORD 'secure_password';

-- Grant schema usage
GRANT USAGE ON SCHEMA admin TO order_service, kitchen_service, billing_service, staff_service;
GRANT USAGE ON SCHEMA orders TO order_service, kitchen_service, billing_service;
GRANT USAGE ON SCHEMA kitchen TO kitchen_service, order_service;
GRANT USAGE ON SCHEMA billing TO billing_service, order_service;
GRANT USAGE ON SCHEMA staff TO staff_service, order_service;
GRANT USAGE ON SCHEMA inventory TO inventory_service, kitchen_service;
GRANT USAGE ON SCHEMA crm TO crm_service, order_service;
GRANT USAGE ON SCHEMA analytics TO analytics_service;

-- Grant table permissions (example for order_service)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA orders TO order_service;
GRANT SELECT ON ALL TABLES IN SCHEMA admin TO order_service;
GRANT SELECT ON admin.branches TO order_service, kitchen_service, billing_service;

-- For future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA orders GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO order_service;
```

### 2.3 Cross-Schema Foreign Key References

PostgreSQL allows foreign keys across schemas:

```sql
-- Example: Order referencing customer from orders schema and branch from admin schema
CREATE TABLE orders.orders (
    id UUID PRIMARY KEY,
    branch_id UUID NOT NULL REFERENCES admin.branches(id),
    customer_id UUID REFERENCES orders.customers(id),
    -- ... other columns
);

-- Example: Kitchen ticket referencing order
CREATE TABLE kitchen.kitchen_tickets (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL, -- Reference to orders.orders.id (soft reference)
    -- ... other columns
);
```

**Note on Cross-Schema FKs:**
- Use hard foreign keys (with REFERENCES) for critical relationships within bounded contexts
- Use soft references (UUID without FK constraint) for loose coupling across domains
- This maintains domain independence while allowing data integrity where needed

---

## 3. Common Patterns & Conventions

### 3.1 Standard Audit Fields

All tables include these standard fields:

```sql
-- Audit columns (included in all tables)
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete
created_by UUID, -- Reference to employee/user
updated_by UUID
```

### 3.2 Multi-Tenancy Pattern

All tenant-scoped tables include:

```sql
branch_id UUID NOT NULL REFERENCES admin.branches(id),
-- RLS Policy
CREATE POLICY branch_isolation ON schema_name.table_name
    USING (branch_id = current_setting('app.current_branch_id')::UUID);
```

### 3.3 Naming Conventions

- **Schemas**: Singular, lowercase (e.g., `admin`, `orders`, `billing`)
- **Tables**: Plural, snake_case (e.g., `orders`, `menu_items`)
- **Full Table Name**: `schema.table` (e.g., `orders.orders`, `admin.branches`)
- **Columns**: snake_case (e.g., `order_number`, `created_at`)
- **Indexes**: `idx_{schema}_{table}_{columns}` (e.g., `idx_orders_orders_branch_status`)
- **Foreign Keys**: `fk_{schema}_{table}_{referenced_table}` (e.g., `fk_orders_orders_customers`)
- **Unique Constraints**: `unq_{schema}_{table}_{columns}` (e.g., `unq_staff_employees_email`)
- **Check Constraints**: `chk_{schema}_{table}_{condition}` (e.g., `chk_orders_orders_total_positive`)

### 3.4 Triggers for Updated_At

```sql
-- Generic trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to each table
CREATE TRIGGER trigger_update_updated_at
    BEFORE UPDATE ON table_name
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 4. Administration & Configuration Schema (admin)

### 4.1 Branches Table (Master Tenant Table)

```sql
CREATE TABLE admin.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,

    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(50),

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Philippines',

    -- Configuration
    timezone VARCHAR(50) DEFAULT 'Asia/Manila',
    currency VARCHAR(3) DEFAULT 'PHP',
    tax_rate DECIMAL(5,4) DEFAULT 0.12, -- 12% VAT
    service_charge_rate DECIMAL(5,4) DEFAULT 0.10, -- 10% service charge

    -- Settings (JSONB for flexibility)
    settings JSONB DEFAULT '{}',

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_admin_branches_code ON admin.branches(branch_code);
CREATE INDEX idx_admin_branches_active ON admin.branches(is_active) WHERE deleted_at IS NULL;
```

### 4.2 System Configuration

```sql
CREATE TABLE admin.system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    data_type VARCHAR(50) NOT NULL, -- string, integer, boolean, json
    category VARCHAR(100), -- general, payment, notification, etc.
    description TEXT,
    is_editable BOOLEAN DEFAULT true,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID
);

CREATE INDEX idx_admin_system_configs_category ON admin.system_configs(category);
```

### 4.3 Integrations

```sql
CREATE TABLE admin.integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES admin.branches(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- payment, delivery, accounting, sms, email
    provider VARCHAR(100) NOT NULL, -- stripe, gcash, grab, etc.

    -- Encrypted credentials (use pgcrypto)
    credentials BYTEA,

    -- Configuration
    config JSONB DEFAULT '{}',

    -- Status
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_admin_integrations_branch ON admin.integrations(branch_id);
CREATE INDEX idx_admin_integrations_type ON admin.integrations(type);
```

### 4.4 Audit Logs

```sql
CREATE TABLE admin.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES admin.branches(id),

    -- Entity Information
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,

    -- Action
    action VARCHAR(50) NOT NULL, -- create, update, delete, login, etc.

    -- Changes (JSONB for flexibility)
    old_values JSONB,
    new_values JSONB,

    -- User Context
    performed_by UUID NOT NULL,
    ip_address INET,
    user_agent TEXT,

    -- Timestamp
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_audit_logs_branch ON admin.audit_logs(branch_id);
CREATE INDEX idx_admin_audit_logs_entity ON admin.audit_logs(entity_type, entity_id);
CREATE INDEX idx_admin_audit_logs_performed_by ON admin.audit_logs(performed_by);
CREATE INDEX idx_admin_audit_logs_occurred_at ON admin.audit_logs(occurred_at DESC);

-- Enable RLS
ALTER TABLE admin.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY branch_isolation ON admin.audit_logs
    USING (branch_id = current_setting('app.current_branch_id')::UUID);
```

---

## 5. Staff & Operations Schema (staff)

### 5.1 Employees

```sql
CREATE TABLE staff.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES admin.branches(id),
    employee_number VARCHAR(50) NOT NULL,

    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),

    -- Authentication
    password_hash VARCHAR(255) NOT NULL,

    -- Employment Details
    role_id UUID NOT NULL,
    hire_date DATE NOT NULL,
    termination_date DATE,

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, on_leave, terminated

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,

    CONSTRAINT unq_employees_email UNIQUE(email),
    CONSTRAINT unq_employees_employee_number UNIQUE(branch_id, employee_number)
);

CREATE INDEX idx_staff_employees_branch ON staff.employees(branch_id);
CREATE INDEX idx_staff_employees_email ON staff.employees(email);
CREATE INDEX idx_staff_employees_status ON staff.employees(status) WHERE deleted_at IS NULL;

-- Enable RLS
ALTER TABLE staff.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY branch_isolation ON staff.employees
    USING (branch_id = current_setting('app.current_branch_id')::UUID);
```

### 5.2 Roles

```sql
CREATE TABLE staff.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,

    -- Permissions (JSONB array)
    permissions JSONB NOT NULL DEFAULT '[]',

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed default roles
INSERT INTO staff.roles (id, name, description, permissions) VALUES
('00000000-0000-0000-0000-000000000001', 'Admin', 'Full system access',
    '["*:*"]'::jsonb),
('00000000-0000-0000-0000-000000000002', 'Manager', 'Branch management',
    '["orders:*", "menu:*", "inventory:read", "reports:*"]'::jsonb),
('00000000-0000-0000-0000-000000000003', 'Cashier', 'POS operations',
    '["orders:create", "orders:update", "payments:create"]'::jsonb),
('00000000-0000-0000-0000-000000000004', 'Server', 'Table service',
    '["orders:create", "orders:read", "tables:update"]'::jsonb),
('00000000-0000-0000-0000-000000000005', 'Kitchen', 'Kitchen operations',
    '["kitchen:*"]'::jsonb);
```

### 5.3 Shifts

```sql
CREATE TABLE staff.shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES admin.branches(id),
    employee_id UUID NOT NULL REFERENCES staff.employees(id),

    -- Schedule
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Actual Time
    actual_clock_in TIMESTAMP WITH TIME ZONE,
    actual_clock_out TIMESTAMP WITH TIME ZONE,

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- scheduled, active, completed, no_show

    -- Notes
    notes TEXT,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,

    CONSTRAINT chk_shifts_schedule CHECK (scheduled_end > scheduled_start)
);

CREATE INDEX idx_staff_shifts_branch ON staff.shifts(branch_id);
CREATE INDEX idx_staff_shifts_employee ON staff.shifts(employee_id);
CREATE INDEX idx_staff_shifts_schedule ON staff.shifts(scheduled_start, scheduled_end);
CREATE INDEX idx_staff_shifts_status ON staff.shifts(status);

-- Enable RLS
ALTER TABLE staff.shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY branch_isolation ON staff.shifts
    USING (branch_id = current_setting('app.current_branch_id')::UUID);
```

---

## 6. Customer & Orders Schema (orders)

### 6.1 Customers

```sql
CREATE TABLE orders.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Personal Information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,

    -- Additional Info
    birthday DATE,

    -- Preferences (JSONB)
    preferences JSONB DEFAULT '{}',

    -- Aggregate Stats (denormalized for performance)
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0,

    -- Customer Tier
    tier VARCHAR(50) DEFAULT 'bronze', -- bronze, silver, gold, platinum

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT unq_customers_phone UNIQUE(phone)
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_tier ON customers(tier);
```

### 5.2 Menu Categories

```sql
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES branches(id), -- NULL means global

    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Ordering
    sort_order INT DEFAULT 0,

    -- Parent category for hierarchy
    parent_id UUID REFERENCES menu_categories(id),

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_menu_categories_branch ON menu_categories(branch_id);
CREATE INDEX idx_menu_categories_parent ON menu_categories(parent_id);
CREATE INDEX idx_menu_categories_active ON menu_categories(is_active) WHERE deleted_at IS NULL;
```

### 5.3 Menu Items

```sql
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES branches(id), -- NULL means global
    category_id UUID NOT NULL REFERENCES menu_categories(id),

    -- Basic Info
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2), -- Cost of goods sold

    -- Pricing variants (different prices for dine-in, takeout, delivery)
    price_dine_in DECIMAL(10,2),
    price_takeout DECIMAL(10,2),
    price_delivery DECIMAL(10,2),

    -- Media
    image_url VARCHAR(500),

    -- Availability
    is_available BOOLEAN DEFAULT true,
    availability_schedule JSONB, -- Time-based availability

    -- Dietary & Allergen Info
    allergens JSONB DEFAULT '[]', -- ["nuts", "dairy", "gluten"]
    dietary_tags JSONB DEFAULT '[]', -- ["vegetarian", "vegan", "halal"]

    -- Nutritional Info (optional)
    nutritional_info JSONB,

    -- Preparation
    preparation_time INT, -- in minutes

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,

    CONSTRAINT chk_menu_items_price_positive CHECK (price >= 0)
);

CREATE INDEX idx_menu_items_branch ON menu_items(branch_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available) WHERE deleted_at IS NULL;
CREATE INDEX idx_menu_items_name_search ON menu_items USING gin(to_tsvector('english', name));
```

### 5.4 Modifier Groups

```sql
CREATE TABLE modifier_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,

    -- Rules
    min_selection INT DEFAULT 0,
    max_selection INT DEFAULT 1,
    is_required BOOLEAN DEFAULT false,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE modifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0,

    -- Availability
    is_available BOOLEAN DEFAULT true,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_modifiers_group ON modifiers(group_id);

-- Link menu items to modifier groups
CREATE TABLE menu_item_modifiers (
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    modifier_group_id UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,

    PRIMARY KEY (menu_item_id, modifier_group_id)
);
```

### 5.5 Tables

```sql
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),

    table_number VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,

    -- Location
    section VARCHAR(100), -- indoor, outdoor, vip, etc.
    floor VARCHAR(50),

    -- Position for floor plan (x, y coordinates)
    position_x INT,
    position_y INT,

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'available', -- available, occupied, reserved, needs_cleaning

    -- Current assignments
    current_order_id UUID,
    assigned_server_id UUID REFERENCES employees(id),

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT unq_tables_number UNIQUE(branch_id, table_number),
    CONSTRAINT chk_tables_capacity_positive CHECK (capacity > 0)
);

CREATE INDEX idx_tables_branch ON tables(branch_id);
CREATE INDEX idx_tables_status ON tables(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tables_server ON tables(assigned_server_id);

-- Enable RLS
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
CREATE POLICY branch_isolation ON tables
    USING (branch_id = current_setting('app.current_branch_id')::UUID);
```

### 5.6 Reservations

```sql
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),

    -- Customer
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),

    -- Reservation Details
    party_size INT NOT NULL,
    reservation_time TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Table Assignment
    table_id UUID REFERENCES tables(id),

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed', -- confirmed, seated, cancelled, no_show, completed

    -- Special Requests
    special_requests TEXT,

    -- Notifications
    reminder_sent BOOLEAN DEFAULT false,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,

    CONSTRAINT chk_reservations_party_size_positive CHECK (party_size > 0)
);

CREATE INDEX idx_reservations_branch ON reservations(branch_id);
CREATE INDEX idx_reservations_customer ON reservations(customer_id);
CREATE INDEX idx_reservations_time ON reservations(reservation_time);
CREATE INDEX idx_reservations_status ON reservations(status);

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY branch_isolation ON reservations
    USING (branch_id = current_setting('app.current_branch_id')::UUID);
```

### 5.7 Orders

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),

    -- Order Identification
    order_number VARCHAR(50) NOT NULL,

    -- Customer & Table
    customer_id UUID REFERENCES customers(id),
    table_id UUID REFERENCES tables(id),

    -- Order Type
    type VARCHAR(50) NOT NULL, -- dine_in, takeout, delivery

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, confirmed, in_progress, completed, cancelled

    -- Pricing
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    service_charge DECIMAL(15,2) NOT NULL DEFAULT 0,
    total DECIMAL(15,2) NOT NULL DEFAULT 0,

    -- Delivery Info (for delivery orders)
    delivery_address JSONB,
    delivery_fee DECIMAL(10,2),

    -- Special Notes
    special_notes TEXT,

    -- Assignment
    server_id UUID REFERENCES employees(id),

    -- Timestamps
    confirmed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,

    CONSTRAINT unq_orders_number UNIQUE(branch_id, order_number),
    CONSTRAINT chk_orders_total_positive CHECK (total >= 0)
);

CREATE INDEX idx_orders_branch ON orders(branch_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_type ON orders(type);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_server ON orders(server_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY branch_isolation ON orders
    USING (branch_id = current_setting('app.current_branch_id')::UUID);
```

### 5.8 Order Items

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    -- Menu Item
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    name VARCHAR(255) NOT NULL, -- Snapshot at time of order

    -- Quantity & Pricing
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,

    -- Modifiers (JSONB for flexibility)
    modifiers JSONB DEFAULT '[]',

    -- Special Instructions
    special_notes TEXT,

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, preparing, ready, served, cancelled

    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_order_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_order_items_price_positive CHECK (unit_price >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item ON order_items(menu_item_id);
CREATE INDEX idx_order_items_status ON order_items(status);
```

---

## 6. Kitchen & Fulfillment Database (kitchen_db)

### 6.1 Kitchen Stations

```sql
CREATE TABLE kitchen_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),

    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- grill, fryer, salads, drinks, desserts, main

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Current Load (for load balancing)
    current_load INT DEFAULT 0,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT unq_kitchen_stations_name UNIQUE(branch_id, name)
);

CREATE INDEX idx_kitchen_stations_branch ON kitchen_stations(branch_id);
CREATE INDEX idx_kitchen_stations_type ON kitchen_stations(type);

-- Enable RLS
ALTER TABLE kitchen_stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY branch_isolation ON kitchen_stations
    USING (branch_id = current_setting('app.current_branch_id')::UUID);
```

### 6.2 Kitchen Tickets

```sql
CREATE TABLE kitchen_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),

    -- Order Reference
    order_id UUID NOT NULL,
    order_number VARCHAR(50) NOT NULL,

    -- Station Assignment
    station_id UUID NOT NULL REFERENCES kitchen_stations(id),

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled

    -- Priority
    priority VARCHAR(50) DEFAULT 'normal', -- normal, high, urgent

    -- Timing
    estimated_time INT, -- in minutes
    received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kitchen_tickets_branch ON kitchen_tickets(branch_id);
CREATE INDEX idx_kitchen_tickets_order ON kitchen_tickets(order_id);
CREATE INDEX idx_kitchen_tickets_station ON kitchen_tickets(station_id);
CREATE INDEX idx_kitchen_tickets_status ON kitchen_tickets(status);
CREATE INDEX idx_kitchen_tickets_received_at ON kitchen_tickets(received_at DESC);

-- Enable RLS
ALTER TABLE kitchen_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY branch_isolation ON kitchen_tickets
    USING (branch_id = current_setting('app.current_branch_id')::UUID);
```

### 6.3 Prep Items

```sql
CREATE TABLE prep_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES kitchen_tickets(id) ON DELETE CASCADE,

    -- Order Item Reference
    order_item_id UUID NOT NULL,

    -- Item Details
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    modifiers JSONB DEFAULT '[]',
    special_notes TEXT,

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, preparing, ready

    -- Timing
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_prep_items_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_prep_items_ticket ON prep_items(ticket_id);
CREATE INDEX idx_prep_items_order_item ON prep_items(order_item_id);
CREATE INDEX idx_prep_items_status ON prep_items(status);
```

---

*[Document continues with Billing, Inventory, CRM, and Analytics databases...]*

## 7. Row-Level Security (RLS) Implementation

### 7.1 Setting Current Branch Context

**Application-level (Go):**

```go
func SetBranchContext(ctx context.Context, db *sql.DB, branchID uuid.UUID) error {
    _, err := db.ExecContext(ctx,
        "SET LOCAL app.current_branch_id = $1",
        branchID.String())
    return err
}

// Usage in transaction
func ExecuteWithBranchContext(branchID uuid.UUID, fn func(*sql.Tx) error) error {
    tx, err := db.BeginTx(context.Background(), nil)
    if err != nil {
        return err
    }
    defer tx.Rollback()

    // Set branch context
    if err := SetBranchContext(context.Background(), tx, branchID); err != nil {
        return err
    }

    // Execute business logic
    if err := fn(tx); err != nil {
        return err
    }

    return tx.Commit()
}
```

### 7.2 RLS Policy Template

Apply this pattern to all branch-scoped tables:

```sql
-- Enable RLS on table
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations
CREATE POLICY branch_isolation ON table_name
    USING (branch_id = current_setting('app.current_branch_id')::UUID);
```

---

---

## 8. Schema Summary & Quick Reference

### 8.1 Complete Schema List

All tables use the pattern: `schema_name.table_name`

| Schema | Tables | Purpose |
|--------|--------|---------|
| **admin** | branches, system_configs, integrations, audit_logs | System configuration and multi-tenancy |
| **staff** | employees, roles, shifts | HR and access control |
| **orders** | customers, menu_categories, menu_items, modifiers, tables, reservations, orders, order_items | Core ordering functionality |
| **kitchen** | kitchen_stations, kitchen_tickets, prep_items | Kitchen operations |
| **billing** | bills, bill_items, discounts, payments, refunds | Financial transactions |
| **inventory** | inventory_items, recipes, stock_movements, suppliers, purchase_orders | Stock management |
| **crm** | loyalty_accounts, loyalty_transactions, campaigns, feedback | Customer engagement |
| **analytics** | daily_sales_summary, product_performance, customer_analytics, hourly_traffic | Business intelligence |

### 8.2 Schema-Based Table References

**Examples of fully-qualified table names:**

```sql
-- Admin schema
admin.branches
admin.system_configs
admin.integrations
admin.audit_logs

-- Staff schema
staff.employees
staff.roles
staff.shifts

-- Orders schema
orders.customers
orders.menu_items
orders.orders
orders.order_items
orders.tables

-- Kitchen schema
kitchen.kitchen_stations
kitchen.kitchen_tickets

-- Billing schema
billing.bills
billing.payments
billing.discounts

-- Inventory schema
inventory.inventory_items
inventory.purchase_orders

-- CRM schema
crm.loyalty_accounts
crm.campaigns

-- Analytics schema
analytics.daily_sales_summary
analytics.product_performance
```

### 8.3 Application Connection String

```go
// Single database connection
connStr := "postgres://user:password@localhost:5432/restoplus_db?sslmode=require"

// Set search path for service
db.Exec("SET search_path TO orders, admin, staff, kitchen, billing")

// Or use fully qualified names
db.Query("SELECT * FROM orders.orders WHERE branch_id = $1", branchID)
```

### 8.4 Migration Strategy for Schema-Based Approach

```bash
# Migration file structure
migrations/
├── 001_create_schemas.up.sql          # CREATE SCHEMA statements
├── 001_create_schemas.down.sql
├── 002_create_admin_tables.up.sql     # admin.branches, etc.
├── 002_create_admin_tables.down.sql
├── 003_create_staff_tables.up.sql     # staff.employees, etc.
├── 003_create_staff_tables.down.sql
├── 004_create_orders_tables.up.sql    # orders.orders, etc.
├── 004_create_orders_tables.down.sql
├── 005_create_kitchen_tables.up.sql
├── 006_create_billing_tables.up.sql
├── 007_create_inventory_tables.up.sql
├── 008_create_crm_tables.up.sql
├── 009_create_analytics_tables.up.sql
└── 010_create_rls_policies.up.sql     # All RLS policies
```

### 8.5 Benefits Summary

**Why Single Database with Multiple Schemas?**

1. **Simpler Operations**
   - Single backup/restore operation
   - One connection pool to manage
   - Easier monitoring and maintenance

2. **Better Performance**
   - Cross-schema JOINs are fast (same database)
   - No network overhead for cross-domain queries
   - Shared buffer cache

3. **Atomic Transactions**
   - ACID transactions across all schemas
   - Distributed transactions not needed for cross-domain operations
   - Simpler saga implementation

4. **Development Experience**
   - Single database to set up locally
   - Easier testing and seeding
   - Simpler CI/CD pipeline

5. **Cost Effective**
   - Single database instance instead of 8
   - Shared resources (memory, CPU)
   - Lower cloud hosting costs

6. **Flexible Boundaries**
   - Schemas provide logical separation
   - Can still enforce access control via GRANT/REVOKE
   - Easy to split into separate databases later if needed

---

**Document Control**
**Owner:** Database Team
**Reviewers:** Backend Engineers, DBA
**Next Review:** 2025-11-21
**Status:** Living Document

**Note:** This design uses PostgreSQL schemas for domain separation within a single database. All tables shown in sections 4-6 should include schema prefixes (e.g., `admin.branches`, `orders.orders`, `kitchen.kitchen_tickets`). The remaining schemas (billing, inventory, crm, analytics) follow the same patterns with their respective schema prefixes.

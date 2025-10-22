# Domain Architecture
## RestoPlus - Event-Driven DDD Microservices

**Version:** 1.0
**Last Updated:** 2025-10-21
**Architecture Style:** Event-Driven, Domain-Driven Design (DDD), Clean Architecture

---

## 1. Architecture Overview

RestoPlus follows an **event-driven, domain-driven microservices architecture** with **Clean Architecture (Hexagonal Architecture)** principles. Each domain is autonomous, handling its own business logic, data persistence, and API contracts while communicating through asynchronous events and synchronous APIs when necessary.

### 1.1 Core Architectural Principles

1. **Domain Independence**: Core business rules live independently of frameworks, databases, and external systems
2. **Event-Driven Communication**: Domains communicate primarily through domain events via message brokers
3. **Bounded Contexts**: Each domain has clear boundaries with well-defined aggregate roots
4. **Infrastructure Abstraction**: Shared infrastructure (auth, notifications, payments) is abstracted behind interfaces
5. **Separation of Concerns**: Four-layer architecture (Domain, Application, Infrastructure, Interface)
6. **CQRS Pattern**: Command-Query Responsibility Segregation for read/write optimization

---

## 2. High-Level Domain Groups

### Domain Architecture Map

| Domain | Responsibility | Microservices/Modules | Priority |
|--------|---------------|----------------------|----------|
| **Customer & Orders Domain** | Manages ordering, reservations, table flow, menu catalog | OrderService, ReservationService, TableService, MenuService | P0 |
| **Kitchen & Fulfillment Domain** | Handles food preparation workflow and kitchen operations | KitchenDisplayService, InventoryDeductionService | P0 |
| **Sales & Payments Domain** | Handles billing, invoices, taxes, payments, refunds | BillingService, PaymentGatewayService, DiscountService | P0 |
| **Staff & Operations Domain** | Employee management, scheduling, access control | EmployeeService, ShiftService, RoleService, AuthService | P1 |
| **Inventory & Procurement Domain** | Ingredients, stock, suppliers, purchase orders | InventoryService, SupplierService, ProcurementService | P1 |
| **Customer Engagement Domain** | Loyalty programs, CRM, feedback, promotions | CRMService, LoyaltyService, FeedbackService, MarketingService | P2 |
| **Reporting & Analytics Domain** | Aggregated reporting, business intelligence, data warehouse | ReportService, AnalyticsService, DataWarehouseService | P1 |
| **Administration & Config Domain** | System settings, branch management, integrations | AdminService, BranchService, IntegrationService, ConfigService | P1 |

---

## 3. Domain Model & Bounded Contexts

### 3.1 Customer & Orders Domain

**Bounded Context:** Ordering & Reservations

**Aggregate Roots:**
- `Order` - Central aggregate for customer orders
- `OrderItem` - Line items within an order
- `Reservation` - Customer table reservations
- `Table` - Physical restaurant tables
- `MenuItem` - Menu catalog items
- `MenuCategory` - Menu organization

**Key Entities:**
```go
// Order Aggregate
type Order struct {
    ID              OrderID
    OrderNumber     string
    CustomerID      CustomerID
    TableID         TableID (optional)
    Type            OrderType (DineIn, Takeout, Delivery)
    Status          OrderStatus (Draft, Confirmed, InProgress, Completed, Cancelled)
    Items           []OrderItem
    Subtotal        Money
    Discounts       []Discount
    Tax             Money
    Total           Money
    SpecialNotes    string
    CreatedAt       time.Time
    UpdatedAt       time.Time
    CompletedAt     *time.Time
}

type OrderItem struct {
    ID              OrderItemID
    MenuItemID      MenuItemID
    Name            string
    Quantity        int
    UnitPrice       Money
    Modifiers       []Modifier
    SpecialNotes    string
    Status          ItemStatus (Pending, Preparing, Ready, Served)
}

// Reservation Aggregate
type Reservation struct {
    ID              ReservationID
    CustomerID      CustomerID
    PartySize       int
    ReservedAt      time.Time
    Status          ReservationStatus (Confirmed, Seated, Cancelled, NoShow)
    TableID         *TableID
    SpecialRequests string
}

// Table Aggregate
type Table struct {
    ID              TableID
    TableNumber     string
    Capacity        int
    Section         string
    Floor           string
    Status          TableStatus (Available, Occupied, Reserved, NeedsCleaning)
    CurrentOrderID  *OrderID
    AssignedServerID *EmployeeID
}

// MenuItem Aggregate
type MenuItem struct {
    ID              MenuItemID
    Name            string
    Description     string
    CategoryID      CategoryID
    Price           Money
    ImageURL        string
    IsAvailable     bool
    Modifiers       []ModifierGroup
    Allergens       []Allergen
    NutritionalInfo NutritionalInfo
}
```

**Domain Events Published:**
- `OrderCreatedEvent`
- `OrderConfirmedEvent`
- `OrderItemAddedEvent`
- `OrderCompletedEvent`
- `OrderCancelledEvent`
- `TableStatusChangedEvent`
- `ReservationCreatedEvent`
- `ReservationSeatedEvent`
- `MenuItemUpdatedEvent`

**Domain Events Subscribed:**
- `PaymentCompletedEvent` (from Sales & Payments)
- `KitchenItemCompletedEvent` (from Kitchen & Fulfillment)

**Use Cases (Application Layer):**
- CreateOrder
- AddItemToOrder
- RemoveItemFromOrder
- ApplyDiscountToOrder
- ConfirmOrder
- CancelOrder
- SplitOrderBill
- MergeTableOrders
- CreateReservation
- SeatReservation
- UpdateTableStatus
- UpdateMenuItem
- BulkUpdateMenu

---

### 3.2 Kitchen & Fulfillment Domain

**Bounded Context:** Kitchen Operations

**Aggregate Roots:**
- `KitchenTicket` - Kitchen order preparation unit
- `KitchenStation` - Physical kitchen stations (grill, fryer, etc.)
- `PrepItem` - Individual items being prepared

**Key Entities:**
```go
// KitchenTicket Aggregate
type KitchenTicket struct {
    ID              KitchenTicketID
    OrderID         OrderID
    OrderNumber     string
    StationID       StationID
    Items           []PrepItem
    Status          TicketStatus (Pending, InProgress, Completed, Cancelled)
    Priority        Priority (Normal, High, Urgent)
    ReceivedAt      time.Time
    StartedAt       *time.Time
    CompletedAt     *time.Time
    EstimatedTime   time.Duration
}

type PrepItem struct {
    ID              PrepItemID
    OrderItemID     OrderItemID
    Name            string
    Quantity        int
    Modifiers       []string
    SpecialNotes    string
    Status          PrepStatus (Pending, Preparing, Ready)
    StartedAt       *time.Time
    CompletedAt     *time.Time
}

type KitchenStation struct {
    ID              StationID
    Name            string
    Type            StationType (Grill, Fryer, Salads, Drinks, Desserts)
    IsActive        bool
    CurrentLoad     int
}
```

**Domain Events Published:**
- `KitchenTicketReceivedEvent`
- `PrepItemStartedEvent`
- `PrepItemCompletedEvent`
- `KitchenTicketCompletedEvent`
- `PrepDelayAlertEvent`

**Domain Events Subscribed:**
- `OrderConfirmedEvent` (from Customer & Orders)
- `OrderCancelledEvent` (from Customer & Orders)

**Use Cases:**
- ReceiveKitchenOrder
- AssignTicketToStation
- StartPreparingItem
- BumpItem (mark complete)
- CompleteTicket
- AlertOnDelay
- ReassignTicket

---

### 3.3 Sales & Payments Domain

**Bounded Context:** Billing & Payments

**Aggregate Roots:**
- `Bill` - Customer bill/invoice
- `Payment` - Payment transaction
- `Discount` - Discount/promotion application
- `Tax` - Tax calculation

**Key Entities:**
```go
// Bill Aggregate
type Bill struct {
    ID              BillID
    OrderID         OrderID
    CustomerID      CustomerID
    Items           []BillLineItem
    Subtotal        Money
    Discounts       []AppliedDiscount
    TaxAmount       Money
    ServiceCharge   Money
    Total           Money
    Status          BillStatus (Pending, PartiallyPaid, Paid, Refunded)
    CreatedAt       time.Time
    PaidAt          *time.Time
}

type BillLineItem struct {
    ID              string
    OrderItemID     OrderItemID
    Description     string
    Quantity        int
    UnitPrice       Money
    Total           Money
}

// Payment Aggregate
type Payment struct {
    ID              PaymentID
    BillID          BillID
    Amount          Money
    Method          PaymentMethod (Cash, Card, QR, EWallet)
    Status          PaymentStatus (Pending, Authorized, Captured, Failed, Refunded)
    TransactionID   string
    GatewayResponse string
    ProcessedAt     time.Time
}

// Discount Aggregate
type Discount struct {
    ID              DiscountID
    Code            string
    Type            DiscountType (Percentage, FixedAmount)
    Value           decimal.Decimal
    Conditions      DiscountConditions
    ValidFrom       time.Time
    ValidUntil      time.Time
    MaxUsageCount   int
    CurrentUsage    int
}

type AppliedDiscount struct {
    DiscountID      DiscountID
    Code            string
    Amount          Money
    AppliedAt       time.Time
}
```

**Domain Events Published:**
- `BillGeneratedEvent`
- `PaymentInitiatedEvent`
- `PaymentCompletedEvent`
- `PaymentFailedEvent`
- `RefundIssuedEvent`
- `DiscountAppliedEvent`

**Domain Events Subscribed:**
- `OrderCompletedEvent` (from Customer & Orders)

**Use Cases:**
- GenerateBill
- SplitBill
- ProcessPayment
- ProcessSplitPayment
- IssueRefund
- ValidateDiscountCode
- ApplyDiscount
- CalculateTax
- GenerateReceipt

---

### 3.4 Staff & Operations Domain

**Bounded Context:** Human Resources & Access Control

**Aggregate Roots:**
- `Employee` - Staff member information
- `Shift` - Work schedule and attendance
- `Role` - Access control roles

**Key Entities:**
```go
// Employee Aggregate
type Employee struct {
    ID              EmployeeID
    EmployeeNumber  string
    FirstName       string
    LastName        string
    Email           string
    Phone           string
    RoleID          RoleID
    BranchID        BranchID
    Status          EmployeeStatus (Active, OnLeave, Terminated)
    HireDate        time.Time
    TerminationDate *time.Time
}

// Shift Aggregate
type Shift struct {
    ID              ShiftID
    EmployeeID      EmployeeID
    BranchID        BranchID
    ScheduledStart  time.Time
    ScheduledEnd    time.Time
    ActualClockIn   *time.Time
    ActualClockOut  *time.Time
    Status          ShiftStatus (Scheduled, Active, Completed, NoShow)
    Notes           string
}

// Role Aggregate
type Role struct {
    ID              RoleID
    Name            string
    Permissions     []Permission
    Description     string
}

type Permission struct {
    Resource        string
    Action          string (Read, Write, Delete, Execute)
}
```

**Domain Events Published:**
- `EmployeeCreatedEvent`
- `EmployeeRoleChangedEvent`
- `ShiftScheduledEvent`
- `ClockInEvent`
- `ClockOutEvent`

**Domain Events Subscribed:**
- `OrderCreatedEvent` (to track server assignments)

**Use Cases:**
- CreateEmployee
- UpdateEmployeeRole
- ScheduleShift
- ClockIn
- ClockOut
- AssignServerToTable
- CalculateHoursWorked
- ValidatePermissions

---

### 3.5 Inventory & Procurement Domain

**Bounded Context:** Stock & Supply Chain Management

**Aggregate Roots:**
- `InventoryItem` - Stock item (ingredient/supply)
- `Supplier` - Vendor information
- `PurchaseOrder` - Supply orders
- `Recipe` - Ingredient mapping for menu items

**Key Entities:**
```go
// InventoryItem Aggregate
type InventoryItem struct {
    ID              InventoryItemID
    SKU             string
    Name            string
    Category        string
    Unit            UnitOfMeasure
    CurrentStock    decimal.Decimal
    MinimumStock    decimal.Decimal
    ReorderLevel    decimal.Decimal
    UnitCost        Money
    LastRestocked   time.Time
}

// Recipe Aggregate (links MenuItem to Ingredients)
type Recipe struct {
    ID              RecipeID
    MenuItemID      MenuItemID
    Ingredients     []RecipeIngredient
}

type RecipeIngredient struct {
    InventoryItemID InventoryItemID
    Quantity        decimal.Decimal
    Unit            UnitOfMeasure
}

// PurchaseOrder Aggregate
type PurchaseOrder struct {
    ID              PurchaseOrderID
    PONumber        string
    SupplierID      SupplierID
    Items           []POLineItem
    Status          POStatus (Draft, Sent, PartiallyReceived, Received, Cancelled)
    OrderDate       time.Time
    ExpectedDate    time.Time
    ReceivedDate    *time.Time
    TotalAmount     Money
}

// Supplier Aggregate
type Supplier struct {
    ID              SupplierID
    Name            string
    ContactPerson   string
    Email           string
    Phone           string
    Address         Address
    PaymentTerms    string
}
```

**Domain Events Published:**
- `InventoryUpdatedEvent`
- `LowStockAlertEvent`
- `StockDepletedEvent`
- `PurchaseOrderCreatedEvent`
- `PurchaseOrderReceivedEvent`

**Domain Events Subscribed:**
- `OrderCompletedEvent` (to deduct stock)
- `PaymentCompletedEvent` (to confirm deduction)

**Use Cases:**
- UpdateInventoryStock
- CheckStockAvailability
- DeductStockForOrder
- TriggerLowStockAlert
- CreatePurchaseOrder
- ReceivePurchaseOrder
- CalculateStockUsage
- ForecastReorderNeeds

---

### 3.6 Customer Engagement Domain

**Bounded Context:** CRM & Marketing

**Aggregate Roots:**
- `Customer` - Customer profile
- `LoyaltyAccount` - Loyalty points and tiers
- `Campaign` - Marketing campaigns
- `Feedback` - Customer feedback

**Key Entities:**
```go
// Customer Aggregate
type Customer struct {
    ID              CustomerID
    FirstName       string
    LastName        string
    Email           string
    Phone           string
    Birthday        *time.Time
    Preferences     CustomerPreferences
    Tier            CustomerTier (Bronze, Silver, Gold, Platinum)
    TotalSpent      Money
    OrderCount      int
    CreatedAt       time.Time
}

// LoyaltyAccount Aggregate
type LoyaltyAccount struct {
    ID              LoyaltyAccountID
    CustomerID      CustomerID
    PointsBalance   int
    TotalEarned     int
    TotalRedeemed   int
    Tier            LoyaltyTier
    LastActivity    time.Time
}

// Campaign Aggregate
type Campaign struct {
    ID              CampaignID
    Name            string
    Type            CampaignType (Birthday, Lapsed, Promotional)
    Trigger         TriggerCondition
    OfferTemplate   string
    ValidFrom       time.Time
    ValidUntil      time.Time
    Status          CampaignStatus
}

// Feedback Aggregate
type Feedback struct {
    ID              FeedbackID
    CustomerID      CustomerID
    OrderID         OrderID
    Rating          int
    Comment         string
    CreatedAt       time.Time
}
```

**Domain Events Published:**
- `CustomerRegisteredEvent`
- `LoyaltyPointsEarnedEvent`
- `LoyaltyPointsRedeemedEvent`
- `CustomerTierUpgradedEvent`
- `FeedbackSubmittedEvent`
- `CampaignTriggeredEvent`

**Domain Events Subscribed:**
- `PaymentCompletedEvent` (to award points)
- `OrderCompletedEvent` (to trigger campaigns)

**Use Cases:**
- RegisterCustomer
- UpdateCustomerProfile
- AwardLoyaltyPoints
- RedeemLoyaltyPoints
- CalculateCustomerTier
- TriggerBirthdayCampaign
- SendPromotionalOffer
- CollectFeedback

---

### 3.7 Reporting & Analytics Domain

**Bounded Context:** Business Intelligence

**Aggregate Roots:**
- `Report` - Scheduled or on-demand reports
- `Dashboard` - Real-time metrics
- `DataSnapshot` - Historical aggregates

**Key Entities:**
```go
// Report Aggregate
type Report struct {
    ID              ReportID
    Name            string
    Type            ReportType (Sales, Inventory, Staff, Customer)
    Parameters      ReportParameters
    GeneratedAt     time.Time
    Format          ReportFormat (PDF, CSV, JSON)
    DataURL         string
}

// Dashboard Aggregate
type Dashboard struct {
    ID              DashboardID
    BranchID        BranchID
    Metrics         []Metric
    UpdatedAt       time.Time
}

type Metric struct {
    Name            string
    Value           interface{}
    Unit            string
    Timestamp       time.Time
}
```

**Domain Events Published:**
- `ReportGeneratedEvent`
- `AlertThresholdExceededEvent`

**Domain Events Subscribed:**
- All domain events (for analytics aggregation)

**Use Cases:**
- GenerateSalesReport
- GenerateInventoryReport
- GenerateStaffReport
- CalculatePeakHours
- CalculateTopSellingItems
- CalculateCustomerLifetimeValue
- ExportReportToCSV
- BuildRealTimeDashboard

---

### 3.8 Administration & Configuration Domain

**Bounded Context:** System Configuration & Multi-Tenancy

**Aggregate Roots:**
- `Branch` - Restaurant branch/location
- `SystemConfig` - System-wide settings
- `Integration` - Third-party integrations
- `AuditLog` - System audit trail

**Key Entities:**
```go
// Branch Aggregate
type Branch struct {
    ID              BranchID
    BranchCode      string
    Name            string
    Address         Address
    Phone           string
    Email           string
    TaxRate         decimal.Decimal
    Timezone        string
    IsActive        bool
    Settings        BranchSettings
}

// SystemConfig Aggregate
type SystemConfig struct {
    ID              ConfigID
    Key             string
    Value           string
    DataType        string
    Category        string
    IsEditable      bool
    UpdatedAt       time.Time
    UpdatedBy       EmployeeID
}

// Integration Aggregate
type Integration struct {
    ID              IntegrationID
    Name            string
    Type            IntegrationType (Payment, Delivery, Accounting, SMS)
    Provider        string
    Credentials     EncryptedCredentials
    IsActive        bool
    Config          map[string]string
}

// AuditLog Aggregate
type AuditLog struct {
    ID              AuditLogID
    EntityType      string
    EntityID        string
    Action          AuditAction (Create, Update, Delete)
    PerformedBy     EmployeeID
    Changes         map[string]interface{}
    Timestamp       time.Time
    IPAddress       string
}
```

**Domain Events Published:**
- `BranchCreatedEvent`
- `ConfigurationUpdatedEvent`
- `IntegrationActivatedEvent`
- `AuditLogRecordedEvent`

**Domain Events Subscribed:**
- All critical domain events (for audit logging)

**Use Cases:**
- CreateBranch
- UpdateBranchSettings
- UpdateSystemConfig
- ActivateIntegration
- DeactivateIntegration
- RecordAuditLog
- SyncMenuAcrossBranches

---

## 4. Clean Architecture Layers

Each microservice follows the four-layer Clean Architecture pattern:

### 4.1 Domain Layer (Innermost)

**Responsibility:** Pure business logic and domain models

**Components:**
- Entities (Aggregate Roots)
- Value Objects
- Domain Events
- Domain Services
- Business Rules
- Domain Exceptions

**Dependencies:** None (zero external dependencies)

**Example Structure:**
```
domain/
   entities/
      order.go
      order_item.go
      table.go
   valueobjects/
      money.go
      order_status.go
      address.go
   events/
      order_created_event.go
      order_completed_event.go
   services/
      pricing_service.go
   errors/
       domain_errors.go
```

### 4.2 Application Layer

**Responsibility:** Use case orchestration and business workflows

**Components:**
- Use Cases (Application Services)
- Input/Output DTOs
- Port Interfaces (Repository, External Services)
- Command Handlers
- Query Handlers
- Event Handlers

**Dependencies:** Domain Layer only

**Example Structure:**
```
application/
   usecases/
      create_order.go
      confirm_order.go
      split_bill.go
   commands/
      create_order_command.go
      confirm_order_command.go
   queries/
      get_order_query.go
      list_orders_query.go
   ports/
      repositories/
         order_repository.go
         menu_repository.go
      services/
          payment_gateway.go
          notification_service.go
   dtos/
       order_dto.go
       order_request.go
```

### 4.3 Infrastructure Layer

**Responsibility:** External implementations and technical concerns

**Components:**
- Database Implementations (PostgreSQL, Redis)
- Message Broker Implementations (RabbitMQ, Kafka)
- External API Clients
- File Storage
- Caching
- Logging
- Monitoring

**Dependencies:** Application Layer (implements ports)

**Example Structure:**
```
infrastructure/
   persistence/
      postgres/
         order_repository_impl.go
         migrations/
         models/
      redis/
          cache_impl.go
   messaging/
      kafka/
         producer.go
         consumer.go
         event_publisher.go
      rabbitmq/
          publisher.go
   external/
      payment_gateway_impl.go
      sms_service_impl.go
      delivery_api_client.go
   storage/
      s3_storage.go
   logging/
       logger.go
```

### 4.4 Interface Layer (Outermost)

**Responsibility:** Entry points and user interfaces

**Components:**
- REST API Controllers
- GraphQL Resolvers
- gRPC Services
- WebSocket Handlers
- CLI Commands
- Background Jobs

**Dependencies:** Application Layer

**Example Structure:**
```
interfaces/
   api/
      rest/
         handlers/
            order_handler.go
            menu_handler.go
         middleware/
            auth.go
            logging.go
         routes.go
      grpc/
         order_service.proto
         order_service_impl.go
      graphql/
          schema.graphql
          resolvers/
   websocket/
      order_updates.go
   jobs/
       sync_offline_orders.go
       generate_reports.go
```

---

## 5. Inter-Service Communication

### 5.1 Communication Patterns

| Pattern | Use When | Example | Technology |
|---------|----------|---------|------------|
| **Synchronous (REST/gRPC)** | Direct request-response needed, real-time validation | OrderService ’ InventoryService: Check stock availability | REST API, gRPC |
| **Asynchronous (Event-Driven)** | Fire-and-forget, multiple consumers, eventual consistency | OrderPlacedEvent triggers KitchenService, BillingService, InventoryService | Kafka, RabbitMQ |
| **Query (CQRS Read Model)** | Reporting, aggregated data, complex queries | ReportService reads from denormalized analytics database | PostgreSQL, ElasticSearch |
| **Saga Pattern** | Distributed transactions, compensation logic | Payment ’ Inventory ’ Kitchen coordination for order fulfillment | Event Choreography |

### 5.2 Domain Events Catalog

#### Core Events Flow Example:

```
1. Customer places order
   ’ OrderCreatedEvent published

2. Order confirmed
   ’ OrderConfirmedEvent published
   ’ Consumed by: KitchenService, InventoryService

3. Kitchen receives order
   ’ KitchenTicketReceivedEvent published

4. Kitchen completes order
   ’ KitchenTicketCompletedEvent published
   ’ Consumed by: OrderService

5. Bill generated
   ’ BillGeneratedEvent published

6. Payment processed
   ’ PaymentCompletedEvent published
   ’ Consumed by: OrderService, InventoryService, LoyaltyService

7. Stock deducted
   ’ InventoryUpdatedEvent published
   ’ If low: LowStockAlertEvent published

8. Loyalty points awarded
   ’ LoyaltyPointsEarnedEvent published
```

### 5.3 Event Schema Standard

All events follow a common schema:

```go
type DomainEvent struct {
    EventID       string    // Unique event identifier
    EventType     string    // e.g., "order.created"
    AggregateID   string    // ID of the aggregate root
    AggregateType string    // e.g., "Order"
    OccurredAt    time.Time // Event timestamp
    Version       int       // Event schema version
    Payload       interface{} // Event-specific data
    Metadata      EventMetadata
}

type EventMetadata struct {
    UserID        string
    BranchID      string
    CorrelationID string // For tracing across services
    CausationID   string // ID of event that caused this event
}
```

### 5.4 Event Bus Architecture

```
                                                         
OrderService   pub  ’    Kafka        sub  ’KitchenService
                         Topics                          
                                     
                        - orders                         
BillingService  sub  ’  - payments   pub  PaymentService
                        - inventory                      
                                     
                              
                              “
                                     
                     Event Consumers 
                     - Analytics     
                     - Audit Log     
                     - Notifications 
                                     
```

---

## 6. Data Management Strategy

### 6.1 Database per Service

Each microservice has its own database schema/instance:

| Service | Database | Purpose | Backup Frequency |
|---------|----------|---------|------------------|
| OrderService | PostgreSQL | Transactional order data | Every 4 hours |
| MenuService | PostgreSQL | Menu catalog | Daily |
| InventoryService | PostgreSQL | Stock levels | Every 2 hours |
| BillingService | PostgreSQL | Financial records | Every 1 hour |
| KitchenService | Redis + PostgreSQL | Real-time tickets + history | Every 4 hours |
| CRMService | PostgreSQL | Customer data | Daily |
| AnalyticsService | ElasticSearch + ClickHouse | Time-series analytics | Weekly |
| ReportService | Data Warehouse (PostgreSQL) | Denormalized reporting | Daily |

### 6.2 CQRS Implementation

**Command Side (Write):**
- Handles state changes
- Strong consistency
- Event sourcing optional for audit trail

**Query Side (Read):**
- Optimized for reads
- Eventual consistency acceptable
- Denormalized views
- Separate read models for reporting

**Example:**
```
Write Model (OrderService):
- Normalized tables
- ACID transactions
- Events published on commit

Read Model (ReportService):
- Denormalized views
- Pre-aggregated data
- Updated via event consumers
```

### 6.3 Data Consistency Patterns

**Strong Consistency (within service):**
- Use database transactions
- ACID guarantees

**Eventual Consistency (across services):**
- Event-driven updates
- Retry mechanisms
- Idempotent event handlers

**Saga Pattern (distributed transactions):**
```
Order Creation Saga:
1. Reserve inventory
2. Process payment
3. Create kitchen ticket
4. Complete order

On failure at any step:
’ Compensating transactions rollback
```

---

## 7. Technology Stack

### 7.1 Backend Services

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Primary Language** | Go (Golang) | Performance, concurrency, microservices-friendly |
| **Alternative** | Node.js (NestJS) | Event-driven, TypeScript, developer familiarity |
| **API Framework** | Gin, Fiber (Go) or NestJS | Fast, lightweight, good middleware support |
| **gRPC** | protobuf + gRPC-Go | Inter-service communication |

### 7.2 Data Layer

| Component | Technology | Use Case |
|-----------|-----------|----------|
| **Primary Database** | PostgreSQL 15+ | Relational data, ACID transactions |
| **Cache** | Redis 7+ | Session management, real-time data, rate limiting |
| **Search** | ElasticSearch | Full-text search, analytics |
| **Time-Series Analytics** | ClickHouse | Large-scale reporting, data warehouse |
| **Object Storage** | MinIO / S3 | Images, receipts, documents |

### 7.3 Messaging & Events

| Component | Technology | Use Case |
|-----------|-----------|----------|
| **Message Broker** | Apache Kafka | High-throughput event streaming |
| **Alternative** | RabbitMQ | Simple pub-sub, task queues |
| **Event Store** | EventStoreDB (optional) | Event sourcing, audit trail |

### 7.4 Authentication & Authorization

| Component | Technology | Use Case |
|-----------|-----------|----------|
| **Auth Service** | Custom Go service | JWT issuer, session management |
| **Identity Provider** | Keycloak (optional) | OAuth2/OIDC, SSO |
| **Token** | JWT (RS256) | Stateless authentication |
| **RBAC** | Custom implementation | Role-based permissions |

### 7.5 Infrastructure & DevOps

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Containerization** | Docker | Service packaging |
| **Orchestration** | Kubernetes | Container orchestration, scaling |
| **API Gateway** | Kong / Nginx | API routing, rate limiting, auth |
| **Service Mesh** | Istio (optional) | Traffic management, observability |
| **CI/CD** | GitLab CI / GitHub Actions | Automated testing, deployment |
| **Monitoring** | Prometheus + Grafana | Metrics, alerting |
| **Logging** | ELK Stack (Elasticsearch, Logstash, Kibana) | Centralized logging |
| **Tracing** | Jaeger | Distributed tracing |
| **Cloud Provider** | AWS / GCP / Azure | Cloud-agnostic design with IaC |

### 7.6 Frontend

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Web Admin** | React 18 + TypeScript | Admin dashboard |
| **POS Terminal** | React + Electron | Offline-capable desktop app |
| **Customer Web** | Next.js | SSR for SEO, online ordering |
| **Mobile App** | React Native / Flutter | iOS/Android customer app |
| **UI Library** | Tailwind CSS + shadcn/ui | Consistent design system |
| **State Management** | Zustand / Redux Toolkit | Client state |
| **API Client** | TanStack Query | Data fetching, caching |

---

## 8. Security Architecture

### 8.1 Authentication Flow

```
1. User login
   ’ AuthService validates credentials
   ’ Issues JWT (access + refresh token)

2. API request
   ’ API Gateway validates JWT
   ’ Extracts user context
   ’ Forwards to service with user metadata

3. Service authorization
   ’ Checks RBAC permissions
   ’ Executes use case
```

### 8.2 Security Layers

| Layer | Measures |
|-------|----------|
| **Network** | VPC isolation, firewall rules, DDoS protection |
| **API Gateway** | Rate limiting, IP whitelisting, JWT validation |
| **Service-to-Service** | mTLS (mutual TLS), service mesh encryption |
| **Data** | Encryption at rest (AES-256), encryption in transit (TLS 1.3) |
| **Application** | Input validation, SQL injection prevention, XSS protection |
| **Audit** | Comprehensive audit logging, SIEM integration |

### 8.3 PCI-DSS Compliance (Payment Data)

- **Never store full card numbers** (use tokenization)
- **Encrypt cardholder data** in transit and at rest
- **Secure payment gateway integration** (Stripe, Adyen)
- **Regular security audits** and penetration testing
- **Access control** to payment systems

---

## 9. Scalability & Performance

### 9.1 Horizontal Scaling Strategy

| Service | Scaling Trigger | Target Instances |
|---------|----------------|------------------|
| OrderService | CPU > 70% or RPS > 1000 | 3-10 |
| KitchenService | Active tickets > 100 | 2-5 |
| PaymentService | Transaction queue > 50 | 3-8 |
| ReportService | Scheduled batch jobs | 2-4 |
| MenuService | Low frequency | 2 |

### 9.2 Caching Strategy

**Multi-Layer Caching:**

1. **CDN (Cloudflare/CloudFront)**
   - Static assets, images
   - Menu catalog for customer apps

2. **API Gateway Cache**
   - Menu read endpoints
   - Public data (TTL: 5 minutes)

3. **Application Cache (Redis)**
   - User sessions
   - Active orders
   - Real-time inventory
   - Table status

4. **Database Query Cache**
   - Frequently accessed aggregates
   - Read replicas for analytics

### 9.3 Performance Targets

| Metric | Target | Monitoring |
|--------|--------|------------|
| API Response Time (p95) | < 200ms | Prometheus |
| API Response Time (p99) | < 500ms | Prometheus |
| Order Creation | < 2 seconds | APM |
| Payment Processing | < 3 seconds | APM |
| Kitchen Ticket Delivery | < 2 seconds | Custom metric |
| Event Processing Lag | < 5 seconds | Kafka metrics |
| Database Query Time | < 50ms (p95) | Slow query log |

---

## 10. Offline-First Architecture (POS Terminals)

### 10.1 Local-First Data Strategy

**POS Terminal Stack:**
```
                             
  React POS App (Electron)   
                             $
  Local State (Redux)        
                             $
  IndexedDB (Local Storage)  
  - Orders (pending sync)    
  - Menu (cached)            
  - Settings                 
                             $
  Sync Engine                
  - Background sync worker   
  - Conflict resolution      
  - Retry queue              
                             
        • (when online)
                             
   Cloud Services (APIs)     
                             
```

### 10.2 Sync Strategy

**On Connection Restore:**
1. Sync menu updates (pull)
2. Sync pending orders (push)
3. Sync payments (push)
4. Resolve conflicts (last-write-wins with timestamp)

**Conflict Resolution Rules:**
```go
// Example: Order conflict
if localOrder.UpdatedAt > remoteOrder.UpdatedAt {
    // Local version is newer
    uploadToServer(localOrder)
} else if localOrder.UpdatedAt < remoteOrder.UpdatedAt {
    // Remote version is newer
    updateLocal(remoteOrder)
} else {
    // Timestamps equal - check by OrderStatus priority
    resolveByBusinessRule(localOrder, remoteOrder)
}
```

---

## 11. Multi-Tenancy (Multi-Branch Support)

### 11.1 Tenancy Model

**Shared Database, Partitioned by BranchID:**

```sql
-- All tables include branch_id for data isolation
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    branch_id UUID NOT NULL,
    customer_id UUID,
    order_number VARCHAR(50),
    -- ... other columns
    CONSTRAINT fk_branch FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- Row-level security (PostgreSQL)
CREATE POLICY branch_isolation ON orders
    USING (branch_id = current_setting('app.branch_id')::UUID);
```

**Service Filtering:**
```go
// Every query automatically filters by branch
func (r *OrderRepository) FindByID(ctx context.Context, orderID OrderID) (*Order, error) {
    branchID := ctx.Value("branch_id").(BranchID)

    query := "SELECT * FROM orders WHERE id = $1 AND branch_id = $2"
    // ...
}
```

### 11.2 Branch Configuration Hierarchy

```
                           
   Head Office Config      
   (Global Settings)       
             ,             
              
             4    
         “         “
                     
    Branch A Branch B
    Config   Config  
                     

Merge Strategy:
- Branch settings override global
- Menu can be branch-specific or inherited
- Tax rates per branch
```

---

## 12. Observability & Monitoring

### 12.1 Three Pillars

**1. Metrics (Prometheus + Grafana)**
- Request rates, latencies, error rates
- Resource utilization (CPU, memory, disk)
- Business metrics (orders/hour, revenue, etc.)

**2. Logs (ELK Stack)**
- Centralized structured logging (JSON format)
- Log levels: DEBUG, INFO, WARN, ERROR
- Correlation IDs for request tracing

**3. Traces (Jaeger)**
- Distributed tracing across services
- Span context propagation
- Performance bottleneck identification

### 12.2 Alerting Strategy

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| Service Down | Health check fails | Critical | Page on-call engineer |
| High Error Rate | Error rate > 5% | High | Investigate immediately |
| Slow Response | p99 > 1s | Medium | Review performance |
| Low Stock | Inventory < threshold | Medium | Notify manager |
| Payment Failures | Failure rate > 2% | High | Check payment gateway |
| Kafka Lag | Consumer lag > 10k | High | Scale consumers |

### 12.3 Health Checks

**Liveness Probe:**
```go
// /health/live
func LivenessHandler(w http.ResponseWriter, r *http.Request) {
    // Simple: is the service running?
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"status": "alive"})
}
```

**Readiness Probe:**
```go
// /health/ready
func ReadinessHandler(w http.ResponseWriter, r *http.Request) {
    // Check dependencies: database, message broker
    if !db.Ping() || !kafka.IsConnected() {
        w.WriteHeader(http.StatusServiceUnavailable)
        return
    }
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"status": "ready"})
}
```

---

## 13. Deployment Architecture

### 13.1 Kubernetes Deployment

```yaml
# Example: OrderService deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
      - name: order-service
        image: restoplus/order-service:v1.2.3
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 30
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 10
```

### 13.2 Network Architecture

```
                                 
                       Internet  
                          ,      
                           
                          ¼      
                    Load Balancer
                          ,      
                           
                          ¼      
                    API Gateway  
                       (Kong)    
                          ,      
                           
                          <                  
                                            
       ¼               ¼               ¼   
    Order           Menu            Payment
    Service         Service         Service
       ,               ,               ,   
                                            
                          <                  
                           
                          ¼      
                       Kafka     
                                 
```

### 13.3 Environment Strategy

| Environment | Purpose | Data | Deployment |
|-------------|---------|------|------------|
| **Development** | Local development | Mock/seed data | Docker Compose |
| **Staging** | Pre-production testing | Anonymized production snapshot | Kubernetes |
| **Production** | Live system | Real customer data | Kubernetes (multi-region) |

---

## 14. Migration & Rollout Strategy

### 14.1 Phased Rollout

**Phase 1: MVP (Single Branch)**
- Deploy core services: Order, Menu, Payment
- Test with 1 pilot branch
- Gather feedback, iterate

**Phase 2: Multi-Service (3-5 Branches)**
- Add Kitchen, Inventory, Staff services
- Onboard early adopter branches
- Validate scalability

**Phase 3: Full Platform (10+ Branches)**
- Add CRM, Loyalty, Analytics
- National rollout
- Marketing push

**Phase 4: Advanced Features**
- AI forecasting
- Third-party integrations
- International expansion

### 14.2 Database Migration Strategy

**Zero-Downtime Migrations:**
1. Deploy new schema changes backward-compatible
2. Run dual-write (old + new schema)
3. Backfill historical data
4. Switch reads to new schema
5. Remove old schema after verification period

**Tools:**
- Flyway or Liquibase for versioned migrations
- Blue-green database deployments for major changes

---

## 15. Testing Strategy

### 15.1 Testing Pyramid

```
                       
          E2E Tests     10%
          (Postman)    
                       $
         Integration    30%
            Tests      
                       $
          Unit Tests    60%
          (Go testing) 
                       
```

### 15.2 Testing Approach by Layer

| Layer | Test Type | Coverage Target | Tools |
|-------|-----------|----------------|-------|
| **Domain** | Unit tests | 90%+ | Go `testing`, testify |
| **Application** | Unit + integration | 80%+ | Mock repositories |
| **Infrastructure** | Integration tests | 60%+ | Testcontainers, Docker |
| **Interface** | API tests | 70%+ | Postman, httptest |
| **End-to-End** | E2E scenarios | Key flows | Cypress, Playwright |

### 15.3 Contract Testing

Use Pact for consumer-driven contracts between services:

```go
// Example: OrderService expects PaymentService contract
pact.AddInteraction().
    Given("payment gateway is available").
    UponReceiving("a payment request").
    WithRequest("POST", "/api/payments").
    WillRespondWith(200).
    WithBodyMatch(PaymentResponse{})
```

---

## 16. Future Enhancements

### 16.1 Advanced Features Roadmap

| Feature | Business Value | Technical Complexity | Priority |
|---------|---------------|---------------------|----------|
| **AI Demand Forecasting** | Reduce waste by 20% | High (ML pipeline) | P2 |
| **Dynamic Pricing** | Increase revenue 5-10% | Medium (pricing engine) | P3 |
| **Voice Ordering (Alexa/Google)** | Accessibility, novelty | Medium (NLP integration) | P3 |
| **Blockchain Loyalty** | Customer trust, differentiation | High (blockchain) | P3 |
| **AR Menu Visualization** | Enhanced experience | High (3D modeling) | P3 |
| **Predictive Maintenance** | Reduce equipment downtime | High (IoT + ML) | P3 |

### 16.2 Global Expansion Considerations

- **Multi-Currency Support**: Dynamic exchange rates, local payment methods
- **Multi-Language**: i18n/l10n for 20+ languages
- **Regional Compliance**: GDPR (EU), PDPA (Singapore), CCPA (California)
- **Local Delivery Partners**: Country-specific integrations
- **Tax Variations**: VAT, GST, service charges per region

---

## 17. Appendix

### 17.1 Key Design Decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **Event-Driven over REST-heavy** | Loose coupling, scalability | Eventual consistency complexity |
| **Go for backend** | Performance, concurrency, simplicity | Smaller ecosystem than Node.js |
| **PostgreSQL over NoSQL** | ACID guarantees, relational data | Harder horizontal sharding |
| **Kafka over RabbitMQ** | High throughput, log retention | Operational complexity |
| **Kubernetes over VMs** | Container orchestration, auto-scaling | Steeper learning curve |
| **Monorepo vs. Polyrepo** | TBD based on team structure | Code sharing vs. independence |

### 17.2 Glossary

- **Aggregate Root**: Main entity in a bounded context
- **Bounded Context**: Clear boundary for a domain model
- **CQRS**: Command Query Responsibility Segregation
- **DDD**: Domain-Driven Design
- **Event Sourcing**: Storing state changes as events
- **Saga**: Pattern for managing distributed transactions
- **Value Object**: Immutable object defined by its attributes

### 17.3 References

- **Domain-Driven Design** by Eric Evans
- **Implementing Domain-Driven Design** by Vaughn Vernon
- **Building Microservices** by Sam Newman
- **Clean Architecture** by Robert C. Martin
- **Event Storming** by Alberto Brandolini

---

**Document Control**
**Owner:** Architecture Team
**Reviewers:** CTO, Lead Engineers
**Next Review:** 2025-11-21
**Status:** Living Document

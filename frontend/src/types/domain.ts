// Domain Types for RestoPlus Frontend
// Based on domain-architecture.md

// ============================================================================
// Common Types & Enums
// ============================================================================

export type Money = {
  amount: number;
  currency: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKEOUT = 'TAKEOUT',
  DELIVERY = 'DELIVERY',
}

export enum OrderStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ItemStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  NEEDS_CLEANING = 'NEEDS_CLEANING',
}

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  SEATED = 'SEATED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  QR = 'QR',
  E_WALLET = 'E_WALLET',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum BillStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED',
}

export enum ShiftStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export enum KitchenTicketStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum Priority {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum StationType {
  GRILL = 'GRILL',
  FRYER = 'FRYER',
  SALADS = 'SALADS',
  DRINKS = 'DRINKS',
  DESSERTS = 'DESSERTS',
}

// ============================================================================
// Customer & Orders Domain
// ============================================================================

export type Modifier = {
  id: string;
  name: string;
  price: Money;
};

export type ModifierGroup = {
  id: string;
  name: string;
  required: boolean;
  minSelection: number;
  maxSelection: number;
  modifiers: Modifier[];
};

export type OrderItem = {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: Money;
  modifiers: Modifier[];
  specialNotes?: string;
  status: ItemStatus;
};

export type Discount = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  conditions?: Record<string, any>;
  validFrom: string;
  validUntil: string;
  maxUsageCount?: number;
  currentUsage: number;
};

export type AppliedDiscount = {
  discountId: string;
  code: string;
  amount: Money;
  appliedAt: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerId?: string;
  tableId?: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: Money;
  discounts: AppliedDiscount[];
  tax: Money;
  total: Money;
  specialNotes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type Reservation = {
  id: string;
  customerId: string;
  partySize: number;
  reservedAt: string;
  status: ReservationStatus;
  tableId?: string;
  specialRequests?: string;
};

export type Table = {
  id: string;
  tableNumber: string;
  capacity: number;
  section: string;
  floor: string;
  status: TableStatus;
  currentOrderId?: string;
  assignedServerId?: string;
  position?: { x: number; y: number };
};

export type Allergen = {
  id: string;
  name: string;
  icon?: string;
};

export type NutritionalInfo = {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  price: Money;
  imageUrl?: string;
  isAvailable: boolean;
  modifiers: ModifierGroup[];
  allergens: Allergen[];
  nutritionalInfo?: NutritionalInfo;
};

export type MenuCategory = {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  imageUrl?: string;
  isActive: boolean;
};

// ============================================================================
// Kitchen & Fulfillment Domain
// ============================================================================

export type PrepItem = {
  id: string;
  orderItemId: string;
  name: string;
  quantity: number;
  modifiers: string[];
  specialNotes?: string;
  status: ItemStatus;
  startedAt?: string;
  completedAt?: string;
};

export type KitchenTicket = {
  id: string;
  orderId: string;
  orderNumber: string;
  stationId: string;
  items: PrepItem[];
  status: KitchenTicketStatus;
  priority: Priority;
  receivedAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedTime?: number; // in minutes
};

export type KitchenStation = {
  id: string;
  name: string;
  type: StationType;
  isActive: boolean;
  currentLoad: number;
};

// ============================================================================
// Sales & Payments Domain
// ============================================================================

export type BillLineItem = {
  id: string;
  orderItemId: string;
  description: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
};

export type Bill = {
  id: string;
  orderId: string;
  customerId?: string;
  items: BillLineItem[];
  subtotal: Money;
  discounts: AppliedDiscount[];
  taxAmount: Money;
  serviceCharge: Money;
  total: Money;
  status: BillStatus;
  createdAt: string;
  paidAt?: string;
};

export type Payment = {
  id: string;
  billId: string;
  amount: Money;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: string;
  processedAt: string;
};

// ============================================================================
// Staff & Operations Domain
// ============================================================================

export type Permission = {
  resource: string;
  action: 'READ' | 'WRITE' | 'DELETE' | 'EXECUTE';
};

export type Role = {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
};

export type Employee = {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
  role?: Role;
  branchId: string;
  status: EmployeeStatus;
  hireDate: string;
  terminationDate?: string;
};

export type Shift = {
  id: string;
  employeeId: string;
  employee?: Employee;
  branchId: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualClockIn?: string;
  actualClockOut?: string;
  status: ShiftStatus;
  notes?: string;
};

// ============================================================================
// Inventory & Procurement Domain
// ============================================================================

export enum UnitOfMeasure {
  KG = 'KG',
  G = 'G',
  L = 'L',
  ML = 'ML',
  PIECE = 'PIECE',
  PACK = 'PACK',
}

export enum POStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: UnitOfMeasure;
  currentStock: number;
  minimumStock: number;
  reorderLevel: number;
  unitCost: Money;
  lastRestocked: string;
};

export type RecipeIngredient = {
  inventoryItemId: string;
  quantity: number;
  unit: UnitOfMeasure;
};

export type Recipe = {
  id: string;
  menuItemId: string;
  ingredients: RecipeIngredient[];
};

export type POLineItem = {
  id: string;
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
  quantity: number;
  unitPrice: Money;
  total: Money;
};

export type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  paymentTerms?: string;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  supplierId: string;
  supplier?: Supplier;
  items: POLineItem[];
  status: POStatus;
  orderDate: string;
  expectedDate: string;
  receivedDate?: string;
  totalAmount: Money;
};

// ============================================================================
// Customer Engagement Domain
// ============================================================================

export enum CustomerTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export enum LoyaltyTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export enum CampaignType {
  BIRTHDAY = 'BIRTHDAY',
  LAPSED = 'LAPSED',
  PROMOTIONAL = 'PROMOTIONAL',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

export type CustomerPreferences = {
  dietaryRestrictions?: string[];
  favoriteItems?: string[];
  preferredTable?: string;
  communicationPreference?: 'EMAIL' | 'SMS' | 'PUSH' | 'NONE';
};

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday?: string;
  preferences?: CustomerPreferences;
  tier: CustomerTier;
  totalSpent: Money;
  orderCount: number;
  createdAt: string;
};

export type LoyaltyAccount = {
  id: string;
  customerId: string;
  pointsBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  tier: LoyaltyTier;
  lastActivity: string;
};

export type Campaign = {
  id: string;
  name: string;
  type: CampaignType;
  trigger?: Record<string, any>;
  offerTemplate: string;
  validFrom: string;
  validUntil: string;
  status: CampaignStatus;
};

export type Feedback = {
  id: string;
  customerId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

// ============================================================================
// Reporting & Analytics Domain
// ============================================================================

export enum ReportType {
  SALES = 'SALES',
  INVENTORY = 'INVENTORY',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

export enum ReportFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  JSON = 'JSON',
}

export type ReportParameters = {
  startDate?: string;
  endDate?: string;
  branchId?: string;
  categoryId?: string;
  [key: string]: any;
};

export type Report = {
  id: string;
  name: string;
  type: ReportType;
  parameters: ReportParameters;
  generatedAt: string;
  format: ReportFormat;
  dataUrl?: string;
};

export type Metric = {
  name: string;
  value: number | string;
  unit?: string;
  timestamp: string;
};

export type Dashboard = {
  id: string;
  branchId: string;
  metrics: Metric[];
  updatedAt: string;
};

// ============================================================================
// Administration & Configuration Domain
// ============================================================================

export enum IntegrationType {
  PAYMENT = 'PAYMENT',
  DELIVERY = 'DELIVERY',
  ACCOUNTING = 'ACCOUNTING',
  SMS = 'SMS',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export type BranchSettings = {
  timezone: string;
  businessHours?: Record<string, { open: string; close: string }>;
  maxTableCapacity?: number;
  [key: string]: any;
};

export type Branch = {
  id: string;
  branchCode: string;
  name: string;
  address: Address;
  phone: string;
  email: string;
  taxRate: number;
  timezone: string;
  isActive: boolean;
  settings?: BranchSettings;
};

export type SystemConfig = {
  id: string;
  key: string;
  value: string;
  dataType: string;
  category: string;
  isEditable: boolean;
  updatedAt: string;
  updatedBy: string;
};

export type Integration = {
  id: string;
  name: string;
  type: IntegrationType;
  provider: string;
  isActive: boolean;
  config?: Record<string, string>;
};

export type AuditLog = {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  performedBy: string;
  changes?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
};

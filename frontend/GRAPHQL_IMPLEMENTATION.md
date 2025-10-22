# GraphQL Implementation Summary

## Overview
This document summarizes the GraphQL layer that has been implemented for the RestoPlus frontend application. The implementation is ready to integrate with a backend GraphQL API.

## What Was Built

### 1. Type System (`src/types/domain.ts`)
Comprehensive TypeScript types based on the domain architecture, including:
- **Customer & Orders Domain**: Order, OrderItem, MenuItem, MenuCategory, Table, Reservation
- **Kitchen & Fulfillment Domain**: KitchenTicket, PrepItem, KitchenStation
- **Sales & Payments Domain**: Bill, Payment, Discount
- **Staff & Operations Domain**: Employee, Shift, Role
- **Inventory & Procurement Domain**: InventoryItem, Recipe, PurchaseOrder, Supplier
- **Customer Engagement Domain**: Customer, LoyaltyAccount, Campaign, Feedback
- **Reporting & Analytics Domain**: Report, Dashboard, Metric
- **Administration & Configuration**: Branch, SystemConfig, Integration, AuditLog

### 2. GraphQL Operations

#### Fragments (`src/graphql/fragments/`)
Reusable GraphQL fragments for:
- Menu items and categories
- Orders and order items
- Tables and reservations
- Bills and payments

#### Queries (`src/graphql/queries/`)

**Menu Management:**
- `GET_MENU_ITEMS` - List all menu items with filtering
- `GET_MENU_ITEM` - Get single menu item with full details
- `SEARCH_MENU_ITEMS` - Search menu items
- `GET_MENU_CATEGORIES` - List all categories
- `GET_FULL_MENU` - Get full menu with categories and items

**Order Management:**
- `GET_ORDERS` - List orders with filtering and pagination
- `GET_ORDER` - Get single order by ID
- `GET_ACTIVE_ORDERS` - Get all active orders
- `GET_ORDERS_BY_TABLE` - Get orders for a table
- `GET_ORDER_STATISTICS` - Get order statistics
- `VALIDATE_DISCOUNT` - Validate discount code

**Table Management:**
- `GET_TABLES` - List all tables
- `GET_TABLE_LAYOUT` - Get floor plan layout
- `GET_AVAILABLE_TABLES` - Get available tables
- `GET_RESERVATIONS` - List reservations
- `GET_UPCOMING_RESERVATIONS` - Get upcoming reservations

**Payment Processing:**
- `GET_BILL` - Get bill by ID
- `GET_BILL_BY_ORDER` - Get bill for an order
- `GET_PAYMENT_METHODS` - Get available payment methods
- `GET_PAYMENT_STATISTICS` - Get payment analytics
- `CALCULATE_BILL_SPLIT` - Calculate bill split

**Reports & Analytics:**
- `GET_SALES_REPORT` - Comprehensive sales report
- `GET_INVENTORY_REPORT` - Inventory status and movements
- `GET_STAFF_REPORT` - Staff performance metrics
- `GET_CUSTOMER_ANALYTICS` - Customer behavior analysis
- `GET_PEAK_HOURS_ANALYSIS` - Peak hours insights
- `GET_DASHBOARD_METRICS` - Real-time dashboard data
- `GET_FINANCIAL_SUMMARY` - Financial overview

#### Mutations (`src/graphql/mutations/`)

**Menu Management:**
- `CREATE_MENU_ITEM`, `UPDATE_MENU_ITEM`, `DELETE_MENU_ITEM`
- `TOGGLE_MENU_ITEM_AVAILABILITY`
- `CREATE_MENU_CATEGORY`, `UPDATE_MENU_CATEGORY`, `DELETE_MENU_CATEGORY`
- `REORDER_MENU_CATEGORIES`
- `BULK_UPDATE_MENU_ITEMS`

**Order Management:**
- `CREATE_ORDER`, `UPDATE_ORDER`
- `ADD_ORDER_ITEM`, `UPDATE_ORDER_ITEM`, `REMOVE_ORDER_ITEM`
- `CONFIRM_ORDER`, `CANCEL_ORDER`, `COMPLETE_ORDER`
- `APPLY_DISCOUNT`, `REMOVE_DISCOUNT`
- `SPLIT_ORDER_BILL`, `MERGE_TABLE_ORDERS`

**Table Management:**
- `CREATE_TABLE`, `UPDATE_TABLE`, `DELETE_TABLE`
- `UPDATE_TABLE_STATUS`, `ASSIGN_ORDER_TO_TABLE`, `CLEAR_TABLE`
- `ASSIGN_SERVER_TO_TABLE`
- `CREATE_RESERVATION`, `CANCEL_RESERVATION`, `SEAT_RESERVATION`

**Payment Processing:**
- `GENERATE_BILL`
- `PROCESS_PAYMENT`, `PROCESS_SPLIT_PAYMENT`
- `SPLIT_BILL`
- `ISSUE_REFUND`, `VOID_PAYMENT`, `CAPTURE_PAYMENT`
- `APPLY_TIP`
- `GENERATE_RECEIPT`, `SEND_RECEIPT_EMAIL`

#### Subscriptions (`src/graphql/subscriptions/`)
Real-time updates for:
- Order updates and new orders
- Kitchen ticket updates
- Table status changes
- Payment processing
- Inventory alerts
- Menu availability changes
- Reservation updates
- Dashboard metrics
- Staff notifications

### 3. Custom React Hooks (`src/hooks/graphql/`)

#### Menu Hooks (`useMenu.ts`)
- `useMenuItems`, `useMenuItem`, `useSearchMenuItems`
- `useMenuCategories`, `useFullMenu`
- `useCreateMenuItem`, `useUpdateMenuItem`, `useDeleteMenuItem`
- `useToggleMenuItemAvailability`
- `useMenuAvailabilitySubscription`

#### Order Hooks (`useOrders.ts`)
- `useOrders`, `useOrder`, `useActiveOrders`
- `useOrdersByTable`, `useOrderStatistics`
- `useCreateOrder`, `useUpdateOrder`
- `useAddOrderItem`, `useRemoveOrderItem`
- `useConfirmOrder`, `useCancelOrder`, `useCompleteOrder`
- `useApplyDiscount`, `useSplitOrderBill`
- `useOrderUpdatesSubscription`, `useNewOrdersSubscription`

#### Table Hooks (`useTables.ts`)
- `useTables`, `useTable`, `useTableLayout`
- `useAvailableTables`, `useReservations`
- `useCreateTable`, `useUpdateTableStatus`, `useClearTable`
- `useCreateReservation`, `useSeatReservation`
- `useTableUpdatesSubscription`

#### Payment Hooks (`usePayments.ts`)
- `useBill`, `useBillByOrder`, `usePaymentMethods`
- `useGenerateBill`, `useProcessPayment`
- `useSplitBill`, `useIssueRefund`
- `useGenerateReceipt`, `useSendReceiptEmail`
- `usePaymentUpdatesSubscription`

#### Report Hooks (`useReports.ts`)
- `useSalesReport`, `useInventoryReport`, `useStaffReport`
- `useCustomerAnalytics`, `usePeakHoursAnalysis`
- `useDashboardMetrics`, `useFinancialSummary`
- `useMenuItemPerformance`

## Usage Examples

### Example 1: Fetch Menu Items
```typescript
import { useMenuItems } from '@/hooks/graphql';

function MenuList() {
  const { data, loading, error, refetch } = useMenuItems();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.items?.map(item => (
        <div key={item.id}>{item.name} - ${item.price.amount}</div>
      ))}
    </div>
  );
}
```

### Example 2: Create Order
```typescript
import { useCreateOrder } from '@/hooks/graphql';

function CreateOrderButton() {
  const { createOrder, loading, error } = useCreateOrder();

  const handleCreateOrder = async () => {
    const result = await createOrder({
      type: 'DINE_IN',
      tableId: 'table-123',
      items: [
        {
          menuItemId: 'item-456',
          quantity: 2,
          modifiers: []
        }
      ]
    });

    if (result.data) {
      console.log('Order created:', result.data.createOrder);
    }
  };

  return (
    <button onClick={handleCreateOrder} disabled={loading}>
      Create Order
    </button>
  );
}
```

### Example 3: Real-time Order Updates
```typescript
import { useOrderUpdatesSubscription } from '@/hooks/graphql';

function OrderTracker({ orderId }: { orderId: string }) {
  const { data } = useOrderUpdatesSubscription(orderId);

  useEffect(() => {
    if (data) {
      console.log('Order updated:', data);
      // Update UI with new order data
    }
  }, [data]);

  return <div>Order Status: {data?.status}</div>;
}
```

### Example 4: Process Payment
```typescript
import { useProcessPayment, useBillByOrder } from '@/hooks/graphql';

function PaymentForm({ orderId }: { orderId: string }) {
  const { data: bill } = useBillByOrder(orderId);
  const { processPayment, loading } = useProcessPayment();

  const handlePayment = async (method: string) => {
    const result = await processPayment({
      billId: bill.id,
      amount: bill.total,
      method: method
    });

    if (result.data?.processPayment.success) {
      console.log('Payment successful!');
    }
  };

  return (
    <div>
      <div>Total: ${bill?.total.amount}</div>
      <button onClick={() => handlePayment('CASH')}>Pay Cash</button>
      <button onClick={() => handlePayment('CARD')}>Pay Card</button>
    </div>
  );
}
```

## Directory Structure

```
src/
├── types/
│   ├── domain.ts          # All domain types
│   └── index.ts           # Type exports
├── graphql/
│   ├── fragments/         # Reusable GraphQL fragments
│   │   ├── menu.graphql.ts
│   │   ├── order.graphql.ts
│   │   ├── table.graphql.ts
│   │   ├── payment.graphql.ts
│   │   └── index.ts
│   ├── queries/           # GraphQL queries
│   │   ├── menu.graphql.ts
│   │   ├── order.graphql.ts
│   │   ├── table.graphql.ts
│   │   ├── payment.graphql.ts
│   │   ├── reports.graphql.ts
│   │   └── index.ts
│   ├── mutations/         # GraphQL mutations
│   │   ├── menu.graphql.ts
│   │   ├── order.graphql.ts
│   │   ├── table.graphql.ts
│   │   ├── payment.graphql.ts
│   │   └── index.ts
│   ├── subscriptions/     # GraphQL subscriptions
│   │   └── index.graphql.ts
│   └── index.ts           # Main GraphQL exports
└── hooks/
    └── graphql/           # Custom React hooks
        ├── useMenu.ts
        ├── useOrders.ts
        ├── useTables.ts
        ├── usePayments.ts
        ├── useReports.ts
        └── index.ts
```

## Next Steps

### Backend Integration
When you're ready to connect to the backend:

1. **Set up environment variables** in `.env.local`:
   ```
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/graphql
   NEXT_PUBLIC_GRAPHQL_WS_URL=ws://localhost:8080/graphql
   ```

2. **Configure the GraphQL client** in a provider component
3. **Wrap your app** with the urql Provider
4. **Start using the hooks** in your components

### Testing
- The hooks are ready to use with mock data or a GraphQL mock server
- Consider setting up MSW (Mock Service Worker) for testing
- Each hook returns `{ data, loading, error, refetch }` for easy testing

### Features Implemented
✅ Complete type system aligned with domain architecture
✅ GraphQL queries for all major domains
✅ GraphQL mutations for CRUD operations
✅ Real-time subscriptions for live updates
✅ Custom React hooks with TypeScript support
✅ Modular and scalable architecture
✅ Ready for backend integration

## Additional Features (Update)

### Customer Management
✅ Customer listing page with search and filtering
✅ Customer statistics and analytics cards
✅ Tier-based customer segmentation (Bronze, Silver, Gold, Platinum)
✅ Loyalty points tracking
✅ GraphQL queries and mutations for customer operations
✅ Custom React hooks for customer management
✅ Campaign management
✅ Feedback system

**Files Added:**
- `src/app/customers/page.tsx` - Customer management UI
- `src/graphql/fragments/customer.graphql.ts` - Customer fragments
- `src/graphql/queries/customer.graphql.ts` - Customer queries
- `src/graphql/mutations/customer.graphql.ts` - Customer mutations
- `src/hooks/graphql/useCustomers.ts` - Customer hooks

### Inventory Management
✅ Inventory listing with stock level indicators
✅ Low stock and critical stock alerts
✅ Stock movement tracking
✅ Recipe management for menu items
✅ Supplier management
✅ Purchase order system
✅ Auto-generate purchase orders based on reorder levels
✅ GraphQL queries and mutations for inventory operations
✅ Custom React hooks for inventory management

**Files Added:**
- `src/app/inventory/page.tsx` - Inventory management UI
- `src/graphql/fragments/inventory.graphql.ts` - Inventory fragments
- `src/graphql/queries/inventory.graphql.ts` - Inventory queries
- `src/graphql/mutations/inventory.graphql.ts` - Inventory mutations
- `src/hooks/graphql/useInventory.ts` - Inventory hooks
- `src/components/ui/progress.tsx` - Progress bar component

### What's NOT Included
❌ GraphQL client configuration (urql setup) - intentionally skipped
❌ Backend GraphQL schema - to be implemented separately
❌ Authentication/authorization logic - to be added
❌ Error handling UI components - use the error returns from hooks
❌ Offline support implementation - can be added later
❌ Kitchen Display System (KDS) UI - to be implemented
❌ Staff management UI - to be implemented

## Key Benefits

1. **Type Safety**: Full TypeScript support with domain-aligned types
2. **Reusability**: Fragments prevent code duplication
3. **Developer Experience**: Custom hooks provide clean API
4. **Real-time**: Subscriptions ready for live updates
5. **Scalability**: Modular structure easy to extend
6. **Testing**: Hooks can be easily mocked and tested
7. **Performance**: Queries support pagination and filtering

## Notes

- All GraphQL operations use string literals (not `.graphql` files) for better TypeScript integration
- Hooks use urql's `useQuery`, `useMutation`, and `useSubscription`
- Fragment composition reduces query complexity
- Variables are properly typed for IntelliSense support
- Subscriptions include proper cleanup on unmount

// GraphQL Subscriptions for Real-time Updates
import { ORDER_FRAGMENT } from '../fragments/order.graphql';
import { TABLE_FRAGMENT } from '../fragments/table.graphql';
import { PAYMENT_FRAGMENT } from '../fragments/payment.graphql';

// Subscribe to order updates
export const SUBSCRIBE_TO_ORDER_UPDATES = `
  subscription OnOrderUpdated($orderId: ID) {
    orderUpdated(orderId: $orderId) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Subscribe to new orders
export const SUBSCRIBE_TO_NEW_ORDERS = `
  subscription OnNewOrder($branchId: ID) {
    newOrder(branchId: $branchId) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Subscribe to order status changes
export const SUBSCRIBE_TO_ORDER_STATUS = `
  subscription OnOrderStatusChanged($orderId: ID) {
    orderStatusChanged(orderId: $orderId) {
      id
      status
      updatedAt
    }
  }
`;

// Subscribe to kitchen ticket updates
export const SUBSCRIBE_TO_KITCHEN_UPDATES = `
  subscription OnKitchenTicketUpdated($stationId: ID) {
    kitchenTicketUpdated(stationId: $stationId) {
      id
      orderId
      orderNumber
      stationId
      items {
        id
        name
        quantity
        status
        modifiers
        specialNotes
      }
      status
      priority
      receivedAt
      estimatedTime
    }
  }
`;

// Subscribe to table status changes
export const SUBSCRIBE_TO_TABLE_UPDATES = `
  subscription OnTableStatusChanged($branchId: ID, $floor: String) {
    tableStatusChanged(branchId: $branchId, floor: $floor) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Subscribe to payment updates
export const SUBSCRIBE_TO_PAYMENT_UPDATES = `
  subscription OnPaymentProcessed($billId: ID) {
    paymentProcessed(billId: $billId) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FRAGMENT}
`;

// Subscribe to inventory alerts
export const SUBSCRIBE_TO_INVENTORY_ALERTS = `
  subscription OnInventoryAlert($branchId: ID) {
    inventoryAlert(branchId: $branchId) {
      id
      sku
      name
      currentStock
      minimumStock
      alertType
      timestamp
    }
  }
`;

// Subscribe to menu item availability changes
export const SUBSCRIBE_TO_MENU_AVAILABILITY = `
  subscription OnMenuItemAvailabilityChanged($branchId: ID) {
    menuItemAvailabilityChanged(branchId: $branchId) {
      id
      name
      isAvailable
      reason
      updatedAt
    }
  }
`;

// Subscribe to reservation updates
export const SUBSCRIBE_TO_RESERVATION_UPDATES = `
  subscription OnReservationUpdated($branchId: ID) {
    reservationUpdated(branchId: $branchId) {
      id
      customerId
      partySize
      reservedAt
      status
      tableId
      updatedAt
    }
  }
`;

// Subscribe to real-time dashboard metrics
export const SUBSCRIBE_TO_DASHBOARD_METRICS = `
  subscription OnDashboardMetricsUpdated($branchId: ID!) {
    dashboardMetricsUpdated(branchId: $branchId) {
      activeOrders
      availableTables
      occupancyRate
      currentRevenue {
        amount
        currency
      }
      ordersToday
      timestamp
    }
  }
`;

// Subscribe to staff notifications
export const SUBSCRIBE_TO_STAFF_NOTIFICATIONS = `
  subscription OnStaffNotification($employeeId: ID!) {
    staffNotification(employeeId: $employeeId) {
      id
      type
      title
      message
      priority
      data
      timestamp
    }
  }
`;

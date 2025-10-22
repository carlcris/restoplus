// GraphQL Queries for Order Management
import { ORDER_FRAGMENT } from '../fragments/order.graphql';

// Query to list all orders with filtering and pagination
export const GET_ORDERS = `
  query GetOrders($filter: OrderFilter, $pagination: PaginationInput) {
    orders(filter: $filter, pagination: $pagination) {
      items {
        ...OrderFields
      }
      total
      hasMore
    }
  }
  ${ORDER_FRAGMENT}
`;

// Query to get a single order by ID
export const GET_ORDER = `
  query GetOrder($id: ID!) {
    order(id: $id) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Query to get order by order number
export const GET_ORDER_BY_NUMBER = `
  query GetOrderByNumber($orderNumber: String!) {
    orderByNumber(orderNumber: $orderNumber) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Query to get active orders
export const GET_ACTIVE_ORDERS = `
  query GetActiveOrders($branchId: ID) {
    activeOrders(branchId: $branchId) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Query to get orders by table
export const GET_ORDERS_BY_TABLE = `
  query GetOrdersByTable($tableId: ID!) {
    ordersByTable(tableId: $tableId) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Query to get orders by customer
export const GET_ORDERS_BY_CUSTOMER = `
  query GetOrdersByCustomer($customerId: ID!, $limit: Int) {
    ordersByCustomer(customerId: $customerId, limit: $limit) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Query to get order statistics
export const GET_ORDER_STATISTICS = `
  query GetOrderStatistics($branchId: ID, $startDate: String, $endDate: String) {
    orderStatistics(branchId: $branchId, startDate: $startDate, endDate: $endDate) {
      totalOrders
      completedOrders
      cancelledOrders
      averageOrderValue {
        amount
        currency
      }
      totalRevenue {
        amount
        currency
      }
      ordersByType {
        type
        count
      }
      ordersByStatus {
        status
        count
      }
    }
  }
`;

// Query to validate discount code
export const VALIDATE_DISCOUNT = `
  query ValidateDiscount($code: String!, $orderId: ID) {
    validateDiscount(code: $code, orderId: $orderId) {
      valid
      discount {
        id
        code
        type
        value
        conditions
        validFrom
        validUntil
      }
      estimatedDiscount {
        amount
        currency
      }
      message
    }
  }
`;

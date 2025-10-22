// GraphQL Mutations for Order Management
import { ORDER_FRAGMENT } from '../fragments/order.graphql';

// Create a new order
export const CREATE_ORDER = `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Update an existing order
export const UPDATE_ORDER = `
  mutation UpdateOrder($id: ID!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Add item to order
export const ADD_ORDER_ITEM = `
  mutation AddOrderItem($orderId: ID!, $input: AddOrderItemInput!) {
    addOrderItem(orderId: $orderId, input: $input) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Update order item
export const UPDATE_ORDER_ITEM = `
  mutation UpdateOrderItem($orderId: ID!, $itemId: ID!, $input: UpdateOrderItemInput!) {
    updateOrderItem(orderId: $orderId, itemId: $itemId, input: $input) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Remove item from order
export const REMOVE_ORDER_ITEM = `
  mutation RemoveOrderItem($orderId: ID!, $itemId: ID!) {
    removeOrderItem(orderId: $orderId, itemId: $itemId) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Confirm order (moves from DRAFT to CONFIRMED)
export const CONFIRM_ORDER = `
  mutation ConfirmOrder($id: ID!) {
    confirmOrder(id: $id) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Cancel order
export const CANCEL_ORDER = `
  mutation CancelOrder($id: ID!, $reason: String) {
    cancelOrder(id: $id, reason: $reason) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Complete order
export const COMPLETE_ORDER = `
  mutation CompleteOrder($id: ID!) {
    completeOrder(id: $id) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Apply discount to order
export const APPLY_DISCOUNT = `
  mutation ApplyDiscount($orderId: ID!, $discountCode: String!) {
    applyDiscount(orderId: $orderId, discountCode: $discountCode) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Remove discount from order
export const REMOVE_DISCOUNT = `
  mutation RemoveDiscount($orderId: ID!, $discountId: ID!) {
    removeDiscount(orderId: $orderId, discountId: $discountId) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Split order bill
export const SPLIT_ORDER_BILL = `
  mutation SplitOrderBill($orderId: ID!, $splitBy: SplitType!, $splits: [SplitInput!]!) {
    splitOrderBill(orderId: $orderId, splitBy: $splitBy, splits: $splits) {
      orders {
        ...OrderFields
      }
      success
      message
    }
  }
  ${ORDER_FRAGMENT}
`;

// Merge table orders
export const MERGE_TABLE_ORDERS = `
  mutation MergeTableOrders($orderIds: [ID!]!, $targetTableId: ID!) {
    mergeTableOrders(orderIds: $orderIds, targetTableId: $targetTableId) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Update order status
export const UPDATE_ORDER_STATUS = `
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Update order item status
export const UPDATE_ORDER_ITEM_STATUS = `
  mutation UpdateOrderItemStatus($orderId: ID!, $itemId: ID!, $status: ItemStatus!) {
    updateOrderItemStatus(orderId: $orderId, itemId: $itemId, status: $status) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

// Add special notes to order
export const ADD_ORDER_NOTES = `
  mutation AddOrderNotes($orderId: ID!, $notes: String!) {
    addOrderNotes(orderId: $orderId, notes: $notes) {
      ...OrderFields
    }
  }
  ${ORDER_FRAGMENT}
`;

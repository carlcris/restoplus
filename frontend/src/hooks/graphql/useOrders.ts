// Custom hooks for Order Management GraphQL operations
import { useQuery, useMutation, useSubscription } from 'urql';
import {
  GET_ORDERS,
  GET_ORDER,
  GET_ORDER_BY_NUMBER,
  GET_ACTIVE_ORDERS,
  GET_ORDERS_BY_TABLE,
  GET_ORDERS_BY_CUSTOMER,
  GET_ORDER_STATISTICS,
  VALIDATE_DISCOUNT,
} from '@/graphql/queries/order.graphql';
import {
  CREATE_ORDER,
  UPDATE_ORDER,
  ADD_ORDER_ITEM,
  UPDATE_ORDER_ITEM,
  REMOVE_ORDER_ITEM,
  CONFIRM_ORDER,
  CANCEL_ORDER,
  COMPLETE_ORDER,
  APPLY_DISCOUNT,
  REMOVE_DISCOUNT,
  SPLIT_ORDER_BILL,
  MERGE_TABLE_ORDERS,
  UPDATE_ORDER_STATUS,
  UPDATE_ORDER_ITEM_STATUS,
  ADD_ORDER_NOTES,
} from '@/graphql/mutations/order.graphql';
import {
  SUBSCRIBE_TO_ORDER_UPDATES,
  SUBSCRIBE_TO_NEW_ORDERS,
  SUBSCRIBE_TO_ORDER_STATUS,
} from '@/graphql/subscriptions/index.graphql';

// Hook to get all orders
export const useOrders = (filter?: any, pagination?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_ORDERS,
    variables: { filter, pagination },
  });

  return {
    data: result.data?.orders,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get a single order
export const useOrder = (id: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_ORDER,
    variables: { id },
    pause: !id,
  });

  return {
    data: result.data?.order,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get order by number
export const useOrderByNumber = (orderNumber: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_ORDER_BY_NUMBER,
    variables: { orderNumber },
    pause: !orderNumber,
  });

  return {
    data: result.data?.orderByNumber,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get active orders
export const useActiveOrders = (branchId?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_ACTIVE_ORDERS,
    variables: { branchId },
  });

  return {
    data: result.data?.activeOrders,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get orders by table
export const useOrdersByTable = (tableId: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_ORDERS_BY_TABLE,
    variables: { tableId },
    pause: !tableId,
  });

  return {
    data: result.data?.ordersByTable,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get orders by customer
export const useOrdersByCustomer = (customerId: string, limit?: number) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_ORDERS_BY_CUSTOMER,
    variables: { customerId, limit },
    pause: !customerId,
  });

  return {
    data: result.data?.ordersByCustomer,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get order statistics
export const useOrderStatistics = (branchId?: string, startDate?: string, endDate?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_ORDER_STATISTICS,
    variables: { branchId, startDate, endDate },
  });

  return {
    data: result.data?.orderStatistics,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to validate discount
export const useValidateDiscount = (code: string, orderId?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: VALIDATE_DISCOUNT,
    variables: { code, orderId },
    pause: !code,
  });

  return {
    data: result.data?.validateDiscount,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to create order
export const useCreateOrder = () => {
  const [result, executeMutation] = useMutation(CREATE_ORDER);

  return {
    createOrder: (input: any) => executeMutation({ input }),
    data: result.data?.createOrder,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update order
export const useUpdateOrder = () => {
  const [result, executeMutation] = useMutation(UPDATE_ORDER);

  return {
    updateOrder: (id: string, input: any) => executeMutation({ id, input }),
    data: result.data?.updateOrder,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to add order item
export const useAddOrderItem = () => {
  const [result, executeMutation] = useMutation(ADD_ORDER_ITEM);

  return {
    addOrderItem: (orderId: string, input: any) => executeMutation({ orderId, input }),
    data: result.data?.addOrderItem,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update order item
export const useUpdateOrderItem = () => {
  const [result, executeMutation] = useMutation(UPDATE_ORDER_ITEM);

  return {
    updateOrderItem: (orderId: string, itemId: string, input: any) =>
      executeMutation({ orderId, itemId, input }),
    data: result.data?.updateOrderItem,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to remove order item
export const useRemoveOrderItem = () => {
  const [result, executeMutation] = useMutation(REMOVE_ORDER_ITEM);

  return {
    removeOrderItem: (orderId: string, itemId: string) => executeMutation({ orderId, itemId }),
    data: result.data?.removeOrderItem,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to confirm order
export const useConfirmOrder = () => {
  const [result, executeMutation] = useMutation(CONFIRM_ORDER);

  return {
    confirmOrder: (id: string) => executeMutation({ id }),
    data: result.data?.confirmOrder,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to cancel order
export const useCancelOrder = () => {
  const [result, executeMutation] = useMutation(CANCEL_ORDER);

  return {
    cancelOrder: (id: string, reason?: string) => executeMutation({ id, reason }),
    data: result.data?.cancelOrder,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to complete order
export const useCompleteOrder = () => {
  const [result, executeMutation] = useMutation(COMPLETE_ORDER);

  return {
    completeOrder: (id: string) => executeMutation({ id }),
    data: result.data?.completeOrder,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to apply discount
export const useApplyDiscount = () => {
  const [result, executeMutation] = useMutation(APPLY_DISCOUNT);

  return {
    applyDiscount: (orderId: string, discountCode: string) =>
      executeMutation({ orderId, discountCode }),
    data: result.data?.applyDiscount,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to remove discount
export const useRemoveDiscount = () => {
  const [result, executeMutation] = useMutation(REMOVE_DISCOUNT);

  return {
    removeDiscount: (orderId: string, discountId: string) =>
      executeMutation({ orderId, discountId }),
    data: result.data?.removeDiscount,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to split order bill
export const useSplitOrderBill = () => {
  const [result, executeMutation] = useMutation(SPLIT_ORDER_BILL);

  return {
    splitBill: (orderId: string, splitBy: any, splits: any[]) =>
      executeMutation({ orderId, splitBy, splits }),
    data: result.data?.splitOrderBill,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to merge table orders
export const useMergeTableOrders = () => {
  const [result, executeMutation] = useMutation(MERGE_TABLE_ORDERS);

  return {
    mergeOrders: (orderIds: string[], targetTableId: string) =>
      executeMutation({ orderIds, targetTableId }),
    data: result.data?.mergeTableOrders,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update order status
export const useUpdateOrderStatus = () => {
  const [result, executeMutation] = useMutation(UPDATE_ORDER_STATUS);

  return {
    updateStatus: (id: string, status: any) => executeMutation({ id, status }),
    data: result.data?.updateOrderStatus,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update order item status
export const useUpdateOrderItemStatus = () => {
  const [result, executeMutation] = useMutation(UPDATE_ORDER_ITEM_STATUS);

  return {
    updateItemStatus: (orderId: string, itemId: string, status: any) =>
      executeMutation({ orderId, itemId, status }),
    data: result.data?.updateOrderItemStatus,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to add order notes
export const useAddOrderNotes = () => {
  const [result, executeMutation] = useMutation(ADD_ORDER_NOTES);

  return {
    addNotes: (orderId: string, notes: string) => executeMutation({ orderId, notes }),
    data: result.data?.addOrderNotes,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to subscribe to order updates
export const useOrderUpdatesSubscription = (orderId?: string) => {
  const [result] = useSubscription({
    query: SUBSCRIBE_TO_ORDER_UPDATES,
    variables: { orderId },
  });

  return {
    data: result.data?.orderUpdated,
    error: result.error,
  };
};

// Hook to subscribe to new orders
export const useNewOrdersSubscription = (branchId?: string) => {
  const [result] = useSubscription({
    query: SUBSCRIBE_TO_NEW_ORDERS,
    variables: { branchId },
  });

  return {
    data: result.data?.newOrder,
    error: result.error,
  };
};

// Hook to subscribe to order status changes
export const useOrderStatusSubscription = (orderId?: string) => {
  const [result] = useSubscription({
    query: SUBSCRIBE_TO_ORDER_STATUS,
    variables: { orderId },
  });

  return {
    data: result.data?.orderStatusChanged,
    error: result.error,
  };
};

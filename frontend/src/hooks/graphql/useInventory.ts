// Custom hooks for Inventory Management GraphQL operations
import { useQuery, useMutation } from 'urql';
import {
  GET_INVENTORY_ITEMS,
  GET_INVENTORY_ITEM,
  GET_INVENTORY_ITEM_BY_SKU,
  GET_LOW_STOCK_ITEMS,
  GET_OUT_OF_STOCK_ITEMS,
  GET_INVENTORY_BY_CATEGORY,
  GET_STOCK_MOVEMENTS,
  GET_RECIPE_BY_MENU_ITEM,
  GET_RECIPES,
  CHECK_INGREDIENT_AVAILABILITY,
  GET_SUPPLIERS,
  GET_SUPPLIER,
  GET_PURCHASE_ORDERS,
  GET_PURCHASE_ORDER,
  GET_PENDING_PURCHASE_ORDERS,
  GET_INVENTORY_VALUE,
  GET_STOCK_FORECAST,
} from '@/graphql/queries/inventory.graphql';
import {
  CREATE_INVENTORY_ITEM,
  UPDATE_INVENTORY_ITEM,
  DELETE_INVENTORY_ITEM,
  ADJUST_STOCK,
  RESTOCK_INVENTORY,
  DEDUCT_STOCK,
  BULK_ADJUST_STOCK,
  UPSERT_RECIPE,
  DELETE_RECIPE,
  CREATE_SUPPLIER,
  UPDATE_SUPPLIER,
  DELETE_SUPPLIER,
  CREATE_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER,
  CANCEL_PURCHASE_ORDER,
  RECEIVE_PURCHASE_ORDER,
  SEND_PURCHASE_ORDER,
  AUTO_GENERATE_PURCHASE_ORDERS,
  UPDATE_STOCK_LEVELS,
} from '@/graphql/mutations/inventory.graphql';

// Hook to get all inventory items
export const useInventoryItems = (filter?: any, pagination?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_INVENTORY_ITEMS,
    variables: { filter, pagination },
  });

  return {
    data: result.data?.inventoryItems,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get a single inventory item
export const useInventoryItem = (id: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_INVENTORY_ITEM,
    variables: { id },
    pause: !id,
  });

  return {
    data: result.data?.inventoryItem,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get inventory item by SKU
export const useInventoryItemBySku = (sku: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_INVENTORY_ITEM_BY_SKU,
    variables: { sku },
    pause: !sku,
  });

  return {
    data: result.data?.inventoryItemBySku,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get low stock items
export const useLowStockItems = (branchId?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_LOW_STOCK_ITEMS,
    variables: { branchId },
  });

  return {
    data: result.data?.lowStockItems,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get out of stock items
export const useOutOfStockItems = (branchId?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_OUT_OF_STOCK_ITEMS,
    variables: { branchId },
  });

  return {
    data: result.data?.outOfStockItems,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get inventory by category
export const useInventoryByCategory = (category: string, branchId?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_INVENTORY_BY_CATEGORY,
    variables: { category, branchId },
    pause: !category,
  });

  return {
    data: result.data?.inventoryByCategory,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get stock movements
export const useStockMovements = (inventoryItemId: string, startDate?: string, endDate?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_STOCK_MOVEMENTS,
    variables: { inventoryItemId, startDate, endDate },
    pause: !inventoryItemId,
  });

  return {
    data: result.data?.stockMovements,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get recipe by menu item
export const useRecipeByMenuItem = (menuItemId: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_RECIPE_BY_MENU_ITEM,
    variables: { menuItemId },
    pause: !menuItemId,
  });

  return {
    data: result.data?.recipeByMenuItem,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get all recipes
export const useRecipes = () => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_RECIPES,
  });

  return {
    data: result.data?.recipes,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to check ingredient availability
export const useCheckIngredientAvailability = (menuItemId: string, quantity: number) => {
  const [result, reexecuteQuery] = useQuery({
    query: CHECK_INGREDIENT_AVAILABILITY,
    variables: { menuItemId, quantity },
    pause: !menuItemId,
  });

  return {
    data: result.data?.checkIngredientAvailability,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get all suppliers
export const useSuppliers = () => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_SUPPLIERS,
  });

  return {
    data: result.data?.suppliers,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get a single supplier
export const useSupplier = (id: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_SUPPLIER,
    variables: { id },
    pause: !id,
  });

  return {
    data: result.data?.supplier,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get purchase orders
export const usePurchaseOrders = (filter?: any, pagination?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_PURCHASE_ORDERS,
    variables: { filter, pagination },
  });

  return {
    data: result.data?.purchaseOrders,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get a single purchase order
export const usePurchaseOrder = (id: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_PURCHASE_ORDER,
    variables: { id },
    pause: !id,
  });

  return {
    data: result.data?.purchaseOrder,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get pending purchase orders
export const usePendingPurchaseOrders = (branchId?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_PENDING_PURCHASE_ORDERS,
    variables: { branchId },
  });

  return {
    data: result.data?.pendingPurchaseOrders,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get inventory value
export const useInventoryValue = (branchId?: string, category?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_INVENTORY_VALUE,
    variables: { branchId, category },
  });

  return {
    data: result.data?.inventoryValue,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get stock forecast
export const useStockForecast = (inventoryItemId: string, days: number) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_STOCK_FORECAST,
    variables: { inventoryItemId, days },
    pause: !inventoryItemId,
  });

  return {
    data: result.data?.stockForecast,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to create inventory item
export const useCreateInventoryItem = () => {
  const [result, executeMutation] = useMutation(CREATE_INVENTORY_ITEM);

  return {
    createItem: (input: any) => executeMutation({ input }),
    data: result.data?.createInventoryItem,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update inventory item
export const useUpdateInventoryItem = () => {
  const [result, executeMutation] = useMutation(UPDATE_INVENTORY_ITEM);

  return {
    updateItem: (id: string, input: any) => executeMutation({ id, input }),
    data: result.data?.updateInventoryItem,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to delete inventory item
export const useDeleteInventoryItem = () => {
  const [result, executeMutation] = useMutation(DELETE_INVENTORY_ITEM);

  return {
    deleteItem: (id: string) => executeMutation({ id }),
    data: result.data?.deleteInventoryItem,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to adjust stock
export const useAdjustStock = () => {
  const [result, executeMutation] = useMutation(ADJUST_STOCK);

  return {
    adjustStock: (inventoryItemId: string, quantity: number, reason: string, type: any) =>
      executeMutation({ inventoryItemId, quantity, reason, type }),
    data: result.data?.adjustStock,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to restock inventory
export const useRestockInventory = () => {
  const [result, executeMutation] = useMutation(RESTOCK_INVENTORY);

  return {
    restock: (inventoryItemId: string, quantity: number, purchaseOrderId?: string) =>
      executeMutation({ inventoryItemId, quantity, purchaseOrderId }),
    data: result.data?.restockInventory,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to deduct stock
export const useDeductStock = () => {
  const [result, executeMutation] = useMutation(DEDUCT_STOCK);

  return {
    deductStock: (inventoryItemId: string, quantity: number, orderId: string) =>
      executeMutation({ inventoryItemId, quantity, orderId }),
    data: result.data?.deductStock,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to bulk adjust stock
export const useBulkAdjustStock = () => {
  const [result, executeMutation] = useMutation(BULK_ADJUST_STOCK);

  return {
    bulkAdjust: (adjustments: any[]) => executeMutation({ adjustments }),
    data: result.data?.bulkAdjustStock,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to upsert recipe
export const useUpsertRecipe = () => {
  const [result, executeMutation] = useMutation(UPSERT_RECIPE);

  return {
    upsertRecipe: (input: any) => executeMutation({ input }),
    data: result.data?.upsertRecipe,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to delete recipe
export const useDeleteRecipe = () => {
  const [result, executeMutation] = useMutation(DELETE_RECIPE);

  return {
    deleteRecipe: (menuItemId: string) => executeMutation({ menuItemId }),
    data: result.data?.deleteRecipe,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to create supplier
export const useCreateSupplier = () => {
  const [result, executeMutation] = useMutation(CREATE_SUPPLIER);

  return {
    createSupplier: (input: any) => executeMutation({ input }),
    data: result.data?.createSupplier,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update supplier
export const useUpdateSupplier = () => {
  const [result, executeMutation] = useMutation(UPDATE_SUPPLIER);

  return {
    updateSupplier: (id: string, input: any) => executeMutation({ id, input }),
    data: result.data?.updateSupplier,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to delete supplier
export const useDeleteSupplier = () => {
  const [result, executeMutation] = useMutation(DELETE_SUPPLIER);

  return {
    deleteSupplier: (id: string) => executeMutation({ id }),
    data: result.data?.deleteSupplier,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to create purchase order
export const useCreatePurchaseOrder = () => {
  const [result, executeMutation] = useMutation(CREATE_PURCHASE_ORDER);

  return {
    createPO: (input: any) => executeMutation({ input }),
    data: result.data?.createPurchaseOrder,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update purchase order
export const useUpdatePurchaseOrder = () => {
  const [result, executeMutation] = useMutation(UPDATE_PURCHASE_ORDER);

  return {
    updatePO: (id: string, input: any) => executeMutation({ id, input }),
    data: result.data?.updatePurchaseOrder,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to cancel purchase order
export const useCancelPurchaseOrder = () => {
  const [result, executeMutation] = useMutation(CANCEL_PURCHASE_ORDER);

  return {
    cancelPO: (id: string, reason?: string) => executeMutation({ id, reason }),
    data: result.data?.cancelPurchaseOrder,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to receive purchase order
export const useReceivePurchaseOrder = () => {
  const [result, executeMutation] = useMutation(RECEIVE_PURCHASE_ORDER);

  return {
    receivePO: (id: string, receivedItems: any[]) => executeMutation({ id, receivedItems }),
    data: result.data?.receivePurchaseOrder,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to send purchase order
export const useSendPurchaseOrder = () => {
  const [result, executeMutation] = useMutation(SEND_PURCHASE_ORDER);

  return {
    sendPO: (id: string, method: any) => executeMutation({ id, method }),
    data: result.data?.sendPurchaseOrder,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to auto-generate purchase orders
export const useAutoGeneratePurchaseOrders = () => {
  const [result, executeMutation] = useMutation(AUTO_GENERATE_PURCHASE_ORDERS);

  return {
    autoGeneratePOs: (branchId?: string) => executeMutation({ branchId }),
    data: result.data?.autoGeneratePurchaseOrders,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update stock levels
export const useUpdateStockLevels = () => {
  const [result, executeMutation] = useMutation(UPDATE_STOCK_LEVELS);

  return {
    updateLevels: (inventoryItemId: string, minimumStock?: number, reorderLevel?: number) =>
      executeMutation({ inventoryItemId, minimumStock, reorderLevel }),
    data: result.data?.updateStockLevels,
    loading: result.fetching,
    error: result.error,
  };
};

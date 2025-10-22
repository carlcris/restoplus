// GraphQL Mutations for Inventory Management
import {
  INVENTORY_ITEM_FRAGMENT,
  RECIPE_FRAGMENT,
  SUPPLIER_FRAGMENT,
  PURCHASE_ORDER_FRAGMENT,
} from '../fragments/inventory.graphql';

// Create a new inventory item
export const CREATE_INVENTORY_ITEM = `
  mutation CreateInventoryItem($input: CreateInventoryItemInput!) {
    createInventoryItem(input: $input) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

// Update an existing inventory item
export const UPDATE_INVENTORY_ITEM = `
  mutation UpdateInventoryItem($id: ID!, $input: UpdateInventoryItemInput!) {
    updateInventoryItem(id: $id, input: $input) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

// Delete an inventory item
export const DELETE_INVENTORY_ITEM = `
  mutation DeleteInventoryItem($id: ID!) {
    deleteInventoryItem(id: $id) {
      success
      message
    }
  }
`;

// Adjust stock level (manual adjustment)
export const ADJUST_STOCK = `
  mutation AdjustStock($inventoryItemId: ID!, $quantity: Float!, $reason: String!, $type: StockAdjustmentType!) {
    adjustStock(inventoryItemId: $inventoryItemId, quantity: $quantity, reason: $reason, type: $type) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

// Restock inventory item
export const RESTOCK_INVENTORY = `
  mutation RestockInventory($inventoryItemId: ID!, $quantity: Float!, $purchaseOrderId: ID) {
    restockInventory(inventoryItemId: $inventoryItemId, quantity: $quantity, purchaseOrderId: $purchaseOrderId) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

// Deduct stock (when order is completed)
export const DEDUCT_STOCK = `
  mutation DeductStock($inventoryItemId: ID!, $quantity: Float!, $orderId: ID!) {
    deductStock(inventoryItemId: $inventoryItemId, quantity: $quantity, orderId: $orderId) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

// Bulk stock adjustment
export const BULK_ADJUST_STOCK = `
  mutation BulkAdjustStock($adjustments: [StockAdjustmentInput!]!) {
    bulkAdjustStock(adjustments: $adjustments) {
      success
      updatedCount
      errors {
        itemId
        message
      }
    }
  }
`;

// Create or update recipe
export const UPSERT_RECIPE = `
  mutation UpsertRecipe($input: UpsertRecipeInput!) {
    upsertRecipe(input: $input) {
      ...RecipeFields
    }
  }
  ${RECIPE_FRAGMENT}
`;

// Delete recipe
export const DELETE_RECIPE = `
  mutation DeleteRecipe($menuItemId: ID!) {
    deleteRecipe(menuItemId: $menuItemId) {
      success
      message
    }
  }
`;

// Create a new supplier
export const CREATE_SUPPLIER = `
  mutation CreateSupplier($input: CreateSupplierInput!) {
    createSupplier(input: $input) {
      ...SupplierFields
    }
  }
  ${SUPPLIER_FRAGMENT}
`;

// Update an existing supplier
export const UPDATE_SUPPLIER = `
  mutation UpdateSupplier($id: ID!, $input: UpdateSupplierInput!) {
    updateSupplier(id: $id, input: $input) {
      ...SupplierFields
    }
  }
  ${SUPPLIER_FRAGMENT}
`;

// Delete a supplier
export const DELETE_SUPPLIER = `
  mutation DeleteSupplier($id: ID!) {
    deleteSupplier(id: $id) {
      success
      message
    }
  }
`;

// Create a new purchase order
export const CREATE_PURCHASE_ORDER = `
  mutation CreatePurchaseOrder($input: CreatePurchaseOrderInput!) {
    createPurchaseOrder(input: $input) {
      ...PurchaseOrderFields
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

// Update an existing purchase order
export const UPDATE_PURCHASE_ORDER = `
  mutation UpdatePurchaseOrder($id: ID!, $input: UpdatePurchaseOrderInput!) {
    updatePurchaseOrder(id: $id, input: $input) {
      ...PurchaseOrderFields
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

// Cancel a purchase order
export const CANCEL_PURCHASE_ORDER = `
  mutation CancelPurchaseOrder($id: ID!, $reason: String) {
    cancelPurchaseOrder(id: $id, reason: $reason) {
      ...PurchaseOrderFields
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

// Receive purchase order (mark as received)
export const RECEIVE_PURCHASE_ORDER = `
  mutation ReceivePurchaseOrder($id: ID!, $receivedItems: [ReceivedItemInput!]!) {
    receivePurchaseOrder(id: $id, receivedItems: $receivedItems) {
      ...PurchaseOrderFields
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

// Send purchase order to supplier
export const SEND_PURCHASE_ORDER = `
  mutation SendPurchaseOrder($id: ID!, $method: SendMethod!) {
    sendPurchaseOrder(id: $id, method: $method) {
      success
      message
    }
  }
`;

// Auto-generate purchase orders based on reorder levels
export const AUTO_GENERATE_PURCHASE_ORDERS = `
  mutation AutoGeneratePurchaseOrders($branchId: ID) {
    autoGeneratePurchaseOrders(branchId: $branchId) {
      purchaseOrders {
        ...PurchaseOrderFields
      }
      itemCount
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

// Update stock minimum and reorder levels
export const UPDATE_STOCK_LEVELS = `
  mutation UpdateStockLevels($inventoryItemId: ID!, $minimumStock: Float, $reorderLevel: Float) {
    updateStockLevels(inventoryItemId: $inventoryItemId, minimumStock: $minimumStock, reorderLevel: $reorderLevel) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

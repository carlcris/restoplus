// GraphQL Queries for Inventory Management
import {
  INVENTORY_ITEM_FRAGMENT,
  RECIPE_FRAGMENT,
  SUPPLIER_FRAGMENT,
  PURCHASE_ORDER_FRAGMENT,
} from '../fragments/inventory.graphql';

// Query to get all inventory items
export const GET_INVENTORY_ITEMS = `
  query GetInventoryItems($filter: InventoryFilter, $pagination: PaginationInput) {
    inventoryItems(filter: $filter, pagination: $pagination) {
      items {
        ...InventoryItemFields
      }
      total
      hasMore
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

// Query to get a single inventory item
export const GET_INVENTORY_ITEM = `
  query GetInventoryItem($id: ID!) {
    inventoryItem(id: $id) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

// Query to get inventory item by SKU
export const GET_INVENTORY_ITEM_BY_SKU = `
  query GetInventoryItemBySku($sku: String!) {
    inventoryItemBySku(sku: $sku) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

// Query to get low stock items
export const GET_LOW_STOCK_ITEMS = `
  query GetLowStockItems($branchId: ID) {
    lowStockItems(branchId: $branchId) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

// Query to get out of stock items
export const GET_OUT_OF_STOCK_ITEMS = `
  query GetOutOfStockItems($branchId: ID) {
    outOfStockItems(branchId: $branchId) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

// Query to get inventory by category
export const GET_INVENTORY_BY_CATEGORY = `
  query GetInventoryByCategory($category: String!, $branchId: ID) {
    inventoryByCategory(category: $category, branchId: $branchId) {
      ...InventoryItemFields
    }
  }
  ${INVENTORY_ITEM_FRAGMENT}
`;

// Query to get stock movements/history
export const GET_STOCK_MOVEMENTS = `
  query GetStockMovements($inventoryItemId: ID!, $startDate: String, $endDate: String) {
    stockMovements(inventoryItemId: $inventoryItemId, startDate: $startDate, endDate: $endDate) {
      id
      inventoryItemId
      quantity
      type
      reason
      reference
      performedBy
      createdAt
    }
  }
`;

// Query to get recipe by menu item
export const GET_RECIPE_BY_MENU_ITEM = `
  query GetRecipeByMenuItem($menuItemId: ID!) {
    recipeByMenuItem(menuItemId: $menuItemId) {
      ...RecipeFields
    }
  }
  ${RECIPE_FRAGMENT}
`;

// Query to get all recipes
export const GET_RECIPES = `
  query GetRecipes {
    recipes {
      ...RecipeFields
    }
  }
  ${RECIPE_FRAGMENT}
`;

// Query to check ingredient availability for menu item
export const CHECK_INGREDIENT_AVAILABILITY = `
  query CheckIngredientAvailability($menuItemId: ID!, $quantity: Int!) {
    checkIngredientAvailability(menuItemId: $menuItemId, quantity: $quantity) {
      available
      missingIngredients {
        inventoryItemId
        required
        available
      }
    }
  }
`;

// Query to get all suppliers
export const GET_SUPPLIERS = `
  query GetSuppliers {
    suppliers {
      ...SupplierFields
    }
  }
  ${SUPPLIER_FRAGMENT}
`;

// Query to get a single supplier
export const GET_SUPPLIER = `
  query GetSupplier($id: ID!) {
    supplier(id: $id) {
      ...SupplierFields
    }
  }
  ${SUPPLIER_FRAGMENT}
`;

// Query to get purchase orders
export const GET_PURCHASE_ORDERS = `
  query GetPurchaseOrders($filter: PurchaseOrderFilter, $pagination: PaginationInput) {
    purchaseOrders(filter: $filter, pagination: $pagination) {
      items {
        ...PurchaseOrderFields
      }
      total
      hasMore
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

// Query to get a single purchase order
export const GET_PURCHASE_ORDER = `
  query GetPurchaseOrder($id: ID!) {
    purchaseOrder(id: $id) {
      ...PurchaseOrderFields
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

// Query to get pending purchase orders
export const GET_PENDING_PURCHASE_ORDERS = `
  query GetPendingPurchaseOrders($branchId: ID) {
    pendingPurchaseOrders(branchId: $branchId) {
      ...PurchaseOrderFields
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

// Query to get inventory value
export const GET_INVENTORY_VALUE = `
  query GetInventoryValue($branchId: ID, $category: String) {
    inventoryValue(branchId: $branchId, category: $category) {
      totalValue {
        amount
        currency
      }
      itemCount
      categories {
        category
        value {
          amount
          currency
        }
        itemCount
      }
    }
  }
`;

// Query to get stock forecast
export const GET_STOCK_FORECAST = `
  query GetStockForecast($inventoryItemId: ID!, $days: Int!) {
    stockForecast(inventoryItemId: $inventoryItemId, days: $days) {
      inventoryItemId
      currentStock
      projectedStock
      reorderDate
      estimatedOutOfStockDate
      suggestedOrderQuantity
    }
  }
`;

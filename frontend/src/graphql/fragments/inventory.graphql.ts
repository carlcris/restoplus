// GraphQL Fragments for Inventory domain
import { MONEY_FRAGMENT } from './order.graphql';

export const INVENTORY_ITEM_FRAGMENT = `
  fragment InventoryItemFields on InventoryItem {
    id
    sku
    name
    category
    unit
    currentStock
    minimumStock
    reorderLevel
    unitCost {
      ...MoneyFields
    }
    lastRestocked
  }
  ${MONEY_FRAGMENT}
`;

export const RECIPE_INGREDIENT_FRAGMENT = `
  fragment RecipeIngredientFields on RecipeIngredient {
    inventoryItemId
    quantity
    unit
  }
`;

export const RECIPE_FRAGMENT = `
  fragment RecipeFields on Recipe {
    id
    menuItemId
    ingredients {
      ...RecipeIngredientFields
    }
  }
  ${RECIPE_INGREDIENT_FRAGMENT}
`;

export const SUPPLIER_FRAGMENT = `
  fragment SupplierFields on Supplier {
    id
    name
    contactPerson
    email
    phone
    address {
      street
      city
      state
      postalCode
      country
    }
    paymentTerms
  }
`;

export const PO_LINE_ITEM_FRAGMENT = `
  fragment POLineItemFields on POLineItem {
    id
    inventoryItemId
    quantity
    unitPrice {
      ...MoneyFields
    }
    total {
      ...MoneyFields
    }
  }
  ${MONEY_FRAGMENT}
`;

export const PURCHASE_ORDER_FRAGMENT = `
  fragment PurchaseOrderFields on PurchaseOrder {
    id
    poNumber
    supplierId
    items {
      ...POLineItemFields
    }
    status
    orderDate
    expectedDate
    receivedDate
    totalAmount {
      ...MoneyFields
    }
  }
  ${MONEY_FRAGMENT}
  ${PO_LINE_ITEM_FRAGMENT}
`;

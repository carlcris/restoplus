// GraphQL Mutations for Menu Management
import { MENU_ITEM_FULL_FRAGMENT, MENU_CATEGORY_FRAGMENT } from '../fragments/menu.graphql';

// Create a new menu item
export const CREATE_MENU_ITEM = `
  mutation CreateMenuItem($input: CreateMenuItemInput!) {
    createMenuItem(input: $input) {
      ...MenuItemFullFields
    }
  }
  ${MENU_ITEM_FULL_FRAGMENT}
`;

// Update an existing menu item
export const UPDATE_MENU_ITEM = `
  mutation UpdateMenuItem($id: ID!, $input: UpdateMenuItemInput!) {
    updateMenuItem(id: $id, input: $input) {
      ...MenuItemFullFields
    }
  }
  ${MENU_ITEM_FULL_FRAGMENT}
`;

// Delete a menu item
export const DELETE_MENU_ITEM = `
  mutation DeleteMenuItem($id: ID!) {
    deleteMenuItem(id: $id) {
      success
      message
    }
  }
`;

// Toggle menu item availability
export const TOGGLE_MENU_ITEM_AVAILABILITY = `
  mutation ToggleMenuItemAvailability($id: ID!, $isAvailable: Boolean!) {
    toggleMenuItemAvailability(id: $id, isAvailable: $isAvailable) {
      id
      isAvailable
    }
  }
`;

// Create a new menu category
export const CREATE_MENU_CATEGORY = `
  mutation CreateMenuCategory($input: CreateMenuCategoryInput!) {
    createMenuCategory(input: $input) {
      ...MenuCategoryFields
    }
  }
  ${MENU_CATEGORY_FRAGMENT}
`;

// Update an existing menu category
export const UPDATE_MENU_CATEGORY = `
  mutation UpdateMenuCategory($id: ID!, $input: UpdateMenuCategoryInput!) {
    updateMenuCategory(id: $id, input: $input) {
      ...MenuCategoryFields
    }
  }
  ${MENU_CATEGORY_FRAGMENT}
`;

// Delete a menu category
export const DELETE_MENU_CATEGORY = `
  mutation DeleteMenuCategory($id: ID!) {
    deleteMenuCategory(id: $id) {
      success
      message
    }
  }
`;

// Reorder menu categories
export const REORDER_MENU_CATEGORIES = `
  mutation ReorderMenuCategories($categoryIds: [ID!]!) {
    reorderMenuCategories(categoryIds: $categoryIds) {
      ...MenuCategoryFields
    }
  }
  ${MENU_CATEGORY_FRAGMENT}
`;

// Bulk update menu items (e.g., for price changes)
export const BULK_UPDATE_MENU_ITEMS = `
  mutation BulkUpdateMenuItems($updates: [BulkMenuItemUpdate!]!) {
    bulkUpdateMenuItems(updates: $updates) {
      success
      updatedCount
      errors {
        itemId
        message
      }
    }
  }
`;

// Create or update modifier group
export const UPSERT_MODIFIER_GROUP = `
  mutation UpsertModifierGroup($menuItemId: ID!, $input: ModifierGroupInput!) {
    upsertModifierGroup(menuItemId: $menuItemId, input: $input) {
      id
      modifiers {
        id
        name
        required
        minSelection
        maxSelection
        modifiers {
          id
          name
          price {
            amount
            currency
          }
        }
      }
    }
  }
`;

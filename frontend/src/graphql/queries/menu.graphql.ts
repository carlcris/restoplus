// GraphQL Queries for Menu Management
import {
  MENU_ITEM_FRAGMENT,
  MENU_ITEM_FULL_FRAGMENT,
  MENU_CATEGORY_FRAGMENT,
} from '../fragments/menu.graphql';

// Query to list all menu items with optional filtering
export const GET_MENU_ITEMS = `
  query GetMenuItems($filter: MenuItemFilter, $pagination: PaginationInput) {
    menuItems(filter: $filter, pagination: $pagination) {
      items {
        ...MenuItemFields
      }
      total
      hasMore
    }
  }
  ${MENU_ITEM_FRAGMENT}
`;

// Query to get a single menu item by ID with full details
export const GET_MENU_ITEM = `
  query GetMenuItem($id: ID!) {
    menuItem(id: $id) {
      ...MenuItemFullFields
    }
  }
  ${MENU_ITEM_FULL_FRAGMENT}
`;

// Query to search menu items
export const SEARCH_MENU_ITEMS = `
  query SearchMenuItems($searchTerm: String!, $categoryId: ID, $limit: Int) {
    searchMenuItems(searchTerm: $searchTerm, categoryId: $categoryId, limit: $limit) {
      ...MenuItemFields
    }
  }
  ${MENU_ITEM_FRAGMENT}
`;

// Query to list all menu categories
export const GET_MENU_CATEGORIES = `
  query GetMenuCategories($includeInactive: Boolean) {
    menuCategories(includeInactive: $includeInactive) {
      ...MenuCategoryFields
    }
  }
  ${MENU_CATEGORY_FRAGMENT}
`;

// Query to get a single menu category by ID
export const GET_MENU_CATEGORY = `
  query GetMenuCategory($id: ID!) {
    menuCategory(id: $id) {
      ...MenuCategoryFields
    }
  }
  ${MENU_CATEGORY_FRAGMENT}
`;

// Query to get menu items by category
export const GET_MENU_ITEMS_BY_CATEGORY = `
  query GetMenuItemsByCategory($categoryId: ID!, $includeUnavailable: Boolean) {
    menuItemsByCategory(categoryId: $categoryId, includeUnavailable: $includeUnavailable) {
      ...MenuItemFields
    }
  }
  ${MENU_ITEM_FRAGMENT}
`;

// Query to get full menu with categories and items
export const GET_FULL_MENU = `
  query GetFullMenu($branchId: ID) {
    fullMenu(branchId: $branchId) {
      categories {
        ...MenuCategoryFields
        items {
          ...MenuItemFields
        }
      }
    }
  }
  ${MENU_CATEGORY_FRAGMENT}
  ${MENU_ITEM_FRAGMENT}
`;

// Export all GraphQL fragments
export {
  MENU_ITEM_FRAGMENT,
  MENU_CATEGORY_FRAGMENT,
  MODIFIER_GROUP_FRAGMENT,
  MENU_ITEM_FULL_FRAGMENT,
} from './menu.graphql';

export {
  MONEY_FRAGMENT,
  ORDER_ITEM_FRAGMENT,
  APPLIED_DISCOUNT_FRAGMENT,
  ORDER_FRAGMENT,
} from './order.graphql';

// Re-export MODIFIER_FRAGMENT from menu to avoid duplicate export
export { MODIFIER_FRAGMENT } from './menu.graphql';

export * from './table.graphql';
export * from './payment.graphql';

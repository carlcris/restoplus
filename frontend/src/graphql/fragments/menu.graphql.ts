// GraphQL Fragments for Menu domain

export const MENU_ITEM_FRAGMENT = `
  fragment MenuItemFields on MenuItem {
    id
    name
    description
    categoryId
    price {
      amount
      currency
    }
    imageUrl
    isAvailable
    allergens {
      id
      name
      icon
    }
    nutritionalInfo {
      calories
      protein
      carbohydrates
      fat
      fiber
      sodium
    }
  }
`;

export const MENU_CATEGORY_FRAGMENT = `
  fragment MenuCategoryFields on MenuCategory {
    id
    name
    description
    displayOrder
    imageUrl
    isActive
  }
`;

export const MODIFIER_FRAGMENT = `
  fragment ModifierFields on Modifier {
    id
    name
    price {
      amount
      currency
    }
  }
`;

export const MODIFIER_GROUP_FRAGMENT = `
  fragment ModifierGroupFields on ModifierGroup {
    id
    name
    required
    minSelection
    maxSelection
    modifiers {
      ...ModifierFields
    }
  }
  ${MODIFIER_FRAGMENT}
`;

export const MENU_ITEM_FULL_FRAGMENT = `
  fragment MenuItemFullFields on MenuItem {
    ...MenuItemFields
    modifiers {
      ...ModifierGroupFields
    }
  }
  ${MENU_ITEM_FRAGMENT}
  ${MODIFIER_GROUP_FRAGMENT}
`;

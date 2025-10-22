// GraphQL Fragments for Order domain

export const MONEY_FRAGMENT = `
  fragment MoneyFields on Money {
    amount
    currency
  }
`;

export const MODIFIER_FRAGMENT = `
  fragment ModifierFields on Modifier {
    id
    name
    price {
      ...MoneyFields
    }
  }
  ${MONEY_FRAGMENT}
`;

export const ORDER_ITEM_FRAGMENT = `
  fragment OrderItemFields on OrderItem {
    id
    menuItemId
    name
    quantity
    unitPrice {
      ...MoneyFields
    }
    modifiers {
      ...ModifierFields
    }
    specialNotes
    status
  }
  ${MONEY_FRAGMENT}
  ${MODIFIER_FRAGMENT}
`;

export const APPLIED_DISCOUNT_FRAGMENT = `
  fragment AppliedDiscountFields on AppliedDiscount {
    discountId
    code
    amount {
      ...MoneyFields
    }
    appliedAt
  }
  ${MONEY_FRAGMENT}
`;

export const ORDER_FRAGMENT = `
  fragment OrderFields on Order {
    id
    orderNumber
    customerId
    tableId
    type
    status
    items {
      ...OrderItemFields
    }
    subtotal {
      ...MoneyFields
    }
    discounts {
      ...AppliedDiscountFields
    }
    tax {
      ...MoneyFields
    }
    total {
      ...MoneyFields
    }
    specialNotes
    createdAt
    updatedAt
    completedAt
  }
  ${MONEY_FRAGMENT}
  ${ORDER_ITEM_FRAGMENT}
  ${APPLIED_DISCOUNT_FRAGMENT}
`;

// GraphQL Fragments for Payment domain
import { MONEY_FRAGMENT, APPLIED_DISCOUNT_FRAGMENT } from './order.graphql';

export const BILL_LINE_ITEM_FRAGMENT = `
  fragment BillLineItemFields on BillLineItem {
    id
    orderItemId
    description
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

export const BILL_FRAGMENT = `
  fragment BillFields on Bill {
    id
    orderId
    customerId
    items {
      ...BillLineItemFields
    }
    subtotal {
      ...MoneyFields
    }
    discounts {
      ...AppliedDiscountFields
    }
    taxAmount {
      ...MoneyFields
    }
    serviceCharge {
      ...MoneyFields
    }
    total {
      ...MoneyFields
    }
    status
    createdAt
    paidAt
  }
  ${MONEY_FRAGMENT}
  ${BILL_LINE_ITEM_FRAGMENT}
  ${APPLIED_DISCOUNT_FRAGMENT}
`;

export const PAYMENT_FRAGMENT = `
  fragment PaymentFields on Payment {
    id
    billId
    amount {
      ...MoneyFields
    }
    method
    status
    transactionId
    gatewayResponse
    processedAt
  }
  ${MONEY_FRAGMENT}
`;

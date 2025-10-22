// GraphQL Queries for Payment Processing
import { BILL_FRAGMENT, PAYMENT_FRAGMENT } from '../fragments/payment.graphql';

// Query to get bill by ID
export const GET_BILL = `
  query GetBill($id: ID!) {
    bill(id: $id) {
      ...BillFields
    }
  }
  ${BILL_FRAGMENT}
`;

// Query to get bill by order ID
export const GET_BILL_BY_ORDER = `
  query GetBillByOrder($orderId: ID!) {
    billByOrder(orderId: $orderId) {
      ...BillFields
    }
  }
  ${BILL_FRAGMENT}
`;

// Query to get all bills with filtering
export const GET_BILLS = `
  query GetBills($filter: BillFilter, $pagination: PaginationInput) {
    bills(filter: $filter, pagination: $pagination) {
      items {
        ...BillFields
      }
      total
      hasMore
    }
  }
  ${BILL_FRAGMENT}
`;

// Query to get payment by ID
export const GET_PAYMENT = `
  query GetPayment($id: ID!) {
    payment(id: $id) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FRAGMENT}
`;

// Query to get payments by bill
export const GET_PAYMENTS_BY_BILL = `
  query GetPaymentsByBill($billId: ID!) {
    paymentsByBill(billId: $billId) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FRAGMENT}
`;

// Query to get payment history
export const GET_PAYMENT_HISTORY = `
  query GetPaymentHistory($filter: PaymentFilter, $pagination: PaginationInput) {
    paymentHistory(filter: $filter, pagination: $pagination) {
      items {
        ...PaymentFields
      }
      total
      hasMore
    }
  }
  ${PAYMENT_FRAGMENT}
`;

// Query to get payment methods configuration
export const GET_PAYMENT_METHODS = `
  query GetPaymentMethods($branchId: ID) {
    paymentMethods(branchId: $branchId) {
      method
      enabled
      displayName
      icon
      config
    }
  }
`;

// Query to calculate bill split
export const CALCULATE_BILL_SPLIT = `
  query CalculateBillSplit($billId: ID!, $splitBy: SplitType!, $parts: Int!) {
    calculateBillSplit(billId: $billId, splitBy: $splitBy, parts: $parts) {
      splits {
        amount {
          amount
          currency
        }
        items {
          description
          quantity
          total {
            amount
            currency
          }
        }
      }
    }
  }
`;

// Query to get payment statistics
export const GET_PAYMENT_STATISTICS = `
  query GetPaymentStatistics($branchId: ID, $startDate: String, $endDate: String) {
    paymentStatistics(branchId: $branchId, startDate: $startDate, endDate: $endDate) {
      totalPayments {
        amount
        currency
      }
      paymentsByMethod {
        method
        count
        totalAmount {
          amount
          currency
        }
      }
      averageTransactionValue {
        amount
        currency
      }
      successRate
      refundRate
    }
  }
`;

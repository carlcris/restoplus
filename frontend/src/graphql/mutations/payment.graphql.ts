// GraphQL Mutations for Payment Processing
import { BILL_FRAGMENT, PAYMENT_FRAGMENT } from '../fragments/payment.graphql';

// Generate bill from order
export const GENERATE_BILL = `
  mutation GenerateBill($orderId: ID!) {
    generateBill(orderId: $orderId) {
      ...BillFields
    }
  }
  ${BILL_FRAGMENT}
`;

// Process a payment
export const PROCESS_PAYMENT = `
  mutation ProcessPayment($input: ProcessPaymentInput!) {
    processPayment(input: $input) {
      payment {
        ...PaymentFields
      }
      bill {
        ...BillFields
      }
      success
      message
    }
  }
  ${PAYMENT_FRAGMENT}
  ${BILL_FRAGMENT}
`;

// Process split payment
export const PROCESS_SPLIT_PAYMENT = `
  mutation ProcessSplitPayment($billId: ID!, $payments: [PaymentInput!]!) {
    processSplitPayment(billId: $billId, payments: $payments) {
      payments {
        ...PaymentFields
      }
      bill {
        ...BillFields
      }
      success
      message
    }
  }
  ${PAYMENT_FRAGMENT}
  ${BILL_FRAGMENT}
`;

// Split bill
export const SPLIT_BILL = `
  mutation SplitBill($billId: ID!, $splitBy: SplitType!, $splits: [BillSplitInput!]!) {
    splitBill(billId: $billId, splitBy: $splitBy, splits: $splits) {
      bills {
        ...BillFields
      }
      success
      message
    }
  }
  ${BILL_FRAGMENT}
`;

// Issue refund
export const ISSUE_REFUND = `
  mutation IssueRefund($paymentId: ID!, $amount: MoneyInput, $reason: String!) {
    issueRefund(paymentId: $paymentId, amount: $amount, reason: $reason) {
      refundPayment {
        ...PaymentFields
      }
      originalPayment {
        ...PaymentFields
      }
      success
      message
    }
  }
  ${PAYMENT_FRAGMENT}
`;

// Void payment
export const VOID_PAYMENT = `
  mutation VoidPayment($paymentId: ID!, $reason: String!) {
    voidPayment(paymentId: $paymentId, reason: $reason) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FRAGMENT}
`;

// Capture authorized payment
export const CAPTURE_PAYMENT = `
  mutation CapturePayment($paymentId: ID!, $amount: MoneyInput) {
    capturePayment(paymentId: $paymentId, amount: $amount) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FRAGMENT}
`;

// Apply tip to bill
export const APPLY_TIP = `
  mutation ApplyTip($billId: ID!, $tipAmount: MoneyInput!) {
    applyTip(billId: $billId, tipAmount: $tipAmount) {
      ...BillFields
    }
  }
  ${BILL_FRAGMENT}
`;

// Generate receipt
export const GENERATE_RECEIPT = `
  mutation GenerateReceipt($billId: ID!, $format: ReceiptFormat!) {
    generateReceipt(billId: $billId, format: $format) {
      receiptUrl
      receiptData
      success
      message
    }
  }
`;

// Send receipt via email
export const SEND_RECEIPT_EMAIL = `
  mutation SendReceiptEmail($billId: ID!, $email: String!) {
    sendReceiptEmail(billId: $billId, email: $email) {
      success
      message
    }
  }
`;

// Update payment status (for manual reconciliation)
export const UPDATE_PAYMENT_STATUS = `
  mutation UpdatePaymentStatus($paymentId: ID!, $status: PaymentStatus!, $notes: String) {
    updatePaymentStatus(paymentId: $paymentId, status: $status, notes: $notes) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FRAGMENT}
`;

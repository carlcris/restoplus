// Custom hooks for Payment Processing GraphQL operations
import { useQuery, useMutation, useSubscription } from 'urql';
import {
  GET_BILL,
  GET_BILL_BY_ORDER,
  GET_BILLS,
  GET_PAYMENT,
  GET_PAYMENTS_BY_BILL,
  GET_PAYMENT_HISTORY,
  GET_PAYMENT_METHODS,
  CALCULATE_BILL_SPLIT,
  GET_PAYMENT_STATISTICS,
} from '@/graphql/queries/payment.graphql';
import {
  GENERATE_BILL,
  PROCESS_PAYMENT,
  PROCESS_SPLIT_PAYMENT,
  SPLIT_BILL,
  ISSUE_REFUND,
  VOID_PAYMENT,
  CAPTURE_PAYMENT,
  APPLY_TIP,
  GENERATE_RECEIPT,
  SEND_RECEIPT_EMAIL,
  UPDATE_PAYMENT_STATUS,
} from '@/graphql/mutations/payment.graphql';
import { SUBSCRIBE_TO_PAYMENT_UPDATES } from '@/graphql/subscriptions/index.graphql';

// Hook to get bill by ID
export const useBill = (id: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_BILL,
    variables: { id },
    pause: !id,
  });

  return {
    data: result.data?.bill,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get bill by order ID
export const useBillByOrder = (orderId: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_BILL_BY_ORDER,
    variables: { orderId },
    pause: !orderId,
  });

  return {
    data: result.data?.billByOrder,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get all bills
export const useBills = (filter?: any, pagination?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_BILLS,
    variables: { filter, pagination },
  });

  return {
    data: result.data?.bills,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get payment by ID
export const usePayment = (id: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAYMENT,
    variables: { id },
    pause: !id,
  });

  return {
    data: result.data?.payment,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get payments by bill
export const usePaymentsByBill = (billId: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAYMENTS_BY_BILL,
    variables: { billId },
    pause: !billId,
  });

  return {
    data: result.data?.paymentsByBill,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get payment history
export const usePaymentHistory = (filter?: any, pagination?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAYMENT_HISTORY,
    variables: { filter, pagination },
  });

  return {
    data: result.data?.paymentHistory,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get payment methods
export const usePaymentMethods = (branchId?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAYMENT_METHODS,
    variables: { branchId },
  });

  return {
    data: result.data?.paymentMethods,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to calculate bill split
export const useCalculateBillSplit = (billId: string, splitBy: any, parts: number) => {
  const [result, reexecuteQuery] = useQuery({
    query: CALCULATE_BILL_SPLIT,
    variables: { billId, splitBy, parts },
    pause: !billId,
  });

  return {
    data: result.data?.calculateBillSplit,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get payment statistics
export const usePaymentStatistics = (branchId?: string, startDate?: string, endDate?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_PAYMENT_STATISTICS,
    variables: { branchId, startDate, endDate },
  });

  return {
    data: result.data?.paymentStatistics,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to generate bill
export const useGenerateBill = () => {
  const [result, executeMutation] = useMutation(GENERATE_BILL);

  return {
    generateBill: (orderId: string) => executeMutation({ orderId }),
    data: result.data?.generateBill,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to process payment
export const useProcessPayment = () => {
  const [result, executeMutation] = useMutation(PROCESS_PAYMENT);

  return {
    processPayment: (input: any) => executeMutation({ input }),
    data: result.data?.processPayment,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to process split payment
export const useProcessSplitPayment = () => {
  const [result, executeMutation] = useMutation(PROCESS_SPLIT_PAYMENT);

  return {
    processSplitPayment: (billId: string, payments: any[]) =>
      executeMutation({ billId, payments }),
    data: result.data?.processSplitPayment,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to split bill
export const useSplitBill = () => {
  const [result, executeMutation] = useMutation(SPLIT_BILL);

  return {
    splitBill: (billId: string, splitBy: any, splits: any[]) =>
      executeMutation({ billId, splitBy, splits }),
    data: result.data?.splitBill,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to issue refund
export const useIssueRefund = () => {
  const [result, executeMutation] = useMutation(ISSUE_REFUND);

  return {
    issueRefund: (paymentId: string, amount: any, reason: string) =>
      executeMutation({ paymentId, amount, reason }),
    data: result.data?.issueRefund,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to void payment
export const useVoidPayment = () => {
  const [result, executeMutation] = useMutation(VOID_PAYMENT);

  return {
    voidPayment: (paymentId: string, reason: string) => executeMutation({ paymentId, reason }),
    data: result.data?.voidPayment,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to capture payment
export const useCapturePayment = () => {
  const [result, executeMutation] = useMutation(CAPTURE_PAYMENT);

  return {
    capturePayment: (paymentId: string, amount?: any) => executeMutation({ paymentId, amount }),
    data: result.data?.capturePayment,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to apply tip
export const useApplyTip = () => {
  const [result, executeMutation] = useMutation(APPLY_TIP);

  return {
    applyTip: (billId: string, tipAmount: any) => executeMutation({ billId, tipAmount }),
    data: result.data?.applyTip,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to generate receipt
export const useGenerateReceipt = () => {
  const [result, executeMutation] = useMutation(GENERATE_RECEIPT);

  return {
    generateReceipt: (billId: string, format: any) => executeMutation({ billId, format }),
    data: result.data?.generateReceipt,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to send receipt email
export const useSendReceiptEmail = () => {
  const [result, executeMutation] = useMutation(SEND_RECEIPT_EMAIL);

  return {
    sendReceiptEmail: (billId: string, email: string) => executeMutation({ billId, email }),
    data: result.data?.sendReceiptEmail,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update payment status
export const useUpdatePaymentStatus = () => {
  const [result, executeMutation] = useMutation(UPDATE_PAYMENT_STATUS);

  return {
    updatePaymentStatus: (paymentId: string, status: any, notes?: string) =>
      executeMutation({ paymentId, status, notes }),
    data: result.data?.updatePaymentStatus,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to subscribe to payment updates
export const usePaymentUpdatesSubscription = (billId?: string) => {
  const [result] = useSubscription({
    query: SUBSCRIBE_TO_PAYMENT_UPDATES,
    variables: { billId },
  });

  return {
    data: result.data?.paymentProcessed,
    error: result.error,
  };
};

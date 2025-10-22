// Custom hooks for Customer Management GraphQL operations
import { useQuery, useMutation } from 'urql';
import {
  GET_CUSTOMERS,
  GET_CUSTOMER,
  SEARCH_CUSTOMERS,
  GET_CUSTOMER_BY_CONTACT,
  GET_LOYALTY_ACCOUNT,
  GET_LOYALTY_HISTORY,
  GET_CUSTOMER_ORDER_HISTORY,
  GET_CUSTOMER_SEGMENTS,
  GET_TOP_CUSTOMERS,
  GET_CAMPAIGNS,
  GET_CUSTOMER_FEEDBACK,
  GET_FEEDBACK_BY_ORDER,
  GET_CUSTOMER_STATISTICS,
} from '@/graphql/queries/customer.graphql';
import {
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
  UPDATE_CUSTOMER_PREFERENCES,
  AWARD_LOYALTY_POINTS,
  REDEEM_LOYALTY_POINTS,
  UPGRADE_CUSTOMER_TIER,
  CREATE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN_STATUS,
  SEND_CUSTOMER_OFFER,
  SUBMIT_FEEDBACK,
  RESPOND_TO_FEEDBACK,
  MERGE_CUSTOMERS,
} from '@/graphql/mutations/customer.graphql';

// Hook to get all customers
export const useCustomers = (filter?: any, pagination?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_CUSTOMERS,
    variables: { filter, pagination },
  });

  return {
    data: result.data?.customers,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get a single customer
export const useCustomer = (id: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_CUSTOMER,
    variables: { id },
    pause: !id,
  });

  return {
    data: result.data?.customer,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to search customers
export const useSearchCustomers = (searchTerm: string, limit?: number) => {
  const [result, reexecuteQuery] = useQuery({
    query: SEARCH_CUSTOMERS,
    variables: { searchTerm, limit },
    pause: !searchTerm || searchTerm.length < 2,
  });

  return {
    data: result.data?.searchCustomers,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get customer by contact info
export const useCustomerByContact = (email?: string, phone?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_CUSTOMER_BY_CONTACT,
    variables: { email, phone },
    pause: !email && !phone,
  });

  return {
    data: result.data?.customerByContact,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get loyalty account
export const useLoyaltyAccount = (customerId: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_LOYALTY_ACCOUNT,
    variables: { customerId },
    pause: !customerId,
  });

  return {
    data: result.data?.loyaltyAccount,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get loyalty history
export const useLoyaltyHistory = (customerId: string, limit?: number) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_LOYALTY_HISTORY,
    variables: { customerId, limit },
    pause: !customerId,
  });

  return {
    data: result.data?.loyaltyHistory,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get customer order history
export const useCustomerOrderHistory = (customerId: string, limit?: number) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_CUSTOMER_ORDER_HISTORY,
    variables: { customerId, limit },
    pause: !customerId,
  });

  return {
    data: result.data?.customerOrderHistory,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get customer segments
export const useCustomerSegments = (branchId?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_CUSTOMER_SEGMENTS,
    variables: { branchId },
  });

  return {
    data: result.data?.customerSegments,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get top customers
export const useTopCustomers = (branchId?: string, limit?: number, period?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_TOP_CUSTOMERS,
    variables: { branchId, limit, period },
  });

  return {
    data: result.data?.topCustomers,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get campaigns
export const useCampaigns = (filter?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_CAMPAIGNS,
    variables: { filter },
  });

  return {
    data: result.data?.campaigns,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get customer feedback
export const useCustomerFeedback = (filter?: any, pagination?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_CUSTOMER_FEEDBACK,
    variables: { filter, pagination },
  });

  return {
    data: result.data?.customerFeedback,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get feedback by order
export const useFeedbackByOrder = (orderId: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_FEEDBACK_BY_ORDER,
    variables: { orderId },
    pause: !orderId,
  });

  return {
    data: result.data?.feedbackByOrder,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get customer statistics
export const useCustomerStatistics = (branchId?: string, startDate?: string, endDate?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_CUSTOMER_STATISTICS,
    variables: { branchId, startDate, endDate },
  });

  return {
    data: result.data?.customerStatistics,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to create customer
export const useCreateCustomer = () => {
  const [result, executeMutation] = useMutation(CREATE_CUSTOMER);

  return {
    createCustomer: (input: any) => executeMutation({ input }),
    data: result.data?.createCustomer,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update customer
export const useUpdateCustomer = () => {
  const [result, executeMutation] = useMutation(UPDATE_CUSTOMER);

  return {
    updateCustomer: (id: string, input: any) => executeMutation({ id, input }),
    data: result.data?.updateCustomer,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to delete customer
export const useDeleteCustomer = () => {
  const [result, executeMutation] = useMutation(DELETE_CUSTOMER);

  return {
    deleteCustomer: (id: string) => executeMutation({ id }),
    data: result.data?.deleteCustomer,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update customer preferences
export const useUpdateCustomerPreferences = () => {
  const [result, executeMutation] = useMutation(UPDATE_CUSTOMER_PREFERENCES);

  return {
    updatePreferences: (customerId: string, preferences: any) =>
      executeMutation({ customerId, preferences }),
    data: result.data?.updateCustomerPreferences,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to award loyalty points
export const useAwardLoyaltyPoints = () => {
  const [result, executeMutation] = useMutation(AWARD_LOYALTY_POINTS);

  return {
    awardPoints: (customerId: string, points: number, description?: string, orderId?: string) =>
      executeMutation({ customerId, points, description, orderId }),
    data: result.data?.awardLoyaltyPoints,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to redeem loyalty points
export const useRedeemLoyaltyPoints = () => {
  const [result, executeMutation] = useMutation(REDEEM_LOYALTY_POINTS);

  return {
    redeemPoints: (customerId: string, points: number, description?: string, orderId?: string) =>
      executeMutation({ customerId, points, description, orderId }),
    data: result.data?.redeemLoyaltyPoints,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to upgrade customer tier
export const useUpgradeCustomerTier = () => {
  const [result, executeMutation] = useMutation(UPGRADE_CUSTOMER_TIER);

  return {
    upgradeTier: (customerId: string, tier: any) => executeMutation({ customerId, tier }),
    data: result.data?.upgradeCustomerTier,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to create campaign
export const useCreateCampaign = () => {
  const [result, executeMutation] = useMutation(CREATE_CAMPAIGN);

  return {
    createCampaign: (input: any) => executeMutation({ input }),
    data: result.data?.createCampaign,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update campaign
export const useUpdateCampaign = () => {
  const [result, executeMutation] = useMutation(UPDATE_CAMPAIGN);

  return {
    updateCampaign: (id: string, input: any) => executeMutation({ id, input }),
    data: result.data?.updateCampaign,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to delete campaign
export const useDeleteCampaign = () => {
  const [result, executeMutation] = useMutation(DELETE_CAMPAIGN);

  return {
    deleteCampaign: (id: string) => executeMutation({ id }),
    data: result.data?.deleteCampaign,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update campaign status
export const useUpdateCampaignStatus = () => {
  const [result, executeMutation] = useMutation(UPDATE_CAMPAIGN_STATUS);

  return {
    updateCampaignStatus: (id: string, status: any) => executeMutation({ id, status }),
    data: result.data?.updateCampaignStatus,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to send customer offer
export const useSendCustomerOffer = () => {
  const [result, executeMutation] = useMutation(SEND_CUSTOMER_OFFER);

  return {
    sendOffer: (customerId: string, campaignId: string, channel: any) =>
      executeMutation({ customerId, campaignId, channel }),
    data: result.data?.sendCustomerOffer,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to submit feedback
export const useSubmitFeedback = () => {
  const [result, executeMutation] = useMutation(SUBMIT_FEEDBACK);

  return {
    submitFeedback: (input: any) => executeMutation({ input }),
    data: result.data?.submitFeedback,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to respond to feedback
export const useRespondToFeedback = () => {
  const [result, executeMutation] = useMutation(RESPOND_TO_FEEDBACK);

  return {
    respondToFeedback: (feedbackId: string, response: string) =>
      executeMutation({ feedbackId, response }),
    data: result.data?.respondToFeedback,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to merge customers
export const useMergeCustomers = () => {
  const [result, executeMutation] = useMutation(MERGE_CUSTOMERS);

  return {
    mergeCustomers: (primaryCustomerId: string, duplicateCustomerId: string) =>
      executeMutation({ primaryCustomerId, duplicateCustomerId }),
    data: result.data?.mergeCustomers,
    loading: result.fetching,
    error: result.error,
  };
};

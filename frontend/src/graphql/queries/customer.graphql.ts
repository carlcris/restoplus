// GraphQL Queries for Customer Management
import {
  CUSTOMER_FRAGMENT,
  LOYALTY_ACCOUNT_FRAGMENT,
  CAMPAIGN_FRAGMENT,
  FEEDBACK_FRAGMENT,
} from '../fragments/customer.graphql';

// Query to get all customers
export const GET_CUSTOMERS = `
  query GetCustomers($filter: CustomerFilter, $pagination: PaginationInput) {
    customers(filter: $filter, pagination: $pagination) {
      items {
        ...CustomerFields
      }
      total
      hasMore
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Query to get a single customer by ID
export const GET_CUSTOMER = `
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Query to search customers
export const SEARCH_CUSTOMERS = `
  query SearchCustomers($searchTerm: String!, $limit: Int) {
    searchCustomers(searchTerm: $searchTerm, limit: $limit) {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Query to get customer by email or phone
export const GET_CUSTOMER_BY_CONTACT = `
  query GetCustomerByContact($email: String, $phone: String) {
    customerByContact(email: $email, phone: $phone) {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Query to get customer loyalty account
export const GET_LOYALTY_ACCOUNT = `
  query GetLoyaltyAccount($customerId: ID!) {
    loyaltyAccount(customerId: $customerId) {
      ...LoyaltyAccountFields
    }
  }
  ${LOYALTY_ACCOUNT_FRAGMENT}
`;

// Query to get loyalty point history
export const GET_LOYALTY_HISTORY = `
  query GetLoyaltyHistory($customerId: ID!, $limit: Int) {
    loyaltyHistory(customerId: $customerId, limit: $limit) {
      id
      customerId
      points
      type
      description
      orderId
      createdAt
    }
  }
`;

// Query to get customer order history
export const GET_CUSTOMER_ORDER_HISTORY = `
  query GetCustomerOrderHistory($customerId: ID!, $limit: Int) {
    customerOrderHistory(customerId: $customerId, limit: $limit) {
      id
      orderNumber
      type
      status
      total {
        amount
        currency
      }
      createdAt
    }
  }
`;

// Query to get customer segments
export const GET_CUSTOMER_SEGMENTS = `
  query GetCustomerSegments($branchId: ID) {
    customerSegments(branchId: $branchId) {
      tier
      count
      averageSpend {
        amount
        currency
      }
      totalRevenue {
        amount
        currency
      }
    }
  }
`;

// Query to get top customers
export const GET_TOP_CUSTOMERS = `
  query GetTopCustomers($branchId: ID, $limit: Int, $period: TimePeriod) {
    topCustomers(branchId: $branchId, limit: $limit, period: $period) {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Query to get all campaigns
export const GET_CAMPAIGNS = `
  query GetCampaigns($filter: CampaignFilter) {
    campaigns(filter: $filter) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

// Query to get customer feedback
export const GET_CUSTOMER_FEEDBACK = `
  query GetCustomerFeedback($filter: FeedbackFilter, $pagination: PaginationInput) {
    customerFeedback(filter: $filter, pagination: $pagination) {
      items {
        ...FeedbackFields
      }
      total
      hasMore
    }
  }
  ${FEEDBACK_FRAGMENT}
`;

// Query to get feedback by order
export const GET_FEEDBACK_BY_ORDER = `
  query GetFeedbackByOrder($orderId: ID!) {
    feedbackByOrder(orderId: $orderId) {
      ...FeedbackFields
    }
  }
  ${FEEDBACK_FRAGMENT}
`;

// Query to get customer statistics
export const GET_CUSTOMER_STATISTICS = `
  query GetCustomerStatistics($branchId: ID, $startDate: String, $endDate: String) {
    customerStatistics(branchId: $branchId, startDate: $startDate, endDate: $endDate) {
      totalCustomers
      newCustomers
      returningCustomers
      averageLifetimeValue {
        amount
        currency
      }
      retentionRate
      churnRate
      topTier
      averageOrdersPerCustomer
    }
  }
`;

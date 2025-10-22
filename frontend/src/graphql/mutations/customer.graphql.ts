// GraphQL Mutations for Customer Management
import {
  CUSTOMER_FRAGMENT,
  LOYALTY_ACCOUNT_FRAGMENT,
  CAMPAIGN_FRAGMENT,
  FEEDBACK_FRAGMENT,
} from '../fragments/customer.graphql';

// Create a new customer
export const CREATE_CUSTOMER = `
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Update an existing customer
export const UPDATE_CUSTOMER = `
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Delete a customer
export const DELETE_CUSTOMER = `
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      success
      message
    }
  }
`;

// Update customer preferences
export const UPDATE_CUSTOMER_PREFERENCES = `
  mutation UpdateCustomerPreferences($customerId: ID!, $preferences: CustomerPreferencesInput!) {
    updateCustomerPreferences(customerId: $customerId, preferences: $preferences) {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Award loyalty points
export const AWARD_LOYALTY_POINTS = `
  mutation AwardLoyaltyPoints($customerId: ID!, $points: Int!, $description: String, $orderId: ID) {
    awardLoyaltyPoints(customerId: $customerId, points: $points, description: $description, orderId: $orderId) {
      ...LoyaltyAccountFields
    }
  }
  ${LOYALTY_ACCOUNT_FRAGMENT}
`;

// Redeem loyalty points
export const REDEEM_LOYALTY_POINTS = `
  mutation RedeemLoyaltyPoints($customerId: ID!, $points: Int!, $description: String, $orderId: ID) {
    redeemLoyaltyPoints(customerId: $customerId, points: $points, description: $description, orderId: $orderId) {
      ...LoyaltyAccountFields
    }
  }
  ${LOYALTY_ACCOUNT_FRAGMENT}
`;

// Upgrade customer tier
export const UPGRADE_CUSTOMER_TIER = `
  mutation UpgradeCustomerTier($customerId: ID!, $tier: CustomerTier!) {
    upgradeCustomerTier(customerId: $customerId, tier: $tier) {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Create a campaign
export const CREATE_CAMPAIGN = `
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

// Update a campaign
export const UPDATE_CAMPAIGN = `
  mutation UpdateCampaign($id: ID!, $input: UpdateCampaignInput!) {
    updateCampaign(id: $id, input: $input) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

// Delete a campaign
export const DELETE_CAMPAIGN = `
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id) {
      success
      message
    }
  }
`;

// Activate/deactivate campaign
export const UPDATE_CAMPAIGN_STATUS = `
  mutation UpdateCampaignStatus($id: ID!, $status: CampaignStatus!) {
    updateCampaignStatus(id: $id, status: $status) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

// Send targeted offer to customer
export const SEND_CUSTOMER_OFFER = `
  mutation SendCustomerOffer($customerId: ID!, $campaignId: ID!, $channel: CommunicationChannel!) {
    sendCustomerOffer(customerId: $customerId, campaignId: $campaignId, channel: $channel) {
      success
      message
    }
  }
`;

// Submit customer feedback
export const SUBMIT_FEEDBACK = `
  mutation SubmitFeedback($input: SubmitFeedbackInput!) {
    submitFeedback(input: $input) {
      ...FeedbackFields
    }
  }
  ${FEEDBACK_FRAGMENT}
`;

// Respond to feedback
export const RESPOND_TO_FEEDBACK = `
  mutation RespondToFeedback($feedbackId: ID!, $response: String!) {
    respondToFeedback(feedbackId: $feedbackId, response: $response) {
      ...FeedbackFields
    }
  }
  ${FEEDBACK_FRAGMENT}
`;

// Merge duplicate customers
export const MERGE_CUSTOMERS = `
  mutation MergeCustomers($primaryCustomerId: ID!, $duplicateCustomerId: ID!) {
    mergeCustomers(primaryCustomerId: $primaryCustomerId, duplicateCustomerId: $duplicateCustomerId) {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

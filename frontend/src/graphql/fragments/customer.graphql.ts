// GraphQL Fragments for Customer domain
import { MONEY_FRAGMENT } from './order.graphql';

export const CUSTOMER_FRAGMENT = `
  fragment CustomerFields on Customer {
    id
    firstName
    lastName
    email
    phone
    birthday
    preferences {
      dietaryRestrictions
      favoriteItems
      preferredTable
      communicationPreference
    }
    tier
    totalSpent {
      ...MoneyFields
    }
    orderCount
    createdAt
  }
  ${MONEY_FRAGMENT}
`;

export const LOYALTY_ACCOUNT_FRAGMENT = `
  fragment LoyaltyAccountFields on LoyaltyAccount {
    id
    customerId
    pointsBalance
    totalEarned
    totalRedeemed
    tier
    lastActivity
  }
`;

export const CAMPAIGN_FRAGMENT = `
  fragment CampaignFields on Campaign {
    id
    name
    type
    trigger
    offerTemplate
    validFrom
    validUntil
    status
  }
`;

export const FEEDBACK_FRAGMENT = `
  fragment FeedbackFields on Feedback {
    id
    customerId
    orderId
    rating
    comment
    createdAt
  }
`;

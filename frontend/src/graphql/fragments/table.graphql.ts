// GraphQL Fragments for Table domain

export const TABLE_FRAGMENT = `
  fragment TableFields on Table {
    id
    tableNumber
    capacity
    section
    floor
    status
    currentOrderId
    assignedServerId
    position {
      x
      y
    }
  }
`;

export const RESERVATION_FRAGMENT = `
  fragment ReservationFields on Reservation {
    id
    customerId
    partySize
    reservedAt
    status
    tableId
    specialRequests
  }
`;

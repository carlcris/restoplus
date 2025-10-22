// GraphQL Mutations for Table Management
import { TABLE_FRAGMENT, RESERVATION_FRAGMENT } from '../fragments/table.graphql';

// Create a new table
export const CREATE_TABLE = `
  mutation CreateTable($input: CreateTableInput!) {
    createTable(input: $input) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Update an existing table
export const UPDATE_TABLE = `
  mutation UpdateTable($id: ID!, $input: UpdateTableInput!) {
    updateTable(id: $id, input: $input) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Delete a table
export const DELETE_TABLE = `
  mutation DeleteTable($id: ID!) {
    deleteTable(id: $id) {
      success
      message
    }
  }
`;

// Update table status
export const UPDATE_TABLE_STATUS = `
  mutation UpdateTableStatus($id: ID!, $status: TableStatus!) {
    updateTableStatus(id: $id, status: $status) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Assign order to table
export const ASSIGN_ORDER_TO_TABLE = `
  mutation AssignOrderToTable($tableId: ID!, $orderId: ID!) {
    assignOrderToTable(tableId: $tableId, orderId: $orderId) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Clear table (mark as needs cleaning)
export const CLEAR_TABLE = `
  mutation ClearTable($id: ID!) {
    clearTable(id: $id) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Assign server to table
export const ASSIGN_SERVER_TO_TABLE = `
  mutation AssignServerToTable($tableId: ID!, $serverId: ID!) {
    assignServerToTable(tableId: $tableId, serverId: $serverId) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Update table position (for floor plan editor)
export const UPDATE_TABLE_POSITION = `
  mutation UpdateTablePosition($id: ID!, $position: PositionInput!) {
    updateTablePosition(id: $id, position: $position) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Bulk update table positions
export const BULK_UPDATE_TABLE_POSITIONS = `
  mutation BulkUpdateTablePositions($updates: [TablePositionUpdate!]!) {
    bulkUpdateTablePositions(updates: $updates) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Create a new reservation
export const CREATE_RESERVATION = `
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      ...ReservationFields
    }
  }
  ${RESERVATION_FRAGMENT}
`;

// Update an existing reservation
export const UPDATE_RESERVATION = `
  mutation UpdateReservation($id: ID!, $input: UpdateReservationInput!) {
    updateReservation(id: $id, input: $input) {
      ...ReservationFields
    }
  }
  ${RESERVATION_FRAGMENT}
`;

// Cancel a reservation
export const CANCEL_RESERVATION = `
  mutation CancelReservation($id: ID!, $reason: String) {
    cancelReservation(id: $id, reason: $reason) {
      ...ReservationFields
    }
  }
  ${RESERVATION_FRAGMENT}
`;

// Seat a reservation (assign table and change status)
export const SEAT_RESERVATION = `
  mutation SeatReservation($id: ID!, $tableId: ID!) {
    seatReservation(id: $id, tableId: $tableId) {
      ...ReservationFields
    }
  }
  ${RESERVATION_FRAGMENT}
`;

// Mark reservation as no-show
export const MARK_RESERVATION_NO_SHOW = `
  mutation MarkReservationNoShow($id: ID!) {
    markReservationNoShow(id: $id) {
      ...ReservationFields
    }
  }
  ${RESERVATION_FRAGMENT}
`;

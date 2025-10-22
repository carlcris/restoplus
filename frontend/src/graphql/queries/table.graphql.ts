// GraphQL Queries for Table Management
import { TABLE_FRAGMENT, RESERVATION_FRAGMENT } from '../fragments/table.graphql';

// Query to get all tables
export const GET_TABLES = `
  query GetTables($branchId: ID, $filter: TableFilter) {
    tables(branchId: $branchId, filter: $filter) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Query to get a single table by ID
export const GET_TABLE = `
  query GetTable($id: ID!) {
    table(id: $id) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Query to get tables by section
export const GET_TABLES_BY_SECTION = `
  query GetTablesBySection($branchId: ID!, $section: String!) {
    tablesBySection(branchId: $branchId, section: $section) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Query to get available tables
export const GET_AVAILABLE_TABLES = `
  query GetAvailableTables($branchId: ID, $minCapacity: Int) {
    availableTables(branchId: $branchId, minCapacity: $minCapacity) {
      ...TableFields
    }
  }
  ${TABLE_FRAGMENT}
`;

// Query to get table layout (floor plan)
export const GET_TABLE_LAYOUT = `
  query GetTableLayout($branchId: ID!, $floor: String) {
    tableLayout(branchId: $branchId, floor: $floor) {
      floor
      sections {
        name
        tables {
          ...TableFields
        }
      }
    }
  }
  ${TABLE_FRAGMENT}
`;

// Query to get all reservations
export const GET_RESERVATIONS = `
  query GetReservations($filter: ReservationFilter, $pagination: PaginationInput) {
    reservations(filter: $filter, pagination: $pagination) {
      items {
        ...ReservationFields
      }
      total
      hasMore
    }
  }
  ${RESERVATION_FRAGMENT}
`;

// Query to get a single reservation by ID
export const GET_RESERVATION = `
  query GetReservation($id: ID!) {
    reservation(id: $id) {
      ...ReservationFields
    }
  }
  ${RESERVATION_FRAGMENT}
`;

// Query to get reservations by date
export const GET_RESERVATIONS_BY_DATE = `
  query GetReservationsByDate($branchId: ID!, $date: String!) {
    reservationsByDate(branchId: $branchId, date: $date) {
      ...ReservationFields
    }
  }
  ${RESERVATION_FRAGMENT}
`;

// Query to get upcoming reservations
export const GET_UPCOMING_RESERVATIONS = `
  query GetUpcomingReservations($branchId: ID!, $hours: Int) {
    upcomingReservations(branchId: $branchId, hours: $hours) {
      ...ReservationFields
    }
  }
  ${RESERVATION_FRAGMENT}
`;

// Query to check table availability
export const CHECK_TABLE_AVAILABILITY = `
  query CheckTableAvailability($tableId: ID!, $dateTime: String!) {
    checkTableAvailability(tableId: $tableId, dateTime: $dateTime) {
      available
      reason
      nextAvailableTime
    }
  }
`;

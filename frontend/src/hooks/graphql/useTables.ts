// Custom hooks for Table Management GraphQL operations
import { useQuery, useMutation, useSubscription } from 'urql';
import {
  GET_TABLES,
  GET_TABLE,
  GET_TABLES_BY_SECTION,
  GET_AVAILABLE_TABLES,
  GET_TABLE_LAYOUT,
  GET_RESERVATIONS,
  GET_RESERVATION,
  GET_RESERVATIONS_BY_DATE,
  GET_UPCOMING_RESERVATIONS,
  CHECK_TABLE_AVAILABILITY,
} from '@/graphql/queries/table.graphql';
import {
  CREATE_TABLE,
  UPDATE_TABLE,
  DELETE_TABLE,
  UPDATE_TABLE_STATUS,
  ASSIGN_ORDER_TO_TABLE,
  CLEAR_TABLE,
  ASSIGN_SERVER_TO_TABLE,
  UPDATE_TABLE_POSITION,
  BULK_UPDATE_TABLE_POSITIONS,
  CREATE_RESERVATION,
  UPDATE_RESERVATION,
  CANCEL_RESERVATION,
  SEAT_RESERVATION,
  MARK_RESERVATION_NO_SHOW,
} from '@/graphql/mutations/table.graphql';
import { SUBSCRIBE_TO_TABLE_UPDATES, SUBSCRIBE_TO_RESERVATION_UPDATES } from '@/graphql/subscriptions/index.graphql';

// Hook to get all tables
export const useTables = (branchId?: string, filter?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_TABLES,
    variables: { branchId, filter },
  });

  return {
    data: result.data?.tables,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get a single table
export const useTable = (id: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_TABLE,
    variables: { id },
    pause: !id,
  });

  return {
    data: result.data?.table,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get tables by section
export const useTablesBySection = (branchId: string, section: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_TABLES_BY_SECTION,
    variables: { branchId, section },
    pause: !branchId || !section,
  });

  return {
    data: result.data?.tablesBySection,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get available tables
export const useAvailableTables = (branchId?: string, minCapacity?: number) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_AVAILABLE_TABLES,
    variables: { branchId, minCapacity },
  });

  return {
    data: result.data?.availableTables,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get table layout
export const useTableLayout = (branchId: string, floor?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_TABLE_LAYOUT,
    variables: { branchId, floor },
    pause: !branchId,
  });

  return {
    data: result.data?.tableLayout,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get all reservations
export const useReservations = (filter?: any, pagination?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_RESERVATIONS,
    variables: { filter, pagination },
  });

  return {
    data: result.data?.reservations,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get a single reservation
export const useReservation = (id: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_RESERVATION,
    variables: { id },
    pause: !id,
  });

  return {
    data: result.data?.reservation,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get reservations by date
export const useReservationsByDate = (branchId: string, date: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_RESERVATIONS_BY_DATE,
    variables: { branchId, date },
    pause: !branchId || !date,
  });

  return {
    data: result.data?.reservationsByDate,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get upcoming reservations
export const useUpcomingReservations = (branchId: string, hours?: number) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_UPCOMING_RESERVATIONS,
    variables: { branchId, hours },
    pause: !branchId,
  });

  return {
    data: result.data?.upcomingReservations,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to check table availability
export const useCheckTableAvailability = (tableId: string, dateTime: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: CHECK_TABLE_AVAILABILITY,
    variables: { tableId, dateTime },
    pause: !tableId || !dateTime,
  });

  return {
    data: result.data?.checkTableAvailability,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to create table
export const useCreateTable = () => {
  const [result, executeMutation] = useMutation(CREATE_TABLE);

  return {
    createTable: (input: any) => executeMutation({ input }),
    data: result.data?.createTable,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update table
export const useUpdateTable = () => {
  const [result, executeMutation] = useMutation(UPDATE_TABLE);

  return {
    updateTable: (id: string, input: any) => executeMutation({ id, input }),
    data: result.data?.updateTable,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to delete table
export const useDeleteTable = () => {
  const [result, executeMutation] = useMutation(DELETE_TABLE);

  return {
    deleteTable: (id: string) => executeMutation({ id }),
    data: result.data?.deleteTable,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update table status
export const useUpdateTableStatus = () => {
  const [result, executeMutation] = useMutation(UPDATE_TABLE_STATUS);

  return {
    updateStatus: (id: string, status: any) => executeMutation({ id, status }),
    data: result.data?.updateTableStatus,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to assign order to table
export const useAssignOrderToTable = () => {
  const [result, executeMutation] = useMutation(ASSIGN_ORDER_TO_TABLE);

  return {
    assignOrder: (tableId: string, orderId: string) => executeMutation({ tableId, orderId }),
    data: result.data?.assignOrderToTable,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to clear table
export const useClearTable = () => {
  const [result, executeMutation] = useMutation(CLEAR_TABLE);

  return {
    clearTable: (id: string) => executeMutation({ id }),
    data: result.data?.clearTable,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to assign server to table
export const useAssignServerToTable = () => {
  const [result, executeMutation] = useMutation(ASSIGN_SERVER_TO_TABLE);

  return {
    assignServer: (tableId: string, serverId: string) => executeMutation({ tableId, serverId }),
    data: result.data?.assignServerToTable,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update table position
export const useUpdateTablePosition = () => {
  const [result, executeMutation] = useMutation(UPDATE_TABLE_POSITION);

  return {
    updatePosition: (id: string, position: any) => executeMutation({ id, position }),
    data: result.data?.updateTablePosition,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to bulk update table positions
export const useBulkUpdateTablePositions = () => {
  const [result, executeMutation] = useMutation(BULK_UPDATE_TABLE_POSITIONS);

  return {
    bulkUpdatePositions: (updates: any[]) => executeMutation({ updates }),
    data: result.data?.bulkUpdateTablePositions,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to create reservation
export const useCreateReservation = () => {
  const [result, executeMutation] = useMutation(CREATE_RESERVATION);

  return {
    createReservation: (input: any) => executeMutation({ input }),
    data: result.data?.createReservation,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update reservation
export const useUpdateReservation = () => {
  const [result, executeMutation] = useMutation(UPDATE_RESERVATION);

  return {
    updateReservation: (id: string, input: any) => executeMutation({ id, input }),
    data: result.data?.updateReservation,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to cancel reservation
export const useCancelReservation = () => {
  const [result, executeMutation] = useMutation(CANCEL_RESERVATION);

  return {
    cancelReservation: (id: string, reason?: string) => executeMutation({ id, reason }),
    data: result.data?.cancelReservation,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to seat reservation
export const useSeatReservation = () => {
  const [result, executeMutation] = useMutation(SEAT_RESERVATION);

  return {
    seatReservation: (id: string, tableId: string) => executeMutation({ id, tableId }),
    data: result.data?.seatReservation,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to mark reservation as no-show
export const useMarkReservationNoShow = () => {
  const [result, executeMutation] = useMutation(MARK_RESERVATION_NO_SHOW);

  return {
    markNoShow: (id: string) => executeMutation({ id }),
    data: result.data?.markReservationNoShow,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to subscribe to table updates
export const useTableUpdatesSubscription = (branchId?: string, floor?: string) => {
  const [result] = useSubscription({
    query: SUBSCRIBE_TO_TABLE_UPDATES,
    variables: { branchId, floor },
  });

  return {
    data: result.data?.tableStatusChanged,
    error: result.error,
  };
};

// Hook to subscribe to reservation updates
export const useReservationUpdatesSubscription = (branchId?: string) => {
  const [result] = useSubscription({
    query: SUBSCRIBE_TO_RESERVATION_UPDATES,
    variables: { branchId },
  });

  return {
    data: result.data?.reservationUpdated,
    error: result.error,
  };
};

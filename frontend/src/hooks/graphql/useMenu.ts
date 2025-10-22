// Custom hooks for Menu Management GraphQL operations
import { useQuery, useMutation, useSubscription } from 'urql';
import {
  GET_MENU_ITEMS,
  GET_MENU_ITEM,
  SEARCH_MENU_ITEMS,
  GET_MENU_CATEGORIES,
  GET_MENU_CATEGORY,
  GET_MENU_ITEMS_BY_CATEGORY,
  GET_FULL_MENU,
} from '@/graphql/queries/menu.graphql';
import {
  CREATE_MENU_ITEM,
  UPDATE_MENU_ITEM,
  DELETE_MENU_ITEM,
  TOGGLE_MENU_ITEM_AVAILABILITY,
  CREATE_MENU_CATEGORY,
  UPDATE_MENU_CATEGORY,
  DELETE_MENU_CATEGORY,
  REORDER_MENU_CATEGORIES,
  BULK_UPDATE_MENU_ITEMS,
  UPSERT_MODIFIER_GROUP,
} from '@/graphql/mutations/menu.graphql';
import { SUBSCRIBE_TO_MENU_AVAILABILITY } from '@/graphql/subscriptions/index.graphql';

// Hook to get all menu items
export const useMenuItems = (filter?: any, pagination?: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_MENU_ITEMS,
    variables: { filter, pagination },
  });

  return {
    data: result.data?.menuItems,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get a single menu item
export const useMenuItem = (id: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_MENU_ITEM,
    variables: { id },
    pause: !id,
  });

  return {
    data: result.data?.menuItem,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to search menu items
export const useSearchMenuItems = (searchTerm: string, categoryId?: string, limit?: number) => {
  const [result, reexecuteQuery] = useQuery({
    query: SEARCH_MENU_ITEMS,
    variables: { searchTerm, categoryId, limit },
    pause: !searchTerm || searchTerm.length < 2,
  });

  return {
    data: result.data?.searchMenuItems,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get menu categories
export const useMenuCategories = (includeInactive = false) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_MENU_CATEGORIES,
    variables: { includeInactive },
  });

  return {
    data: result.data?.menuCategories,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get a single menu category
export const useMenuCategory = (id: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_MENU_CATEGORY,
    variables: { id },
    pause: !id,
  });

  return {
    data: result.data?.menuCategory,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get menu items by category
export const useMenuItemsByCategory = (categoryId: string, includeUnavailable = false) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_MENU_ITEMS_BY_CATEGORY,
    variables: { categoryId, includeUnavailable },
    pause: !categoryId,
  });

  return {
    data: result.data?.menuItemsByCategory,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get full menu
export const useFullMenu = (branchId?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_FULL_MENU,
    variables: { branchId },
  });

  return {
    data: result.data?.fullMenu,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to create menu item
export const useCreateMenuItem = () => {
  const [result, executeMutation] = useMutation(CREATE_MENU_ITEM);

  return {
    createMenuItem: (input: any) => executeMutation({ input }),
    data: result.data?.createMenuItem,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update menu item
export const useUpdateMenuItem = () => {
  const [result, executeMutation] = useMutation(UPDATE_MENU_ITEM);

  return {
    updateMenuItem: (id: string, input: any) => executeMutation({ id, input }),
    data: result.data?.updateMenuItem,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to delete menu item
export const useDeleteMenuItem = () => {
  const [result, executeMutation] = useMutation(DELETE_MENU_ITEM);

  return {
    deleteMenuItem: (id: string) => executeMutation({ id }),
    data: result.data?.deleteMenuItem,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to toggle menu item availability
export const useToggleMenuItemAvailability = () => {
  const [result, executeMutation] = useMutation(TOGGLE_MENU_ITEM_AVAILABILITY);

  return {
    toggleAvailability: (id: string, isAvailable: boolean) =>
      executeMutation({ id, isAvailable }),
    data: result.data?.toggleMenuItemAvailability,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to create menu category
export const useCreateMenuCategory = () => {
  const [result, executeMutation] = useMutation(CREATE_MENU_CATEGORY);

  return {
    createCategory: (input: any) => executeMutation({ input }),
    data: result.data?.createMenuCategory,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to update menu category
export const useUpdateMenuCategory = () => {
  const [result, executeMutation] = useMutation(UPDATE_MENU_CATEGORY);

  return {
    updateCategory: (id: string, input: any) => executeMutation({ id, input }),
    data: result.data?.updateMenuCategory,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to delete menu category
export const useDeleteMenuCategory = () => {
  const [result, executeMutation] = useMutation(DELETE_MENU_CATEGORY);

  return {
    deleteCategory: (id: string) => executeMutation({ id }),
    data: result.data?.deleteMenuCategory,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to reorder categories
export const useReorderMenuCategories = () => {
  const [result, executeMutation] = useMutation(REORDER_MENU_CATEGORIES);

  return {
    reorderCategories: (categoryIds: string[]) => executeMutation({ categoryIds }),
    data: result.data?.reorderMenuCategories,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to bulk update menu items
export const useBulkUpdateMenuItems = () => {
  const [result, executeMutation] = useMutation(BULK_UPDATE_MENU_ITEMS);

  return {
    bulkUpdate: (updates: any[]) => executeMutation({ updates }),
    data: result.data?.bulkUpdateMenuItems,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to upsert modifier group
export const useUpsertModifierGroup = () => {
  const [result, executeMutation] = useMutation(UPSERT_MODIFIER_GROUP);

  return {
    upsertModifierGroup: (menuItemId: string, input: any) =>
      executeMutation({ menuItemId, input }),
    data: result.data?.upsertModifierGroup,
    loading: result.fetching,
    error: result.error,
  };
};

// Hook to subscribe to menu availability changes
export const useMenuAvailabilitySubscription = (branchId?: string) => {
  const [result] = useSubscription({
    query: SUBSCRIBE_TO_MENU_AVAILABILITY,
    variables: { branchId },
  });

  return {
    data: result.data?.menuItemAvailabilityChanged,
    error: result.error,
  };
};

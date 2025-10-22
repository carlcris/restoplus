// Custom hooks for Reports and Analytics GraphQL operations
import { useQuery } from 'urql';
import {
  GET_SALES_REPORT,
  GET_INVENTORY_REPORT,
  GET_STAFF_REPORT,
  GET_CUSTOMER_ANALYTICS,
  GET_PEAK_HOURS_ANALYSIS,
  GET_DASHBOARD_METRICS,
  GENERATE_CUSTOM_REPORT,
  EXPORT_REPORT,
  GET_MENU_ITEM_PERFORMANCE,
  GET_FINANCIAL_SUMMARY,
} from '@/graphql/queries/reports.graphql';

// Hook to get sales report
export const useSalesReport = (input: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_SALES_REPORT,
    variables: { input },
  });

  return {
    data: result.data?.salesReport,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get inventory report
export const useInventoryReport = (input: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_INVENTORY_REPORT,
    variables: { input },
  });

  return {
    data: result.data?.inventoryReport,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get staff report
export const useStaffReport = (input: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_STAFF_REPORT,
    variables: { input },
  });

  return {
    data: result.data?.staffReport,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get customer analytics
export const useCustomerAnalytics = (input: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_CUSTOMER_ANALYTICS,
    variables: { input },
  });

  return {
    data: result.data?.customerAnalytics,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get peak hours analysis
export const usePeakHoursAnalysis = (branchId: string, startDate: string, endDate: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_PEAK_HOURS_ANALYSIS,
    variables: { branchId, startDate, endDate },
    pause: !branchId || !startDate || !endDate,
  });

  return {
    data: result.data?.peakHoursAnalysis,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get dashboard metrics
export const useDashboardMetrics = (branchId?: string, period: any = 'TODAY') => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_DASHBOARD_METRICS,
    variables: { branchId, period },
  });

  return {
    data: result.data?.dashboardMetrics,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to generate custom report
export const useGenerateCustomReport = (input: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GENERATE_CUSTOM_REPORT,
    variables: { input },
    pause: !input,
  });

  return {
    data: result.data?.generateCustomReport,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to export report
export const useExportReport = (reportType: any, input: any, format: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: EXPORT_REPORT,
    variables: { reportType, input, format },
    pause: !reportType || !input || !format,
  });

  return {
    data: result.data?.exportReport,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get menu item performance
export const useMenuItemPerformance = (input: any) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_MENU_ITEM_PERFORMANCE,
    variables: { input },
  });

  return {
    data: result.data?.menuItemPerformance,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

// Hook to get financial summary
export const useFinancialSummary = (branchId?: string, startDate?: string, endDate?: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_FINANCIAL_SUMMARY,
    variables: { branchId, startDate, endDate },
    pause: !startDate || !endDate,
  });

  return {
    data: result.data?.financialSummary,
    loading: result.fetching,
    error: result.error,
    refetch: reexecuteQuery,
  };
};

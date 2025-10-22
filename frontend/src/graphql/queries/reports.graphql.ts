// GraphQL Queries for Reports and Analytics

// Query to get sales report
export const GET_SALES_REPORT = `
  query GetSalesReport($input: SalesReportInput!) {
    salesReport(input: $input) {
      summary {
        totalSales {
          amount
          currency
        }
        totalOrders
        averageOrderValue {
          amount
          currency
        }
        totalTax {
          amount
          currency
        }
        totalDiscounts {
          amount
          currency
        }
      }
      salesByDay {
        date
        sales {
          amount
          currency
        }
        orderCount
      }
      salesByCategory {
        categoryName
        sales {
          amount
          currency
        }
        itemCount
      }
      salesByOrderType {
        type
        sales {
          amount
          currency
        }
        orderCount
      }
      topSellingItems {
        itemName
        quantity
        revenue {
          amount
          currency
        }
      }
    }
  }
`;

// Query to get inventory report
export const GET_INVENTORY_REPORT = `
  query GetInventoryReport($input: InventoryReportInput!) {
    inventoryReport(input: $input) {
      summary {
        totalItems
        lowStockItems
        outOfStockItems
        totalValue {
          amount
          currency
        }
      }
      items {
        sku
        name
        category
        currentStock
        minimumStock
        reorderLevel
        unitCost {
          amount
          currency
        }
        totalValue {
          amount
          currency
        }
        status
      }
      lowStockAlerts {
        sku
        name
        currentStock
        minimumStock
        reorderLevel
      }
      stockMovements {
        date
        itemName
        quantity
        type
        reason
      }
    }
  }
`;

// Query to get staff performance report
export const GET_STAFF_REPORT = `
  query GetStaffReport($input: StaffReportInput!) {
    staffReport(input: $input) {
      summary {
        totalEmployees
        totalHoursWorked
        totalSalesHandled {
          amount
          currency
        }
      }
      employeePerformance {
        employeeId
        employeeName
        hoursWorked
        ordersHandled
        salesGenerated {
          amount
          currency
        }
        averageOrderValue {
          amount
          currency
        }
        customerRating
      }
      attendance {
        employeeId
        employeeName
        scheduledShifts
        attendedShifts
        lateArrivals
        earlyDepartures
      }
    }
  }
`;

// Query to get customer analytics
export const GET_CUSTOMER_ANALYTICS = `
  query GetCustomerAnalytics($input: CustomerAnalyticsInput!) {
    customerAnalytics(input: $input) {
      summary {
        totalCustomers
        newCustomers
        returningCustomers
        averageLifetimeValue {
          amount
          currency
        }
      }
      topCustomers {
        customerId
        customerName
        totalOrders
        totalSpent {
          amount
          currency
        }
        lastOrderDate
      }
      customerSegments {
        tier
        count
        totalRevenue {
          amount
          currency
        }
      }
      orderFrequency {
        range
        customerCount
      }
      retentionRate {
        period
        rate
      }
    }
  }
`;

// Query to get peak hours analysis
export const GET_PEAK_HOURS_ANALYSIS = `
  query GetPeakHoursAnalysis($branchId: ID!, $startDate: String!, $endDate: String!) {
    peakHoursAnalysis(branchId: $branchId, startDate: $startDate, endDate: $endDate) {
      hourlyData {
        hour
        orderCount
        revenue {
          amount
          currency
        }
        averageWaitTime
      }
      peakHours {
        hour
        dayOfWeek
        averageOrders
      }
      recommendations {
        hour
        suggestedStaffing
        reason
      }
    }
  }
`;

// Query to get dashboard metrics
export const GET_DASHBOARD_METRICS = `
  query GetDashboardMetrics($branchId: ID, $period: TimePeriod!) {
    dashboardMetrics(branchId: $branchId, period: $period) {
      revenue {
        current {
          amount
          currency
        }
        previous {
          amount
          currency
        }
        changePercent
      }
      orders {
        current
        previous
        changePercent
      }
      averageOrderValue {
        current {
          amount
          currency
        }
        previous {
          amount
          currency
        }
        changePercent
      }
      activeOrders
      availableTables
      occupancyRate
      popularItems {
        name
        orderCount
        trend
      }
      recentOrders {
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
  }
`;

// Query to generate custom report
export const GENERATE_CUSTOM_REPORT = `
  query GenerateCustomReport($input: CustomReportInput!) {
    generateCustomReport(input: $input) {
      id
      name
      type
      generatedAt
      format
      dataUrl
      summary
    }
  }
`;

// Query to export report data
export const EXPORT_REPORT = `
  query ExportReport($reportType: ReportType!, $input: ReportInput!, $format: ExportFormat!) {
    exportReport(reportType: $reportType, input: $input, format: $format) {
      downloadUrl
      expiresAt
    }
  }
`;

// Query to get menu item performance
export const GET_MENU_ITEM_PERFORMANCE = `
  query GetMenuItemPerformance($input: MenuItemPerformanceInput!) {
    menuItemPerformance(input: $input) {
      items {
        menuItemId
        name
        category
        orderCount
        revenue {
          amount
          currency
        }
        profitMargin
        averageRating
        trend
      }
      insights {
        underperforming {
          itemId
          itemName
          reason
        }
        topPerforming {
          itemId
          itemName
          metric
        }
      }
    }
  }
`;

// Query to get financial summary
export const GET_FINANCIAL_SUMMARY = `
  query GetFinancialSummary($branchId: ID, $startDate: String!, $endDate: String!) {
    financialSummary(branchId: $branchId, startDate: $startDate, endDate: $endDate) {
      revenue {
        gross {
          amount
          currency
        }
        net {
          amount
          currency
        }
      }
      costs {
        cogs {
          amount
          currency
        }
        labor {
          amount
          currency
        }
        overhead {
          amount
          currency
        }
      }
      profitability {
        grossProfit {
          amount
          currency
        }
        grossMargin
        netProfit {
          amount
          currency
        }
        netMargin
      }
      taxes {
        collected {
          amount
          currency
        }
        owed {
          amount
          currency
        }
      }
    }
  }
`;

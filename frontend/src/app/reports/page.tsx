'use client';

import { AppLayout } from '@/components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ReportsPage() {
  // Mock data
  const salesData = {
    today: {
      revenue: 62275.00,
      orders: 24,
      avgOrderValue: 2594.79,
      change: '+12%',
      positive: true,
    },
    week: {
      revenue: 422512.50,
      orders: 156,
      avgOrderValue: 2708.41,
      change: '+8%',
      positive: true,
    },
    month: {
      revenue: 1784037.50,
      orders: 645,
      avgOrderValue: 2765.95,
      change: '-3%',
      positive: false,
    },
  };

  const topSellingItems = [
    { name: 'Margherita Pizza', quantity: 45, revenue: 29227.50 },
    { name: 'Caesar Salad', quantity: 38, revenue: 17081.00 },
    { name: 'Pasta Carbonara', quantity: 32, revenue: 23984.00 },
    { name: 'Chicken Wings', quantity: 28, revenue: 16786.00 },
    { name: 'Tiramisu', quantity: 25, revenue: 8737.50 },
  ];

  const inventoryStatus = [
    { item: 'Tomatoes', current: 15, minimum: 20, status: 'low', unit: 'kg' },
    { item: 'Mozzarella Cheese', current: 8, minimum: 10, status: 'low', unit: 'kg' },
    { item: 'Pasta', current: 35, minimum: 15, status: 'good', unit: 'kg' },
    { item: 'Chicken Breast', current: 22, minimum: 12, status: 'good', unit: 'kg' },
    { item: 'Lettuce', current: 18, minimum: 10, status: 'good', unit: 'heads' },
  ];

  const salesByCategory = [
    { category: 'Main Course', orders: 156, revenue: 117022.00 },
    { category: 'Appetizer', orders: 98, revenue: 44051.00 },
    { category: 'Dessert', orders: 67, revenue: 23416.50 },
    { category: 'Beverage', orders: 124, revenue: 18538.00 },
  ];

  // Chart data - Weekly revenue trend
  const weeklyRevenueData = [
    { day: 'Mon', revenue: 58420.00, orders: 87 },
    { day: 'Tue', revenue: 62150.00, orders: 95 },
    { day: 'Wed', revenue: 55890.00, orders: 82 },
    { day: 'Thu', revenue: 68230.00, orders: 103 },
    { day: 'Fri', revenue: 79850.00, orders: 122 },
    { day: 'Sat', revenue: 94320.00, orders: 145 },
    { day: 'Sun', revenue: 87652.50, orders: 131 },
  ];

  // Chart data - Sales by category for pie chart
  const categoryPieData = salesByCategory.map(cat => ({
    name: cat.category,
    value: cat.revenue,
  }));

  // Chart colors
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  // Chart data - Hourly sales distribution
  const hourlySalesData = [
    { hour: '9AM', orders: 12, revenue: 15240.00 },
    { hour: '10AM', orders: 18, revenue: 22890.00 },
    { hour: '11AM', orders: 28, revenue: 35620.00 },
    { hour: '12PM', orders: 45, revenue: 57230.00 },
    { hour: '1PM', orders: 52, revenue: 66140.00 },
    { hour: '2PM', orders: 38, revenue: 48320.00 },
    { hour: '3PM', orders: 22, revenue: 27980.00 },
    { hour: '4PM', orders: 15, revenue: 19050.00 },
    { hour: '5PM', orders: 25, revenue: 31750.00 },
    { hour: '6PM', orders: 48, revenue: 61020.00 },
    { hour: '7PM', orders: 58, revenue: 73740.00 },
    { hour: '8PM', orders: 55, revenue: 69950.00 },
    { hour: '9PM', orders: 42, revenue: 53340.00 },
    { hour: '10PM', orders: 27, revenue: 34290.00 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-500 mt-1">Business insights and performance metrics</p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sales">Sales Reports</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Sales Reports Tab */}
          <TabsContent value="sales" className="space-y-6">
            {/* Time Period Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Today
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold">
                    ₱{salesData.today.revenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {salesData.today.orders} orders
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    {salesData.today.change}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold">
                    ₱{salesData.week.revenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {salesData.week.orders} orders
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    {salesData.week.change}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    This Month
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold">
                    ₱{salesData.month.revenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {salesData.month.orders} orders
                  </div>
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <TrendingDown className="h-4 w-4" />
                    {salesData.month.change}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hourly Sales & Weekly Revenue - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Sales Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={hourlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue (₱)" />
                      <Bar yAxisId="right" dataKey="orders" fill="#10b981" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => `₱${value.toFixed(2)}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Category Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props: any) =>
                          `${props.name}: ${(props.percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `₱${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => `₱${value.toFixed(2)}`}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Selling Items */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead className="text-right">Quantity Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSellingItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₱{item.revenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Avg Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesByCategory.map((cat, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{cat.category}</TableCell>
                        <TableCell className="text-right">{cat.orders}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₱{cat.revenue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱{(cat.revenue / cat.orders).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Current Stock</TableHead>
                      <TableHead className="text-right">Minimum Level</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryStatus.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell className="text-right">
                          {item.current} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.minimum} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.status === 'low' ? (
                            <span className="text-red-600 font-medium">Low Stock</span>
                          ) : (
                            <span className="text-green-600 font-medium">Good</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Avg Order Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₱2,708.50</div>
                  <p className="text-xs text-green-600 mt-1">+5% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Table Turnover
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3.2x</div>
                  <p className="text-xs text-gray-500 mt-1">Per day average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Peak Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">6-8 PM</div>
                  <p className="text-xs text-gray-500 mt-1">Highest traffic</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Customer Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4.7/5</div>
                  <p className="text-xs text-green-600 mt-1">+0.3 from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

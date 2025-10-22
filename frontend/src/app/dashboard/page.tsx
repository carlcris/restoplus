'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layouts/AppLayout';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your restaurant operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders Today</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue Today</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₱62,250</div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8/20</div>
              <p className="text-xs text-gray-500 mt-1">12 tables available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-xs text-orange-600 mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/orders/new">
                <Button className="h-24 w-full" variant="outline">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">➕</span>
                    <span>New Order</span>
                  </div>
                </Button>
              </Link>
              <Link href="/tables">
                <Button className="h-24 w-full" variant="outline">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">🪑</span>
                    <span>View Tables</span>
                  </div>
                </Button>
              </Link>
              <Link href="/menu">
                <Button className="h-24 w-full" variant="outline">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">🍽️</span>
                    <span>Menu</span>
                  </div>
                </Button>
              </Link>
              <Link href="/reports">
                <Button className="h-24 w-full" variant="outline">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">📊</span>
                    <span>Reports</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">Order #{1000 + i}</p>
                      <p className="text-sm text-gray-500">Table {i * 2}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₱{(i * 1275).toFixed(2)}</p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        In Progress
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Margherita Pizza', 'Caesar Salad', 'Pasta Carbonara'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{item}</p>
                      <p className="text-sm text-gray-500">{15 - i * 3} orders today</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₱{((15 - i * 3) * 650).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

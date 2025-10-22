'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Eye, Edit, X, User, MapPin, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

type OrderStatus = 'draft' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
type OrderType = 'dine-in' | 'takeout' | 'delivery';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  items: number;
  itemDetails: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  specialNotes?: string;
  createdAt: string;
  serverName: string;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#1001',
    type: 'dine-in',
    status: 'in_progress',
    tableNumber: '2',
    items: 3,
    itemDetails: [
      { id: '1-1', name: 'Caesar Salad', quantity: 1, price: 12.50 },
      { id: '1-2', name: 'Grilled Salmon', quantity: 1, price: 24.00, notes: 'Medium rare' },
      { id: '1-3', name: 'Iced Tea', quantity: 1, price: 3.50 },
    ],
    subtotal: 40.00,
    tax: 5.50,
    total: 45.50,
    specialNotes: 'Customer has peanut allergy',
    createdAt: '2025-10-21 10:30',
    serverName: 'John Doe',
  },
  {
    id: '2',
    orderNumber: '#1002',
    type: 'dine-in',
    status: 'in_progress',
    tableNumber: '4',
    items: 5,
    itemDetails: [
      { id: '2-1', name: 'Wagyu Steak', quantity: 2, price: 45.00 },
      { id: '2-2', name: 'Lobster Bisque', quantity: 2, price: 18.00 },
      { id: '2-3', name: 'Red Wine (Glass)', quantity: 1, price: 12.00 },
    ],
    subtotal: 120.00,
    tax: 8.75,
    total: 128.75,
    createdAt: '2025-10-21 10:15',
    serverName: 'Jane Smith',
  },
  {
    id: '3',
    orderNumber: '#1003',
    type: 'takeout',
    status: 'confirmed',
    customerName: 'Alice Johnson',
    customerPhone: '+1-555-0123',
    items: 2,
    itemDetails: [
      { id: '3-1', name: 'Margherita Pizza', quantity: 1, price: 16.00 },
      { id: '3-2', name: 'Tiramisu', quantity: 1, price: 8.00 },
    ],
    subtotal: 24.00,
    tax: 8.50,
    total: 32.50,
    specialNotes: 'Extra napkins please',
    createdAt: '2025-10-21 11:00',
    serverName: 'John Doe',
  },
  {
    id: '4',
    orderNumber: '#1004',
    type: 'delivery',
    status: 'confirmed',
    customerName: 'Bob Williams',
    customerPhone: '+1-555-0456',
    deliveryAddress: '123 Main St, Apt 4B',
    items: 4,
    itemDetails: [
      { id: '4-1', name: 'BBQ Chicken Pizza', quantity: 1, price: 18.00 },
      { id: '4-2', name: 'Buffalo Wings', quantity: 1, price: 14.00 },
      { id: '4-3', name: 'Garlic Bread', quantity: 1, price: 6.00 },
      { id: '4-4', name: 'Coke (2L)', quantity: 1, price: 4.00 },
    ],
    subtotal: 42.00,
    tax: 25.25,
    total: 67.25,
    specialNotes: 'Ring doorbell twice',
    createdAt: '2025-10-21 11:15',
    serverName: 'Jane Smith',
  },
  {
    id: '5',
    orderNumber: '#1005',
    type: 'dine-in',
    status: 'completed',
    tableNumber: '8',
    items: 2,
    itemDetails: [
      { id: '5-1', name: 'Eggs Benedict', quantity: 2, price: 14.00 },
    ],
    subtotal: 28.00,
    tax: 0,
    total: 28.00,
    createdAt: '2025-10-21 09:45',
    serverName: 'John Doe',
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    status: OrderStatus;
    specialNotes: string;
  }>({ status: 'draft', specialNotes: '' });

  // Handler functions for actions
  const handleViewOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setViewDialogOpen(true);
    }
  };

  const handleEditOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setEditFormData({
        status: order.status,
        specialNotes: order.specialNotes || '',
      });
      setEditDialogOpen(true);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setCancelDialogOpen(true);
    }
  };

  const confirmCancelOrder = () => {
    if (selectedOrder) {
      setOrders(
        orders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: 'cancelled' } : o
        )
      );
      setCancelDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const saveOrderEdit = () => {
    if (selectedOrder) {
      setOrders(
        orders.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                status: editFormData.status,
                specialNotes: editFormData.specialNotes,
              }
            : o
        )
      );
      setEditDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber?.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, { variant: any; label: string }> = {
      draft: { variant: 'outline', label: 'Draft' },
      confirmed: { variant: 'secondary', label: 'Confirmed' },
      in_progress: { variant: 'default', label: 'In Progress' },
      completed: { variant: 'default', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    };
    return variants[status];
  };

  const getTypeBadge = (type: OrderType) => {
    const labels: Record<OrderType, string> = {
      'dine-in': 'Dine In',
      takeout: 'Takeout',
      delivery: 'Delivery',
    };
    return labels[type];
  };

  const stats = {
    total: orders.length,
    active: orders.filter((o) => o.status === 'in_progress' || o.status === 'confirmed')
      .length,
    completed: orders.filter((o) => o.status === 'completed').length,
    revenue: orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1">Manage all restaurant orders</p>
          </div>
          <Link href="/orders/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-gray-500">Total Orders Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
              <p className="text-sm text-gray-500">Active Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-sm text-gray-500">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
              <p className="text-sm text-gray-500">Revenue Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('confirmed')}
                  >
                    Confirmed
                  </Button>
                  <Button
                    variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('in_progress')}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={statusFilter === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('completed')}
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Table/Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTypeBadge(order.type)}</Badge>
                      </TableCell>
                      <TableCell>
                        {order.type === 'dine-in' ? (
                          <span>Table {order.tableNumber}</span>
                        ) : (
                          <span>{order.customerName}</span>
                        )}
                      </TableCell>
                      <TableCell>{order.items} items</TableCell>
                      <TableCell className="font-medium">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </TableCell>
                      <TableCell>{order.serverName}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {order.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewOrder(order.id)}
                            title="View Order"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status !== 'completed' && order.status !== 'cancelled' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditOrder(order.id)}
                                title="Edit Order"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCancelOrder(order.id)}
                                title="Cancel Order"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Order Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order {selectedOrder?.orderNumber}</DialogTitle>
              <DialogDescription>Order details and items</DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4 py-4">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Type</Label>
                    <div className="mt-1 font-medium capitalize">
                      {selectedOrder.type.replace('-', ' ')}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Status</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusBadge(selectedOrder.status).variant}>
                        {getStatusBadge(selectedOrder.status).label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Customer/Table Info */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedOrder.type === 'dine-in' ? (
                    <div>
                      <Label className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Table
                      </Label>
                      <div className="mt-1 font-medium">Table {selectedOrder.tableNumber}</div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label className="text-sm text-gray-500 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Customer
                        </Label>
                        <div className="mt-1 font-medium">{selectedOrder.customerName}</div>
                        <div className="text-sm text-gray-500">{selectedOrder.customerPhone}</div>
                      </div>
                    </>
                  )}
                  <div>
                    <Label className="text-sm text-gray-500 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Server
                    </Label>
                    <div className="mt-1 font-medium">{selectedOrder.serverName}</div>
                  </div>
                </div>

                {selectedOrder.deliveryAddress && (
                  <div>
                    <Label className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Delivery Address
                    </Label>
                    <div className="mt-1 font-medium">{selectedOrder.deliveryAddress}</div>
                  </div>
                )}

                <div>
                  <Label className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Order Time
                  </Label>
                  <div className="mt-1 font-medium">{selectedOrder.createdAt}</div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4">
                  <Label className="text-base font-semibold mb-3 block">Order Items</Label>
                  <div className="space-y-3">
                    {selectedOrder.itemDetails.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium">
                            {item.quantity}x {item.name}
                          </div>
                          {item.notes && (
                            <div className="text-sm text-gray-500 italic">{item.notes}</div>
                          )}
                        </div>
                        <div className="font-medium">${(item.quantity * item.price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Notes */}
                {selectedOrder.specialNotes && (
                  <div className="border-t pt-4">
                    <Label className="text-sm text-gray-500">Special Notes</Label>
                    <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                      {selectedOrder.specialNotes}
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="font-medium">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold flex items-center gap-1">
                      <DollarSign className="h-5 w-5" />
                      {selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              {selectedOrder?.status !== 'completed' && selectedOrder?.status !== 'cancelled' && (
                <Button onClick={() => {
                  setViewDialogOpen(false);
                  if (selectedOrder) handleEditOrder(selectedOrder.id);
                }}>
                  Edit Order
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Order Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Order {selectedOrder?.orderNumber}</DialogTitle>
              <DialogDescription>Update order status and notes</DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="status">Order Status</Label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value: OrderStatus) =>
                      setEditFormData({ ...editFormData, status: value })
                    }
                  >
                    <SelectTrigger id="status" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Special Notes</Label>
                  <Textarea
                    id="notes"
                    value={editFormData.specialNotes}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, specialNotes: e.target.value })
                    }
                    placeholder="Add any special notes or instructions..."
                    className="mt-2"
                    rows={4}
                  />
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="font-medium capitalize">
                        {selectedOrder.type.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Items</span>
                      <span className="font-medium">{selectedOrder.items} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total</span>
                      <span className="font-medium">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveOrderEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Order Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order?
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="py-4">
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Order Number</span>
                    <span className="font-medium">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Type</span>
                    <span className="font-medium capitalize">
                      {selectedOrder.type.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="font-medium">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-red-600">
                  This action cannot be undone. The order will be marked as cancelled.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                Keep Order
              </Button>
              <Button variant="destructive" onClick={confirmCancelOrder}>
                Cancel Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

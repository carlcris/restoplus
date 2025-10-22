'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard,
  Banknote,
  Split,
  Receipt,
  CheckCircle2,
  XCircle,
  Wallet,
  Search,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type PaymentMethod = 'cash' | 'card' | 'split';
type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface SplitPayment {
  method: 'cash' | 'card';
  amount: number;
}

// Mock pending orders awaiting payment - expanded for demo
const mockPendingOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#1001',
    tableNumber: '2',
    items: [
      { id: '1', name: 'Margherita Pizza', quantity: 1, price: 649.50 },
      { id: '2', name: 'Caesar Salad', quantity: 1, price: 449.50 },
      { id: '3', name: 'Coca Cola', quantity: 2, price: 149.50 },
    ],
    subtotal: 1398.00,
    tax: 140.00,
    discount: 0,
    total: 1538.00,
  },
  {
    id: '2',
    orderNumber: '#1002',
    tableNumber: '4',
    items: [
      { id: '4', name: 'Pasta Carbonara', quantity: 2, price: 749.50 },
      { id: '5', name: 'Chicken Wings', quantity: 1, price: 599.50 },
      { id: '6', name: 'Tiramisu', quantity: 2, price: 349.50 },
    ],
    subtotal: 2797.50,
    tax: 280.00,
    discount: 280.00,
    total: 2797.50,
  },
  {
    id: '3',
    orderNumber: '#1003',
    customerName: 'Alice Johnson',
    items: [
      { id: '7', name: 'Garlic Bread', quantity: 1, price: 299.50 },
      { id: '8', name: 'Pasta Carbonara', quantity: 1, price: 749.50 },
    ],
    subtotal: 1049.00,
    tax: 105.00,
    discount: 0,
    total: 1154.00,
  },
  {
    id: '4',
    orderNumber: '#1004',
    tableNumber: '7',
    items: [
      { id: '9', name: 'Steak', quantity: 2, price: 1299.50 },
      { id: '10', name: 'House Wine', quantity: 1, price: 899.50 },
    ],
    subtotal: 3498.50,
    tax: 350.00,
    discount: 0,
    total: 3848.50,
  },
  {
    id: '5',
    orderNumber: '#1005',
    tableNumber: '12',
    items: [
      { id: '11', name: 'Sushi Platter', quantity: 1, price: 1599.50 },
    ],
    subtotal: 1599.50,
    tax: 160.00,
    discount: 0,
    total: 1759.50,
  },
  {
    id: '6',
    orderNumber: '#1006',
    tableNumber: '5',
    items: [
      { id: '12', name: 'Burger', quantity: 3, price: 549.50 },
      { id: '13', name: 'Fries', quantity: 3, price: 199.50 },
    ],
    subtotal: 2247.00,
    tax: 225.00,
    discount: 0,
    total: 2472.00,
  },
  {
    id: '7',
    orderNumber: '#1007',
    customerName: 'Bob Smith',
    items: [
      { id: '14', name: 'Coffee', quantity: 2, price: 149.50 },
      { id: '15', name: 'Croissant', quantity: 2, price: 199.50 },
    ],
    subtotal: 698.00,
    tax: 70.00,
    discount: 0,
    total: 768.00,
  },
  {
    id: '8',
    orderNumber: '#1008',
    tableNumber: '15',
    items: [
      { id: '16', name: 'Seafood Paella', quantity: 1, price: 1499.50 },
      { id: '17', name: 'Sangria', quantity: 1, price: 699.50 },
    ],
    subtotal: 2199.00,
    tax: 220.00,
    discount: 0,
    total: 2419.00,
  },
];

export default function PaymentsPage() {
  const router = useRouter();
  const [pendingOrders, setPendingOrders] = useState<Order[]>(mockPendingOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'table' | 'takeout'>('all');
  const [sortBy, setSortBy] = useState<'orderNumber' | 'total' | 'table'>('orderNumber');

  // Cash payment
  const [cashReceived, setCashReceived] = useState<string>('');

  // Card payment
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Split payment
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([]);
  const [splitMethod, setSplitMethod] = useState<'cash' | 'card'>('cash');
  const [splitAmount, setSplitAmount] = useState<string>('');

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsPaymentDialogOpen(true);
    setPaymentStatus('pending');
    setCashReceived('');
    setCardNumber('');
    setCardHolder('');
    setSplitPayments([]);
  };

  const handleCashPayment = () => {
    if (!selectedOrder || !cashReceived) return;

    const received = parseFloat(cashReceived);
    if (received < selectedOrder.total) {
      alert('Insufficient cash received');
      return;
    }

    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('completed');
      setTimeout(() => {
        setPendingOrders(pendingOrders.filter((o) => o.id !== selectedOrder.id));
        setIsPaymentDialogOpen(false);
        setSelectedOrder(null);
      }, 2000);
    }, 1000);
  };

  const handleCardPayment = () => {
    if (!selectedOrder || !cardNumber || !cardHolder) {
      alert('Please fill in all card details');
      return;
    }

    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('completed');
      setTimeout(() => {
        setPendingOrders(pendingOrders.filter((o) => o.id !== selectedOrder.id));
        setIsPaymentDialogOpen(false);
        setSelectedOrder(null);
      }, 2000);
    }, 1500);
  };

  const addSplitPayment = () => {
    if (!splitAmount || parseFloat(splitAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(splitAmount);
    const totalSplit = splitPayments.reduce((sum, p) => sum + p.amount, 0);

    if (selectedOrder && totalSplit + amount > selectedOrder.total) {
      alert('Split amount exceeds order total');
      return;
    }

    setSplitPayments([...splitPayments, { method: splitMethod, amount }]);
    setSplitAmount('');
  };

  const removeSplitPayment = (index: number) => {
    setSplitPayments(splitPayments.filter((_, i) => i !== index));
  };

  const handleSplitPayment = () => {
    if (!selectedOrder) return;

    const totalSplit = splitPayments.reduce((sum, p) => sum + p.amount, 0);
    if (Math.abs(totalSplit - selectedOrder.total) > 0.01) {
      alert('Split payments must equal order total');
      return;
    }

    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('completed');
      setTimeout(() => {
        setPendingOrders(pendingOrders.filter((o) => o.id !== selectedOrder.id));
        setIsPaymentDialogOpen(false);
        setSelectedOrder(null);
      }, 2000);
    }, 1500);
  };

  const calculateChange = () => {
    if (!selectedOrder || !cashReceived) return 0;
    const received = parseFloat(cashReceived);
    return received - selectedOrder.total;
  };

  const getSplitTotal = () => {
    return splitPayments.reduce((sum, p) => sum + p.amount, 0);
  };

  const getSplitRemaining = () => {
    if (!selectedOrder) return 0;
    return selectedOrder.total - getSplitTotal();
  };

  // Filter and sort orders
  const filteredAndSortedOrders = pendingOrders
    .filter((order) => {
      // Filter by type
      if (filterType === 'table' && !order.tableNumber) return false;
      if (filterType === 'takeout' && order.tableNumber) return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(query) ||
          order.tableNumber?.toLowerCase().includes(query) ||
          order.customerName?.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'orderNumber') {
        return a.orderNumber.localeCompare(b.orderNumber);
      } else if (sortBy === 'total') {
        return b.total - a.total;
      } else if (sortBy === 'table') {
        const aTable = a.tableNumber || '999';
        const bTable = b.tableNumber || '999';
        return aTable.localeCompare(bTable);
      }
      return 0;
    });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Processing</h1>
          <p className="text-gray-500 mt-1">Process customer payments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Receipt className="h-6 w-6 text-orange-700" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingOrders.length}</div>
                  <p className="text-sm text-gray-500">Pending Payments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Banknote className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    ₱{pendingOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-500">Total Due</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-sm text-gray-500">Completed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Wallet className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <div className="text-2xl font-bold">₱1,245.50</div>
                  <p className="text-sm text-gray-500">Today's Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Orders Awaiting Payment ({filteredAndSortedOrders.length})</CardTitle>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:flex-initial sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search order, table..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {/* Filter by type */}
                <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="table">Dine-in</SelectItem>
                    <SelectItem value="takeout">Takeout</SelectItem>
                  </SelectContent>
                </Select>
                {/* Sort by */}
                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="w-[140px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orderNumber">Order #</SelectItem>
                    <SelectItem value="table">Table #</SelectItem>
                    <SelectItem value="total">Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Table / Customer</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No pending payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSelectOrder(order)}
                      >
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>
                          {order.tableNumber ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-50">
                                Table {order.tableNumber}
                              </Badge>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-50">
                                Takeout
                              </Badge>
                              <span className="text-sm">{order.customerName}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{order.items.length}</TableCell>
                        <TableCell className="text-right">₱{order.subtotal.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₱{order.tax.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {order.discount > 0 ? (
                            <span className="text-green-600">-₱{order.discount.toFixed(2)}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ₱{order.total.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectOrder(order);
                            }}
                          >
                            Process
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Process Payment - {selectedOrder?.orderNumber}</DialogTitle>
              <DialogDescription>
                {selectedOrder?.tableNumber
                  ? `Table ${selectedOrder.tableNumber}`
                  : selectedOrder?.customerName}
              </DialogDescription>
            </DialogHeader>

            {paymentStatus === 'pending' && selectedOrder && (
              <div className="space-y-4">
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Due</span>
                      <span>₱{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method Tabs */}
                <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="cash">
                      <Banknote className="mr-2 h-4 w-4" />
                      Cash
                    </TabsTrigger>
                    <TabsTrigger value="card">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="split">
                      <Split className="mr-2 h-4 w-4" />
                      Split
                    </TabsTrigger>
                  </TabsList>

                  {/* Cash Payment */}
                  <TabsContent value="cash" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Cash Received</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                      />
                    </div>
                    {cashReceived && parseFloat(cashReceived) >= selectedOrder.total && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-green-900">Change Due</span>
                          <span className="text-2xl font-bold text-green-700">
                            ₱{calculateChange().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                    <Button
                      className="w-full"
                      onClick={handleCashPayment}
                      disabled={!cashReceived || parseFloat(cashReceived) < selectedOrder.total}
                    >
                      Complete Payment
                    </Button>
                  </TabsContent>

                  {/* Card Payment */}
                  <TabsContent value="card" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Card Holder Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input placeholder="123" maxLength={3} />
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleCardPayment}
                      disabled={!cardNumber || !cardHolder}
                    >
                      Process Card Payment
                    </Button>
                  </TabsContent>

                  {/* Split Payment */}
                  <TabsContent value="split" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Select value={splitMethod} onValueChange={(v: any) => setSplitMethod(v)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Amount"
                          value={splitAmount}
                          onChange={(e) => setSplitAmount(e.target.value)}
                        />
                        <Button onClick={addSplitPayment}>Add</Button>
                      </div>

                      {splitPayments.length > 0 && (
                        <div className="space-y-2">
                          {splitPayments.map((payment, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                {payment.method === 'cash' ? (
                                  <Banknote className="h-4 w-4" />
                                ) : (
                                  <CreditCard className="h-4 w-4" />
                                )}
                                <span className="capitalize">{payment.method}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-medium">₱{payment.amount.toFixed(2)}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeSplitPayment(index)}
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span>Total Paid</span>
                          <span className="font-medium">₱{getSplitTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining</span>
                          <span className="font-medium">₱{getSplitRemaining().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleSplitPayment}
                      disabled={Math.abs(getSplitRemaining()) > 0.01}
                    >
                      Complete Split Payment
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {paymentStatus === 'processing' && (
              <div className="py-12 flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                <p className="text-lg font-medium">Processing payment...</p>
              </div>
            )}

            {paymentStatus === 'completed' && (
              <div className="py-12 flex flex-col items-center gap-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <p className="text-xl font-bold text-green-700">Payment Successful!</p>
                <p className="text-gray-600">Receipt has been generated</p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="py-12 flex flex-col items-center gap-4">
                <div className="p-4 bg-red-100 rounded-full">
                  <XCircle className="h-16 w-16 text-red-600" />
                </div>
                <p className="text-xl font-bold text-red-700">Payment Failed</p>
                <p className="text-gray-600">Please try again</p>
              </div>
            )}

            {paymentStatus === 'pending' && (
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

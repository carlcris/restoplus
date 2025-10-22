'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { Users, Clock, DollarSign } from 'lucide-react';

type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  section: string;
  currentOrderId?: string;
  orderTotal?: number;
  occupiedTime?: string;
  serverName?: string;
}

// Mock data
const mockTables: Table[] = [
  {
    id: '1',
    number: '1',
    capacity: 2,
    status: 'available',
    section: 'Main Floor',
  },
  {
    id: '2',
    number: '2',
    capacity: 4,
    status: 'occupied',
    section: 'Main Floor',
    currentOrderId: '#1001',
    orderTotal: 45.5,
    occupiedTime: '25 min',
    serverName: 'John Doe',
  },
  {
    id: '3',
    number: '3',
    capacity: 2,
    status: 'reserved',
    section: 'Main Floor',
  },
  {
    id: '4',
    number: '4',
    capacity: 6,
    status: 'occupied',
    section: 'Main Floor',
    currentOrderId: '#1002',
    orderTotal: 128.75,
    occupiedTime: '45 min',
    serverName: 'Jane Smith',
  },
  {
    id: '5',
    number: '5',
    capacity: 4,
    status: 'available',
    section: 'Patio',
  },
  {
    id: '6',
    number: '6',
    capacity: 2,
    status: 'cleaning',
    section: 'Patio',
  },
  {
    id: '7',
    number: '7',
    capacity: 8,
    status: 'reserved',
    section: 'Private Room',
  },
  {
    id: '8',
    number: '8',
    capacity: 4,
    status: 'available',
    section: 'Main Floor',
  },
];

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-100/50 hover:bg-green-100 text-green-800 border-2 border-green-200/50 shadow-sm';
      case 'occupied':
        return 'bg-rose-100/50 hover:bg-rose-100 text-rose-800 border-2 border-rose-200/50 shadow-sm';
      case 'reserved':
        return 'bg-yellow-100/50 hover:bg-yellow-100 text-yellow-800 border-2 border-yellow-200/50 shadow-sm';
      case 'cleaning':
        return 'bg-gray-100/50 hover:bg-gray-100 text-gray-700 border-2 border-gray-200/50 shadow-sm';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: TableStatus) => {
    const variants: Record<TableStatus, any> = {
      available: 'default',
      occupied: 'destructive',
      reserved: 'secondary',
      cleaning: 'outline',
    };
    return variants[status] || 'default';
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (newStatus: TableStatus) => {
    if (selectedTable) {
      setTables(
        tables.map((t) =>
          t.id === selectedTable.id ? { ...t, status: newStatus } : t
        )
      );
      setSelectedTable({ ...selectedTable, status: newStatus });
    }
  };

  const tablesBySection = tables.reduce((acc, table) => {
    if (!acc[table.section]) {
      acc[table.section] = [];
    }
    acc[table.section].push(table);
    return acc;
  }, {} as Record<string, Table[]>);

  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-500 mt-1">Monitor and manage restaurant tables</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-gray-500">Total Tables</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-700">{stats.available}</div>
              <p className="text-sm text-gray-500">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-rose-700">{stats.occupied}</div>
              <p className="text-sm text-gray-500">Occupied</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-700">{stats.reserved}</div>
              <p className="text-sm text-gray-500">Reserved</p>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-50 border-2 border-emerald-200 rounded shadow-sm"></div>
                <span className="text-sm font-medium text-emerald-900">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-50 border-2 border-blue-200 rounded shadow-sm"></div>
                <span className="text-sm font-medium text-blue-900">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-50 border-2 border-amber-200 rounded shadow-sm"></div>
                <span className="text-sm font-medium text-amber-900">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-zinc-50 border-2 border-zinc-200 rounded shadow-sm"></div>
                <span className="text-sm font-medium text-zinc-900">Cleaning</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floor Plan by Section */}
        {Object.entries(tablesBySection).map(([section, sectionTables]) => (
          <Card key={section}>
            <CardHeader>
              <CardTitle>{section}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {sectionTables.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => handleTableClick(table)}
                    className={`${getStatusColor(
                      table.status
                    )} p-6 rounded-lg transition-all transform hover:scale-105 relative`}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">Table {table.number}</div>
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Users className="h-3 w-3" />
                        {table.capacity}
                      </div>
                      {table.status === 'occupied' && table.occupiedTime && (
                        <div className="mt-2 text-xs flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" />
                          {table.occupiedTime}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Table Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Table {selectedTable?.number}</DialogTitle>
              <DialogDescription>
                Manage table status and view details
              </DialogDescription>
            </DialogHeader>

            {selectedTable && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Capacity</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{selectedTable.capacity} people</span>
                    </div>
                  </div>
                  <div>
                    <Label>Section</Label>
                    <div className="mt-1 font-medium">{selectedTable.section}</div>
                  </div>
                </div>

                <div>
                  <Label>Status</Label>
                  <div className="mt-2">
                    <Badge variant={getStatusBadge(selectedTable.status)}>
                      {selectedTable.status.charAt(0).toUpperCase() +
                        selectedTable.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                {selectedTable.status === 'occupied' && (
                  <>
                    <div className="border-t pt-4">
                      <Label className="text-base font-semibold">Current Order</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Order ID</span>
                          <span className="font-medium">{selectedTable.currentOrderId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Server</span>
                          <span className="font-medium">{selectedTable.serverName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Duration</span>
                          <span className="font-medium">{selectedTable.occupiedTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Current Total</span>
                          <span className="text-lg font-bold flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {selectedTable.orderTotal?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="border-t pt-4">
                  <Label className="text-base font-semibold mb-3 block">
                    Change Status
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={
                        selectedTable.status === 'available' ? 'default' : 'outline'
                      }
                      onClick={() => handleStatusChange('available')}
                      className="w-full"
                    >
                      Available
                    </Button>
                    <Button
                      variant={
                        selectedTable.status === 'occupied' ? 'default' : 'outline'
                      }
                      onClick={() => handleStatusChange('occupied')}
                      className="w-full"
                    >
                      Occupied
                    </Button>
                    <Button
                      variant={
                        selectedTable.status === 'reserved' ? 'default' : 'outline'
                      }
                      onClick={() => handleStatusChange('reserved')}
                      className="w-full"
                    >
                      Reserved
                    </Button>
                    <Button
                      variant={
                        selectedTable.status === 'cleaning' ? 'default' : 'outline'
                      }
                      onClick={() => handleStatusChange('cleaning')}
                      className="w-full"
                    >
                      Cleaning
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              {selectedTable?.status === 'available' && (
                <Button>Start New Order</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

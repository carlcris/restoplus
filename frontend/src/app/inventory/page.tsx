'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Search, Plus, AlertTriangle, TrendingDown, Package, FileDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useInventory } from '@/contexts/InventoryContext';

export default function InventoryPage() {
  const { inventoryItems, addInventoryItem } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Meat',
    currentStock: '',
    minimumStock: '',
    reorderLevel: '',
    unit: 'g',
    unitCost: '',
    supplier: '',
  });

  const handleAddItem = () => {
    setFormData({
      sku: '',
      name: '',
      category: 'Meat',
      currentStock: '',
      minimumStock: '',
      reorderLevel: '',
      unit: 'g',
      unitCost: '',
      supplier: '',
    });
    setAddDialogOpen(true);
  };

  const handleSaveNewItem = () => {
    // Convert units to base units (g for weight, ml for liquid)
    const getBaseUnit = (unit: string) => {
      if (unit === 'KG') return 'g';
      if (unit === 'L') return 'ml';
      if (unit === 'LB') return 'g';
      if (unit === 'GAL') return 'ml';
      if (unit === 'OZ') return 'g';
      return unit; // g, ml, PCS already base units
    };

    const convertToBaseUnit = (value: number, unit: string) => {
      if (unit === 'KG') return value * 1000; // kg to g
      if (unit === 'L') return value * 1000; // L to ml
      if (unit === 'LB') return value * 453.592; // lb to g
      if (unit === 'GAL') return value * 3785.41; // gal to ml
      if (unit === 'OZ') return value * 28.3495; // oz to g
      return value; // already in base unit
    };

    const baseUnit = getBaseUnit(formData.unit);
    const currentStockValue = parseFloat(formData.currentStock);
    const minimumStockValue = parseFloat(formData.minimumStock);
    const reorderLevelValue = parseFloat(formData.reorderLevel);
    const unitCostValue = parseFloat(formData.unitCost);

    addInventoryItem({
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      currentStock: convertToBaseUnit(currentStockValue, formData.unit),
      minimumStock: convertToBaseUnit(minimumStockValue, formData.unit),
      reorderLevel: convertToBaseUnit(reorderLevelValue, formData.unit),
      unit: baseUnit,
      unitCost: {
        amount: unitCostValue / (formData.unit === baseUnit ? 1 : convertToBaseUnit(1, formData.unit)),
        currency: 'PHP'
      },
      lastRestocked: new Date().toISOString().split('T')[0],
      supplier: formData.supplier,
    });
    setAddDialogOpen(false);
  };

  // Format stock display (convert base units to readable format)
  const formatStock = (value: number, unit: string) => {
    if (unit === 'g') {
      if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} kg`;
      }
      return `${value.toFixed(0)} g`;
    }
    if (unit === 'ml') {
      if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} L`;
      }
      return `${value.toFixed(0)} ml`;
    }
    return `${value.toFixed(2)} ${unit}`;
  };

  const getStockStatus = (item: any) => {
    if (item.currentStock < item.minimumStock) {
      return 'critical';
    } else if (item.currentStock < item.reorderLevel) {
      return 'low';
    }
    return 'good';
  };

  const getStockPercentage = (item: any) => {
    return (item.currentStock / item.reorderLevel) * 100;
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

    const status = getStockStatus(item);
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'low' && status === 'low') ||
      (filterStatus === 'critical' && status === 'critical');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockCount = inventoryItems.filter((item) => getStockStatus(item) === 'low').length;
  const criticalStockCount = inventoryItems.filter(
    (item) => getStockStatus(item) === 'critical'
  ).length;
  const totalValue = inventoryItems.reduce(
    (sum, item) => sum + item.currentStock * item.unitCost.amount,
    0
  );

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Track stock levels, manage suppliers, and automate reordering
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current stock value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Need reordering soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalStockCount}</div>
            <p className="text-xs text-muted-foreground">Below minimum level</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Monitor and manage your ingredient stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Meat">Meat</SelectItem>
                <SelectItem value="Vegetables">Vegetables</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
                <SelectItem value="Oils">Oils</SelectItem>
                <SelectItem value="Dry Goods">Dry Goods</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => {
                    const status = getStockStatus(item);
                    const percentage = getStockPercentage(item);

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.sku}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {formatStock(item.currentStock, item.unit)}
                            </div>
                            <Progress value={Math.min(percentage, 100)} className="h-1" />
                            <div className="text-xs text-muted-foreground">
                              Min: {formatStock(item.minimumStock, item.unit)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {status === 'critical' && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Critical
                            </Badge>
                          )}
                          {status === 'low' && (
                            <Badge variant="outline" className="gap-1 border-yellow-600 text-yellow-600">
                              <AlertTriangle className="w-3 h-3" />
                              Low Stock
                            </Badge>
                          )}
                          {status === 'good' && (
                            <Badge variant="outline" className="gap-1 border-green-600 text-green-600">
                              Good
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱{item.unitCost.amount.toFixed(4)}/{item.unit}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₱{(item.currentStock * item.unitCost.amount).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm">{item.supplier}</TableCell>
                        <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Reorder
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Enter the details for the new inventory item
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Row 1: SKU and Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="ING-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Chicken Breast"
                />
              </div>
            </div>

            {/* Row 2: Category and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meat">Meat</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Oils">Oils</SelectItem>
                    <SelectItem value="Dry Goods">Dry Goods</SelectItem>
                    <SelectItem value="Seafood">Seafood</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                    <SelectItem value="Spices">Spices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g (Grams) - for weight</SelectItem>
                    <SelectItem value="KG">KG (Kilogram) - will convert to grams</SelectItem>
                    <SelectItem value="ml">ml (Milliliters) - for liquids</SelectItem>
                    <SelectItem value="L">L (Liter) - will convert to ml</SelectItem>
                    <SelectItem value="PCS">PCS (Pieces) - for countable items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Stock Levels */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  step="0.01"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumStock">Minimum Stock *</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  step="0.01"
                  value={formData.minimumStock}
                  onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Reorder Level *</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  step="0.01"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Row 4: Unit Cost and Supplier */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitCost">Unit Cost (PHP) *</Label>
                <Input
                  id="unitCost"
                  type="number"
                  step="0.01"
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Supplier Name"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveNewItem}
              disabled={
                !formData.sku ||
                !formData.name ||
                !formData.currentStock ||
                !formData.minimumStock ||
                !formData.reorderLevel ||
                !formData.unitCost ||
                !formData.supplier
              }
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AppLayout>
  );
}

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';

export default function MenuPage() {
  const {
    menuItems,
    inventoryItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getRecipeByMenuItemId,
    addRecipe,
    updateRecipe,
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    isAvailable: true,
  });

  const [recipeIngredients, setRecipeIngredients] = useState<
    Array<{ inventoryItemId: string; quantity: string; unit: string }>
  >([]);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      isAvailable: true,
    });
    setRecipeIngredients([]);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price.toString(),
      isAvailable: item.isAvailable,
    });

    // Load existing recipe if available
    const recipe = getRecipeByMenuItemId(item.id);
    if (recipe) {
      setRecipeIngredients(
        recipe.ingredients.map((ing) => ({
          inventoryItemId: ing.inventoryItemId,
          quantity: ing.quantity.toString(),
          unit: ing.unit,
        }))
      );
    } else {
      setRecipeIngredients([]);
    }

    setIsDialogOpen(true);
  };

  const handleSave = () => {
    let menuItemId: string;

    if (editingItem) {
      // Update existing item
      updateMenuItem(editingItem.id, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        isAvailable: formData.isAvailable,
      });
      menuItemId = editingItem.id;
    } else {
      // Add new item
      const newMenuItem = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        isAvailable: formData.isAvailable,
      };
      const addedItem = addMenuItem(newMenuItem);
      menuItemId = addedItem.id;
    }

    // Save recipe if ingredients are defined
    const ingredients = recipeIngredients
      .filter((ing) => ing.inventoryItemId && ing.quantity)
      .map((ing) => ({
        inventoryItemId: ing.inventoryItemId,
        quantity: parseFloat(ing.quantity),
        unit: ing.unit,
      }));

    if (ingredients.length > 0) {
      const existingRecipe = getRecipeByMenuItemId(menuItemId);
      if (existingRecipe) {
        updateRecipe(existingRecipe.id, {
          menuItemId,
          ingredients,
        });
      } else {
        addRecipe({
          menuItemId,
          ingredients,
        });
      }
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      deleteMenuItem(id);
    }
  };

  const handleAddIngredient = () => {
    setRecipeIngredients([
      ...recipeIngredients,
      { inventoryItemId: '', quantity: '', unit: 'g' },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
  };

  const handleUpdateIngredient = (
    index: number,
    field: 'inventoryItemId' | 'quantity' | 'unit',
    value: string
  ) => {
    const updated = [...recipeIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipeIngredients(updated);
  };

  const getIngredientUnit = (inventoryItemId: string) => {
    return inventoryItems.find((item) => item.id === inventoryItemId)?.unit || 'g';
  };

  const getRecipeCost = () => {
    return recipeIngredients.reduce((total, ing) => {
      if (!ing.inventoryItemId || !ing.quantity) return total;
      const item = inventoryItems.find((i) => i.id === ing.inventoryItemId);
      if (item) {
        return total + parseFloat(ing.quantity) * item.unitCost.amount;
      }
      return total;
    }, 0);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-500 mt-1">Manage your restaurant menu items and recipes</p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Menu Items ({menuItems.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Recipe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const recipe = getRecipeByMenuItemId(item.id);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>₱{item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {recipe ? (
                          <Badge variant="outline" className="gap-1">
                            <Package className="w-3 h-3" />
                            {recipe.ingredients.length} ingredients
                          </Badge>
                        ) : (
                          <Badge variant="secondary">No recipe</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.isAvailable ? 'default' : 'secondary'}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog with Tabs */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? 'Update the menu item details and recipe configuration.'
                  : 'Add a new item to your menu and configure its recipe.'}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Item Details</TabsTrigger>
                <TabsTrigger value="recipe">Recipe & Ingredients</TabsTrigger>
              </TabsList>

              {/* Item Details Tab */}
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Margherita Pizza"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the menu item..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Appetizer">Appetizer</SelectItem>
                        <SelectItem value="Main Course">Main Course</SelectItem>
                        <SelectItem value="Dessert">Dessert</SelectItem>
                        <SelectItem value="Beverage">Beverage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (₱) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) =>
                      setFormData({ ...formData, isAvailable: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isAvailable" className="cursor-pointer">
                    Available for ordering
                  </Label>
                </div>
              </TabsContent>

              {/* Recipe & Ingredients Tab */}
              <TabsContent value="recipe" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Ingredients (Optional)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddIngredient}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add Ingredient
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Define the ingredients needed to make this menu item. This enables automatic
                    inventory tracking.
                  </div>

                  <div className="space-y-3 mt-4">
                    {recipeIngredients.map((ingredient, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-6 space-y-1">
                          <Label className="text-xs">Ingredient</Label>
                          <Select
                            value={ingredient.inventoryItemId}
                            onValueChange={(value) =>
                              handleUpdateIngredient(index, 'inventoryItemId', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select ingredient" />
                            </SelectTrigger>
                            <SelectContent>
                              {inventoryItems.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name} ({item.unit})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-3 space-y-1">
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={ingredient.quantity}
                            onChange={(e) =>
                              handleUpdateIngredient(index, 'quantity', e.target.value)
                            }
                            placeholder="0.00"
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">Unit</Label>
                          <Input
                            value={
                              ingredient.inventoryItemId
                                ? getIngredientUnit(ingredient.inventoryItemId)
                                : ingredient.unit
                            }
                            disabled
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveIngredient(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {recipeIngredients.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                        No ingredients added yet. Click &quot;Add Ingredient&quot; to start building the
                        recipe.
                      </div>
                    )}
                  </div>

                  {/* Recipe Cost Summary */}
                  {recipeIngredients.length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Estimated Cost Per Unit:</span>
                        <span className="font-bold">₱{getRecipeCost().toFixed(2)}</span>
                      </div>
                      {formData.price && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="font-medium">Selling Price:</span>
                          <span className="font-bold">₱{parseFloat(formData.price || '0').toFixed(2)}</span>
                        </div>
                      )}
                      {formData.price && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="font-medium">Profit Margin:</span>
                          <span className="font-bold text-green-600">
                            ₱{(parseFloat(formData.price || '0') - getRecipeCost()).toFixed(2)}
                            {' '}
                            ({((parseFloat(formData.price || '0') - getRecipeCost()) / parseFloat(formData.price || '1') * 100).toFixed(1)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.name || !formData.description || !formData.category || !formData.price}
              >
                {editingItem ? 'Update' : 'Add'} Menu Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

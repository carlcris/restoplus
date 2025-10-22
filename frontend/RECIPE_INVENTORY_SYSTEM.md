# Recipe-Based Inventory Management System

## Overview

The RestoPlus system now implements a sophisticated **Recipe-Based Inventory Management** system that automatically tracks ingredient usage and deducts stock when orders are placed.

## System Architecture

### 1. Three-Layer Structure

```
Menu Items → Recipes → Inventory Items
```

- **Inventory Items**: Raw ingredients (flour, cheese, pepperoni, etc.) stored in base units (grams, milliliters)
- **Recipes**: Define ingredient compositions for menu items
- **Menu Items**: Dishes on the menu that customers can order

### 2. How It Works

1. **Setup Phase**:
   - Add raw ingredients to inventory (e.g., 100 packs of 250g flour = 25,000g)
   - Create recipes that define what ingredients are needed for each menu item
   - Link menu items to their recipes

2. **Order Phase**:
   - When a customer orders "Pepperoni Pizza" (quantity: 1)
   - System finds the recipe for Pepperoni Pizza
   - Automatically deducts ingredients:
     - 250g flour
     - 25g cheese
     - 25g sauce
     - 50g pepperoni
     - 10ml olive oil

3. **Automatic Availability Management**:
   - If any ingredient falls below required quantity, the menu item becomes unavailable
   - When stock is restocked, availability is automatically restored

4. **Order Cancellation**:
   - If an order is cancelled, ingredients are restored to inventory

## Data Structure

### Inventory Item Example
```typescript
{
  id: '1',
  sku: 'ING-001',
  name: 'Flour',
  category: 'Dry Goods',
  currentStock: 25000, // 100 packs × 250g = 25,000g
  minimumStock: 5000,
  reorderLevel: 10000,
  unit: 'g', // Base unit
  unitCost: { amount: 0.002, currency: 'USD' }, // $0.002 per gram
  lastRestocked: '2024-10-18',
  supplier: 'Grain Suppliers Co.',
}
```

### Recipe Example (Pepperoni Pizza)
```typescript
{
  id: '1',
  menuItemId: '1', // Links to "Pepperoni Pizza"
  ingredients: [
    { inventoryItemId: '1', quantity: 250, unit: 'g' }, // Flour
    { inventoryItemId: '2', quantity: 25, unit: 'g' },  // Cheese
    { inventoryItemId: '3', quantity: 25, unit: 'g' },  // Sauce
    { inventoryItemId: '4', quantity: 50, unit: 'g' },  // Pepperoni
    { inventoryItemId: '5', quantity: 10, unit: 'ml' }, // Olive Oil
  ]
}
```

### Menu Item Example
```typescript
{
  id: '1',
  name: 'Pepperoni Pizza',
  description: 'Classic pizza with pepperoni...',
  category: 'Main Course',
  price: 14.99,
  isAvailable: true,
  recipeId: '1', // Links to recipe
}
```

## Key Features

### 1. Integrated Recipe Management (within Menu Management)
- Configure recipes directly when creating/editing menu items
- Two-tab interface: "Item Details" and "Recipe & Ingredients"
- Define ingredient quantities inline
- View cost per unit and profit margin (automatic calculation)
- Edit existing recipes alongside menu item details
- See which menu items have recipes configured at a glance

### 2. Menu Management (`/menu` page)
- Create and edit menu items
- Configure recipes as part of menu item setup (tabbed interface)
- View recipe status badge showing number of ingredients or "No recipe"
- See profit margins and cost calculations in real-time
- Integrated workflow: menu item → recipe → ingredients all in one place

### 3. Inventory Tracking (`/inventory` page)
- Track raw ingredients in base units
- Visual stock level indicators
- Low stock and critical stock alerts
- Automatic updates when orders are placed

### 4. Order Integration
- Automatic ingredient deduction when orders confirmed
- Automatic ingredient restoration when orders cancelled
- Real-time availability updates

## Context/State Management

### InventoryContext (`src/contexts/InventoryContext.tsx`)

Provides global state management for:
- Inventory items
- Recipes
- Menu items

**Key Functions:**

```typescript
// Check if menu item can be made with current stock
checkAvailability(menuItemId: string, quantity: number): boolean

// Deduct ingredients when order is placed
deductInventoryForOrder(menuItemId: string, quantity: number): boolean

// Restore ingredients when order is cancelled
restoreInventoryForOrder(menuItemId: string, quantity: number): void

// Get recipe for a menu item
getRecipeByMenuItemId(menuItemId: string): Recipe | undefined
```

## Usage Examples

### Example 1: Creating a Menu Item with Recipe

1. Go to `/menu`
2. Click "Add Menu Item"
3. **Item Details Tab:**
   - Name: "Pepperoni Pizza"
   - Description: "Classic pizza with pepperoni and cheese"
   - Category: "Main Course"
   - Price: $14.99
   - Check "Available for ordering"
4. **Recipe & Ingredients Tab:**
   - Click "Add Ingredient" and add:
     - Flour: 250g
     - Cheese: 25g
     - Tomato Sauce: 25g
     - Pepperoni: 50g
     - Olive Oil: 10ml
   - View the automatic cost calculation and profit margin
5. Click "Add Menu Item" to save both the menu item and its recipe

### Example 2: Viewing Ingredient Impact

Initial Inventory:
- Flour: 25,000g (100 packs of 250g)
- Cheese: 2,500g (100 packs of 25g)
- Sauce: 2,500g (100 packs of 25g)
- Pepperoni: 5,000g (100 packs of 50g)

After 10 Pepperoni Pizzas ordered:
- Flour: 22,500g (-2,500g)
- Cheese: 2,250g (-250g)
- Sauce: 2,250g (-250g)
- Pepperoni: 4,500g (-500g)

Maximum pizzas possible: 100 (limited by ingredients)

### Example 3: Automatic Availability

Current Stock:
- Pepperoni: 40g (below 50g needed for one pizza)

Result:
- "Pepperoni Pizza" automatically marked as unavailable
- Shows as unavailable on menu
- Cannot be ordered

When Restocked:
- Pepperoni: 1,000g
- "Pepperoni Pizza" automatically available again

## Integration Points

### With Orders System
```typescript
// When order is confirmed
import { useInventory } from '@/contexts/InventoryContext';

const { deductInventoryForOrder } = useInventory();

function handleConfirmOrder(order) {
  order.items.forEach(item => {
    const success = deductInventoryForOrder(item.menuItemId, item.quantity);
    if (!success) {
      alert(`Insufficient ingredients for ${item.name}`);
    }
  });
}
```

### With Menu System
```typescript
// Check availability before adding to order
const { checkAvailability } = useInventory();

function canAddToOrder(menuItemId, quantity) {
  return checkAvailability(menuItemId, quantity);
}
```

## Benefits

1. **Accurate Inventory Tracking**: Real-time stock updates based on actual orders
2. **Prevent Overordering**: Cannot order items without sufficient ingredients
3. **Cost Analysis**: See exact cost per menu item
4. **Automatic Reorder Alerts**: Know when to restock based on actual usage
5. **Recipe Standardization**: Consistent ingredient usage across all orders
6. **Waste Reduction**: Better planning and forecasting

## Future Enhancements

- [ ] Batch cooking support (make 10 pizzas at once)
- [ ] Recipe variations (different sizes: small, medium, large)
- [ ] Ingredient substitutions
- [ ] Historical usage analytics
- [ ] Predictive restocking based on order patterns
- [ ] Integration with supplier ordering system
- [ ] Multi-unit conversions (kg to lbs, etc.)
- [ ] Waste tracking and spoilage

## Files Added/Modified

### New Files:
- `src/contexts/InventoryContext.tsx` - Global inventory state management
- `RECIPE_INVENTORY_SYSTEM.md` - This documentation

### Modified Files:
- `src/app/layout.tsx` - Added InventoryProvider
- `src/app/menu/page.tsx` - Enhanced with integrated recipe management (tabbed interface)
- `src/app/inventory/page.tsx` - Connected to InventoryContext with unit conversion
- `src/components/layouts/Sidebar.tsx` - Uses menu items only (recipes integrated)

## Notes

- All inventory is tracked in base units (grams, milliliters) for consistency
- Unit costs are stored per base unit for accurate calculation
- The system supports multiple units but converts everything internally
- Recipes can be updated without affecting existing orders (historical data preserved)

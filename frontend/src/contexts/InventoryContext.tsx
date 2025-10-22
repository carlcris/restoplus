'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number; // in base units
  minimumStock: number;
  reorderLevel: number;
  unit: string; // base unit (e.g., 'g' for grams, 'ml' for milliliters)
  unitCost: { amount: number; currency: string };
  lastRestocked: string;
  supplier: string;
}

export interface RecipeIngredient {
  inventoryItemId: string;
  quantity: number; // quantity in base units
  unit: string;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  ingredients: RecipeIngredient[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isAvailable: boolean;
  recipeId?: string;
}

interface InventoryContextType {
  inventoryItems: InventoryItem[];
  recipes: Recipe[];
  menuItems: MenuItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => Recipe;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deductInventoryForOrder: (menuItemId: string, quantity: number) => boolean;
  restoreInventoryForOrder: (menuItemId: string, quantity: number) => void;
  checkAvailability: (menuItemId: string, quantity: number) => boolean;
  getRecipeByMenuItemId: (menuItemId: string) => Recipe | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Initial mock data
const initialInventoryItems: InventoryItem[] = [
  {
    id: '1',
    sku: 'ING-001',
    name: 'Flour',
    category: 'Dry Goods',
    currentStock: 25000, // 100 packs of 250g = 25,000g
    minimumStock: 5000,
    reorderLevel: 10000,
    unit: 'g',
    unitCost: { amount: 0.10, currency: 'PHP' }, // ₱0.10 per gram
    lastRestocked: '2024-10-18',
    supplier: 'Grain Suppliers Co.',
  },
  {
    id: '2',
    sku: 'ING-002',
    name: 'Cheese (Mozzarella)',
    category: 'Dairy',
    currentStock: 2500, // 100 packs of 25g = 2,500g
    minimumStock: 500,
    reorderLevel: 1000,
    unit: 'g',
    unitCost: { amount: 0.60, currency: 'PHP' },
    lastRestocked: '2024-10-19',
    supplier: 'Dairy Delights',
  },
  {
    id: '3',
    sku: 'ING-003',
    name: 'Tomato Sauce',
    category: 'Sauces',
    currentStock: 2500, // 100 packs of 25g = 2,500g
    minimumStock: 500,
    reorderLevel: 1000,
    unit: 'g',
    unitCost: { amount: 0.20, currency: 'PHP' },
    lastRestocked: '2024-10-20',
    supplier: 'Italian Imports',
  },
  {
    id: '4',
    sku: 'ING-004',
    name: 'Pepperoni',
    category: 'Meat',
    currentStock: 5000, // 100 packs of 50g = 5,000g
    minimumStock: 1000,
    reorderLevel: 2000,
    unit: 'g',
    unitCost: { amount: 0.75, currency: 'PHP' },
    lastRestocked: '2024-10-18',
    supplier: 'Fresh Meats Co.',
  },
  {
    id: '5',
    sku: 'ING-005',
    name: 'Olive Oil',
    category: 'Oils',
    currentStock: 5000, // 5 liters = 5,000ml
    minimumStock: 1000,
    reorderLevel: 2000,
    unit: 'ml',
    unitCost: { amount: 0.40, currency: 'PHP' },
    lastRestocked: '2024-10-15',
    supplier: 'Mediterranean Imports',
  },
  {
    id: '6',
    sku: 'ING-006',
    name: 'Basil (Fresh)',
    category: 'Herbs',
    currentStock: 200, // 200g
    minimumStock: 50,
    reorderLevel: 100,
    unit: 'g',
    unitCost: { amount: 2.50, currency: 'PHP' },
    lastRestocked: '2024-10-21',
    supplier: 'Farm Fresh Produce',
  },
];

const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Pepperoni Pizza',
    description: 'Classic pizza with pepperoni, mozzarella, and tomato sauce',
    category: 'Main Course',
    price: 750.00,
    isAvailable: true,
    recipeId: '1',
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Traditional pizza with fresh mozzarella, tomato sauce, and basil',
    category: 'Main Course',
    price: 650.00,
    isAvailable: true,
    recipeId: '2',
  },
];

const initialRecipes: Recipe[] = [
  {
    id: '1',
    menuItemId: '1', // Pepperoni Pizza
    ingredients: [
      { inventoryItemId: '1', quantity: 250, unit: 'g' }, // Flour
      { inventoryItemId: '2', quantity: 25, unit: 'g' }, // Cheese
      { inventoryItemId: '3', quantity: 25, unit: 'g' }, // Tomato Sauce
      { inventoryItemId: '4', quantity: 50, unit: 'g' }, // Pepperoni
      { inventoryItemId: '5', quantity: 10, unit: 'ml' }, // Olive Oil
    ],
  },
  {
    id: '2',
    menuItemId: '2', // Margherita Pizza
    ingredients: [
      { inventoryItemId: '1', quantity: 250, unit: 'g' }, // Flour
      { inventoryItemId: '2', quantity: 30, unit: 'g' }, // Cheese
      { inventoryItemId: '3', quantity: 30, unit: 'g' }, // Tomato Sauce
      { inventoryItemId: '6', quantity: 5, unit: 'g' }, // Basil
      { inventoryItemId: '5', quantity: 10, unit: 'ml' }, // Olive Oil
    ],
  },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setInventoryItems([...inventoryItems, newItem]);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventoryItems(inventoryItems.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteInventoryItem = (id: string) => {
    setInventoryItems(inventoryItems.filter((item) => item.id !== id));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>): MenuItem => {
    const newItem = { ...item, id: Date.now().toString() };
    setMenuItems([...menuItems, newItem]);
    return newItem;
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const addRecipe = (recipe: Omit<Recipe, 'id'>): Recipe => {
    const newRecipe = { ...recipe, id: Date.now().toString() };
    setRecipes([...recipes, newRecipe]);
    return newRecipe;
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(recipes.map((recipe) => (recipe.id === id ? { ...recipe, ...updates } : recipe)));
  };

  const getRecipeByMenuItemId = (menuItemId: string): Recipe | undefined => {
    return recipes.find((recipe) => recipe.menuItemId === menuItemId);
  };

  const checkAvailability = (menuItemId: string, quantity: number): boolean => {
    const recipe = getRecipeByMenuItemId(menuItemId);
    if (!recipe) return false;

    // Check if all ingredients are available
    for (const ingredient of recipe.ingredients) {
      const inventoryItem = inventoryItems.find((item) => item.id === ingredient.inventoryItemId);
      if (!inventoryItem) return false;

      const requiredQuantity = ingredient.quantity * quantity;
      if (inventoryItem.currentStock < requiredQuantity) {
        return false;
      }
    }

    return true;
  };

  const deductInventoryForOrder = (menuItemId: string, quantity: number): boolean => {
    const recipe = getRecipeByMenuItemId(menuItemId);
    if (!recipe) return false;

    // Check availability first
    if (!checkAvailability(menuItemId, quantity)) {
      return false;
    }

    // Deduct ingredients
    const updatedItems = inventoryItems.map((item) => {
      const ingredient = recipe.ingredients.find((ing) => ing.inventoryItemId === item.id);
      if (ingredient) {
        const deductAmount = ingredient.quantity * quantity;
        return {
          ...item,
          currentStock: item.currentStock - deductAmount,
        };
      }
      return item;
    });

    setInventoryItems(updatedItems);

    // Update menu item availability based on new stock levels
    const stillAvailable = checkAvailability(menuItemId, 1);
    if (!stillAvailable) {
      updateMenuItem(menuItemId, { isAvailable: false });
    }

    return true;
  };

  const restoreInventoryForOrder = (menuItemId: string, quantity: number): void => {
    const recipe = getRecipeByMenuItemId(menuItemId);
    if (!recipe) return;

    // Restore ingredients
    const updatedItems = inventoryItems.map((item) => {
      const ingredient = recipe.ingredients.find((ing) => ing.inventoryItemId === item.id);
      if (ingredient) {
        const restoreAmount = ingredient.quantity * quantity;
        return {
          ...item,
          currentStock: item.currentStock + restoreAmount,
        };
      }
      return item;
    });

    setInventoryItems(updatedItems);

    // Re-check menu item availability
    const nowAvailable = checkAvailability(menuItemId, 1);
    if (nowAvailable) {
      updateMenuItem(menuItemId, { isAvailable: true });
    }
  };

  const value: InventoryContextType = {
    inventoryItems,
    recipes,
    menuItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addRecipe,
    updateRecipe,
    deductInventoryForOrder,
    restoreInventoryForOrder,
    checkAvailability,
    getRecipeByMenuItemId,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
}

// Common types for the application

// Export all domain types
export * from './domain';

// Legacy types - keeping for backward compatibility
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
}

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserLevel = 'admin' | 'mid' | 'employee';

export interface User {
  id: string;
  name: string;
  level: UserLevel;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  hasPermission: (permission: 'create' | 'edit' | 'delete' | 'manage-users') => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Mock user for demonstration - in real app, this would come from authentication
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'João Silva',
    level: 'admin',
    email: 'joao.silva@stockmate.com'
  });

  const hasPermission = (permission: 'create' | 'edit' | 'delete' | 'manage-users'): boolean => {
    if (!user) return false;

    switch (user.level) {
      case 'admin':
        return true; // Admin has all permissions
      case 'mid':
        return ['create', 'edit'].includes(permission);
      case 'employee':
        return false; // Employee can only view
      default:
        return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, hasPermission }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
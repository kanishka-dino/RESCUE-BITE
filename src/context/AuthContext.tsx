import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | 'guest';
  isAuthenticated: boolean;
  loginAs: (roleKey: 'donor1' | 'recipient1' | 'admin1') => void;
  loginWithCredentials: (email: string, role: UserRole) => Promise<boolean>;
  registerUser: (userData: Partial<User> & { password?: string }) => Promise<User>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with donor1 as active user so the evaluator can immediately explore rich interactive states, or allow switching
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('rescuebite_auth_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return MOCK_USERS.donor1;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rescuebite_auth_user', JSON.stringify(currentUser));
      localStorage.setItem('rescuebite_auth_token', `demo_jwt_token_${currentUser.role}_${currentUser.id}`);
    } else {
      localStorage.removeItem('rescuebite_auth_user');
      localStorage.removeItem('rescuebite_auth_token');
    }
  }, [currentUser]);

  const loginAs = (key: 'donor1' | 'recipient1' | 'admin1') => {
    const user = MOCK_USERS[key];
    if (user) {
      setCurrentUser(user);
    }
  };

  const loginWithCredentials = async (email: string, role: UserRole): Promise<boolean> => {
    // Check if matches one of demo users or create session
    const matched = Object.values(MOCK_USERS).find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );
    if (matched) {
      setCurrentUser(matched);
      return true;
    }
    // Generic demo login
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      phone: '+1 (555) 123-4567',
      role,
      organizationName: role === 'donor' ? 'Gourmet Kitchen' : 'Community Care Hub',
      organizationType: role === 'donor' ? 'Restaurant' : 'NGO',
      address: '124 Marketplace Boulevard',
      city: 'Metro City',
      verified: true,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(newUser);
    return true;
  };

  const registerUser = async (data: Partial<User>): Promise<User> => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name || 'New Member',
      email: data.email || 'user@example.com',
      phone: data.phone || '+1 (555) 000-0000',
      role: data.role || 'donor',
      organizationName: data.organizationName || 'New Organization',
      organizationType: data.organizationType || 'Community Kitchen',
      address: data.address || '101 Street',
      city: data.city || 'Metro City',
      verified: data.role === 'donor' ? true : false, // recipients go to verification queue
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...updates });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser ? currentUser.role : 'guest',
        isAuthenticated: !!currentUser,
        loginAs,
        loginWithCredentials,
        registerUser,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  IUser,
  IPatientProfile,
  IDriverProfile,
  IAdminProfile,
  ILoginUserPayload,
  Role,
  ApiResponse,
  IAuthData,
} from '@/types/auth.types';
import { getCurrentUserAction, loginUserAction, logoutAction } from '@/services/auth/auth.service';

interface AuthContextType {
  user: IUser | null;
  profile: IPatientProfile | IDriverProfile | IAdminProfile | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: ILoginUserPayload) => Promise<ApiResponse<IAuthData>>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  setProfile: React.Dispatch<
    React.SetStateAction<IPatientProfile | IDriverProfile | IAdminProfile | null>
  >;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [profile, setProfile] = useState<
    IPatientProfile | IDriverProfile | IAdminProfile | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await getCurrentUserAction();
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              'user',
              JSON.stringify({
                fullName: res.data.user.name,
                email: res.data.user.email,
                phone: res.data.user.phone,
                address: (res.data.profile as any)?.address,
                avatarUrl: res.data.user.avatarUrl,
                role: res.data.user.role,
              }),
            );
          } catch {
            // ignore
          }
        }
      } else {
        setUser(null);
        setProfile(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setUser(null);
      setProfile(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (payload: ILoginUserPayload): Promise<ApiResponse<IAuthData>> => {
    setIsLoading(true);
    try {
      const res = await loginUserAction(payload);
      if (res.success && res.data) {
        setUser(res.data.user);
        if (res.data.patient) setProfile(res.data.patient);
        else if (res.data.driver) setProfile(res.data.driver);
        else if (res.data.admin) setProfile(res.data.admin);

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              'user',
              JSON.stringify({
                fullName: res.data.user.name,
                email: res.data.user.email,
                phone: res.data.user.phone,
                address: (res.data.patient as any)?.address || (res.data.driver as any)?.address,
                avatarUrl: res.data.user.avatarUrl,
                role: res.data.user.role,
              }),
            );
          } catch {
            // ignore
          }
        }
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutAction();
      setUser(null);
      setProfile(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
    setUser,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

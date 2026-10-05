import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { EduHubAuthService } from '../services/api';
import { EduHubStore } from '../services/dataStore';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  quickLogin: (role: UserRole) => void;
  refreshUser: () => void;
  consumeDailyUsage: () => boolean; // returns true if allowance available
  awardPointsToStudent: (studentId: string, points: number, reason: string, teacherName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    const user = EduHubAuthService.getActiveUser();
    setCurrentUser(user ? { ...user } : null);
  };

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, []);

  const logout = () => {
    EduHubAuthService.logout();
    setCurrentUser(null);
  };

  const quickLogin = (role: UserRole) => {
    const user = EduHubAuthService.quickLoginAs(role);
    setCurrentUser({ ...user });
  };

  const consumeDailyUsage = (): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'ADMIN') return true; // unlimited for admin

    if (currentUser.dailyUsage.count >= currentUser.dailyUsage.max) {
      return false; // limit reached
    }

    const users = EduHubStore.getUsers();
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].dailyUsage.count += 1;
      EduHubStore.saveUsers(users);
      setCurrentUser({ ...users[userIndex] });
    }
    return true;
  };

  const awardPointsToStudent = (studentId: string, points: number, reason: string, teacherName: string) => {
    const users = EduHubStore.getUsers();
    const student = users.find((u) => u.id === studentId);
    if (student) {
      student.points += points;
      // level calculation: 1 level per 150 points
      student.level = Math.max(1, Math.floor(student.points / 150) + 1);
      EduHubStore.saveUsers(users);

      EduHubStore.addPointHistory({
        userId: studentId,
        points,
        reason,
        awardedBy: currentUser?.id || 'system',
        awardedByName: teacherName,
      });

      EduHubStore.addNotification({
        targetRole: 'STUDENTS',
        targetUserId: studentId,
        title: `+${points} ball qo‘shildi!`,
        message: `${teacherName}: "${reason}"`,
        type: 'point'
      });

      if (currentUser?.id === studentId) {
        setCurrentUser({ ...student });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        isLoading,
        logout,
        quickLogin,
        refreshUser,
        consumeDailyUsage,
        awardPointsToStudent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

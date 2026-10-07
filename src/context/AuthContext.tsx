import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/react';
import { UserProfile, AssessmentAttempt } from '../types';
import { storageService, EMPTY_PROFILE } from '../services/storageService';

interface AuthContextType {
  profile: UserProfile;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  completeOnboarding: (onboardingData: Partial<UserProfile>) => void;
  recordAttempt: (attempt: AssessmentAttempt) => void;
  attempts: AssessmentAttempt[];
  isClerkLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const ClerkStateWatcher: React.FC<{
  onSync: (user: any, isSignedIn: boolean) => void;
  onRegisterSignOut: (signOutFn: () => void) => void;
}> = ({ onSync, onRegisterSignOut }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerkAuth();

  useEffect(() => {
    if (signOut) {
      onRegisterSignOut(signOut);
    }
  }, [signOut, onRegisterSignOut]);

  useEffect(() => {
    if (isLoaded) {
      onSync(user, !!isSignedIn);
    }
  }, [isLoaded, isSignedIn, user, onSync]);

  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getUserProfile());
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>(() => storageService.getAttempts());
  const [isClerkUserSignedIn, setIsClerkUserSignedIn] = useState<boolean>(false);
  const [clerkSignOutFn, setClerkSignOutFn] = useState<(() => void) | null>(null);

  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('speaksure_session_active') === 'true';
  });

  const isOnboarded = !!(profile.college && profile.course && profile.targetRole);

  const handleClerkUserSync = useCallback((user: any, isSignedIn: boolean) => {
    setIsClerkUserSignedIn(isSignedIn);
    if (isSignedIn && user) {
      setProfile((prev) => {
        const clerkEmail = user.primaryEmailAddress?.emailAddress || '';
        const clerkName = user.fullName || user.firstName || (clerkEmail ? clerkEmail.split('@')[0] : '');
        const nextName = clerkName || prev.name || 'Student';
        const nextEmail = clerkEmail || prev.email || '';
        const nextPhoto = user.imageUrl || prev.profilePhoto;

        if (prev.id === user.id && prev.name === nextName && prev.email === nextEmail && prev.profilePhoto === nextPhoto) {
          return prev;
        }

        const updated: UserProfile = {
          ...prev,
          id: user.id || prev.id || 'usr-' + Date.now(),
          name: nextName,
          email: nextEmail,
          profilePhoto: nextPhoto,
        };
        storageService.saveUserProfile(updated);
        return updated;
      });
      setUserLoggedIn(true);
      localStorage.setItem('speaksure_session_active', 'true');
    }
  }, []);

  const handleRegisterSignOut = useCallback((fn: () => void) => {
    setClerkSignOutFn(() => fn);
  }, []);

  const login = (email: string, name?: string) => {
    const updated: UserProfile = {
      ...profile,
      email,
      name: name || profile.name || email.split('@')[0] || 'Student',
    };
    setProfile(updated);
    storageService.saveUserProfile(updated);
    setUserLoggedIn(true);
    localStorage.setItem('speaksure_session_active', 'true');
  };

  const logout = () => {
    if (clerkSignOutFn) {
      try {
        clerkSignOutFn();
      } catch (e) {
        console.warn('Clerk signOut warning:', e);
      }
    }
    setIsClerkUserSignedIn(false);
    setUserLoggedIn(false);
    localStorage.removeItem('speaksure_session_active');
    localStorage.removeItem('speaksure_user_profile');
    localStorage.removeItem('speaksure_attempts');
    localStorage.removeItem('speaksure_mistakes');
    localStorage.removeItem('speaksure_achievements');
    setProfile(EMPTY_PROFILE);
    setAttempts([]);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated, updatedAt: new Date().toISOString() };
      storageService.saveUserProfile(next);
      return next;
    });
  };

  const completeOnboarding = (onboardingData: Partial<UserProfile>) => {
    updateProfile(onboardingData);
  };

  const recordAttempt = (attempt: AssessmentAttempt) => {
    storageService.saveAttempt(attempt);
    setAttempts((prev) => [attempt, ...prev]);

    const latestProfile = storageService.getUserProfile();
    setProfile(latestProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        isAuthenticated: (isClerkUserSignedIn || userLoggedIn) && !!profile.email,
        isOnboarded,
        login,
        logout,
        updateProfile,
        completeOnboarding,
        recordAttempt,
        attempts,
        isClerkLoaded: true,
      }}
    >
      {publishableKey && (
        <ClerkStateWatcher
          onSync={handleClerkUserSync}
          onRegisterSignOut={handleRegisterSignOut}
        />
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

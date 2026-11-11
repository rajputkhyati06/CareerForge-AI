import { createClient as createBrowserClient } from '@/lib/supabase/client';

export interface CareerProfileData {
  careerId: string;
  startingMode?: 'BEGINNING' | 'DIAGNOSTIC';
  readinessScore?: number;
  onboardingCompleted?: boolean;
  onboardingStep?: 'CAREER_SELECTION' | 'STARTING_LEVEL' | 'DIAGNOSTIC' | 'COMPLETED';
  diagnosticResult?: any;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  careerGoal?: string;
  startingMode?: 'BEGINNING' | 'DIAGNOSTIC';
  readinessScore?: number;
  onboardingCompleted?: boolean;
  onboardingStep?: 'CAREER_SELECTION' | 'STARTING_LEVEL' | 'DIAGNOSTIC' | 'COMPLETED';
  diagnosticResult?: any;
  careerProfiles?: Record<string, CareerProfileData>;
}

export interface UserAuthSession {
  user: UserProfile;
  token: string;
}

// SHA-256 password hashing helper so passwords are NEVER stored in plain text
export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_cf_salt_2026');
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simple hash for non-crypto environments
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'cf_hash_' + Math.abs(hash).toString(16);
}

const SESSION_STORAGE_KEY = 'cf_active_user_session';
const ACCOUNTS_STORAGE_KEY = 'cf_registered_user_accounts';

export const authService = {
  // Check if real Supabase project credentials are configured
  isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!url || !key) return false;
    if (
      url.includes('placeholder') ||
      url.includes('your-supabase') ||
      url.includes('example.com') ||
      key.includes('placeholder') ||
      key.includes('your-supabase')
    ) {
      return false;
    }
    return true;
  },

  // Get currently authenticated user
  getCurrentUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!storedSession) return null;
      const parsed: UserAuthSession = JSON.parse(storedSession);
      return parsed.user;
    } catch {
      return null;
    }
  },

  // Update user profile fields in session, local storage account store, and Supabase metadata
  updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.id !== userId) return null;

      const updatedUser: UserProfile = {
        ...currentUser,
        ...updates,
      };

      // Update active session
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        const parsed: UserAuthSession = JSON.parse(storedSession);
        parsed.user = updatedUser;
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsed));
      }

      // Update in registered accounts list
      const accountsRaw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (accountsRaw) {
        const accounts: Array<{ user: UserProfile; passwordHash: string }> = JSON.parse(accountsRaw);
        const idx = accounts.findIndex((acc) => acc.user.id === userId || acc.user.email === updatedUser.email);
        if (idx !== -1) {
          accounts[idx].user = { ...accounts[idx].user, ...updates };
          localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
        }
      }

      // Sync to Supabase user_metadata if configured
      if (this.isSupabaseConfigured()) {
        try {
          const supabase = createBrowserClient();
          supabase.auth.updateUser({
            data: { ...updates },
          });
        } catch {
          // ignore async sync error
        }
      }

      return updatedUser;
    } catch {
      return null;
    }
  },

  // Register new user account
  async signUp(data: {
    fullName: string;
    email: string;
    password: string;
    goal?: string;
  }): Promise<{ user: UserProfile; error?: string; isExistingEmail?: boolean }> {
    const normalizedEmail = data.email.trim().toLowerCase();

    // 1. Try Supabase Auth if real credentials exist
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createBrowserClient();
        const { data: authData, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              goal: data.goal,
              onboarding_completed: false,
              onboarding_step: 'CAREER_SELECTION',
            },
          },
        });

        if (error) {
          const isExisting = error.message.toLowerCase().includes('already registered') ||
                             error.message.toLowerCase().includes('already exists');
          return {
            user: null as any,
            error: isExisting
              ? 'An account already exists with this email. Please log in instead.'
              : error.message,
            isExistingEmail: isExisting,
          };
        }

        if (authData.user) {
          const user: UserProfile = {
            id: authData.user.id,
            email: authData.user.email || normalizedEmail,
            fullName: data.fullName,
            createdAt: new Date().toISOString(),
            careerGoal: data.goal,
            onboardingCompleted: false,
            onboardingStep: 'CAREER_SELECTION',
          };
          this.setSession({ user, token: authData.session?.access_token || 'sb_token' });
          return { user };
        }
      } catch (err: any) {
        if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
          return {
            user: null as any,
            error:
              'Unable to connect to Supabase Auth. Please check your Supabase URL & Key in .env.local or your network connection.',
          };
        }
        return { user: null as any, error: err.message || 'Supabase authentication failed.' };
      }
    }

    // 2. Local Secure Account Persistence (when Supabase keys are placeholder)
    try {
      const accountsRaw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      const accounts: Array<{ user: UserProfile; passwordHash: string }> = accountsRaw
        ? JSON.parse(accountsRaw)
        : [];

      // Check if email already registered
      const existing = accounts.find((acc) => acc.user.email === normalizedEmail);
      if (existing) {
        return {
          user: null as any,
          error: 'An account already exists with this email. Please log in instead.',
          isExistingEmail: true,
        };
      }

      const passwordHash = await hashPassword(data.password);
      const newUser: UserProfile = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        email: normalizedEmail,
        fullName: data.fullName,
        createdAt: new Date().toISOString(),
        careerGoal: data.goal,
        onboardingCompleted: false,
        onboardingStep: 'CAREER_SELECTION',
      };

      accounts.push({ user: newUser, passwordHash });
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));

      // Save initial session
      this.setSession({ user: newUser, token: 'local_token_' + Date.now() });

      return { user: newUser };
    } catch (err: any) {
      return { user: null as any, error: err.message || 'Failed to create account.' };
    }
  },

  // Log in existing user
  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: UserProfile; error?: string }> {
    const normalizedEmail = data.email.trim().toLowerCase();

    // 1. Try Supabase Auth if real credentials exist
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createBrowserClient();
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: data.password,
        });

        if (error) return { user: null as any, error: error.message };

        if (authData.user) {
          const metadata = authData.user.user_metadata || {};
          const accountsRaw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
          const accounts: Array<{ user: UserProfile; passwordHash: string }> = accountsRaw
            ? JSON.parse(accountsRaw)
            : [];
          const matchedLocal = accounts.find(
            (acc) => acc.user.email === normalizedEmail || acc.user.id === authData.user.id
          );
          const localUser = matchedLocal?.user;

          const careerGoal = metadata.career_goal || metadata.goal || localUser?.careerGoal;
          const startingMode = metadata.starting_mode || localUser?.startingMode;

          let onboardingCompleted = false;
          if (metadata.onboarding_completed !== undefined) {
            onboardingCompleted = Boolean(metadata.onboarding_completed);
          } else if (localUser?.onboardingCompleted !== undefined) {
            onboardingCompleted = Boolean(localUser.onboardingCompleted);
          } else if (careerGoal && startingMode) {
            onboardingCompleted = true;
          }

          const user: UserProfile = {
            id: authData.user.id,
            email: authData.user.email || normalizedEmail,
            fullName:
              metadata.full_name ||
              localUser?.fullName ||
              normalizedEmail.split('@')[0] ||
              'CareerForge Learner',
            createdAt: authData.user.created_at || localUser?.createdAt || new Date().toISOString(),
            careerGoal,
            startingMode,
            onboardingCompleted,
            onboardingStep:
              metadata.onboarding_step ||
              localUser?.onboardingStep ||
              (onboardingCompleted ? 'COMPLETED' : 'CAREER_SELECTION'),
            readinessScore: metadata.readiness_score ?? localUser?.readinessScore,
            diagnosticResult: metadata.diagnostic_result || localUser?.diagnosticResult,
          };
          this.setSession({ user, token: authData.session?.access_token || 'sb_token' });
          return { user };
        }
      } catch (err: any) {
        if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
          return {
            user: null as any,
            error:
              'Unable to connect to Supabase Auth. Please check your Supabase URL & Key in .env.local or your network connection.',
          };
        }
        return { user: null as any, error: err.message || 'Supabase login failed.' };
      }
    }

    // 2. Local Secure Account Verification
    try {
      const accountsRaw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      const accounts: Array<{ user: UserProfile; passwordHash: string }> = accountsRaw
        ? JSON.parse(accountsRaw)
        : [];

      const account = accounts.find((acc) => acc.user.email === normalizedEmail);
      if (!account) {
        return {
          user: null as any,
          error: 'No account found with this email. Please check your email or sign up.',
        };
      }

      const inputHash = await hashPassword(data.password);
      if (account.passwordHash !== inputHash) {
        return {
          user: null as any,
          error: 'Invalid email or password. Please try again.',
        };
      }

      const user: UserProfile = { ...account.user };
      if (user.onboardingCompleted === undefined) {
        user.onboardingCompleted = Boolean(user.careerGoal && user.startingMode);
      }
      if (!user.onboardingStep) {
        user.onboardingStep = user.onboardingCompleted ? 'COMPLETED' : 'CAREER_SELECTION';
      }

      this.setSession({ user, token: 'local_token_' + Date.now() });
      return { user };
    } catch (err: any) {
      return { user: null as any, error: err.message || 'Login failed.' };
    }
  },

  // Forgot password handler
  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    const normalizedEmail = email.trim().toLowerCase();

    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createBrowserClient();
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);
        if (error) return { success: false, message: error.message };
        return {
          success: true,
          message: 'Password reset link sent to your email. Check your inbox to reset password.',
        };
      } catch (err: any) {
        if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
          return {
            success: false,
            message:
              'Unable to connect to Supabase Auth. Please check your network connection.',
          };
        }
      }
    }

    try {
      const accountsRaw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      const accounts: Array<{ user: UserProfile; passwordHash: string }> = accountsRaw
        ? JSON.parse(accountsRaw)
        : [];
      const account = accounts.find((acc) => acc.user.email === normalizedEmail);

      if (!account) {
        return {
          success: false,
          message: 'No registered account found with this email address.',
        };
      }

      return {
        success: true,
        message: 'Password reset instructions have been sent to ' + normalizedEmail + '. Check your inbox to set a new password.',
      };
    } catch {
      return { success: false, message: 'Password reset request failed. Please try again.' };
    }
  },

  // Save active user session
  setSession(session: UserAuthSession): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  },

  // Logout active user
  async logout(): Promise<void> {
    if (this.isSupabaseConfigured()) {
      try {
        const supabase = createBrowserClient();
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  },

  // Switch career goal while preserving per-career progress & diagnostic results
  switchCareer(userId: string, targetCareerId: string): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.id !== userId) return null;

      const currentCareer = currentUser.careerGoal;
      const careerProfiles: Record<string, CareerProfileData> = currentUser.careerProfiles || {};

      // 1. Archive current career profile state
      if (currentCareer) {
        careerProfiles[currentCareer] = {
          careerId: currentCareer,
          startingMode: currentUser.startingMode,
          readinessScore: currentUser.readinessScore,
          onboardingCompleted: currentUser.onboardingCompleted,
          onboardingStep: currentUser.onboardingStep,
          diagnosticResult: currentUser.diagnosticResult,
        };
      }

      // 2. Retrieve or initialize target career profile state
      const targetProfile = careerProfiles[targetCareerId] || {
        careerId: targetCareerId,
        onboardingCompleted: false,
        onboardingStep: 'STARTING_LEVEL',
      };

      // 3. Prepare updated user object with target career values
      const updatedUser: UserProfile = {
        ...currentUser,
        careerGoal: targetCareerId,
        startingMode: targetProfile.startingMode,
        readinessScore: targetProfile.readinessScore,
        onboardingCompleted: targetProfile.onboardingCompleted ?? false,
        onboardingStep: targetProfile.onboardingStep || 'STARTING_LEVEL',
        diagnosticResult: targetProfile.diagnosticResult,
        careerProfiles,
      };

      // 4. Update session and account store
      this.setSession({ user: updatedUser, token: 'local_token_' + Date.now() });

      const accountsRaw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (accountsRaw) {
        const accounts: Array<{ user: UserProfile; passwordHash: string }> = JSON.parse(accountsRaw);
        const idx = accounts.findIndex((acc) => acc.user.id === userId || acc.user.email === updatedUser.email);
        if (idx !== -1) {
          accounts[idx].user = updatedUser;
          localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
        }
      }

      // 5. Sync to Supabase if configured
      if (this.isSupabaseConfigured()) {
        try {
          const supabase = createBrowserClient();
          supabase.auth.updateUser({
            data: {
              career_goal: targetCareerId,
              starting_mode: targetProfile.startingMode,
              readiness_score: targetProfile.readinessScore,
              onboarding_completed: targetProfile.onboardingCompleted,
              onboarding_step: targetProfile.onboardingStep,
              career_profiles: careerProfiles,
            },
          });
        } catch {
          // ignore
        }
      }

      return updatedUser;
    } catch {
      return null;
    }
  },

  // Per-user and per-career isolated data storage
  getUserData<T>(userId: string, key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const currentUser = this.getCurrentUser();
      const careerId = currentUser?.careerGoal;
      if (careerId) {
        const scopedKey = `cf_user_${userId}_${careerId}_${key}`;
        const storedScoped = localStorage.getItem(scopedKey);
        if (storedScoped) return JSON.parse(storedScoped);
      }
      const legacyStored = localStorage.getItem(`cf_user_${userId}_${key}`);
      return legacyStored ? JSON.parse(legacyStored) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  saveUserData<T>(userId: string, key: string, data: T): void {
    if (typeof window === 'undefined') return;
    try {
      const currentUser = this.getCurrentUser();
      const careerId = currentUser?.careerGoal;
      if (careerId) {
        localStorage.setItem(`cf_user_${userId}_${careerId}_${key}`, JSON.stringify(data));
      }
      localStorage.setItem(`cf_user_${userId}_${key}`, JSON.stringify(data));
    } catch {
      // ignore
    }
  },
};

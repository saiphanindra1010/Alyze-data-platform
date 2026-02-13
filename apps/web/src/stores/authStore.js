/**
 * Auth store (Zustand): user, licenses, auth state and actions.
 * Use useAuthStore() or useAuth() / useLicense() anywhere without prop drilling.
 */
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { AuthService, SecureAPI } from '../lib/authService';

export const useAuthStore = create((set, get) => {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false, // Start with false to avoid blocking renders
    _initialized: false,

    setUser: (user) => set({ user }),
    setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setLoading: (isLoading) => set({ isLoading }),

    verifySession: async () => {
      const { _initialized } = get();
      if (_initialized) return; // Only verify once

      set({ isLoading: true, _initialized: true });
      try {
        const result = await AuthService.validateSession();
        if (result.valid) {
          let updatedUser = result.user;
          try {
            const res = await SecureAPI.get('/profile');
            if (res.data?.success && res.data?.profile) {
              updatedUser = res.data.profile;
            }
          } catch {
            // keep result.user if profile fetch fails
          }
          set({ isAuthenticated: true, user: updatedUser, isLoading: false });
        } else {
          set({ isAuthenticated: false, user: null, isLoading: false });
        }
      } catch (error) {
        // Session validation failed
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    },

    refreshUser: async () => {
      try {
        const res = await SecureAPI.get('/profile');
        if (res.data?.success && res.data?.profile) {
          set({ user: res.data.profile });
          return res.data.profile;
        }
      } catch (err) {
        console.error('Failed to refresh user:', err);
      }
      return null;
    },

    login: (userData) => set({ user: userData, isAuthenticated: true, isLoading: false }),

    logout: async () => {
      await AuthService.logout();
      set({ user: null, isAuthenticated: false });
    },
  };
});

/** Pick auth state and actions for components */
export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      login: state.login,
      logout: state.logout,
      refreshUser: state.refreshUser,
      verifySession: state.verifySession,
      _initialized: state._initialized,
    }))
  );
}

/** License info from current user (for nav, limits, etc.) */
export function useLicense() {
  const user = useAuthStore((state) => state.user);
  const license = user?.licenses?.[0] ?? null;
  return {
    licenseType: license?.licensesType ?? 'trial',
    totalGenerations: license?.totalGenerations ?? '0',
    generationsUsed: license?.generationsUsed ?? 0,
    licenses: user?.licenses ?? [],
  };
}

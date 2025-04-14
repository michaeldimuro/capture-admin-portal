import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../lib/api/services';
import { useAuthStore } from '../stores/authStore';
import { useEffect, useRef, useCallback } from 'react';
import { queryKeys } from '../lib/api/queryKeys';

// Session inactivity timeout in milliseconds (15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { login: storeLogin, logout: removeUser, getToken } = useAuthStore();
  const inactivityTimerRef = useRef<number | null>(null);
  
  // Reset the inactivity timer when user activity is detected
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
    }
    
    inactivityTimerRef.current = window.setTimeout(() => {
      // Logout the user after inactivity period
      logout();
    }, INACTIVITY_TIMEOUT);
  };
  
  // Memoize the logout function to prevent unnecessary re-renders
  const logout = useCallback(() => {
    authService.logout();
    removeUser();
    
    // Clear inactivity timer
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    
    // Clear all query caches when logging out
    queryClient.clear();
    
    // Always redirect to login page when logging out
    navigate('/login');
  }, [navigate, removeUser, queryClient]);
  
  // Validate session token on app initialization
  const validateSession = useCallback(async () => {
    const token = getToken();
    if (!token) return false;
    
    try {
      const isValid = await authService.validateToken(token);
      if (!isValid) {
        logout();
        return false;
      }
      return true;
    } catch (error) {
      logout();
      return false;
    }
  }, [logout, getToken]);
  
  // Set up event listeners for user activity
  useEffect(() => {
    // Set up event listeners to reset the timer on user activity
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(eventName => {
      window.addEventListener(eventName, resetInactivityTimer);
    });
    
    // Set up listener for session expiration event (from API interceptor)
    window.addEventListener('auth:sessionExpired', logout);
    
    // Initial timer setup if user is logged in
    if (getToken()) {
      resetInactivityTimer();
      // Validate the token on component mount
      validateSession();
    }
    
    // Cleanup event listeners on component unmount
    return () => {
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current);
      }
      
      activityEvents.forEach(eventName => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });
      
      window.removeEventListener('auth:sessionExpired', logout);
    };
  }, [logout, validateSession, getToken]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await authService.login(email, password);
      return response;
    },
    onSuccess: (data) => {
      storeLogin(data.user, data.accessToken, data.refreshToken);
      resetInactivityTimer(); // Start inactivity timer
      // Invalidate any relevant queries that need refreshing after login
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      navigate('/');
    },
  });

  return {
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { useEffect, useRef } from 'react';

// Session inactivity timeout in milliseconds (15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export function useAuth() {
  const navigate = useNavigate();
  const { login: storeLogin, logout: removeUser } = useAuthStore();
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
    if (localStorage.getItem('token')) {
      resetInactivityTimer();
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
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await authApi.login(email, password);
      return response;
    },
    onSuccess: (data) => {
      storeLogin(data.user);
      resetInactivityTimer(); // Start inactivity timer
      navigate('/');
    },
  });

  const logout = () => {
    authApi.logout();
    removeUser();
    
    // Clear inactivity timer
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    
    navigate('/login');
  };

  return {
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
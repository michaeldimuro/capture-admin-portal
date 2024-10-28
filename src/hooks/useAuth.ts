import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const navigate = useNavigate();
  const { login, logout: removeUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await authApi.login(email, password);
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      login(data.user);
      navigate('/');
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    removeUser();
    navigate('/login');
  };

  return {
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
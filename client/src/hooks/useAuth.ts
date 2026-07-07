import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, User } from '@/services/auth.service';

export const useAuth = () => {
  console.log("useAuth() called");
  const queryClient = useQueryClient();

  const query = useQuery<User | null>({
    queryKey: ['auth', 'user'],
    queryFn: authService.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'user'], null);
      window.location.href = '/login';
    },
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};

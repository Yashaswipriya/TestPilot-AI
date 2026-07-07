import api from './api';

export interface User {
  _id: string;
  githubId: string;
  username: string;
  name: string;
  avatarUrl: string;
  email: string;
  role: string;
}

export const authService = {
  getCurrentUser: async (): Promise<User | null> => {
    console.log("Calling /auth/me");
    try {
      const response = await api.get('/auth/me');
      console.log("User:", response.data);
      return response.data.user;
    } catch (error) {
      // If 401, user is not authenticated
      console.log("Error:", error);
      return null;
    }
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  }
};

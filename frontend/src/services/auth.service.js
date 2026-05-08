import api from './api';

/**
 * Authentication service methods.
 */
const authService = {
  /**
   * Register a new user.
   */
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  },

  /**
   * Login a user.
   */
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  },

  /**
   * Logout the current user.
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Get the current user's profile.
   */
  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data;
  },

  /**
   * Check if a user is currently logged in.
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Get the stored user data.
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;

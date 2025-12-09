import api from '../config/api';

export const authenticateWithGoogle = async (googleToken) => {
  try {
    const response = await api.post('/auth/google', { token: googleToken });
    
    // Store the token and user data
    // Note: localStorage is used for simplicity in this demo.
    // For production, consider using httpOnly cookies or a more secure
    // storage mechanism to protect against XSS attacks.
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    // Token will be automatically added by the axios interceptor
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getStoredToken = () => {
  return localStorage.getItem('access_token');
};

import { apiClient } from './api';
import { User } from './types';

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  const data = response.data;
  const token = data.token || data.accessToken || data.data?.token;
  const user = data.user || data.data?.user || data.data;

  if (token) {
    localStorage.setItem('authToken', token);
  }
  if (user && typeof user === 'object') {
    localStorage.setItem('authUser', JSON.stringify(user));
  }
  return { token, user: user as User };
};

export const register = async (name: string, email: string, password: string) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  const data = response.data;
  const token = data.token || data.accessToken || data.data?.token;
  const user = data.user || data.data?.user || data.data;

  if (token) {
    localStorage.setItem('authToken', token);
  }
  if (user && typeof user === 'object') {
    localStorage.setItem('authUser', JSON.stringify(user));
  }
  return { token, user: user as User };
};

export const getCurrentUser = async () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  const response = await apiClient.get('/users/me');
  const data = response.data;
  const user = data.user || data.data || data;
  if (user && typeof user === 'object') {
    localStorage.setItem('authUser', JSON.stringify(user));
  }
  return user as User;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
};



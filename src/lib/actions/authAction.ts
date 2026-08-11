import { apiClient } from '../api';
import { User } from '../types';
import { toast } from 'react-toastify';

export const loginAction = async (email: string, password: string) => {
  try {
    const res = await apiClient.post('/auth/login', { email, password });
    const data = res.data;
    const token = data.token || data.accessToken || data.data?.token;
    const user = data.user || data.data?.user || data.data;

    if (token) {
      localStorage.setItem('authToken', token);
    }
    if (user && typeof user === 'object') {
      localStorage.setItem('authUser', JSON.stringify(user));
    }
    toast.success('Logged in successfully!');
    return { token, user: user as User };
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || 'Login failed';
    toast.error(msg);
    throw error;
  }
};

export const registerAction = async (name: string, email: string, password: string) => {
  try {
    const res = await apiClient.post('/auth/register', { name, email, password });
    const data = res.data;
    const token = data.token || data.accessToken || data.data?.token;
    const user = data.user || data.data?.user || data.data;

    if (token) {
      localStorage.setItem('authToken', token);
    }
    if (user && typeof user === 'object') {
      localStorage.setItem('authUser', JSON.stringify(user));
    }
    toast.success('Registration successful!');
    return { token, user: user as User };
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || 'Registration failed';
    toast.error(msg);
    throw error;
  }
};

export const fetchCurrentUserAction = async (): Promise<User | null> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) return null;
    const res = await apiClient.get('/users/me');
    const data = res.data;
    const user = data.user || data.data || data;
    if (user && typeof user === 'object') {
      localStorage.setItem('authUser', JSON.stringify(user));
    }
    return user as User;
  } catch {
    return null;
  }
};

export const logoutAction = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
  toast.info('Logged out');
};

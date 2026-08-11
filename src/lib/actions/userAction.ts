import { apiClient } from '../api';
import { User } from '../types';
import { toast } from 'react-toastify';

export const getMe = async (): Promise<User | null> => {
  try {
    const res = await apiClient.get('/users/me');
    const data = res.data;
    const user = data.data || data.user || data;
    if (user && typeof user === 'object') {
      localStorage.setItem('authUser', JSON.stringify(user));
    }
    return user as User;
  } catch (error: any) {
    return null;
  }
};

export const updateMe = async (userData: { name?: string; bio?: string; avatar?: string }): Promise<User> => {
  try {
    const res = await apiClient.put('/users/me', userData);
    const data = res.data;
    const updated = data.data || data.user || data;
    if (updated && typeof updated === 'object') {
      localStorage.setItem('authUser', JSON.stringify(updated));
    }
    toast.success('Profile updated successfully');
    return updated as User;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to update profile';
    toast.error(msg);
    throw error;
  }
};

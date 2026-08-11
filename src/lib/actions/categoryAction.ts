import { apiClient } from '../api';
import { Category } from '../types';
import { toast } from 'react-toastify';

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await apiClient.get('/categories');
    const data = res.data;
    const categories = Array.isArray(data) ? data : data.categories || data.data || [];
    return categories as Category[];
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to load categories';
    toast.error(msg);
    return [];
  }
};

import { apiClient } from '../api';
import { Reaction } from '../types';
import { toast } from 'react-toastify';

export const getReactionsByPost = async (postId: string | number): Promise<Reaction[]> => {
  try {
    const res = await apiClient.get(`/reactions/post/${postId}`);
    const data = res.data;
    const reactions = Array.isArray(data) ? data : data.data || data.reactions || [];
    return reactions as Reaction[];
  } catch {
    return [];
  }
};

export const toggleReaction = async (postId: string | number): Promise<any> => {
  try {
    const res = await apiClient.post(`/reactions/post/${postId}`);
    return res.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to toggle reaction';
    toast.error(msg);
    throw error;
  }
};

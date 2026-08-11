import { apiClient } from '../api';
import { Comment } from '../types';
import { toast } from 'react-toastify';

export const getCommentsByPost = async (postId: string | number): Promise<Comment[]> => {
  try {
    const res = await apiClient.get(`/comments/post/${postId}`);
    const data = res.data;
    const comments = Array.isArray(data) ? data : data.data || data.comments || [];
    return comments as Comment[];
  } catch {
    return [];
  }
};

export const createComment = async (postId: string | number, content: string): Promise<Comment> => {
  try {
    const res = await apiClient.post(`/comments/post/${postId}`, { content });
    const data = res.data;
    const created = data.data || data.comment || data;
    toast.success('Comment posted successfully');
    return created as Comment;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to post comment';
    toast.error(msg);
    throw error;
  }
};

export const deleteComment = async (id: string | number): Promise<boolean> => {
  try {
    await apiClient.delete(`/comments/${id}`);
    toast.success('Comment deleted');
    return true;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to delete comment';
    toast.error(msg);
    return false;
  }
};

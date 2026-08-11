import { apiClient } from '../api';
import { Post } from '../types';
import { toast } from 'react-toastify';
import axios from 'axios';

export const getAllPosts = async (page = 1, limit = 6, search = '') => {
  try {
    const params: Record<string, string | number> = { page, limit };
    if (search.trim()) {
      params.search = search.trim();
    }

    const res = await apiClient.get('/posts', { params });
    const data = res.data;

    if (Array.isArray(data)) {
      return {
        posts: data as Post[],
        totalPages: 1,
        total: data.length,
      };
    }

    const posts = (data.data || data.posts || []) as Post[];
    const totalPages = data.pagination?.totalPages || data.totalPages || 1;
    const total = data.pagination?.total || data.total || posts.length;

    return {
      posts,
      totalPages,
      total,
    };
  } catch (error: unknown) {
    let msg = 'Failed to fetch posts';
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.message || error.message || msg;
    }
    toast.error(msg);
    return { posts: [], totalPages: 1, total: 0 };
  }
};

export const getPostById = async (id: string | number): Promise<Post | null> => {
  try {
    const res = await apiClient.get(`/posts/${id}`);
    const data = res.data;
    return (data.data || data.post || data) as Post;
  } catch (error: unknown) {
    let msg = 'Failed to fetch post details';
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.message || error.message || msg;
    }
    toast.error(msg);
    return null;
  }
};

export const getMyPosts = async (page = 1, limit = 6): Promise<{ posts: Post[]; totalPages: number; total: number }> => {
  try {
    const res = await apiClient.get('/posts/my-posts', { params: { page, limit } });
    const data = res.data;
    if (Array.isArray(data)) {
      const total = data.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const start = (page - 1) * limit;
      const posts = data.slice(start, start + limit) as Post[];
      return { posts, totalPages, total };
    }
    const posts = (data.data || data.posts || []) as Post[];
    const totalPages = data.pagination?.totalPages || data.totalPages || Math.max(1, Math.ceil((data.total || posts.length) / limit));
    const total = data.pagination?.total || data.total || posts.length;
    return { posts, totalPages, total };
  } catch (error: unknown) {
    let msg = 'Failed to fetch my posts';
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.message || error.message || msg;
    }
    toast.error(msg);
    return { posts: [], totalPages: 1, total: 0 };
  }
};

export interface CreatePostInput {
  title: string;
  description: string;
  categoryId: string | number;
  image?: string;
}

export const createPost = async (postData: CreatePostInput): Promise<Post> => {
  try {
    const body: Record<string, unknown> = {
      title: postData.title,
      description: postData.description,
      categoryId: postData.categoryId,
    };

    if (postData.image) {
      body.image = postData.image;
    }

    const res = await apiClient.post('/posts', body);
    const data = res.data;
    const createdPost = data.data || data.post || data;
    toast.success('Post published successfully');
    return createdPost as Post;
  } catch (error: unknown) {
    let msg = 'Failed to create post';
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.message || error.message || msg;
    } else if (error instanceof Error) {
      msg = error.message;
    }
    toast.error(msg);
    throw error;
  }
};

export const updatePost = async (id: string | number, postData: Partial<CreatePostInput>): Promise<Post> => {
  try {
    const body: Record<string, unknown> = {};
    if (postData.title !== undefined) body.title = postData.title;
    if (postData.description !== undefined) body.description = postData.description;
    if (postData.categoryId !== undefined) body.categoryId = postData.categoryId;
    if (postData.image !== undefined) body.image = postData.image;

    const res = await apiClient.put(`/posts/${id}`, body);
    const data = res.data;
    const updated = data.data || data.post || data;
    toast.success('Post updated successfully');
    return updated as Post;
  } catch (error: unknown) {
    let msg = 'Failed to update post';
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.message || error.message || msg;
    }
    toast.error(msg);
    throw error;
  }
};

export const deletePost = async (id: string | number): Promise<boolean> => {
  try {
    await apiClient.delete(`/posts/${id}`);
    toast.success('Post deleted successfully');
    return true;
  } catch (error: unknown) {
    let msg = 'Failed to delete post';
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.message || error.message || msg;
    }
    toast.error(msg);
    return false;
  }
};

import { apiClient } from '../api';
import { Post, PostsResponse } from '../types';
import { toast } from 'react-toastify';

export const getAllPosts = async (page = 1, limit = 6, search = '') => {
  try {
    const params: Record<string, any> = { page, limit };
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
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to fetch posts';
    toast.error(msg);
    return { posts: [], totalPages: 1, total: 0 };
  }
};

export const getPostById = async (id: string | number): Promise<Post | null> => {
  try {
    const res = await apiClient.get(`/posts/${id}`);
    const data = res.data;
    return (data.data || data.post || data) as Post;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to fetch post details';
    toast.error(msg);
    return null;
  }
};

export const getMyPosts = async (): Promise<Post[]> => {
  try {
    const res = await apiClient.get('/posts/my-posts');
    const data = res.data;
    const posts = Array.isArray(data) ? data : data.data || data.posts || [];
    return posts as Post[];
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to fetch my posts';
    toast.error(msg);
    return [];
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
    const body: Record<string, any> = {
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
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || 'Failed to create post';
    toast.error(msg);
    throw error;
  }
};

export const updatePost = async (id: string | number, postData: Partial<CreatePostInput>): Promise<Post> => {
  try {
    const body: Record<string, any> = {};
    if (postData.title !== undefined) body.title = postData.title;
    if (postData.description !== undefined) body.description = postData.description;
    if (postData.categoryId !== undefined) body.categoryId = postData.categoryId;
    if (postData.image !== undefined) body.image = postData.image;

    const res = await apiClient.put(`/posts/${id}`, body);
    const data = res.data;
    const updated = data.data || data.post || data;
    toast.success('Post updated successfully');
    return updated as Post;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to update post';
    toast.error(msg);
    throw error;
  }
};

export const deletePost = async (id: string | number): Promise<boolean> => {
  try {
    await apiClient.delete(`/posts/${id}`);
    toast.success('Post deleted successfully');
    return true;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to delete post';
    toast.error(msg);
    return false;
  }
};

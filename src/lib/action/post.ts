import axios from 'axios';
import { Post, Category, Comment, User } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aponverse-postgresql-prisma-server.onrender.com/api';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Posts API
export const fetchPosts = async (search = '', categoryId = '', page = 1) => {
  try {
    const res = await axios.get(`${API_URL}/posts`, {
      params: { search, categoryId, page },
      headers: getAuthHeaders(),
    });
    const data = res.data;
    if (Array.isArray(data)) return { posts: data, total: data.length };
    return {
      posts: (data.posts || data.data || []) as Post[],
      total: data.total || data.meta?.total || (data.posts || []).length,
    };
  } catch (err: any) {
    console.error('Fetch posts error:', err);
    throw err;
  }
};

export const fetchMyPosts = async () => {
  try {
    const res = await axios.get(`${API_URL}/posts/my-posts`, {
      headers: getAuthHeaders(),
    });
    const data = res.data;
    return (Array.isArray(data) ? data : data.posts || data.data || []) as Post[];
  } catch (err: any) {
    // Fallback: fetch all and filter by current user if my-posts endpoint differs
    try {
      const allRes = await axios.get(`${API_URL}/posts`, { headers: getAuthHeaders() });
      const all = Array.isArray(allRes.data) ? allRes.data : allRes.data.posts || [];
      const userJson = localStorage.getItem('authUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        return all.filter((p: Post) => p.authorId === user.id);
      }
      return all;
    } catch {
      throw err;
    }
  }
};

export const fetchPostById = async (id: string | number) => {
  const res = await axios.get(`${API_URL}/posts/${id}`, {
    headers: getAuthHeaders(),
  });
  const data = res.data;
  return (data.post || data.data || data) as Post;
};

export const createPostApi = async (postData: { title: string; content: string; categoryId?: number | string }) => {
  const res = await axios.post(`${API_URL}/posts`, postData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updatePostApi = async (id: string | number, postData: { title: string; content: string; categoryId?: number | string }) => {
  const res = await axios.put(`${API_URL}/posts/${id}`, postData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deletePostApi = async (id: string | number) => {
  const res = await axios.delete(`${API_URL}/posts/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Categories API
export const fetchCategories = async () => {
  try {
    const res = await axios.get(`${API_URL}/categories`, {
      headers: getAuthHeaders(),
    });
    const data = res.data;
    return (Array.isArray(data) ? data : data.categories || data.data || []) as Category[];
  } catch {
    return [
      { id: 1, name: 'Technology' },
      { id: 2, name: 'Programming' },
      { id: 3, name: 'Design' },
      { id: 4, name: 'Lifestyle' },
    ];
  }
};

// Comments API
export const addCommentApi = async (postId: string | number, content: string) => {
  const res = await axios.post(`${API_URL}/posts/${postId}/comments`, { content }, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const fetchCommentsApi = async (postId: string | number) => {
  try {
    const res = await axios.get(`${API_URL}/posts/${postId}/comments`, {
      headers: getAuthHeaders(),
    });
    const data = res.data;
    return (Array.isArray(data) ? data : data.comments || data.data || []) as Comment[];
  } catch {
    return [];
  }
};

// Reactions / Likes API
export const toggleLikeApi = async (postId: string | number) => {
  try {
    const res = await axios.post(`${API_URL}/posts/${postId}/like`, {}, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch {
    // Alternative endpoint format fallback
    const res = await axios.post(`${API_URL}/posts/${postId}/reactions`, { type: 'LIKE' }, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }
};

// Profile API
export const updateProfileApi = async (profileData: { name?: string; bio?: string; avatar?: string }) => {
  const res = await axios.put(`${API_URL}/users/profile`, profileData, {
    headers: getAuthHeaders(),
  });
  const data = res.data;
  const user = data.user || data.data || data;
  if (user && typeof user === 'object') {
    localStorage.setItem('authUser', JSON.stringify(user));
  }
  return user as User;
};

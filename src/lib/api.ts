import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aponverse-postgresql-prisma-server.onrender.com';
const API_BASE = `${BASE_URL.replace(/\/$/, '')}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle global errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      toast.error('Session expired or unauthorized. Please log in again.');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ImgBB Upload helper
export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '245528cf5f3002b3c4fe53914c382951';
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const imageUrl = res.data?.data?.url || res.data?.data?.display_url;
    if (!imageUrl) {
      throw new Error('Failed to get image URL from ImgBB');
    }
    return imageUrl;
  } catch (err: any) {
    const msg = err?.response?.data?.error?.message || err.message || 'Image upload failed';
    toast.error(`ImgBB Upload Error: ${msg}`);
    throw new Error(msg);
  }
};

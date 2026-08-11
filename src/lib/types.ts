export interface User {
  id: number | string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Category {
  id: number | string;
  name: string;
  slug?: string;
}

export interface Comment {
  id: number | string;
  content: string;
  postId: number | string;
  authorId: number | string;
  author?: User;
  user?: User;
  createdAt: string;
}

export interface Reaction {
  id: number | string;
  postId: number | string;
  userId: number | string;
  type?: string;
}

export interface Post {
  id: number | string;
  title: string;
  description?: string;
  content?: string;
  image?: string | null;
  category?: Category | string;
  categoryId?: number | string;
  authorId?: number | string;
  author?: User;
  user?: User;
  comments?: Comment[];
  reactions?: Reaction[];
  _count?: {
    comments?: number;
    reactions?: number;
    likes?: number;
  };
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PostsResponse {
  success?: boolean;
  message?: string;
  data: Post[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}



export interface User {
  username: string;
  profile?: {
    slug?: string | undefined;
    avatar?: string | null;
  };
  name?: string;
  avatar?: string | null;
  slug?: string;
  id?: number;
  first_name?: string;
  last_name?: string;
}

export interface Comment {
  id: number;
  user: User; // Usuário como objeto com username e slug
  text: string;
  created_at: string; // Formato da data (ex: "2025-09-21 18:36")
  tweet?: number; // ID do tweet, opcional se já inferido pelo contexto
}

export interface Tweet {
  id: number;
  body: string;
  text?: string; // Fallback se o backend usar 'text'
  image: string | null;
  created_at: string; // Alinhado com o formato do backend
  comment_count: number;
  retweet_count: number;
  likes_count: number;
  liked: boolean;
  retweeted: boolean;
  user: User;
  comments: Comment[];
}
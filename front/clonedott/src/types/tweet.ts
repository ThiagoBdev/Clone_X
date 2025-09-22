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
  user: User; 
  text: string;
  created_at: string; 
  tweet?: number; 
}

export interface Tweet {
  id: number;
  body: string;
  text?: string; 
  image: string | null;
  created_at: string; 
  comment_count: number;
  retweet_count: number;
  likes_count: number;
  liked: boolean;
  retweeted: boolean;
  user: User;
  comments: Comment[];
}
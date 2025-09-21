export interface User {
  id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  name?: string; 
  slug?: string; 
  avatar?: string | null; 
  profile?: {
    slug?: string;
    avatar?: string | null;
    cover?: string | null;
    bio?: string | null;
    link?: string | null;
  }; 
  bio?: string; 
  link?: string; 
  postCount?: number; 
  cover?: string | null; 
}
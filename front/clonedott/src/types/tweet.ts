export interface Tweet {
  id: number;
  body: string;
  text?: string; // Fallback se o backend usar 'text'
  image: string | null;
  dataPost: Date;
  commentCount: number;
  retweetCount: number;
  likeCount: number;
  liked: boolean;
  retweeted: boolean;
  user: {
    name: string;
    avatar: string | null;
    slug: string;
    id: number; 
    first_name?: string; 
    last_name?: string;  
    username?: string;
    profile?: {
      avatar?: string | null; 
      slug?: string;          
    };
  };
}
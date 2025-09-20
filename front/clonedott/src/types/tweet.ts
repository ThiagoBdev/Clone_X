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
    id: number; // Adicionado para verificação de propriedade
    first_name?: string; // Adicionado como opcional
    last_name?: string;  // Adicionado como opcional
    username?: string;
    profile?: {
      avatar?: string | null; // Adicionado como opcional
      slug?: string;          // Adicionado como opcional
    };
  };
}
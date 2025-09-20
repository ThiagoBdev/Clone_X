export interface User {
  id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  name?: string; // Adicionado como campo direto
  slug?: string; // Adicionado como campo direto
  avatar?: string | null; // Adicionado como campo direto
  profile?: {
    slug?: string;
    avatar?: string | null;
    cover?: string | null;
    bio?: string | null;
    link?: string | null;
  }; // Mantido como opcional
  postCount?: number;
}
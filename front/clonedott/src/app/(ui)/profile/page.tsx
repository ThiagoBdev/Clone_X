import api from '@/lib/api';
import { redirect } from 'next/navigation';

export default async function Page() {
  try {
    const response = await api.get('users/me/');
    const userData = response.data;
    const slug = userData.profile?.slug || 'default'; // Fallback caso o slug não exista
    redirect(`/${slug}`);
  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
    redirect('/login'); // Redireciona para login em caso de erro
  }

  return null;
}
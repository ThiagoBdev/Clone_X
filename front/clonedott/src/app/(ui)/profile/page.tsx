"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User } from '@/types/user';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token atual (Profile):', token ? 'Presente' : 'Ausente');

        const response = await api.get('/api/users/me/');
        const userData = response.data;
        setUser(userData);

        
        const slug = userData.profile?.slug || 'default';
        router.push(`/${slug}`);
      } catch (err: any) {
        console.error('Erro ao carregar usuário (Profile):', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        if (err.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
          router.push('/login');
        } else {
          setError('Falha ao carregar o perfil.');
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <div>Carregando...</div>;
  if (error || !user) return <div>{error || 'Usuário não encontrado.'}</div>;

  return null; 
}
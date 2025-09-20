"use client"

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { User } from '@/types/user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('users/me/');
        setUser(response.data);
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError('Falha ao carregar os dados do usuário.');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
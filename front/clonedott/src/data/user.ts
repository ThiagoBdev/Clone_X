"use client"

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { User } from '@/types/user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; 

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/users/me/');
        if (isMounted) {
          setUser(response.data);
          setError(null);
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        if (isMounted) {
          setError('Falha ao carregar os dados do usuário.');
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    
    return () => {
      isMounted = false;
    };
  }, []); 

  return { user, loading, error };
};
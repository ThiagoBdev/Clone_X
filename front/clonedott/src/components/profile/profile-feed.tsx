"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/data/user';
import { useParams } from 'next/navigation';
import { TweetItem } from "../tweet/tweet-item";
import api from '@/lib/api';

export const ProfileFeed = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const params = useParams();
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTweets = async () => {
      if (!user && !params?.slug) {
        setError('Usuário não autenticado ou slug inválido.');
        setLoading(false);
        return;
      }

      try {
        const slug = params?.slug || user?.slug;
        if (!slug) {
          setError('Slug não encontrado.');
          setLoading(false);
          return;
        }

        const response = await api.get(`users/${slug}/tweets/`);
        setTweets(response.data); 
      } catch (err) {
        console.error('Erro ao carregar tweets do perfil:', err);
        setError('Falha ao carregar os tweets do perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [user, params?.slug]);

  if (userLoading || loading) return <div>Carregando...</div>;
  if (userError || error) return <div>{userError || error}</div>;

  return (
    <div>
      {tweets.map((tweet, index) => (
        <TweetItem key={index} tweet={tweet} />
      ))}
    </div>
  );
};
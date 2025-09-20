"use client";

import { useState, useEffect } from 'react';
import { TweetItem } from "../tweet/tweet-item";
import api from '@/lib/api';

export const HomeFeed = () => {
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await api.get('tweets/');
        setTweets(response.data); 
      } catch (err) {
        console.error('Erro ao carregar tweets:', err);
        setError('Falha ao carregar os tweets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {tweets.map((tweet, index) => (
        <TweetItem key={index} tweet={tweet} />
      ))}
    </div>
  );
};
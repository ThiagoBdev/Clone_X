
"use client";

import { useEffect, useState } from 'react';
import { TweetItem } from "../tweet/tweet-item";
import api from '@/lib/api';
import { Tweet } from '@/types/tweet';
import './profile-feed.css';

interface ProfileFeedProps {
  slug: string;
}

export const ProfileFeed = ({ slug }: ProfileFeedProps) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        if (!slug) {
          setError('Slug não encontrado.');
          setLoading(false);
          return;
        }

        const response = await api.get('/tweets/');
        const allTweets = response.data;
        // Filtra tweets pelo slug do usuário
        const userTweets = allTweets.filter(
          (tweet: Tweet) =>
            tweet.user?.profile?.slug === slug || tweet.user?.username === slug
        );
        setTweets(userTweets);
      } catch (err: any) {
        console.error('Erro ao carregar tweets do perfil:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError('Falha ao carregar os tweets do perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [slug]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "10px" }}>Carregando tweets...</div>;
  if (error) return <div>{error}</div>;
  if (!tweets.length) return <div style={{ textAlign: "center", marginTop: "10px" }}>Nenhum post feito até agora</div>;

  return (
    <div className="profile-feed">
      {tweets.map((tweet) => (
        <TweetItem key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";
import { TweetItem } from "../tweet/tweet-item";
import api from "@/lib/api";
import { Tweet } from "@/types/tweet";
import "./profile-feed.css";

interface ProfileFeedProps {
  slug?: string; // Tornamos slug opcional
  isTimeline?: boolean; // Novo parâmetro para indicar se é a timeline geral
}

export const ProfileFeed = ({ slug, isTimeline = false }: ProfileFeedProps) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        let response;
        if (isTimeline && !slug) {
          // Timeline geral: tweets de usuários seguidos
          response = await api.get('/tweets/');
        } else if (slug) {
          // Tweets de um perfil específico
          response = await api.get(`/tweets/?user__profile__slug=${slug}`);
        } else {
          setError("Nenhum slug ou modo timeline especificado.");
          setLoading(false);
          return;
        }

        const allTweets = response.data;
        setTweets(allTweets);
      } catch (err: any) {
        console.error("Erro ao carregar tweets do perfil:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError("Falha ao carregar os tweets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [slug, isTimeline]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "10px" }}>Carregando tweets...</div>;
  if (error) return <div>{error}</div>;
  if (!tweets.length) return <div style={{ textAlign: "center", marginTop: "10px" }}>Nenhum post feito até agora</div>;

  return (
    <div className="profile-feed">
      {tweets.map((tweet) => (
        <div key={tweet.id}>
          <TweetItem key={tweet.id} tweet={tweet} />
        </div>
      ))}
    </div>
  );
};
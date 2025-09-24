"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/data/user';
import { RecommendationItem, RecommendationItemSkeleton } from "./recommendation-item";
import "./trending-area.css";
import api from '@/lib/api';
import { User } from '@/types/user';

export const RecommendationArea = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const [recommendations, setRecommendations] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/users/recommendations/?exclude=${user.id}&limit=5`); 
        const limitedRecommendations = response.data.slice(0, 3);
        setRecommendations(limitedRecommendations);
      } catch (err) {
        console.error('Erro ao carregar recomendações:', err);
        if (err instanceof Error) {
          setError(`Falha ao carregar recomendações: ${err.message}`);
        } else {
          setError('Falha ao carregar recomendações: Erro desconhecido.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (userLoading || loading) {
    return (
      <div className="containerArea">
        <h2 className="containerOQ">Quem seguir</h2>
        <div className="continuos-container">
          <RecommendationItemSkeleton />
          <RecommendationItemSkeleton />
          <RecommendationItemSkeleton />
        </div>
      </div>
    );
  }

  if (userError || error || !user) {
    return (
      <div className="containerArea">
        <h2 className="containerOQ">Quem seguir</h2>
        <div className="continuos-container">
          <p>{error || userError || 'Erro ao carregar recomendações.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="containerArea">
      <h2 className="containerOQ">Quem seguir</h2>
      <div className="continuos-container">
        {recommendations.map((userData, index) => (
          <RecommendationItem key={userData.id || index} user={userData} />
        ))}
        {recommendations.length < 3 && <RecommendationItemSkeleton />}
      </div>
    </div>
  );
};
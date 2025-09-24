"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TweetItem } from "@/components/tweet/tweet-item";
import { TweetPost } from "@/components/tweet/tweet-post";
import { GeneralHeader } from "@/components/ui/general-header";
import api from '@/lib/api';

import "./page.css";

export default function Page() {
  const params = useParams();
  const [tweet, setTweet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTweet = async () => {
      if (!params?.id) {
        setError('ID do tweet não encontrado.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/tweets/${params.id}/`);
        setTweet(response.data); 
      } catch (err) {
        console.error('Erro ao carregar tweet:', err);
        setError('Falha ao carregar o tweet.');
      } finally {
        setLoading(false);
      }
    };

    fetchTweet();
  }, [params?.id]);

  if (loading) return <div>Carregando...</div>;
  if (error || !tweet) return <div>{error || 'Tweet não encontrado.'}</div>;

  return (
    <div>
      <GeneralHeader backHref="/">
        <div className="containerJ1">Voltar</div>
      </GeneralHeader>
      <div className="containerJ2">
        <TweetItem tweet={tweet} />
        <div className="containerJ3">
          <TweetPost />
        </div>
        <TweetItem tweet={tweet} hideComments />
      </div>
    </div>
  );
}
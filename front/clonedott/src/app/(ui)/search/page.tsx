"use client";

import { useState, useEffect } from "react";
import { TweetItem } from "@/components/tweet/tweet-item";
import { GeneralHeader } from "@/components/ui/general-header";
import { SearchInput } from "@/components/ui/search-input";
import { redirect } from "next/navigation";
import api from "@/lib/api";
import "./page.css";

export default function Page({ searchParams }: { searchParams: { q?: string | string[] | undefined } }) {
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redireciona se não houver searchParams.q
  if (!searchParams.q) redirect("/");

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        // Converte searchParams.q para string, usando o primeiro valor se for array
        const query = Array.isArray(searchParams.q) ? searchParams.q[0] || "" : searchParams.q || "";
        const response = await api.get(`tweets/?search=${encodeURIComponent(query)}`);
        setTweets(response.data);
      } catch (err) {
        console.error("Erro ao carregar tweets:", err);
        setError("Falha ao carregar os tweets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [searchParams.q]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <GeneralHeader backHref="/">
        <SearchInput defaultValue={searchParams.q} />
      </GeneralHeader>
      <div className="containerO1">
        {tweets.map((tweet, index) => (
          <TweetItem key={index} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}
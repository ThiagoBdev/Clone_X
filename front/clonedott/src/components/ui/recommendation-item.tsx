import { User } from "@/types/user";
import Link from "next/link";
import "./recommendation.css";
import { Button } from "./button";
import { useState } from "react";
import api from '@/lib/api';

type Props = {
  user: User;
};

export const RecommendationItem = ({ user }: Props) => {
  const displayName = user.first_name || user.username || "Usuário Desconhecido";
  const displaySlug = user.profile?.slug || user.slug || "sem-slug";
  const displayAvatar = user.profile?.avatar || user.avatar || "https://api.dicebear.com/7.x/bottts/png?size=40";

  const [following, setFollowing] = useState(false);

  const handleFollowButton = async () => {
    try {
      const response = await api.post(`/users/${user.id}/follow/`);
      setFollowing(response.data.following); // Atualiza o estado baseado na resposta
    } catch (err) {
      console.error('Erro ao seguir usuário:', err);
    }
  };

  return (
    <div className="maincontainer">
      <div className="containerimagem">
        <Link href={`/${displaySlug}`}>
          <img src={displayAvatar} alt={displayName} />
        </Link>
      </div>
      <div className="containerfinal">
        <Link href={`/${displaySlug}`} className="namelink">
          {displayName}
        </Link>
        <div className="textoarroba namelink">@{displaySlug}</div>
      </div>
      <div className="containerbutton">
        {!following && (
          <Button label="Seguir" onClick={handleFollowButton} size={3} />
        )}
        {following && <Button label="Seguindo" disabled size={3} />}
      </div>
    </div>
  );
};

export const RecommendationItemSkeleton = () => {
  return (
    <div className="maincontainer">
      <div className="containerimagem">
        <div className="skeleton" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%' }} />
      </div>
      <div className="containerfinal">
        <div className="skeleton" style={{ width: '100px', height: '16px' }} />
        <div className="skeleton" style={{ width: '80px', height: '14px', marginTop: '2px' }} />
      </div>
    </div>
  );
};
import { User } from "@/types/user";
import Link from "next/link";
import "./recommendation.css";
import { Button } from "./button";
import { useState, useEffect } from "react";
import api from '@/lib/api';

type Props = {
  user: User;
};

export const RecommendationItem = ({ user }: Props) => {
  const displayName = user.first_name || user.username || "Usuário Desconhecido";
  const displaySlug = user.profile?.slug || user.slug || "sem-slug";
  const displayAvatar = user.profile?.avatar || user.avatar || "https://api.dicebear.com/7.x/bottts/png?size=40";

  const [following, setFollowing] = useState<boolean>(false);

  const checkFollowingStatus = async (targetUserId: number) => {
    
    try {
      const meResponse = await api.get('/users/me/');
      const currentUserId = meResponse.data.id;
      const profileResponse = await api.get(`/users/${currentUserId}/`);
      const profile = profileResponse.data.profile; 
      if (profile && Array.isArray(profile.following)) {
        setFollowing(profile.following.some((u: User) => u.id === targetUserId));
      } else {
        setFollowing(false); 
      }
    } catch (err) {
      console.error('Erro ao verificar status de follow:', err);
      setFollowing(false); 
    }
  };


  useEffect(() => {
    if (user.id) {
      checkFollowingStatus(user.id);
    }
  }, [user.id]);

  const handleFollowButton = async () => {
    if (!following) {
      try {
        const response = await api.post(`/users/${user.id}/follow/`);
        setFollowing(response.data.following); 
        console.log('Follow realizado, novo status:', response.data.following);
      } catch (err) {
        console.error('Erro ao seguir usuário:', err);
      }
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
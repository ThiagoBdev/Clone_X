"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GeneralHeader } from "@/components/ui/general-header";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { ProfileFeed } from "@/components/profile/profile-feed";
import api from "@/lib/api";
import { User } from "@/types/user";
import "./page.css";
import React from "react";

export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMeState, setIsMeState] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const resolvedParams = React.use(params);

  const fetchCounts = async (userId: number) => {
    try {
      console.log("Buscando contadores para userId:", userId);
      const countsResponse = await api.get(`/users/${userId}/followers-count/`);
      console.log("Dados dos contadores:", countsResponse.data);
      setFollowersCount(countsResponse.data.followers_count);
      setFollowingCount(countsResponse.data.following_count);
    } catch (err) {
      console.error("Erro ao carregar contadores:", err);
    }
  };

  const checkFollowingStatus = async (targetUserId: number) => {
    try {
      const meResponse = await api.get("/users/me/");
      const currentUserId = meResponse.data.id;
      const profileResponse = await api.get(`/users/${currentUserId}/`);
      const profile = profileResponse.data.profile;
      if (profile && Array.isArray(profile.following)) {
        const isFollowingNow = profile.following.includes(targetUserId);
        setIsFollowing(isFollowingNow);
        console.log("Status de follow atualizado:", isFollowingNow);
      } else {
        console.log("following não disponível, usando fallback");
        setIsFollowing(false);
      }
    } catch (err) {
      console.error("Erro ao verificar status de follow:", err);
      setIsFollowing(false);
    }
  };

  const handleFollow = async (userId: number) => {
    if (!isFollowing) {
      try {
        console.log("Tentando seguir usuário com ID:", userId);
        const response = await api.post(`/users/${userId}/follow/`);
        console.log("Resposta do follow:", response.data);
        await fetchCounts(userId);
        setIsFollowing(response.data.following);
      } catch (err: any) {
        console.error("Erro ao seguir usuário:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
      }
    } else {
      try {
        console.log("Tentando deixar de seguir usuário com ID:", userId);
        const response = await api.post(`/users/${userId}/follow/`);
        console.log("Resposta do unfollow:", response.data);
        await fetchCounts(userId);
        setIsFollowing(!response.data.following);
      } catch (err: any) {
        console.error("Erro ao deixar de seguir usuário:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token atual (Profile):", token ? "Presente" : "Ausente");

        const profileResponse = await api.get(`/users/slug/${resolvedParams.slug}/`);
        const profileUser = profileResponse.data;
        setUser(profileUser);  

        const meResponse = await api.get("/users/me/");
        const currentUser = meResponse.data;
        const isMe = currentUser.profile?.slug === resolvedParams.slug;
        setIsMeState(isMe);
        console.log(
          "isMe:",
          isMe,
          "Profile slug:",
          currentUser.profile?.slug,
          "Params slug:",
          resolvedParams.slug
        );

        
        if (profileUser && profileUser.id) {  
          const userId = profileUser.id;  
          await fetchCounts(userId);
          await checkFollowingStatus(userId);
        } else {
          console.warn("User não carregou corretamente, pulando fetches.");
        }
      } catch (err: any) {
        console.error("Erro ao carregar usuário:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        if (err.response?.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
          router.push("/login");
        } else if (err.response?.status === 404) {
          setError("Usuário não encontrado.");
          router.push("/");
        } else {
          setError("Falha ao carregar o perfil.");
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [resolvedParams.slug, router]);  

  if (loading) return <div>Carregando...</div>;
  if (error || !user) return <div>{error || "Usuário não encontrado."}</div>;

  const displayName = user.first_name || user.username || "Usuário Desconhecido";
  const displaySlug = user.profile?.slug || "default";
  const displayAvatar = user.profile?.avatar || "https://api.dicebear.com/7.x/bottts/png?size=40";
  const displayCover = user.profile?.cover || "https://placehold.co/300x100";
  const displayBio = user.profile?.bio || "";
  const displayLink = user.profile?.link || "";
  const postCount = user.postCount || 0;

  return (
    <div>
      <GeneralHeader backHref="/home">
        <div className="containerH1">{displayName}</div>
        <div className="containerH2">{postCount} posts</div>
      </GeneralHeader>

      <section className="containerS1">
        <div className="containerS2" style={{ backgroundImage: `url(${displayCover})` }}></div>
        <div className="containerP1">
          <img src={displayAvatar} alt={displayName} className="containerP2" />
          <div className="containerP3">
            {isMeState && (
              <Link href={`/${displaySlug}/edit`}>
                <Button label="Editar Perfil" size={2} />
              </Link>
            )}
            {!isMeState && user && user.id !== undefined && (
              <Button
                label={isFollowing ? "Seguindo" : "Seguir"}
                size={2}
                onClick={() => handleFollow(user.id)}  
                disabled={isFollowing}
              />
            )}
          </div>
        </div>
        <div className="containerX1">
          <div className="containerX2">{displayName}</div>
          <div className="containerX3">@{displaySlug}</div>
          <div className="containerX4">{displayBio}</div>
          {displayLink && (
            <div className="containerX5">
              <FontAwesomeIcon icon={faLink} className="containerX6" />
              <Link href={displayLink} target="_blank" className="containerX7">
                {displayLink}
              </Link>
            </div>
          )}
          <div className="containerX8">
            <div className="containerX9">
              <span className="containerX10">{followingCount} </span>Seguindo
            </div>
            <div className="containerX9">
              <span className="containerX10">{followersCount} </span>Seguidores
            </div>
          </div>
        </div>
      </section>
      <ProfileFeed slug={displaySlug} />
    </div>
  );
}
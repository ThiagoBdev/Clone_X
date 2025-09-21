
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GeneralHeader } from "@/components/ui/general-header";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { ProfileFeed } from "@/components/profile/profile-feed";
import api from '@/lib/api';
import { User } from '@/types/user';
import "./page.css";
import React from 'react';

export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMeState, setIsMeState] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolvedParams = React.use(params);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token atual (Profile):', token ? 'Presente' : 'Ausente');

        // Carrega o perfil com base no slug da URL
        const profileResponse = await api.get(`/users/slug/${resolvedParams.slug}/`);
        const profileUser = profileResponse.data;
        setUser(profileUser);

        // Verifica se é o usuário autenticado
        const meResponse = await api.get('/users/me/');
        const currentUser = meResponse.data;
        const isMe = currentUser.profile?.slug === resolvedParams.slug;
        setIsMeState(isMe);
        console.log('isMe:', isMe, 'Profile slug:', currentUser.profile?.slug, 'Params slug:', resolvedParams.slug);
      } catch (err: any) {
        console.error('Erro ao carregar usuário:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        if (err.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
          router.push('/login');
        } else if (err.response?.status === 404) {
          setError('Usuário não encontrado.');
          router.push('/');
        } else {
          setError('Falha ao carregar o perfil.');
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [resolvedParams.slug, router]);

  if (loading) return <div>Carregando...</div>;
  if (error || !user) return <div>{error || 'Usuário não encontrado.'}</div>;

  const displayName = user.first_name || user.username || 'Usuário Desconhecido';
  const displaySlug = user.profile?.slug || 'default';
  const displayAvatar = user.profile?.avatar || 'https://api.dicebear.com/7.x/bottts/png?size=40';
  const displayCover = user.profile?.cover || 'https://placehold.co/300x100';
  const displayBio = user.profile?.bio || '';
  const displayLink = user.profile?.link || '';
  const postCount = user.postCount || 0;
  const followingCount = 99; // Substituir por valor real quando disponível
  const followersCount = 99; // Substituir por valor real quando disponível

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
            {!isMeState && <Button label="Seguir" size={2} />}
          </div>
        </div>
        <div className="containerX1">
          <div className="containerX2">{displayName}</div>
          <div className="containerX3">@{displaySlug}</div>
          <div className="containerX4">{displayBio}</div>
          {displayLink && (
            <div className="containerX5">
              <FontAwesomeIcon icon={faLink} className="containerX6" />
              <Link href={displayLink} target="_blank" className="containerX7">{displayLink}</Link>
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

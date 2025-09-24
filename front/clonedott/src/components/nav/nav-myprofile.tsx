"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User } from '@/types/user';
import './nav-myprofile.css';

export const NavMyProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/users/me/');
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="maincontainer">
        <div className="containerimagem">
          <img
            src="https://api.dicebear.com/7.x/identicon/png?size=40"
            alt="Carregando"
          />
        </div>
        <div className="containerfinal">
          <span className="namelink">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="maincontainer">
        <div className="containerimagem">
          <Link href="/login">
            <img
              src="https://api.dicebear.com/7.x/identicon/png?size=40"
              alt="Usuário não logado"
            />
          </Link>
        </div>
        <div className="containerfinal">
          <Link href="/login" className="namelink">
            Fazer login
          </Link>
          <div className="textoarroba namelink">Não logado</div>
        </div>
      </div>
    );
  }

  const displaySlug = user.profile?.slug || user.slug || "sem-slug";
  const displayAvatar = user.profile?.avatar?.startsWith('http') ? user.profile?.avatar : (user.avatar?.startsWith('http') ? user.avatar : "https://api.dicebear.com/7.x/bottts/png?size=40");
  const displayName = user.first_name || user.username || "Usuário Desconhecido";


  return (
    <div className="maincontainer">
      <div className="containerimagem">
        <Link href={`/${displaySlug}`}>
          <img
            src={displayAvatar}
            alt={displayName} 
            onError={(e) => { (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/identicon/png?size=40"; }} 
          />
        </Link>
      </div>
      <div className="containerfinal">
        <Link href={`/${displaySlug}`} className="namelink">
          {displayName}
        </Link>
        <div className="textoarroba namelink">@{displaySlug}</div>
      </div>
    </div>
  );
};
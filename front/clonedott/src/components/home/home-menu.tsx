"use client";

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Logo } from "../ui/logo";
import { faHouse, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./home-menu.css";
import { SearchInput } from "../ui/search-input";
import { NavItem } from "../nav/nav-item";
import { Navlogout } from "../nav/nav-logout";
import api from '@/lib/api';

type Props = {
  closeAction: () => void;
};

export const HomeMenu = ({ closeAction }: Props) => {
  const [userSlug, setUserSlug] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserSlug = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUserSlug(null);
          return;
        }
        const response = await api.get('/users/me/');
        setUserSlug(response.data.profile?.slug || null);
      } catch (error) {
        console.error('Erro ao carregar slug do usuário:', error);
        setUserSlug(null);
      }
    };
    fetchUserSlug();
  }, []);

  return (
    <div className="ContainerhomeBar">
      <div className="containercenter">
        <Logo size={32} />
        <div onClick={closeAction} className="iconX">
          <FontAwesomeIcon icon={faXmark} className="iconimagebar" />
        </div>
      </div>

      <div style={{ marginTop: "10px" }}>
        <SearchInput />
      </div>

      <div>
        <NavItem href="/home" icon={faHouse} label="Pagina inicial" />
        <NavItem
          href={userSlug ? `/${userSlug}` : '/login'}
          icon={faUser}
          label="Meu perfil"
        />
        <Navlogout />
      </div>
    </div>
  );
};
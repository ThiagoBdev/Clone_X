"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/data/user';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../ui/button';
import './tweet-post.css';
import Link from 'next/link';
import api from '@/lib/api';

export const TweetPost = () => {
  const { user, loading, error } = useUser();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  
  useEffect(() => {
    if (user) {
      console.log('User data:', user);
      console.log('Profile data:', user.profile);
    }
  }, [user]);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        setImage(target.files[0]);
      }
    };
    input.click();
  };

  const handlePostClick = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!content.trim() && !image) {
      alert('Por favor, adicione um texto ou imagem para postar.');
      return;
    }

    const formData = new FormData();
    formData.append('text', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await api.post('/api/tweets/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setContent('');
      setImage(null);
      if (contentEditableRef.current) {
        contentEditableRef.current.innerText = '';
      }
    } catch (error) {
      console.error('Erro ao postar tweet:', error);
      alert('Erro ao postar. Tente novamente.');
    }
  };

  const handleInput = () => {
    if (contentEditableRef.current) {
      setContent(contentEditableRef.current.innerText);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Erro ao carregar o avatar:', e);
    e.currentTarget.src = 'https://api.dicebear.com/7.x/bottts/png?size=40'; // Fallback
  };

  if (loading) {
    return (
      <div className="ContainerPensando">
        <div>
          <img
            src="https://api.dicebear.com/7.x/identicon/png?size=40"
            alt="Carregando"
            className="ContainerEnquadro"
          />
        </div>
        <div className="ContainerSimples">
          <div className="CampoEditavel" role="textbox">
            Carregando...
          </div>
          <div className="ContainerDaImagem">
            <div className="ContainerDoIconeImg">
              <FontAwesomeIcon icon={faImage} className="ContainerTamanho" />
            </div>
            <div className="ContainerLargura">
              <Button label="Postar" size={2} disabled />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="ContainerPensando">
        <div>
          <Link href="/login">
            <img
              src="https://api.dicebear.com/7.x/identicon/png?size=40"
              alt="Usuário não logado"
              className="ContainerEnquadro"
            />
          </Link>
        </div>
        <div className="ContainerSimples">
          <div className="CampoEditavel" role="textbox">
            {error || 'Faça login para postar'}
          </div>
          <div className="ContainerDaImagem">
            <div className="ContainerDoIconeImg">
              <FontAwesomeIcon icon={faImage} className="ContainerTamanho" />
            </div>
            <div className="ContainerLargura">
              <Button label="Postar" size={2} disabled />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ContainerPensando">
      <div>
        <img
          src={user.profile?.avatar || 'https://api.dicebear.com/7.x/bottts/png?size=40'}
          alt={user.username || 'Usuário'}
          className="ContainerEnquadro"
          onError={handleImageError}
        />
      </div>
      <div className="ContainerSimples">
        <div
          className="CampoEditavel"
          contentEditable
          role="textbox"
          ref={contentEditableRef}
          onInput={handleInput}
        ></div>
        <div className="ContainerDaImagem">
          <div onClick={handleImageUpload} className="ContainerDoIconeImg">
            <FontAwesomeIcon icon={faImage} className="ContainerTamanho" />
          </div>
          <div className="ContainerLargura">
            <Button label="Postar" size={2} onClick={handlePostClick} />
          </div>
        </div>
      </div>
    </div>
  );
};
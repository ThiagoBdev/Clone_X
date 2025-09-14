"use client"

import { useState, useEffect } from "react";
import { GeneralHeader } from "@/components/ui/general-header";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { AxiosError } from "axios";
import '../page.css';

export default function Page() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (token && refreshToken) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.user_id);
      api.get(`/api/users/${payload.user_id}/`)
        .then((response) => {
          const userData = response.data;
          setFirstName(String(userData.first_name || ""));
          setLastName(String(userData.last_name || ""));
          setBio(String(userData.profile.bio || ""));
          setLink(String(userData.profile.link || ""));
          setAvatarPreview(userData.profile.avatar ? `http://localhost:8000${userData.profile.avatar}` : null);
          setCoverPreview(userData.profile.cover ? `http://localhost:8000${userData.profile.cover}` : null);
        })
        .catch((err) => {
          if ((err as AxiosError).response?.status === 401) {
            // lógica de refresh token opcional
          } else {
            setError("Erro ao carregar perfil.");
            console.error(err);
          }
        });
    } else {
      setError("Usuário não autenticado. Faça login novamente.");
    }
  }, []);

  const handleUpdateProfile = async () => {
    // lógica de update permanece igual
  };

  return (
    <div>
      <GeneralHeader backHref="/">
        <div className="containerH1">Editar perfil</div>
      </GeneralHeader>

      <section className="containerS1">
        {/* seção de capa e avatar permanece igual */}
      </section>

      <section className="containerB1">
        <label>
          <p className="containerB2">Nome</p>
          <Input
            placeholder="Digite seu nome"
            value={firstName}
            onChange={setFirstName} 
          />
        </label>

        <label>
          <p className="containerB2">Bio</p>
          <Textarea
            placeholder="Descreva você mesmo"
            rows={4}
            value={bio}
            onChange={setBio}
          />
        </label>

        <label>
          <p className="containerB2">Link</p>
          <Input
            placeholder="Digite um link"
            value={link}
            onChange={setLink}
          />
        </label>

        <label>
          <p className="containerB2">Nova Senha (opcional)</p>
          <Input
            placeholder="Digite uma nova senha"
            value={password}
            password
            onChange={setPassword}
          />
        </label>

        {error && <p className="error">{error}</p>}

        <Button label="Salvar alterações" size={1} onClick={handleUpdateProfile} />
      </section>
    </div>
  );
}
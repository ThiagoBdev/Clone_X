"use client"

import { useState, useEffect } from "react";
import { GeneralHeader } from "@/components/ui/general-header";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { AxiosError } from "axios";
import '../page.css';

interface ApiErrorResponse {
  detail?: string;
  [key: string]: any;
}

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  profile: {
    bio: string;
    link: string;
    avatar: string;
    cover: string;
  };
}

export default function Page() {
  const router = useRouter();
  const params = useParams(); // Pega o slug da URL (ex: "thiago")
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
  const [isLoading, setIsLoading] = useState(false); // Adicionado ao estado

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token no localStorage:", token);
    if (!token) {
      setError("Usuário não autenticado. Faça login novamente.");
      return;
    }
    const fetchUserData = async () => {
      try {
        // Validar e extrair user_id do token
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Payload decodificado:", payload);
        const uidFromToken = Number(payload.user_id);
        if (isNaN(uidFromToken)) {
          throw new Error("user_id inválido no token.");
        }
        setUserId(uidFromToken);
        console.log("UserId do token:", uidFromToken);
        // Usar o slug da URL como fallback
        let uidFromSlug: number | undefined;
        if (params && params.slug) {
          console.log("Slug da URL:", params.slug);
          const slugResponse = await api.get(`/users/slug/${params.slug}/`);
          uidFromSlug = slugResponse.data.id;
          if (uidFromSlug) {
            setUserId(uidFromSlug);
            console.log("UserId do slug:", uidFromSlug);
          }
        }
        if (!userId) {
          setError("Usuário não identificado. Verifique o token ou o slug.");
          return;
        }
        // Carregar dados do usuário
        const response = await api.get(`/users/${userId}/`);
        const userData = response.data as UserData;
        setFirstName(userData.first_name || "");
        setLastName(userData.last_name || "");
        setBio(userData.profile.bio || "");
        setLink(userData.profile.link || "");
        setAvatarPreview(userData.profile.avatar ? `http://localhost:8000${userData.profile.avatar}` : null);
        setCoverPreview(userData.profile.cover ? `http://localhost:8000${userData.profile.cover}` : null);
      } catch (err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        setError(axiosError.response?.data?.detail || "Erro ao carregar dados do usuário.");
        console.error("Erro na autenticação ou carregamento:", err);
      }
    };
    fetchUserData();
  }, [params]); // Removido userId das dependências

  useEffect(() => {
    // Limpar URLs de preview ao desmontar o componente
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [avatarPreview, coverPreview]);

  const handleUpdateProfile = async () => {
    if (!userId) {
      setError("Usuário não identificado.");
      return;
    }

    setIsLoading(true); // Inicie o estado de carregamento

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("profile.bio", bio);
    formData.append("profile.link", link);
    if (password) formData.append("password", password);
    if (avatar) formData.append("profile.avatar", avatar);
    if (cover) formData.append("profile.cover", cover);

    try {
      console.log("Enviando requisição PATCH para /users/", userId);
      const response = await api.patch(`/users/${userId}/update-profile/`, formData);
      console.log("Perfil atualizado com sucesso:", response.data);
      setError(null);
      router.push(`/profile/${params.slug}`); // Redirecionamento após sucesso
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMsg = axiosError.response?.data?.detail || axiosError.message || "Erro ao atualizar perfil.";
      setError(errorMsg);
      console.error(err);
    } finally {
      setIsLoading(false); // Finalize o estado de carregamento
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
      setAvatarPreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCover(event.target.files[0]);
      setCoverPreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <div>
      <GeneralHeader backHref="/">
        <div className="containerH1">Editar perfil</div>
      </GeneralHeader>

      <section className="containerS1">
        {avatarPreview && (
          <img src={avatarPreview} alt="Avatar" style={{ width: "100px", height: "100px" }} />
        )}
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
        {coverPreview && (
          <img src={coverPreview} alt="Capa" style={{ width: "200px", height: "100px" }} />
        )}
        <input type="file" accept="image/*" onChange={handleCoverChange} />
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
            password={true}
            onChange={setPassword}
          />
        </label>

        {error && <p className="error">{error}</p>}
        <Button
          label={isLoading ? "Salvando..." : "Salvar alterações"}
          size={1}
          onClick={handleUpdateProfile}
          disabled={isLoading}
        />
      </section>
    </div>
  );
}
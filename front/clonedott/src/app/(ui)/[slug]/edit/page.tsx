"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { GeneralHeader } from "@/components/ui/general-header";
import "../page.css";
import React from "react";

interface FormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  link: string;
  avatar: FileList | null;
  cover: FileList | null;
  password?: string; 
}

export default function EditProfile({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMeState, setIsMeState] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = React.use(params);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      bio: "",
      link: "",
      avatar: null,
      cover: null,
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token atual (EditProfile):", token ? "Presente" : "Ausente");

        const meResponse = await api.get("/users/me/");
        const currentUser = meResponse.data;
        console.log("Usuário carregado:", currentUser);

        const isMe = currentUser.profile?.slug === resolvedParams.slug;
        setIsMeState(isMe);
        console.log("isMe:", isMe, "Profile slug:", currentUser.profile?.slug, "Params slug:", resolvedParams.slug);

        if (!isMe) {
          setError("Você não tem permissão para editar este perfil.");
          router.push("/");
          return;
        }

        setUser(currentUser);
        setValue("username", currentUser.username || "");
        setValue("first_name", currentUser.first_name || "");
        setValue("last_name", currentUser.last_name || "");
        setValue("email", currentUser.email || "");
        setValue("bio", currentUser.profile?.bio || "");
        setValue("link", currentUser.profile?.link || "");
      } catch (err: any) {
        console.error("Erro ao carregar usuário:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });

        if (err.response?.status === 401) {
          try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
              const refreshResponse = await api.post("/token/refresh/", { refresh: refreshToken });
              localStorage.setItem("token", refreshResponse.data.access);
              console.log("Novo token gerado:", refreshResponse.data.access);
              window.location.reload();
            } else {
              setError("Sessão expirada. Faça login novamente.");
              router.push("/login");
            }
          } catch (refreshErr) {
            console.error("Erro ao renovar token:", refreshErr);
            setError("Sessão expirada. Faça login novamente.");
            router.push("/login");
          }
        } else {
          setError("Falha ao carregar o perfil.");
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [resolvedParams.slug, router, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("profile.bio", data.bio);  
      formData.append("profile.link", data.link);  
      if (data.avatar && data.avatar[0]) {
        formData.append("profile.avatar", data.avatar[0]);  
      }
      if (data.cover && data.cover[0]) {
        formData.append("profile.cover", data.cover[0]);  
      }
      if (data.password) {
        formData.append("password", data.password);
      }

      console.log("Enviando FormData:", [...formData.entries()]);
      console.log("Dados do form antes de enviar:", { bio: data.bio });  // Debug
      const response = await api.patch("/users/me/update-profile/", formData); 
      console.log("Perfil atualizado:", response.data);
      router.push(`/${resolvedParams.slug}`);
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(err.response?.data?.detail || "Falha ao atualizar o perfil.");
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error || !user) return <div>{error || "Usuário não encontrado."}</div>;

  return (
    <div>
      <GeneralHeader backHref={`/${resolvedParams.slug}`}>
        <div className="containerH1">Editar Perfil</div>
      </GeneralHeader>
      <section className="containerS1">
        <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="avatar">Foto de perfil</label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              {...register("avatar")}
              className="containerX4-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cover">Capa</label>
            <input
              id="cover"
              type="file"
              accept="image/*"
              {...register("cover")}
              className="containerX4-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Nome de usuário</label>
            <input
              id="username"
              {...register("username", { required: "Nome de usuário é obrigatório" })}
              className="containerX4-input"
            />
            {errors.username && <span className="containerX4-error">{errors.username.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password" 
              {...register("password")} 
              className="containerX4-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              style={{ resize: "none" }}
              id="bio"
              {...register("bio")}
              className="containerX4-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="link">Link</label>
            <input
              id="link"
              {...register("link")}
              className="containerX4-input"
            />
          </div>
          <Button
            label="Salvar"
            size={2}
            onClick={handleSubmit(onSubmit)}
          />
        </form>
      </section>
    </div>
  );
}
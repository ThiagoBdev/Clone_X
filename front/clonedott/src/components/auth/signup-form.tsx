"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import api from "@/lib/api"; 
import { AxiosError } from 'axios';

interface RegisterResponse {
  id?: number;
  username?: string;
  email?: string;
}

interface TokenResponse {
  access: string;
  refresh: string;
}

export const SignupForm = () => {
  const router = useRouter();
  const [nameField, setNameField] = useState("");
  const [emailField, setEmailField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEnterButton = async () => {
    if (!nameField.trim() || !emailField.trim() || !passwordField.trim()) {
      setError('Nome de usuário, email e senha são obrigatórios.');
      return;
    }

    try {
      setError(null); 
      
      const registerResponse = await api.post<RegisterResponse>('/api/users/register/', {
        username: nameField.trim(),
        email: emailField.trim(),
        password: passwordField.trim(),
      });

      
      const tokenResponse = await api.post<TokenResponse>('/api/token/', {
        username: nameField.trim(),
        password: passwordField.trim(),
      });
      localStorage.setItem('token', tokenResponse.data.access);
      localStorage.setItem('refresh_token', tokenResponse.data.refresh); 
      router.push('/home'); 
    } catch (err) {
      const errorMessage = (err as AxiosError).response?.data
        ? (err as AxiosError).response?.data
        : 'Erro ao criar conta. Tente novamente.';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      if (err instanceof AxiosError) {
        console.error('Server response:', (err as AxiosError).response?.data);
      } else {
        console.error('Error:', err);
      }
    }
  };

  return (
    <>
      <Input
        placeholder="Digite seu nome de usuario"
        value={nameField}
        onChange={(T: string) => setNameField(T)} 
      />
      <Input
        placeholder="Digite seu email"
        value={emailField}
        onChange={(T: string) => setEmailField(T)} 
      />
      <Input
        placeholder="Digite sua Senha"
        value={passwordField}
        onChange={(T: string) => setPasswordField(T)} 
        password
      />

      {error && <p className="error">{error}</p>}
      <Button
        size={1}
        label="Criar Conta"
        onClick={handleEnterButton}
      />
    </>
  );
}
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react";
import { Input } from "../ui/input";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { Button } from "../ui/button";
import api from "@/lib/api";

interface SigninFormProps {
  onSuccess: () => void; // Callback para redirecionamento após sucesso
}

interface TokenResponse {
  access: string;
  refresh?: string; // Opcional, dependendo da configuração do JWT
}

export const SigninForm = ({ onSuccess }: SigninFormProps) => {
    const router = useRouter();
    const [emailField, setEmailField] = useState("");
    const [passwordField, setPasswordField] = useState("");
    const [error, setError] = useState<string | null>(null);

const handleEnterButton = async () => {
        try {
            setError(null); // Limpa erro anterior
            const response = await api.post<TokenResponse>('token/', {
                username: emailField, // Assumindo que o campo email é usado como username
                password: passwordField,
            });
            localStorage.setItem('token', response.data.access); // Salva o token
            if (onSuccess) {
                onSuccess(); // Chama o callback se existir
            } else {
                router.push('/home'); // Fallback para redirecionamento
            }
        } catch (err) {
            setError('Usuário ou senha inválidos. Tente novamente.');
            console.error('Login failed', err);
        }
    };

    return (
        <>
            <Input placeholder="Digite seu email"  value={emailField} onChange={T => setEmailField(T)} icon={faHeart}/>  
            <Input placeholder="Digite sua Senha"  value={passwordField} onChange={T => setPasswordField(T)} password/>

            <Button size={1} label="Entrar" onClick={handleEnterButton} />
        </>
    )
}


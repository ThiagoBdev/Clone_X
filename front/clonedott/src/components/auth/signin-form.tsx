"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { Button } from "../ui/button";
import api from "@/lib/api";
import { AxiosError } from 'axios';

interface SigninFormProps {
  onSuccess: () => void; 
}

interface TokenResponse {
  access: string;
  refresh?: string; 
}

export const SigninForm = ({ onSuccess }: SigninFormProps) => {
    const router = useRouter();
    const [nameField, setNameField] = useState("");
    const [passwordField, setPasswordField] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleEnterButton = async () => {
        
        if (!nameField.trim() || !passwordField.trim()) {
            setError('Nome de usuário e senha são obrigatórios.');
            return;
        }

        try {
            setError(null); 
            const response = await api.post<TokenResponse>('token/', {
                username: nameField.trim(),
                password: passwordField.trim(),
            }, {
                headers: {
                    'Content-Type': 'application/json', 
                },
            });
            localStorage.setItem('token', response.data.access); 
            onSuccess(); 
        } catch (err) {
            const errorMessage = (err as AxiosError).response?.data
                ? (err as AxiosError).response?.data
                : 'Usuário ou senha inválidos. Tente novamente.';
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
                icon={faHeart}
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
                label="Entrar" 
                onClick={handleEnterButton} 
            />
        </>
    );
}
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react";
import { Input } from "../ui/input";

import { Button } from "../ui/button";

export const SignupForm = () => {
    const router = useRouter();
    const [nameField, setNameField] = useState("");
    const [emailField, setEmailField] = useState("");
    const [passwordField, setPasswordField] = useState("");

    const handleEnterButton = () => {
        router.replace("/home");
    }

    return (
        <>
            <Input placeholder="Digite seu nome"  value={nameField} onChange={T => setNameField(T)} />
            <Input placeholder="Digite seu email"  value={emailField} onChange={T => setEmailField(T)} />  
            <Input placeholder="Digite sua Senha"  value={passwordField} onChange={T => setPasswordField(T)} password/>

            <Button size={1} label="Criar Conta" onClick={handleEnterButton} />
        </>
    )
}
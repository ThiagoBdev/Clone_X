"use client"

import { useRouter } from "next/navigation"
import { useState } from "react";
import { Input } from "../ui/input";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { Button } from "../ui/button";

export const SigninForm = () => {
    const router = useRouter();
    const [emailField, setEmailField] = useState("");
    const [passwordField, setPasswordField] = useState("");

    const handleEnterButton = () => {
        router.replace("/home");
    }

    return (
        <>
            <Input placeholder="Digite seu email"  value={emailField} onChange={T => setEmailField(T)} icon={faHeart}/>  
            <Input placeholder="Digite sua Senha"  value={passwordField} onChange={T => setPasswordField(T)} password/>

            <Button size={1} label="Entrar" onClick={handleEnterButton} />
        </>
    )
}
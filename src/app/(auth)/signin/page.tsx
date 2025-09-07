import { Logo } from "@/components/ui/logo";
import "./signin.css";
import Link from "next/link";
import { SigninForm } from "@/components/auth/signin-form";

export default function Page() {
    return (
        <div className="container"> 
            <Logo size={56} />
            <h1 className="text-h1">Entre na sua conta</h1>
            <div className="container-form">
                <SigninForm />
            </div>
            <div>
                <div className="text">
                    Ainda não tem uma conta?
                </div>
                <Link href="/signup" className="underline">Cadastre-se</Link>
            </div>
        </div>
    );
}



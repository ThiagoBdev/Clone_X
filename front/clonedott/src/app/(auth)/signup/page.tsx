import { Logo } from "@/components/ui/logo";
import "./signup.css";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function Page() {
    return (
        <div className="container"> 
            <Logo size={56} />
            <h1 className="text-h1">Crie a sua conta</h1>
            <div className="container-form">
                <SignupForm />
            </div>
            <div>
                <div className="text">
                    Já tem uma conta ?
                </div>
                <Link href="/signin" className="underline">Entrar no X</Link>
            </div>
        </div>
    );
}


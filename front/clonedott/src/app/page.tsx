import { Logo } from "@/components/ui/logo";
import "./page.css"
import { redirect } from "next/navigation";

export default function Page() {

  redirect('/signup');

  return (
    <div className="container">
       <Logo size={80}/>
    </div>
  );
}
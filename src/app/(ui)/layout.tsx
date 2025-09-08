import { ReactNode } from "react";
import "./layout.css";
import { Logo } from "@/components/ui/logo";
import { NavItem } from "@/components/nav/nav-item";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { Navlogout } from "@/components/nav/nav-logout";
import { NavMyProfile } from "@/components/nav/nav-myprofile";
import { SearchInput } from "@/components/ui/search-input";
import { TrendingArea } from "@/components/ui/trending-area";
import { RecommendationArea } from "@/components/ui/recommendation-area";

type Props = {
    children: ReactNode
}

export default function Layout({children}: Props) {
    return (
        <main className="container1">
            <section className="sectionLeft">
                <div className="container2">
                    <Logo size={24} />
                    <nav className="navcontainer">
                        <NavItem 
                            href="/home"
                            icon={faHouse}
                            label="Pagina inicial"
                        />
                        <NavItem 
                            href="/profile"
                            icon={faUser}
                            label="Meu perfil"
                        />
                    </nav>
                </div>
                <div className="container3">
                    <Navlogout />
                    <NavMyProfile />
                </div>
            </section>
            <section className="sectionMid">{children}</section>
            <aside className="asideRight">
                <SearchInput hideOnSearch />
                <TrendingArea />
                <RecommendationArea />
            </aside>
        </main>
    );
}
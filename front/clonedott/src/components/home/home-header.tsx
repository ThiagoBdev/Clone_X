"use client"


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Logo } from "../ui/logo"
import "./home-header.css"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { HomeMenu } from "./home-menu"

export const HomeHeader = () => {

    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className="containerheader">
            <div className="Logodesktop">
                <Logo size={24}></Logo>
            </div>
            <div className="Containerinicial">
                Pagina Inicial
            </div>

            <div className="iconBar" onClick={()=> setShowMenu(true)}>
                <FontAwesomeIcon icon={faBars} />
            </div>

            {showMenu &&
                <HomeMenu closeAction={() => setShowMenu(false)}/>
            }
        </header>
    )
}
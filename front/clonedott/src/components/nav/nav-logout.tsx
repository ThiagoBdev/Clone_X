"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./nav-logout.css";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";


export const Navlogout = () => {

    const router = useRouter();

    const handleClick = () => {
        router.replace('/signin');
    }


    return (
        <div onClick={handleClick} className="container" >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="icon1" />
            <div className="container2">Sair</div>
        </div>
    )
}
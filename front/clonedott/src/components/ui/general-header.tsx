import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ReactNode } from "react";
import "./general-header.css"


type Props = {
    children: ReactNode;
    backHref: string;
}

export const GeneralHeader = ({children, backHref}: Props) => {
    return (
        <header className="containeT1">
            <Link href={backHref} className="containerT2">
                <FontAwesomeIcon icon={faArrowLeft} className="containerT3"/>
            </Link>
            <div className="containerT4">
                {children}
            </div>
        </header>
    )
}
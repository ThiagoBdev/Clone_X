"use client"

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import "./nav-item.css";
import { usePathname } from "next/navigation";

type Props = {
    label: string;
    icon: IconDefinition;
    href: string;
    active?: boolean;
}

export const NavItem = ({ label, icon, href, active}: Props) => {

    const pathName = usePathname();
    const isMe = pathName === href;

    return (
        <Link href={href} className="container" style={{ opacity: active || isMe ? 1 : 0.5 }}>
            <FontAwesomeIcon icon={icon} className="icon1"  />
            <div className="container2">{label}</div>
        </Link>
    )
}


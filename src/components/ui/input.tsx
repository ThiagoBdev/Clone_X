"use client"

import { faEye, faEyeSlash, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import "./input.css";
import { useState } from "react";

type Props = {
    placeholder: string;
    password?: boolean;
    value?: string;
    onChange?: (newValue: string) => void;
    filled?: boolean;
    icon?: IconDefinition;

}


export const Input = ({placeholder, password,icon, filled, value, onChange}: Props) => {

    const [showpassword, setShowPassword] = useState(false);

    return (
        <div className="container" >
            <input type={password ? 'password' : 'text'} className="input-box" style={{backgroundColor:filled ? '#374151'   : 'transparent'}} placeholder={placeholder} value={value} onChange={e => onChange && onChange(e.target.value)}/>
        </div>
    );
}




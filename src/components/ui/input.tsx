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
    onEnter?: () => void

}


export const Input = ({placeholder, password,icon, filled, value, onChange, onEnter}: Props) => {

    const [showpassword, setShowPassword] = useState(false);

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code.toLowerCase() === "enter" && onEnter) {
            onEnter();
        }
    }

    return (
        <div className="container" >
            <input
                type={password ? 'password' : 'text'}
                className="input-box"
                style={{ backgroundColor: filled ? '#374151' : 'transparent' }}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange && onChange(e.target.value)}
                onKeyUp={handleKeyUp}
            />

        </div>
    );
}




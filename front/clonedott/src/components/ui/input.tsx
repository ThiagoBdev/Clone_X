"use client"

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import "./input.css";

type Props = {
  placeholder: string;
  password?: boolean;
  value?: string;
  onChange?: (newValue: string) => void;
  filled?: boolean;
  icon?: IconDefinition;
  onEnter?: () => void;
};

export const Input = ({
  placeholder,
  password = false,
  filled = false,
  value = "",
  onChange,
  onEnter
}: Props) => {

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onEnter) {
      onEnter();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div className="container">
      <input
        type={password ? "password" : "text"}
        className="input-box"
        style={{ backgroundColor: filled ? "#374151" : "transparent" }}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      />
    </div>
  );
};

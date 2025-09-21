
import "./button.css";

type Props = {
  label: string;
  onClick?: () => void;
  size: 1 | 2 | 3;
  disabled?: boolean;
};

export const Button = ({ label, onClick, size, disabled = false }: Props) => {
  const buttonStyle = {
    ...(size === 1 && { height: "3.0rem", fontSize: "1.125rem" }),
    ...(size === 2 && { height: "2.5rem", fontSize: "1rem" }),
    ...(size === 3 && { height: "1.75rem", fontSize: "0.75rem" }),
  };

  return (
    <div
      className={`Buttonstyle ${disabled ? "disabled" : ""}`}
      onClick={disabled ? undefined : onClick}
      style={buttonStyle}
    >
      {label}
    </div>
  );
};
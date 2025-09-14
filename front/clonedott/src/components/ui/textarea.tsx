import "./textarea.css"

type Props = {
  placeholder: string;
  rows: number;
  value?: string;
  onChange?: (value: string) => void;  
};

export const Textarea = ({ placeholder, rows, value, onChange }: Props) => {
  return (
    <div className="containerI1">
      <textarea
        className="containerI2"
        placeholder={placeholder}
        value={value ?? ""}   
        rows={rows}
        onChange={(e) => onChange?.(e.target.value)} 
      />
    </div>
  );
};

import "./button.css";

type Props = {
    label: string;
    onClick?: () => void;
    size: 1 | 2 | 3;
}

export const Button = ({ label, onClick, size }: Props) => {

    const buttonstyle = {
        ...(size === 1 && { height: '3.0rem', fontSize: '1.125rem' }), 
        ...(size === 2 && { height: '2.5rem', fontSize: '1rem' }),      
        ...(size === 3 && { height: '1.75rem', fontSize: '0.75rem' })  
    };

    return (
        <div className="Buttonstyle" onClick={onClick} style={buttonstyle} >
            {label}
        </div>
    );
}

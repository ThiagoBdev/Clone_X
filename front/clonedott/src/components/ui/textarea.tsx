import "./textarea.css"

type Props = {
    placeholder: string;
    rows: number;
    value?: string;
}


export const Textarea = ({placeholder, rows, value}:Props) => {
    return (
        <div className="containerI1">
            <textarea className="containerI2" placeholder={placeholder} value={value} rows={rows}>

            </textarea>
        </div>
    )
}
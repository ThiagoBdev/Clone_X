import { Input } from "./input"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

export const SearchInput = () => {
    return (
            <Input placeholder="Buscar"
            icon={faMagnifyingGlass}
            filled
        />
        
    )
}
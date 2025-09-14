import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Logo } from "../ui/logo"
import { faHouse, faUser, faXmark } from "@fortawesome/free-solid-svg-icons"

import "./home-menu.css"
import { SearchInput } from "../ui/search-input"
import { NavItem } from "../nav/nav-item"
import { Navlogout } from "../nav/nav-logout"

type Props = {
    closeAction: () => void
}

export const HomeMenu = ({closeAction}: Props) => {
    return(
        <div className="ContainerhomeBar">
            <div className="containercenter">
                <Logo size={32}/>
                <div onClick={closeAction} className="iconX">
                    <FontAwesomeIcon icon={faXmark} className="iconimagebar"/>
                </div>
            </div>

            <div style={{ marginTop: "10px" }}>
                <SearchInput />
            </div>

            <div>
                <NavItem 
                    href="/home"
                    icon={faHouse}
                    label="Pagina inicial"
                />
                <NavItem 
                    href="/profile"
                    icon={faUser}
                    label="Meu perfil"
                />
                <Navlogout />
            </div>
        </div>
    )
}     

        /*problema acima resolvido, continuar do 2:48:16 */
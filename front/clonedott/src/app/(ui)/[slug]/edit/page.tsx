import { GeneralHeader } from "@/components/ui/general-header";
import { user } from "@/data/user";
import '../page.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera,faXmark } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";



export default function Page() {

    const isMe = true;

    return (
        <div>
            <GeneralHeader backHref="/">
                <div className="containerH1">Editar perfil</div>
            </GeneralHeader>

            <section className="containerS1">
                <div className="containerS2" style={{backgroundImage: 'url(' + user.cover + ')'}}>
                    <div className="containerE1">
                        <FontAwesomeIcon icon={faCamera} className="containerE2" />
                    </div>
                    <div className="containerE1">
                        <FontAwesomeIcon icon={faXmark} className="containerE2" />
                    </div>
                </div>
                <div className="containerU1">
                    <img src={user.avatar} alt={user.name} className="containerP2" />
                    <div className="containerU2 ">
                         <div className="containerE1">
                            <FontAwesomeIcon icon={faCamera} className="containerE2" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="containerB1">
                <label>
                    <p className="containerB2">Nome</p>
                    <Input placeholder="Digite seu nome" value={user.name}/>
                </label>
                <label>
                    <p className="containerB2">Bio</p>
                    <Textarea placeholder="Descreva você mesmo" rows={4} value={user.bio}/>
                </label>
                <label>
                    <p className="containerB2">Link</p>
                    <Input placeholder="Digite um link" value={user.link}/>
                </label>

                <Button label="Salvar alterações" size={1} />
            </section>
        </div>
    );
}
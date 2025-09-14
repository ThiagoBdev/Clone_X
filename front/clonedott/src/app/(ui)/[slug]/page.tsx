import { GeneralHeader } from "@/components/ui/general-header";
import { user } from "@/data/user";
import "./page.css"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { ProfileFeed } from "@/components/profile/profile-feed";


export default function Page() {

    const isMe = true;

    return (
        <div>
            <GeneralHeader backHref="/">
                <div className="containerH1">{user.name}</div>
                <div className="containerH2">{user.postCount}posts</div>
            </GeneralHeader>

            <section className="containerS1">
                <div className="containerS2" style={{backgroundImage: 'url(' + user.cover + ')'}}></div>
                <div className="containerP1">
                    <img src={user.avatar} alt={user.name} className="containerP2" />
                    <div className="containerP3">
                        {isMe &&
                            <Link href={`/${user.slug}/edit`}>
                                <Button label="Editar Perfil" size={2} />
                            </Link>
                        }
                        {!isMe &&
                            <Button label="Seguir" size={2}></Button>
                        }
                    </div>
                </div>
                <div className="containerX1"> 
                    <div className="containerX2">{user.name}</div>
                    <div className="containerX3">@{user.slug}</div>
                    <div className="containerX4">{user.bio}</div>
                    {user.link &&
                        <div className="containerX5">
                            <FontAwesomeIcon icon={faLink} className="containerX6"></FontAwesomeIcon>
                            <Link href={user.link} target="_blank" className="containerX7">{user.link}</Link>
                        </div>
                    }
                    <div className="containerX8">
                        <div className="containerX9">
                            <span className="containerX10">99 </span>Seguindo
                        </div>
                        <div className="containerX9">
                            <span className="containerX10">99 </span>Seguidores
                        </div>
                    </div>
                </div>
            </section>
            <ProfileFeed />
        </div>
    );
}
"use client"

import { user } from "@/data/user";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import "./tweet-post.css";

export const TweetPost =() => {

    const handleImageUpload = () => {

    }

    const handlePostClick = () => {

    }

    return(
        <div className="ContainerPensando">
            <div >
                <img src={user.avatar} alt={user.name} className="ContainerEnquadro" />
            </div>
            <div className="ContainerSimples">
                <div className="CampoEditavel" contentEditable role="textbox"></div>
                <div className="ContainerDaImagem">
                    <div onClick={handleImageUpload} className="ContainerDoIconeImg">
                        <FontAwesomeIcon icon={faImage} className="ContainerTamanho " />
                    </div>
                    <div className="ContainerLargura">
                        <Button label="Postar" size={2} onClick={handlePostClick}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
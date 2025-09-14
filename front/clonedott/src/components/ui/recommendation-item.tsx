import { User } from "@/types/user";
import "./recommendation.css"
import Link from "next/link";
import { Button } from "./button";
import { useState } from "react";

type Props = {
    user: User;
}


export const RecommendationItem = ({user}: Props) => {
    const [following, setFollowing] = useState(false);
    const handleFollowButton = () => {
        setFollowing(true)
    }

    return (
        <div className="containerRecommendation">
            <div className="second-container-recommendation">
                <Link href={`/${user.slug}`}>
                    <img  src={user.avatar} alt={user.name} />
                </Link>
            </div>
            <div className="containerInfo">
                <Link href={`/${user.slug}`} className="secondInfo">
                    {user.name}
                </Link>
                <div className="containerSlug">@{user.slug}</div>
            </div>
            <div className="containerbutton">
                {!following &&
                    <Button label="Seguir" onClick={handleFollowButton} size={3} />
                }
            </div>
        </div>
    );
}


export const RecommendationItemSkeleton = () => {
    return (
        <div className="containerRecommendation pulse">
            <div className="containerInfo">
                <div className="InfoNone"></div>
                <div className="InfoNone"></div>
            </div>
        </div>
    )
}
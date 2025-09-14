"use client"


import { Tweet } from "@/types/tweet";
import Link from "next/link";
import "./tweet-item.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faHeart} from "@fortawesome/free-regular-svg-icons";
import { faRetweet, faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { formatRelativeTime } from "@/utils/format-relative";



type Props= {
    tweet: Tweet;
    hideComments?: boolean;
}


export const TweetItem = ({ tweet, hideComments}: Props) => {

    const [liked, setLiked] = useState(tweet.liked);


      const handleLikeButton = () => {
            setLiked(!liked); 
        };

    return (
        <div className="containerR1">
            <div>
                <Link href={`/${tweet.user.slug}`}>
                    <img src={tweet.user.avatar} alt={tweet.user.name} className="containerR2"/>
                </Link>
            </div>
            <div className="containerR3">
                <div className="containerR8">
                    <div className="containerR9">
                        <Link href={`/${tweet.user.slug}`}>{tweet.user.name}</Link>
                    </div>
                    <div className="containerR10">@{tweet.user.slug} - {formatRelativeTime(tweet.dataPost)}</div>
                </div>
                <div className="containerR4">{tweet.body}</div>
                {tweet.image &&
                    <div className="containerR5">
                        <img src={tweet.image} alt="" className="containerR6"/>
                    </div>
                }
                <div className="containerR7">
                    {!hideComments &&
                        <div className="containerR3">
                            <Link href={`/tweet/${tweet.id}`}>
                                <div className="containerR11">
                                    <FontAwesomeIcon icon={faComment} className="containerR12" />
                                    <div className="containerR13">{tweet.commentCount}</div>
                                </div>
                            </Link>
                        </div>
                    }
                    <div className="containerR3">
                        <div className="containerR11">
                            <FontAwesomeIcon icon={faRetweet} className="containerR12" />
                            <div className="containerR13">{tweet.retweetCount}</div>
                        </div>
                    </div>
                    <div className="containerR3">
                        <div onClick={handleLikeButton} className="containerR11">
                            <FontAwesomeIcon icon={liked ? faHeartFilled : faHeart } className="containerR12" style={{ color: liked ? "#f87171" : "inherit" }} />
                            <div className="containerR13">{liked ? tweet.likeCount + 1 : tweet.likeCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
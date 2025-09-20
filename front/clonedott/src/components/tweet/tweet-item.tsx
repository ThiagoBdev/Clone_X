"use client";

import { Tweet } from "@/types/tweet";
import Link from "next/link";
import "./tweet-item.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faRetweet, faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { formatRelativeTime } from "@/utils/format-relative";

type Props = {
  tweet: Tweet;
  hideComments?: boolean;
};

export const TweetItem = ({ tweet, hideComments }: Props) => {
  const [liked, setLiked] = useState(tweet.liked || false);

  console.log('Tweet recebido:', tweet);

  const mappedTweet = {
    body: tweet.body || tweet.text || '',
    image: tweet.image || null,
    dataPost: tweet.dataPost || new Date(),
    commentCount: tweet.commentCount || 0,
    retweetCount: tweet.retweetCount || 0,
    likeCount: tweet.likeCount || 0,
    liked: liked,
    user: {
      name: tweet.user?.name || `${tweet.user?.first_name || ''} ${tweet.user?.last_name || ''}`.trim() || tweet.user?.username || 'Usuário Desconhecido',
      avatar: tweet.user?.avatar || tweet.user?.profile?.avatar || 'https://api.dicebear.com/7.x/bottts/png?size=40',
      slug: tweet.user?.slug || tweet.user?.profile?.slug || 'sem-slug',
    },
  };

  const handleLikeButton = () => {
    setLiked(!liked); 
  };

  return (
    <div className="containerR1">
      <div>
        <Link href={`/${mappedTweet.user.slug}`}>
          <img src={mappedTweet.user.avatar} alt={mappedTweet.user.name} className="containerR2" />
        </Link>
      </div>
      <div className="containerR3">
        <div className="containerR8">
          <div className="containerR9">
            <Link href={`/${mappedTweet.user.slug}`}>{mappedTweet.user.name}</Link>
          </div>
          <div className="containerR10">@{mappedTweet.user.slug} - {formatRelativeTime(new Date(mappedTweet.dataPost))}</div>
        </div>
        <div className="containerR4">{mappedTweet.body}</div>
        {mappedTweet.image && (
          <div className="containerR5">
            <img src={mappedTweet.image} alt="" className="containerR6" />
          </div>
        )}
        <div className="containerR7">
          {!hideComments && (
            <div className="containerR3">
              <Link href={`/tweet/${tweet.id}`}>
                <div className="containerR11">
                  <FontAwesomeIcon icon={faComment} className="containerR12" />
                  <div className="containerR13">{mappedTweet.commentCount}</div>
                </div>
              </Link>
            </div>
          )}
          <div className="containerR3">
            <div className="containerR11">
              <FontAwesomeIcon icon={faRetweet} className="containerR12" />
              <div className="containerR13">{mappedTweet.retweetCount}</div>
            </div>
          </div>
          <div className="containerR3">
            <div onClick={handleLikeButton} className="containerR11">
              <FontAwesomeIcon icon={liked ? faHeartFilled : faHeart} className="containerR12" style={{ color: liked ? "#f87171" : "inherit" }} />
              <div className="containerR13">{liked ? mappedTweet.likeCount + 1 : mappedTweet.likeCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
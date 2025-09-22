"use client";

import { useState, useRef } from "react";
import { Tweet } from "@/types/tweet";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faRetweet, faHeart as faHeartFilled, faImage } from "@fortawesome/free-solid-svg-icons";
import { formatRelativeTime } from "@/utils/format-relative";
import api from "@/lib/api";
import "./tweet-item.css";
import "./tweet-post.css";
import { Button } from "../ui/button";
import { useUser } from "@/data/user";

type Props = {
  tweet: Tweet;
  hideComments?: boolean;
};

export const TweetItem = ({ tweet, hideComments }: Props) => {
  const [liked, setLiked] = useState(tweet.liked || false);
  const [commentsVisible, setCommentsVisible] = useState(false); 
  const [content, setContent] = useState("");
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const mappedTweet = {
    body: tweet.body || tweet.text || "",
    image: tweet.image || null,
    dataPost: tweet.created_at ? new Date(tweet.created_at) : new Date(),
    commentCount: tweet.comment_count || 0,
    retweetCount: tweet.retweet_count || 0,
    likeCount: tweet.likes_count || 0,
    liked: liked,
    user: {
      name:
        tweet.user?.name ||
        `${tweet.user?.first_name || ""} ${tweet.user?.last_name || ""}`.trim() ||
        tweet.user?.username ||
        "Usuário Desconhecido",
      avatar:
        tweet.user?.avatar ||
        tweet.user?.profile?.avatar ||
        "https://api.dicebear.com/7.x/bottts/png?size=40",
      slug: tweet.user?.slug || tweet.user?.profile?.slug || "sem-slug",
    },
    comments: tweet.comments || [],
  };

  const handleLikeButton = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token não encontrado. Faça login novamente.");
        return;
      }

      if (liked) {
        await api.post(`/tweets/${tweet.id}/unlike/`);
        setLiked(false);
      } else {
        await api.post(`/tweets/${tweet.id}/like/`);
        setLiked(true);
      }
      const response = await api.get(`/tweets/${tweet.id}/`);
      setLiked(response.data.liked);
    } catch (err: any) {
      console.error("Erro ao curtir/descurtir tweet:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  const handleInput = () => {
    if (contentEditableRef.current) {
      setContent(contentEditableRef.current.innerText);
    }
  };

  const handleCommentSubmit = async () => {
    if (!content.trim()) return;
    try {
      await api.post(`/tweets/${tweet.id}/comment/`, { text: content });
      setContent("");
      
      const response = await api.get(`/tweets/${tweet.id}/`);
      mappedTweet.comments = response.data.comments || [];
    } catch (err) {
      console.error("Erro ao comentar:", err);
    }
  };

  const toggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  return (
    <div className="containerR1">
      <div>
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
            <div className="containerR10">
              @{mappedTweet.user.slug} - {formatRelativeTime(mappedTweet.dataPost)}
            </div>
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
                <div className="containerR11" onClick={toggleComments}>
                  <FontAwesomeIcon icon={faComment} className="containerR12" />
                  <div className="containerR13">{mappedTweet.commentCount}</div>
                </div>
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
                <FontAwesomeIcon
                  icon={liked ? faHeartFilled : faHeart}
                  className="containerR12"
                  style={{ color: liked ? "#f87171" : "inherit" }}
                />
                <div className="containerR13">{mappedTweet.likeCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {commentsVisible && (
        <div className="comments-section">
          <div>
            <div>
              <img
                src={user?.profile?.avatar || user?.avatar || "https://api.dicebear.com/7.x/bottts/png?size=40"}
                className="Containermeuavatar"
                alt="Seu avatar"
              />
            </div>
            <div className="ContainerSimples">
              <div
                className="Campoplaceholdercomment"
                contentEditable
                role="textbox"
                ref={contentEditableRef}
                onInput={handleInput}
              ></div>
              <div className="ContainerDaImagemcoments">
                <div className="ContainerDoIconeImg" style={{ display: "none" }}>
                  <FontAwesomeIcon icon={faImage} className="containerR12" />
                </div>
                <div className="Containerbotaocoments">
                  <Button label="Comentar" size={2} onClick={handleCommentSubmit} />
                </div>
              </div>
            </div>
          </div>
          {mappedTweet.comments.length > 0 && (
            <div className="Coments-containerR1">
              {mappedTweet.comments.map((comment) => (
                <div key={comment.id} className="Coments-container-items">
                  <Link href={`/${comment.user?.profile?.slug || "sem-slug"}`}>
                    <strong>{comment.user?.username || "Usuário Desconhecido"}</strong>
                  </Link>
                  : {comment.text} <small>({new Date(comment.created_at).toLocaleString()})</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
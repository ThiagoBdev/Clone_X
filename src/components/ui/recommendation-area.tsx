"use client"


import { user } from "@/data/user";
import { RecommendationItem, RecommendationItemSkeleton } from "./recommendation-item";
import "./trending-area.css"

export const RecommendationArea = () => {
    return (
        <div className="containerArea">
            <h2 className="containerOQ">Quem seguir</h2>
            <div className="continuos-container">
              <RecommendationItem user={user} />
              <RecommendationItem user={user} />
              <RecommendationItemSkeleton />
            </div>
        </div>
    );
}
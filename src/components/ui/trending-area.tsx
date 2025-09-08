import "./trending-area.css"
import { TrendingItem, TrendingItemSkeleton } from "./trending-item";

export const TrendingArea = () => {
    return (
        <div className="containerArea">
            <h2 className="containerOQ">O que esta acontecendo</h2>
            <div className="continuos-container">
               <TrendingItem label="#Teste" count={2343} />
               <TrendingItem label="#Teste" count={2343} />
               <TrendingItemSkeleton />
               <TrendingItemSkeleton />
            </div>
        </div>
    );
}
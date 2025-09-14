import Link from "next/link";

type Props = {
    label: string;
    count: number;
}


export const TrendingItem = ({label, count}: Props) =>{
    return (
        <Link href={`/search?q=${encodeURIComponent(label)}`} >
            <div className="trendinghashtag">{label}</div>
            <div className="">{count}posts</div>
        </Link>
    );
}

export const TrendingItemSkeleton = () => {
    return (
        <div className="containerskeleton">
            <div className="skeletonitem pulse"></div>
            <div className="skeletonitem pulse"></div>
        </div>
    );
}
import { Tweet } from "@/types/tweet";
import { user } from "./user";

export const tweet: Tweet = {
        id: 123,
        user: user,
        body: "Café da manha",
        image: "https://cdn.pixabay.com/photo/2016/11/19/14/18/oatmeal-1839515_1280.jpg",
        likeCount: 25,
        commentCount: 71,
        retweetCount: 0,
        liked: true,
        retweeted: false,
        dataPost: new Date(2025, 8, 1, 10, 0, 0),
}
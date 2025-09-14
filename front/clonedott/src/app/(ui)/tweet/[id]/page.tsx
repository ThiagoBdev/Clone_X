import { TweetItem } from "@/components/tweet/tweet-item";
import { TweetPost } from "@/components/tweet/tweet-post";
import { GeneralHeader } from "@/components/ui/general-header";
import { tweet } from "@/data/tweet";

import "./page.css"

export default function page() {
    return (
        <div>
            <GeneralHeader backHref="/">
                <div className="containerJ1">Voltar</div>
            </GeneralHeader>
            <div className="containerJ2">
                <TweetItem tweet={tweet} />

                <div className="containerJ3">
                    <TweetPost />
                </div>

                <TweetItem tweet={tweet} hideComments/>
                <TweetItem tweet={tweet} hideComments/>
                <TweetItem tweet={tweet} hideComments/>
                <TweetItem tweet={tweet} hideComments/>
            </div>
        </div>
    )
}
import { Post as IPost } from "../../Feed";
import PostAuthor from "./PostAuthor";
import PostContent from "./PostContent";
import PostMedia from "./PostMedia";

export default function Post({ post, allowUserClickProfile }: { post: IPost, allowUserClickProfile?: boolean }) {

    return (
        <div className="p-4">
            <PostAuthor
                userId={post.user_id}
                username={post.username}
                date={post.created_at}
                avatar={post.avatar}
                allowUserClickProfile={allowUserClickProfile}
            />
            <PostContent content={post.content} />
            <PostMedia media_url={post.media_url} />
        </div>
    );
}
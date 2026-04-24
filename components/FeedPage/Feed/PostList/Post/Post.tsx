import { Post as IPost } from "../../Feed";
import PostAuthor from "./PostAuthor";
import PostContent from "./PostContent";
import PostMedia from "./PostMedia";

export default function Post({ post }: { post: IPost }) {

    return (
        <div className="p-4">
            <PostAuthor username={post.username} date={post.created_at} avatar={post.avatar}/>
            <PostContent content={post.content}/>
            <PostMedia media_url={post.media_url}/>
        </div>
    );
}
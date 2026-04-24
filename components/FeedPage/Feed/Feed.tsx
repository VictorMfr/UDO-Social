import { Fragment } from "react/jsx-runtime";
import PostForm from "./PostForm";
import PostList from "./PostList/PostList";
import CommentModal from "./CommentModal";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export interface Post {
    id: number;
    content: string;
    media_url?: string;
    username: string;
    created_at: string;
    avatar: string;
}

export interface ICommentModal {
    open: boolean,
    selectedPost: Post | null
}

export default function Feed() {

    const [posts, setPosts] = useState<Post[]>([]);

    const [commentModal, setCommentModal] = useState<ICommentModal>({
        open: false,
        selectedPost: null
    });

    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);

                const postsRes = await api.get("/posts");
                
                setPosts(postsRes.data);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <Fragment>
            <PostForm setPosts={setPosts} />
            <PostList
                posts={posts}
                setCommentModal={setCommentModal}
                loadingPosts={loading}
            />

            {/* Modal de comentarios */}
            <CommentModal
                commentModal={commentModal}
                setCommentModal={setCommentModal}
            />
        </Fragment>
    );
}
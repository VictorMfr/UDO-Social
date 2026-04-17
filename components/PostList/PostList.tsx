import { ICommentModal, Post as IPost } from "@/app/feed/page";
import { Dispatch, SetStateAction } from "react";
import Post from "./Post/Post";

export default function PostList({
    posts,
    loadingPosts,
    setCommentModal
}: {
    posts: IPost[],
    loadingPosts: boolean,
    setCommentModal: Dispatch<SetStateAction<ICommentModal>>
}) {

    // Función para abrir el modal
    const openCommentModal = (post: IPost) => {
        setCommentModal({
            open: true,
            selectedPost: post
        })
    };

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <Post post={post}/>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex gap-6 text-gray-500 text-sm">
                        <button
                            onClick={() => openCommentModal(post)} // <-- Agregamos esto
                            className="hover:text-blue-600 transition-colors flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Comentar
                        </button>
                    </div>
                </article>
            ))}
        </div>
    )
}
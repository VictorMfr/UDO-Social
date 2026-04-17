"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList/PostList";
import CommentModal from "@/components/CommentModal";
import NavBar from "@/components/NavBar";

export interface Post {
  id: number;
  content: string;
  media_url?: string;
  username: string;
  created_at: string;
}

export interface ICommentModal {
  open: boolean,
  selectedPost: Post | null
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [commentModal, setCommentModal] = useState<ICommentModal>({
    open: false,
    selectedPost: null
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {

        const response = await api.get("/posts");

        setPosts(response.data);
      } catch (error) {
        console.error("Error cargando posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-2xl mx-auto py-6 px-4 space-y-6">
        <PostForm
          setPosts={setPosts}
        />
        <PostList
          posts={posts}
          setCommentModal={setCommentModal}
          loadingPosts={loading}
        />
        <CommentModal
          commentModal={commentModal}
          setCommentModal={setCommentModal}
        />
      </main>
    </div>
  );
}
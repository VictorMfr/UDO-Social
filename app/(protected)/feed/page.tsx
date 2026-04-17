"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList/PostList";
import CommentModal from "@/components/CommentModal";
import NavBar from "@/components/NavBar";
import Link from "next/link";

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

  // Post
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile
  const [username, setUsername] = useState("@...");


  const [commentModal, setCommentModal] = useState<ICommentModal>({
    open: false,
    selectedPost: null
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {

        const response = await api.get("/posts");
        const userResponse = await api.get("/users/me");
        setUsername('@' + userResponse.data.username)

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
      {/* Contenedor principal con Grid */}
      <main className="mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* COLUMNA IZQUIERDA: PERFIL (Ocupa 1 de 3 columnas) */}
        <aside className="hidden md:block col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-20">
            <div className="flex flex-col items-center text-center">
              {/* Avatar grande */}
              <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4">
                {username[1].toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900">Mi Perfil</h2>
              <p className="text-sm text-gray-500 mb-6">{username}</p>
              <Link href={'/profile'} className="text-blue-500">Editar perfil</Link>
            </div>
          </div>
        </aside>

        {/* COLUMNA DERECHA: FEED (Ocupa 2 de 3 columnas) */}
        <section className="md:col-span-6 space-y-6">
          <PostForm setPosts={setPosts} />
          <PostList
            posts={posts}
            setCommentModal={setCommentModal}
            loadingPosts={loading}
          />
        </section>

        {/* COLUMNA DERECHA: CHATS (Ocupa las últimas 3 columnas) */}
        <aside className="hidden lg:block col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col sticky top-20 overflow-hidden h-[calc(100vh-120px)]">
            {/* Cabecera del Buzón */}
            <div className="p-4 border-b bg-white flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Mensajes</h2>
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            {/* Buscador de chats */}
            <div className="p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar personas..."
                  className="w-full bg-gray-100 border-none rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Lista de Chats */}
            <div className="flex-1 overflow-y-auto">
              {/* Ejemplo de un Chat Item */}
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-500">
                      {i === 1 ? 'JD' : 'U'}
                    </div>
                    {/* Indicador Online */}
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-bold text-gray-900 truncate">Usuario Ejemplo {i}</p>
                      <span className="text-[10px] text-gray-400 font-medium">14:2{i}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">Este es un mensaje de prueba...</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Pie del buzón */}
            <div className="p-3 bg-gray-50 border-t text-center">
              <button className="text-xs font-bold text-blue-600 hover:underline">
                Ver todos los mensajes
              </button>
            </div>
          </div>
        </aside>

        {/* Modal de comentarios */}
        <CommentModal
          commentModal={commentModal}
          setCommentModal={setCommentModal}
        />
      </main>
    </div>
  );
}
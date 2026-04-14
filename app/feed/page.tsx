"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface Post {
  id: number;
  content: string;
  media_url?: string;
  user_id: number;
  createdAt: string;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();






  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);





  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentContent, setCommentContent] = useState("");












  // Función para abrir el modal
  const openCommentModal = (post: Post) => {
    setSelectedPost(post);
    setIsCommentModalOpen(true);
  };

  // Función para enviar el comentario
  const handleSendComment = async () => {
    if (!commentContent.trim() || !selectedPost) return;

    try {
      await api.post(`/posts/${selectedPost.id}/comments`, {
        content: commentContent
      });

      // Aquí podrías actualizar el contador de comentarios localmente
      setCommentContent("");
      setIsCommentModalOpen(false);
    } catch (error) {
      console.error("Error al comentar:", error);
    }
  };









  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Crea una URL temporal para la vista previa
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() && !image) return;

    const formData = new FormData();
    formData.append("content", newPost);
    if (image) {
      formData.append("image", image); // El nombre "image" debe coincidir con lo que espera Multer en el backend
    }

    try {
      const response = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Axios lo configura solo, pero es bueno ser explícito
      });

      if (response.status === 201) {
        setPosts([response.data, ...posts]);
        setNewPost("");
        setImage(null);
        setPreview(null);
      }
    } catch (error) {
      console.error("Error al publicar:", error);
    }
  };











  // Cargar posts al montar el componente
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
  }, [router]);















  const logout = async () => {
    try {
      // 1. Llamamos al endpoint de logout para que el servidor limpie la cookie
      // 'withCredentials: true' es clave para que el navegador envíe la cookie que queremos borrar
      await api.post("/auth/logout", {}, { withCredentials: true });

      // 3. Redirigimos al login
      router.replace("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aun si falla la red, es buena práctica forzar la redirección
      router.replace("/login");
    }
  }








  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR SIMPLE */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-blue-600 text-xl italic">UDO Social</span>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-500 font-medium"
          >
            Salir
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-6 px-4 space-y-6">














        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <form onSubmit={handleCreatePost}>
            <textarea
              className="w-full border-none focus:ring-0 text-lg resize-none placeholder-gray-400 outline-none"
              placeholder="¿Qué está pasando en la UDO?"
              rows={3}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />

            {/* VISTA PREVIA DE LA IMAGEN */}
            {preview && (
              <div className="relative mt-2 mb-4">
                <img src={preview} alt="Vista previa" className="rounded-lg max-h-64 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-gray-800/50 text-white rounded-full p-1 hover:bg-gray-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              {/* BOTÓN DE SUBIR ARCHIVO (OCULTO DETRÁS DE UN ICONO) */}
              <label className="cursor-pointer text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={!newPost.trim() && !image}
              >
                Publicar
              </button>
            </div>
          </form>
        </div>
















        {/* LISTA DE POSTS */}
        {loading ? (
          <p className="text-center text-gray-500">Cargando comunidad...</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      U{post.user_id}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Usuario {post.user_id}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    {post.content}
                  </p>
                  {post.media_url && (
                    <img
                      src={post.media_url}
                      alt="Post media"
                      className="mt-3 rounded-lg w-full object-cover max-h-96"
                    />
                  )}
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex gap-6 text-gray-500 text-sm">
                  <button className="hover:text-blue-600 transition-colors">Me gusta</button>
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
        )}
      </main>



      {/* MODAL DE COMENTARIOS */}
      {isCommentModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Responder a Usuario {selectedPost.user_id}</h3>
              <button onClick={() => setIsCommentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 bg-gray-50 text-sm text-gray-600 italic">
              {selectedPost.content.substring(0, 100)}...
            </div>

            <div className="p-4">
              <textarea
                autoFocus
                className="w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-800 resize-none p-3 border"
                placeholder="Escribe tu respuesta..."
                rows={4}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
            </div>

            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsCommentModalOpen(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendComment}
                disabled={!commentContent.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                Responder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
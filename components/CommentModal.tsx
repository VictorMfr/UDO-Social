import { ICommentModal } from "@/app/feed/page"
import api from "@/lib/axios";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import PostContent from "./PostList/Post/PostContent";
import PostMedia from "./PostList/Post/PostMedia";
import Modal from "./Modal/Modal";
import ModalHeader from "./Modal/ModalHeader";

interface UserComment {
    id: string,
    username: string,
    content: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
}

export default function CommentModal({
    commentModal,
    setCommentModal
}: {
    commentModal: ICommentModal,
    setCommentModal: Dispatch<SetStateAction<ICommentModal>>
}) {

    // Comentario del usuario
    const [commentContent, setCommentContent] = useState("");

    // Lista de los comentarios actuales del post
    const [userComments, setUserComments] = useState<UserComment[]>([]);
    const [loadingUserComments, setLoadingUserComments] = useState<boolean>(true);














    // Funcion para consultar los comentarios de un post
    // Se utiliza callback para no recrear la funcion por
    // cada render
    const getPostComments = useCallback(async () => {

        // Por si se abre una segunda vez
        setLoadingUserComments(true);

        try {
            const response = await api.get<UserComment[]>(`/comments?post=${commentModal.selectedPost!.id}`);
            setUserComments(response.data);
        } catch (error) {
            console.log('Algo salio mal', error);
        } finally {
            setLoadingUserComments(false);
        }
    }, [commentModal.selectedPost]);










    // Cada vez que se abre el modal, debe consultar los comentarios
    useEffect(() => {
        if (commentModal.open) {
            getPostComments();
        }
    }, [commentModal.open, getPostComments]);


    // Cerrar Modal de Comentario
    const closeModal = () => {
        setCommentModal({
            open: false,
            selectedPost: null
        })
    }

    // Función para enviar el comentario
    const handleSendComment = async () => {
        if (!commentContent.trim() || !commentModal.selectedPost) return;

        try {
            await api.post(`/comments`, {
                content: commentContent,
                post_id: commentModal.selectedPost.id
            });

            // Aquí podrías actualizar el contador de comentarios localmente
            setCommentContent("");
            closeModal();
        } catch (error) {
            console.error("Error al comentar:", error);
        }
    };

    // Renderizar el modal solo si debe hacerlo
    if (!commentModal.open) {
        return;
    }

    return (
        <Modal>
            <ModalHeader
                title={`Responder a usuario ${commentModal.selectedPost!.username}`}
                onClose={closeModal}
            />

            {/* El contenido del post */}
            <div className="p-4 bg-gray-50 text-sm text-gray-600 italic max-h-96 overflow-y-scroll">
                <PostContent content={commentModal.selectedPost!.content} />
                <PostMedia media_url={commentModal.selectedPost!.media_url} />

                {/* Lista de comentarios */}
                <div className="flex-1 overflow-y-auto max-h-[300px] border-b bg-white">
                    {loadingUserComments ? (
                        /* Skeleton o Spinner de carga */
                        <div className="p-10 flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-gray-500 font-medium">Buscando respuestas...</p>
                        </div>
                    ) : userComments.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {userComments.map((comment) => (
                                <div key={comment.id} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors">
                                    {/* Avatar con inicial */}
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <span className="text-xs font-bold text-white uppercase">
                                            {comment.username.substring(0, 2)}
                                        </span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-sm text-gray-900 truncate">
                                                @{comment.username}
                                            </span>
                                            <span className="text-[11px] text-gray-400">
                                                {new Date(comment.created_at).toLocaleDateString(undefined, {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed break-words">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Estado cuando no hay comentarios */
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Nadie ha respondido aún.</p>
                            <p className="text-xs text-gray-400">¡Sé el primero en comentar!</p>
                        </div>
                    )}
                </div>
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
                    onClick={closeModal}
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
        </Modal>
    );
} 
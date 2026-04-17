import { Post } from "@/app/feed/page";
import api from "@/lib/axios";
import { Dispatch, SetStateAction, useState } from "react";

export default function PostForm({
    setPosts
}: {
    setPosts: Dispatch<SetStateAction<Post[]>>
}) {
    const [newPost, setNewPost] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);






    // Handler de Creacion de Post
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
                setPosts(prev => [response.data, ...prev]);
                setNewPost("");
                setImage(null);
                setPreview(null);
            }
        } catch (error) {
            console.error("Error al publicar:", error);
        }
    };












    // Handler de Cambio de Imagen
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Crea una URL temporal para la vista previa
        }
    };












    

    return (
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
    )
}
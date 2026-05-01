import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { ContactUser } from "../chat.types";


export const useSearchUsers = (searchTerm: string, localMatchesCount: number) => {
    const [foundUsers, setFoundUsers] = useState<ContactUser[]>([]);
    const [isSearchingAPI, setIsSearchingAPI] = useState<boolean>(false);

    // Busqueda remota con debounce
    useEffect(() => {
        if (searchTerm.length <= 2 || localMatchesCount > 0) {
            setFoundUsers([]);
            setIsSearchingAPI(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearchingAPI(true);
            try {
                // Usamos el endpoint que ya tienes definido
                const response = await api.get<ContactUser[]>(`/users?q=${searchTerm}`);
                setFoundUsers(response.data);
            } catch (error) {
                console.error('Error al buscar usuarios en la API:', error);
                setFoundUsers([]);
            } finally {
                setIsSearchingAPI(false);
            }
        }, 500); // 500ms es un estándar cómodo

        return () => clearTimeout(delayDebounceFn);
        
    }, [searchTerm, localMatchesCount]);

    return { foundUsers, isSearchingAPI };
};
import api from "@/lib/axios";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";


export interface IUserContext {
    user: { id: number, username: string, avatar: string } | null;
    setUser: React.Dispatch<React.SetStateAction<{ id: number, username: string, avatar: string } | null>>;
    loading: boolean;
}

const UserContext = createContext<IUserContext>({
    user: null,
    setUser: () => { },
    loading: true
});


export const useUserContext = () => {
    const ctx = useContext(UserContext);
    return ctx;
}

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<{ id: number, username: string, avatar: string } | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchProfileUser = async () => {
            try {
                const response = await api.get<{ id: number, username: string, avatar: string }>('/users/me');
                setUser({ id: response.data.id, username: response.data.username, avatar: response.data.avatar });
            } catch (error) {
                console.log('Hubo un error al obtener el perfil del usuario:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfileUser();
    }, []);


    const data = {
        user,
        setUser,
        loading
    }

    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    )
}
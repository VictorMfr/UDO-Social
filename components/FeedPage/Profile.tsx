import Link from "next/link";
import { useUserContext } from "@/context/UserProvider";
import Card from "../UI/Card";
import Avatar from "../Avatar";


export default function Profile() {

    const userCtx = useUserContext();

    if (userCtx.loading) {
        return (
            <div className="animate-pulse">
                <div className="h-20 w-20 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
        )
    }

    return (

        <Card variant="flat" className="sticky top-10">
            <div className="flex flex-col items-center text-center">
                {/* Avatar grande */}
                <Avatar
                    initialSrc={userCtx.user?.avatar}
                    size="md"
                />
                
                <h2 className="text-xl font-bold text-gray-900">Mi Perfil</h2>
                <p className="text-sm text-gray-500 mb-6">{userCtx.user!.username}</p>
                <Link href={'/profile'} className="text-blue-500">Editar perfil</Link>
            </div>
        </Card>
    )
}
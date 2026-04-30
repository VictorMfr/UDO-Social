import Header from "@/components/UI/Header";
import SocketProvider from "@/context/SocketProvider";
import UserProvider from "@/context/UserProvider";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <SocketProvider>
                <Header auth={true} />
                {children}
            </SocketProvider>
        </UserProvider>
    );
}
import NavBar from "@/components/NavBar";
import { Fragment } from "react/jsx-runtime";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <Fragment>
            <NavBar/>
            {children}
        </Fragment>
    );
}
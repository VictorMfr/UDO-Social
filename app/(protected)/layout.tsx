import Header from "@/components/UI/Header";
import { Fragment } from "react/jsx-runtime";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <Fragment>
            <Header auth={true}/>
            {children}
        </Fragment>
    );
}
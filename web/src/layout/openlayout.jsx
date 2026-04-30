import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";

export default function Openlayout() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}
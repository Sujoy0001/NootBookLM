import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Openlayout() {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            <Outlet />
        </>
    )
}
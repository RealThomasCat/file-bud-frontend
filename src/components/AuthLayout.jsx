import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.user.user);
    const loading = useSelector((state) => state.user.isLoading);

    useEffect(() => {
        if (!loading) {
            if (authentication && !authStatus) {
                navigate("/login");
            } else if (!authentication && authStatus) {
                navigate("/home");
            }
        }
    }, [authStatus, loading, navigate, authentication]);

    return loading ? 
        <div className="w-full flex justify-center">
            <TailSpin width={48} color="#828FFF" />
        </div>
        : <>{children}</>;
}

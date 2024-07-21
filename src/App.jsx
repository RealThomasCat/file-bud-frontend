import "./App.css";
import React, { useState, useEffect } from "react";
import { Header } from "./components";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "./store/userSlice";
import { TailSpin } from "react-loader-spinner";

function App() {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUser());
        setLoading(false);
    }, [dispatch]);

    return !loading ? (
        <div className="min-h-screen px-6 flex flex-wrap content-between bg-bgCol">
            <div className="w-full block">
                <Header />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    ) : (
        <div className="w-full min-h-screen px-6 text-3xl font-bold text-textCol bg-red-400">
            <TailSpin width={64} color="#828FFF" />
        </div>
    );
}

export default App;

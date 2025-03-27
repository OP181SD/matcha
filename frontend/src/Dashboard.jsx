import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    
    useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");
    if (!token || !userInfo)
        navigate("/");
    else
        setUser(JSON.parse(userInfo));

    }, [navigate]);

    const clearDataInfo = () => {
        localStorage.removeItem("token");
        setUser([]);
        navigate("/");
    }
    return (
        <div className="h-screen flex justify-center items-center bg-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {user ? "Bienvenue !" : "Accès refusé"}
                </h2>

                {user ? (
                    <>
                        <p className="text-gray-700 mb-4">Votre connexion a réussi.</p>
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-800">{user.username}</h3>
                        </div>
                    </>
                ) : (
                    <p className="text-red-500 mb-4">Un probleme est survenu.</p>
                )}

                <button
                    onClick={clearDataInfo}
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                >
                    Retour à la connexion
                </button>
            </div>
        </div>
    );
}

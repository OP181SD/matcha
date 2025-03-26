import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Dashboard() {

    const location = useLocation();
    const navigate = useNavigate();
    const { formData } = location.state || {};

    const handleGoToLogin = () => {
        navigate("/");
    };
    

    return (
        <div className="h-screen flex justify-center items-center bg-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Inscription réussie</h2>
                <p className="text-gray-700 mb-4">Félicitations ! Votre inscription a été réussie.</p>

                <div className="mb-4">
                    <h3 className="font-semibold text-gray-800">{formData.username}</h3>
                    <p className="text-gray-600">{formData.email}</p>
                </div>

                <button
                    onClick={handleGoToLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                >
                    Retour à la connexion
                </button>
            </div>
        </div>
    );
}

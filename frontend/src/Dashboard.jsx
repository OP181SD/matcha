import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state?.formData;

    console.log("FORMDAA",formData);

    console.log("Données reçues dans Dashboard :", formData);

    const handleGoToLogin = () => {
        navigate("/");
    };

    return (
        <div className="h-screen flex justify-center items-center bg-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {formData ? "Bienvenue !" : "Accès refusé"}
                </h2>

                {formData ? (
                    <>
                        <p className="text-gray-700 mb-4">Votre connexion a réussi.</p>
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-800">{formData.identifier}</h3>
                        </div>
                    </>
                ) : (
                    <p className="text-red-500 mb-4">Vous devez vous connecter d'abord.</p>
                )}

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

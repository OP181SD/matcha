import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

export function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulaire envoyé !!", formData);

        fetch('http://127.0.0.1:5001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Mot de passe incorrect ou problème de connexion');
                }
                return response.json();
            })
            .then(data => {
                if (data.success === false) {
                    setError('Mot de passe incorrect');
                } else {
                    localStorage.setItem("token", JSON.stringify(data.token));
                    localStorage.setItem("user", JSON.stringify(data.user));
                    navigate("/dashboard", { state: data });
                }
            })
            .catch(error => {
                console.error("Erreur de connexion :", error);
                setError('Erreur lors de la connexion. Veuillez réessayer.');
            });
    };

    return (
        <div className="h-screen flex justify-center items-center bg-green-100">
            <form className="bg-white p-8 rounded-lg shadow-lg w-96" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Connexion</h2>

                <div className="mb-4">
                    <label htmlFor="identifier" className="block text-gray-800 font-semibold mb-2">
                        Nom ou Email
                    </label>
                    <input
                        type="text"
                        id="identifier"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        autoComplete="username"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-800 font-semibold mb-2">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full mb-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition">
                    Se connecter
                </button>

                <Link to="/">
                    <button
                        type="button"
                        className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition">
                        Retour
                    </button>
                </Link>
            </form>
        </div>
    );
}

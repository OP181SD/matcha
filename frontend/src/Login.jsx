import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

export function Login() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        }); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulaire envoyer check si la connexion a reusii...",formData);
        fetch('http://127.0.0.1:5001/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then (response => response.json())
            .then (data => console.log("OK -> ",data))
            .catch((error) => console.error("Error ->", error));
    };

    return (
        <div className="h-screen flex justify-center items-center bg-green-100">
            <form className="bg-white p-8 rounded-lg shadow-lg w-96" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Connexion</h2>
                <div className="mb-4">
                    <label className="block text-gray-800 font-semibold mb-2">Nom ou Email</label>
                    <input
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-800 font-semibold mb-2">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full mb-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition">
                    se Connecter
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {



    const navigate = useNavigate();
    const [user, setUser] = useState(null);


    const [newUsername, setNewUsername] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    useEffect(() => {
        const token = localStorage.getItem("token");
        const userInfo = localStorage.getItem("user");
        if (!token || !userInfo)
            navigate("/");
        else {
            const parsedUser = JSON.parse(userInfo);
            setUser(parsedUser);
            setNewUsername(parsedUser.username);
        }
    }, [navigate]);

    const ApiUpdate = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5001/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user?.id,
                    username: newUsername
                }),
            })
            if (response.ok) {
                if (response.status === 200)
                {
                    setSuccess("modification reussi avec succes");
                    setTimeout(() => setSuccess(''), 2000);
                }
            }
            else if (response.status === 400)
            {
              
            }
        } catch (error) {
            console.error("ERROR");
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newUsername !== user?.username) {
            ApiUpdate();
        }
        else {
            setError("Errruer la modification a ecouh")
            setTimeout(() => setError(''), 2000);
        }
    }

    const handleChange = (event) => {
        setNewUsername(event.target.value);
    }

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
                {success && <p className="text-green-500 font-bold text-sm text-center mb-4">{success}</p>}
                {error && <p className="text-red-500 font-bold text-sm text-center mb-4">{error}</p>}
                {user ? (
                    <>
                        <p className="text-gray-700 mb-4">Votre connexion a réussi.</p>
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-800">Nom d'utilisateur actuel :</h3>
                            <p className="text-gray-700 mb-4">{user.username}</p>

                            {isEditing ? (
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                        placeholder="Entrez un nouveau nom d'utilisateur"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
                                    >
                                        Sauvegarder
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition mt-4"
                                >
                                    Modifier le nom d'utilisateur
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-red-500 mb-4">Un problème est survenu.</p>
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

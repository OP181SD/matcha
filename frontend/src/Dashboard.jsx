import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogout = async () => {
        console.log("Déconnexion...");
        navigate('/login');
    };

    return (
        <div>
            <h1>Bienvenue sur le dashboard !</h1>
            <p>Contenu du dashboard sans requêtes pour l'instant.</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleLogout}>Se déconnecter</button>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:5001/auth/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération de l’utilisateur');
                }

                const data = await response.json();
                console.log('Données utilisateur récupérées:', data);
                setUser(data.user || data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5001/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Assure-toi que le cookie est envoyé
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la déconnexion');
            }
            const data = await response.json();
            console.log('Déconnexion réussie:', data);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Bienvenue sur le dashboard !</h1>
            {user ? (
                <p>Connecté en tant que : <strong>{user.username}</strong></p>
            ) : (
                <p>Chargement des informations utilisateur...</p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleLogout}>Se déconnecter</button>
        </div>
    );
}

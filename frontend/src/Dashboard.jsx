import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:5001/auth/me', {
                    method: 'GET',
                    credentials: 'include', // important pour envoyer les cookies
                });

                const data = await res.json();

                if (res.ok) {
                    setUser(data.user);
                } else {
                    setError('Non autorisé');
                    navigate('/login');
                }
            } catch (err) {
                setError('Erreur serveur');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        await fetch('http://localhost:5001/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        navigate('/login');
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Bienvenue sur le dashboard !</h1>
            {user && (
                <div>
                    <p>Bonjour, {user.username} 👋</p>
                    <p>Email : {user.email}</p>
                </div>
            )}
            <button onClick={handleLogout}>Se déconnecter</button>
        </div>
    );
}

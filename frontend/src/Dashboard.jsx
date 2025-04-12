import React, { useEffect, useState } from 'react';

export function Dashboard() {
  const [user, setUser] = useState(null); // Pour stocker les données utilisateur
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5001/user', {
          method: 'GET',
          credentials: 'include', // Envoie les cookies pour la session
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Stocke les données de l'utilisateur
        } else {
          setError('Erreur de récupération des données utilisateur');
        }
      } catch (error) {
        setError('Erreur de connexion au serveur');
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); // L'effet se déclenche au montage du composant (une seule fois)

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Bienvenue sur votre Dashboard
        </h2>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {user ? (
          <div className="space-y-4">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">Nom d'utilisateur</h3>
              <p>{user.username}</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">Email</h3>
              <p>{user.email}</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">Prénom</h3>
              <p>{user.firstname}</p>
            </div>
          </div>
        ) : (
          <p>Chargement des données utilisateur...</p>
        )}
      </div>
    </div>
  );
}

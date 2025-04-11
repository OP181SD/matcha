import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Profil() {
  const [prenom, setPrenom] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Récupérer les informations de l'utilisateur (prénom) au chargement du composant
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setPrenom(user.firstname || ''); // Remplir avec le prénom de l'utilisateur
    }
  }, []);

  const handlePrenomChange = (e) => {
    setPrenom(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Récupérer le token depuis localStorage
    const token = localStorage.getItem("token");
    if (!token) {
        console.error('Token manquant, impossible de procéder.');
        setError('Token manquant, veuillez vous reconnecter.');
        return;
    }

    // Préparation des données à envoyer (seulement le prénom)
    const userData = { firstname: prenom };

    // Envoi des données au backend avec le token d'authentification
    fetch('http://127.0.0.1:5001/profil', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Ajout de l'authentification
        },
        body: JSON.stringify(userData),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    console.error("Erreur du serveur :", errData);
                    throw new Error(errData.error || 'Erreur lors de la mise à jour');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Profil mis à jour avec succès:', data);
            navigate("/dashboard");
        })
        .catch(error => {
            console.error("Erreur de mise à jour :", error);
            setError(error.message || 'Erreur lors de la mise à jour. Veuillez réessayer.');
        });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">Compléter votre profil</h1>
      <form onSubmit={handleSubmit}>
        {/* Champ pour le prénom */}
        <div className="mb-6">
          <input
            type="text"
            value={prenom}
            onChange={handlePrenomChange}
            placeholder="Entrez votre prénom"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Valider
          </button>
        </div>
        
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Profil() {
  const [prenom, setPrenom] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Récupérer les informations de l'utilisateur (prénom et photo) au chargement du composant
  useEffect(() => {
    // On suppose que tu récupères les informations de l'utilisateur depuis un token ou une API
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setPrenom(user.firstname || ''); // Remplir avec le prénom de l'utilisateur
      setPhoto(user.profile_picture || ''); // Remplir avec l'URL de la photo de profil
    }
  }, []);

  const handlePrenomChange = (e) => {
    setPrenom(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Envoi des données au backend
    const userData = new FormData();
    userData.append('firstname', prenom);
    userData.append('profile_picture', photo);

    fetch('http://127.0.0.1:5001/update-profil', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`, // Ajout de l'authentification
      },
      body: userData,  // Envoie des données sous forme de FormData (utile pour les fichiers)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour du profil');
        }
        return response.json();
      })
      .then(data => {
        navigate("/dashboard");
      })
      .catch(error => {
        console.error("Erreur de mise à jour :", error);
        setError('Erreur lors de la mise à jour. Veuillez réessayer.');
      });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">Compléter votre profil</h1>
      <form onSubmit={handleSubmit}>
        {/* Photo de profil */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={photo || 'https://via.placeholder.com/150'}
            alt="Photo de profil"
            className="rounded-full w-36 h-36 mb-4"
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mb-2 text-sm text-gray-500"
            />
            <br />
            <span className="text-sm text-gray-600">Changer la photo de profil</span>
          </div>
        </div>

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

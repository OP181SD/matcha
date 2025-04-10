import React, { useState } from 'react';

export function Profil() {
  const [prenom, setPrenom] = useState('');
  const [photo, setPhoto] = useState(null);

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
    console.log('Prénom:', prenom);
    console.log('Photo:', photo);
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
      </form>
    </div>
  );
}
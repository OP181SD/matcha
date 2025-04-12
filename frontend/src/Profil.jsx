import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Profil() {
  const [firstname, setFirstname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname) {
      setError('Le prénom est requis');
      return;
    }

    try {
      console.log('Envoi des données...', firstname); // Vérifie si le prénom est envoyé

      const response = await fetch('http://localhost:5001/profil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname: firstname }),
        credentials: 'include', // Envoie les cookies pour générer le token
      });

      const data = await response.json();

      console.log('Réponse de l\'API:', data); // Vérifie la réponse de l'API

      if (response.ok) {
        console.log('Redirection vers le dashboard');
        // Inscription réussie, redirection vers le dashboard
        navigate('/dashboard'); // Redirige vers le dashboard
      } else {
        console.log('Erreur lors de l\'enregistrement', data.error);
        setError(data.error || 'Une erreur est survenue lors de l\'enregistrement.');
      }
    } catch (error) {
      console.log('Erreur de connexion:', error);
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="p-4">
      <h2>Complétez votre profil</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname">Prénom :</label>
          <input
            type="text"
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}

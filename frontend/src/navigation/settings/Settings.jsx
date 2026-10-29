import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';
import { Navbar } from '../../component/profil/Navbar.jsx';
import { isValidPassword, isValidEmail, isValidName, isValidUsername } from '../../utils/parsing';

export function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [locationStatus, setLocationStatus] = useState('');

  const [editingField, setEditingField] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleUpdate = async (endpoint, body, successMessage) => {
    try {
      await api.put(`/api/${endpoint}`, body);
      setSuccess(successMessage);
      setEditingField(null);
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue.");
    }
  };

  const handleUpdatePassword = async () => {
    resetMessages();
    if (!isValidPassword(password)) {
      return setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");
    }
    if (password !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }
    if (!currentPassword) {
      return setError("Veuillez saisir votre mot de passe actuel.");
    }
    await handleUpdate('update-password', { currentPassword, password }, "Mot de passe mis à jour avec succès.");
    setCurrentPassword('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleUpdateFirstName = async () => {
    resetMessages();
    if (!isValidName(firstname)) return setError("Le prénom doit contenir uniquement des lettres, entre 2 et 30 caractères.");
    await handleUpdate('update-firstname', { first_name: firstname }, "Prénom mis à jour avec succès.");
    setFirstName('');
  };

  const handleUpdateLastName = async () => {
    resetMessages();
    if (!isValidName(lastname)) return setError("Le nom doit contenir uniquement des lettres, entre 2 et 30 caractères.");
    await handleUpdate('update-lastname', { last_name: lastname }, "Nom mis à jour avec succès.");
    setLastName('');
  };

  const handleUpdateEmail = async () => {
    resetMessages();
    if (!isValidEmail(email)) return setError("L'adresse email n'est pas valide.");
    await handleUpdate('update-email', { email }, "Email mis à jour. Un lien de vérification a été envoyé à ta nouvelle adresse.");
    setEmail('');
  };

  const handleUpdateUsername = async () => {
    resetMessages();
    if (!isValidUsername(username)) return setError("Le nom d'utilisateur doit faire entre 3 et 20 caractères, lettres, chiffres ou underscore uniquement.");
    await handleUpdate('update-username', { username }, "Nom d'utilisateur mis à jour avec succès.");
    setUsername('');
  };

  const handleUpdateLocation = () => {
    resetMessages();
    setLocationStatus('requesting');
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas disponible sur ce navigateur.");
      setLocationStatus('');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationStatus('geocoding');
        try {
          const { data: geoData } = await api.get(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`);
          const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || '';

          await api.put('/api/update-location', { latitude, longitude, city });
          setSuccess(`Localisation mise à jour${city ? ` : ${city}` : ''}.`);
        } catch (err) {
          setError(err.response?.data?.error || "Erreur lors de la mise à jour.");
        } finally {
          setLocationStatus('');
        }
      },
      () => {
        setError("Accès à la géolocalisation refusé. Veuillez l'autoriser dans les paramètres du navigateur.");
        setLocationStatus('');
      }
    );
  };

  return (
    <div className="bg-matcha flex flex-col items-center px-4 pb-10">
      <Navbar />
      <h1 className="text-2xl font-bold text-pen mb-2 mt-6">
        matcha <span className="text-pink">抹</span><span className="text-tea">茶</span>
      </h1>
      <p className="matcha-eyebrow mb-6">Paramètres de ton compte</p>

      <div className="matcha-card w-full max-w-md !p-6 space-y-4">
        {error && <p className="text-pen font-semibold">{error}</p>}
        {success && <p className="text-tea font-semibold">{success}</p>}

        {}
        <SettingSection
          title="Mot de passe"
          editing={editingField === 'password'}
          onEdit={() => setEditingField('password')}
          onCancel={() => setEditingField(null)}
          onSave={handleUpdatePassword}
          inputs={[
            { type: 'password', placeholder: 'Mot de passe actuel', value: currentPassword, onChange: setCurrentPassword, autoComplete: 'current-password' },
            { type: 'password', placeholder: 'Nouveau mot de passe', value: password, onChange: setPassword, autoComplete: 'new-password' },
            { type: 'password', placeholder: 'Confirmer mot de passe', value: confirmPassword, onChange: setConfirmPassword, autoComplete: 'new-password' },
          ]}
        />

        <SettingSection
          title="Prénom"
          editing={editingField === 'firstname'}
          onEdit={() => setEditingField('firstname')}
          onCancel={() => setEditingField(null)}
          onSave={handleUpdateFirstName}
          inputs={[
            { type: 'text', placeholder: 'Nouveau prénom', value: firstname, onChange: setFirstName },
          ]}
        />

        <SettingSection
          title="Nom"
          editing={editingField === 'lastname'}
          onEdit={() => setEditingField('lastname')}
          onCancel={() => setEditingField(null)}
          onSave={handleUpdateLastName}
          inputs={[
            { type: 'text', placeholder: 'Nouveau nom', value: lastname, onChange: setLastName },
          ]}
        />

        <SettingSection
          title="Email"
          editing={editingField === 'email'}
          onEdit={() => setEditingField('email')}
          onCancel={() => setEditingField(null)}
          onSave={handleUpdateEmail}
          inputs={[
            { type: 'text', placeholder: 'Nouvel email', value: email, onChange: setEmail },
          ]}
        />

        <SettingSection
          title="Nom d'utilisateur"
          editing={editingField === 'username'}
          onEdit={() => setEditingField('username')}
          onCancel={() => setEditingField(null)}
          onSave={handleUpdateUsername}
          inputs={[
            { type: 'text', placeholder: "Nouveau nom d'utilisateur", value: username, onChange: setUsername },
          ]}
        />

        <div className="w-full border-b border-pen/25 py-4">
          <h2 className="matcha-eyebrow">Localisation</h2>
          <div className="flex justify-between items-center mt-1">
            <button
              onClick={handleUpdateLocation}
              disabled={locationStatus !== ''}
              className="text-tea text-sm font-semibold hover:underline disabled:opacity-50"
            >
              {locationStatus === 'requesting' ? 'Demande GPS...' : locationStatus === 'geocoding' ? 'Mise à jour...' : 'Mettre à jour ma position'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Link
          to="/bloc-page"
          className="matcha-btn matcha-btn-tea w-full max-w-xs text-center"
        >
          Utilisateurs bloqués
        </Link>
        <Link
          to="/profil"
          className="text-sm font-bold text-pen underline hover:text-tea"
        >
          ← Retour
        </Link>
      </div>
    </div>
  );
}

function SettingSection({ title, editing, onEdit, onCancel, onSave, inputs }) {
  return (
    <div className="w-full border-b border-pen/25 py-4">
      <h2 className="matcha-eyebrow">{title}</h2>
      {editing ? (
        <form className="space-y-2 mt-2" onSubmit={e => { e.preventDefault(); onSave(); }}>
          {inputs.map((input, i) => (
            <input
              key={i}
              name={`setting-field-${i}`}
              type={input.type}
              aria-label={input.placeholder}
              autoComplete={input.autoComplete || 'off'}
              placeholder={input.placeholder}
              value={input.value}
              onChange={e => input.onChange(e.target.value)}
              className="matcha-input"
            />
          ))}
          <div className="flex gap-2 justify-center pt-2">
            <button type="submit" className="matcha-btn matcha-btn-tea">
              Enregistrer
            </button>
            <button type="button" onClick={onCancel} className="text-pen/50 font-bold text-sm px-3 py-1 rounded hover:underline">
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between items-center mt-1">
          <button onClick={onEdit} className="text-tea text-sm font-semibold hover:underline">
            Modifier
          </button>
        </div>
      )}
    </div>
  );
}
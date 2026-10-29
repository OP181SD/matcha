import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api.js';
import axios from 'axios';
import { availableCities } from '../data/cityData.js';
import { btnBase, inputBase } from '../../../component/shared/ui.js';

const minDate = new Date(new Date().getFullYear() - 100, 0, 1).toISOString().split('T')[0];
const maxDate = new Date(new Date().getFullYear() - 18, 11, 31).toISOString().split('T')[0];

const calculateAge = (dob) => {
  const birth = new Date(dob);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
  return years;
};

async function reverseGeocode(lat, lon) {
  const { data } = await api.get(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
  const a = data.address || {};
  return a.city || a.town || a.village || '';
}

async function geocodeCity(city) {
  const { data } = await api.get(`/api/forward-geocode?city=${encodeURIComponent(city)}`);
  if (data.length > 0) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  return null;
}

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', 'matcha');
  const res = await axios.post('https://api.cloudinary.com/v1_1/dunrzye1v/image/upload', fd);
  return res.data.secure_url;
}

export function CompleteProfile() {
  const navigate = useNavigate();
  const [gender, setGender] = useState('');
  const [sexualPreferences, setSexualPreferences] = useState('');
  const [birthdate, setBirthdate] = useState(null);
  const [biography, setBiography] = useState('');
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [geolocationDenied, setGeolocationDenied] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/api/me')
      .then(({ data }) => { if (data.profile_complete) navigate('/meet-page', { replace: true }); })
      .catch(() => {});
  }, [navigate]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeolocationDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        try {
          setCity(await reverseGeocode(latitude, longitude));
        } catch {
          setCity('');
        }
      },
      () => setGeolocationDenied(true)
    );
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const confirmCityFromList = async () => {
    if (!city) return;
    try {
      const geo = await geocodeCity(city);
      if (geo) setLocation(geo);
    } catch {

    }
    setLocationConfirmed(true);
  };

  const confirmDetectedCity = () => setLocationConfirmed(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (gender !== 'homme' && gender !== 'femme') return setError('Sélectionnez un genre.');
    if (!['hétérosexuel', 'homosexuel', 'bisexuel'].includes(sexualPreferences))
      return setError('Sélectionnez une préférence sexuelle.');
    if (!birthdate) return setError('Choisissez une date de naissance.');
    const age = calculateAge(birthdate);
    if (age < 18 || age > 120) return setError('Vous devez avoir entre 18 et 120 ans.');
    if (biography.trim().length < 1 || biography.length > 144)
      return setError('La biographie est obligatoire (1 à 144 caractères).');
    if (!locationConfirmed || !location) return setError('Confirmez votre localisation.');
    if (!photoFile) return setError('Ajoutez une photo de profil.');

    setSubmitting(true);
    try {
      const imageUrl = await uploadToCloudinary(photoFile);
      if (!imageUrl) throw new Error('upload');

      try {
        await api.post('/api/complete-profile', {
          gender,
          sexual_preferences: sexualPreferences,
          age,
          biography,
          latitude: location.lat,
          longitude: location.lon,
          city,
        });
      } catch (e) {
        throw new Error(e.response?.data?.error || 'Échec de la complétion.');
      }

      await api.post('/api/add-picture', { imageUrl });
      await api.post('/api/set-profile-picture', { imageUrl });

      navigate('/meet-page');
    } catch (err) {
      setError(err.message === 'upload' ? "Échec de l'envoi de la photo." : err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-matcha text-pen flex flex-col">
      <header className="h-16 flex items-center px-6 border-b border-pen/15">
        <span className="font-quicksand font-extrabold text-2xl text-pen">
          matcha <span className="text-pink">抹</span><span className="text-tea">茶</span>
        </span>
      </header>

      <main className="flex-1 flex items-start justify-center py-6 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-matcha border border-pen/60 rounded-[20px] shadow-[3px_3px_0_rgba(89,67,71,0.28)] p-6 sm:p-8 flex flex-col gap-3"
        >
          <div>
            <h1 className="font-quicksand font-extrabold text-2xl text-pen">Complète ton profil</h1>
            <p className="text-sm text-pen/60 mt-1">
              Ces infos sont requises avant d'accéder à Matcha.
            </p>
          </div>

          <fieldset className="font-bold">
            <legend className="text-sm">Genre</legend>
            <div className="flex gap-4 mt-1">
              {['homme', 'femme'].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value={g} checked={gender === g} onChange={(e) => setGender(e.target.value)} />
                  <span className="capitalize">{g}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label htmlFor="sexual_preferences" className="text-sm font-bold">Préférences sexuelles</label>
          <select id="sexual_preferences" name="sexual_preferences" value={sexualPreferences} onChange={(e) => setSexualPreferences(e.target.value)} className={inputBase}>
            <option value="">-- Sélectionnez --</option>
            <option value="hétérosexuel">Hétérosexuel</option>
            <option value="homosexuel">Homosexuel</option>
            <option value="bisexuel">Bisexuel</option>
          </select>

          <label htmlFor="birthdate" className="text-sm font-bold">Date de naissance</label>
          <input
            id="birthdate"
            type="date"
            name="birthdate"
            className={inputBase}
            min={minDate}
            max={maxDate}
            onChange={(e) => e.target.value && setBirthdate(new Date(e.target.value + 'T12:00:00'))}
          />

          <label htmlFor="biography" className="text-sm font-bold">Biographie</label>
          <textarea
            id="biography"
            name="biography"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            maxLength={144}
            rows={2}
            placeholder="Parle un peu de toi..."
            className={inputBase}
          />

          <div className="p-3 border border-pen/60 rounded-xl flex flex-col gap-2">
            <h3 className="font-bold text-sm">Localisation</h3>
            {locationConfirmed ? (
              <p className="font-semibold flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-tea" /> {city}
                <i className="fas fa-check text-tea" />
              </p>
            ) : geolocationDenied ? (
              <>
                <select name="city" aria-label="Ville" value={city} onChange={(e) => setCity(e.target.value)} className={inputBase}>
                  <option value="">-- Choisissez une ville --</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button type="button" onClick={confirmCityFromList} className={`${btnBase} bg-tea text-pen px-4 py-2 text-sm`}>
                  Confirmer cette ville
                </button>
              </>
            ) : city ? (
              <>
                <p className="font-semibold flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-tea" /> {city}
                </p>
                <button type="button" onClick={confirmDetectedCity} className={`${btnBase} bg-tea text-pen px-4 py-2 text-sm`}>
                  Confirmer cette ville
                </button>
              </>
            ) : (
              <p className="text-sm text-pen/60">Détection de la localisation...</p>
            )}
          </div>

          <label htmlFor="photo" className="text-sm font-bold">Photo de profil</label>
          <input id="photo" type="file" name="photo" accept="image/*" onChange={handlePhoto} className={inputBase} />
          {photoPreview && (
            <img src={photoPreview} alt="Aperçu" className="w-24 h-24 rounded-full object-cover border border-pen/60" />
          )}

          {error && <p className="text-tea font-bold text-center break-words">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className={`${btnBase} bg-pink text-pen p-2.5 disabled:opacity-50`}
          >
            {submitting ? 'Enregistrement...' : 'Valider mon profil'}
            <span className="text-xl">続く</span>
          </button>
        </form>
      </main>
    </div>
  );
}

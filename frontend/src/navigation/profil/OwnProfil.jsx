import { useEffect, useState } from 'react';
import { Navbar } from '../../component/profil/Navbar.jsx';
import { PhotoModal } from '../../component/profil/PhotoModal.jsx';
import api from '../../utils/api.js';
import { handleUploadToCloudinary } from '../profile-picture/ChangeProfilePicture.jsx';

const DEFAULT_PICTURE = "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F375.svg";
const ORIENTATIONS = ['hétérosexuel', 'homosexuel', 'bisexuel'];
const GENDERS = ['homme', 'femme'];

const PANEL = 'bg-matcha border border-pen/60 rounded-2xl shadow-[2px_2px_0_rgba(89,67,71,0.35)]';
const PANEL_T = 'text-[11px] font-extrabold tracking-widest uppercase text-pen/50';
const CHIP = 'text-xs font-bold px-3 py-1.5 border border-pen/60 rounded-full';
const MINI_BTN = 'text-xs font-bold px-3 py-1.5 border border-pen/60 rounded-lg bg-matcha transition-colors hover:bg-pen/5';

export function Profil() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [photoMode, setPhotoMode] = useState('view');
  const [editBio, setEditBio] = useState(false);
  const [editInfos, setEditInfos] = useState(false);
  const [editTags, setEditTags] = useState(false);
  const [draftInfos, setDraftInfos] = useState({ orientation: '', gender: '' });
  const [draftTags, setDraftTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => { authFetchUserProfile(); }, []);
  useEffect(() => {
    api.get('/api/tags/all')
      .then(r => { if (Array.isArray(r.data)) setAvailableTags(r.data); }).catch(() => {});
  }, []);

  const authFetchUserProfile = async () => {
    try {
      const { data: meData } = await api.get('/api/me');
      const userId = meData.user?.id;
      if (!userId) throw new Error("ID utilisateur manquant.");

      const [profileRes, picturesRes, tagsRes] = await Promise.all([
        api.get(`/api/profile/${userId}`),
        api.get(`/api/pictures/${userId}`),
        api.get(`/api/tags/${userId}`),
      ]);
      const profile = profileRes.data;
      const pictures = picturesRes.data;
      const tags = tagsRes.data;
      const profilePic = pictures.find(p => p.is_profile_picture) || {};
      setUser({
        ...profile,
        profilePicture: profilePic.url || DEFAULT_PICTURE,
        photos: Array.isArray(pictures) ? pictures : [],
        interests: Array.isArray(tags) ? tags : [],
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Erreur serveur lors de la récupération du profil");
    }
  };

  const handleEdit = (field, value) => setUser(prev => ({ ...prev, [field]: value }));

  const saveBiography = async () => {
    const bio = user.biography || '';
    if (bio.trim().length < 1 || bio.length > 144) {
      return setError('La biographie est obligatoire (1 à 144 caractères).');
    }
    try {
      await api.post('/api/profile/biography', { biography: user.biography });
      setError('');
      setEditBio(false);
    } catch (err) { setError(err.response?.data?.error || "Erreur sauvegarde bio"); }
  };

  const saveInfos = async () => {
    try {
      await api.post('/api/profile/update-orientation-gender', { orientation: draftInfos.orientation, gender: draftInfos.gender });
      setUser(prev => ({ ...prev, sexual_preferences: draftInfos.orientation, gender: draftInfos.gender }));
      setEditInfos(false);
    } catch (err) { setError("Erreur sauvegarde infos"); }
  };

  const addNewTag = () => {
    const t = newTag.trim().toLowerCase();
    if (t.length < 1 || t.length > 30) return setError('Tag invalide (1 à 30 caractères).');
    if (draftTags.length >= 20) return setError('Trop de tags (maximum 20).');
    if (!draftTags.includes(t)) setDraftTags(prev => [...prev, t]);
    if (!availableTags.includes(t)) setAvailableTags(prev => [...prev, t]);
    setNewTag('');
    setError('');
  };

  const saveTags = async () => {
    if (draftTags.length > 20) {
      return setError('Trop de tags (maximum 20).');
    }
    try {
      const { data } = await api.post('/api/tags/add', { tags: draftTags });
      setUser(prev => ({ ...prev, interests: data.tags || draftTags }));
      setError('');
      setEditTags(false);
    } catch (err) { setError(err.response?.data?.error || "Erreur sauvegarde tags"); }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await api.delete(`/api/pictures/${photoId}`);
      setUser(prev => ({ ...prev, photos: prev.photos.filter(p => p.id !== photoId) }));
    } catch (err) { setError(err.response?.data?.error || "Impossible de supprimer la photo"); }
  };

  const handleSetAsProfilePhoto = async (photoUrl) => {
    try {
      await api.post("/api/set-profile-picture", { imageUrl: photoUrl });
      setUser(prev => ({ ...prev, profilePicture: photoUrl }));
      localStorage.setItem("navbar_pp", photoUrl);
      window.dispatchEvent(new Event("profilePictureChanged"));
    } catch (err) { setError(err.response?.data?.error || "Impossible de mettre à jour la photo de profil"); }
  };

  const handleAddPhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try { await handleUploadToCloudinary(file, setUser); }
    catch (err) { setError(err.message || "Impossible d'ajouter la photo"); }
  };

  const onThumbClick = (photo, idx) => {
    if (photoMode === 'delete') return handleDeletePhoto(photo.id);
    if (photoMode === 'setProfile') { handleSetAsProfilePhoto(photo.url); setPhotoMode('view'); return; }
    setSelectedPhotoIndex(idx);
  };

  if (error) return <div className="min-h-screen bg-matcha flex items-center justify-center text-red-600 font-bold"><i className="fas fa-exclamation-triangle mr-2" />{error}</div>;
  if (!user) return <div className="min-h-screen bg-matcha flex items-center justify-center text-pen font-bold">Chargement...</div>;

  const genderKanji = user.gender === 'homme' ? '男' : user.gender === 'femme' ? '女' : '?';
  const photos = user.photos || [];
  const interests = user.interests || [];

  return (
    <div className="min-h-screen bg-matcha">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">

        {}
        <section className={`${PANEL} p-5 flex items-center gap-4`}>
          <div className="w-24 h-24 flex-none rounded-full border border-pen/60 overflow-hidden bg-matcha">
            <img src={user.profilePicture} alt={user.first_name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-pen flex items-center gap-2">
              {user.first_name} {user.last_name}
              <span className={`text-lg ${user.gender === 'homme' ? 'text-tea' : 'text-pink'}`}>{genderKanji}</span>
            </h1>
            <p className="text-sm font-semibold text-pen/60">
              {user.age ? `${user.age} ans` : ''}{user.city ? ` · ${user.city}` : ''}
            </p>
          </div>
        </section>

        {}
        <div className="grid gap-5 mt-5 md:grid-cols-[340px_1fr] items-start">

          {}
          <div className="flex flex-col gap-5">
            {}
            <section className={`${PANEL} p-5`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={PANEL_T}>À propos</h3>
                {!editBio && <button onClick={() => setEditBio(true)} className="text-xs font-bold text-pen underline">Modifier</button>}
              </div>
              {editBio ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    name="biography"
                    value={user.biography || ''} maxLength={144} rows={4}
                    onChange={(e) => handleEdit('biography', e.target.value)}
                    className="resize-none border border-pen/60 rounded-lg p-2 font-semibold text-pen bg-matcha focus:outline-none focus:ring-2 focus:ring-tea"
                    placeholder="Parle un peu de toi..."
                  />
                  <div className="flex gap-2">
                    <button onClick={saveBiography} className={`${MINI_BTN} bg-tea`}>Sauvegarder</button>
                    <button onClick={() => { setEditBio(false); authFetchUserProfile(); }} className={MINI_BTN}>Annuler</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-pen leading-relaxed">{user.biography || "Pas encore de biographie."}</p>
              )}
            </section>

            {}
            <section className={`${PANEL} p-5`}>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className={PANEL_T}>Infos</h3>
                {!editInfos
                  ? <button onClick={() => { setDraftInfos({ orientation: user.sexual_preferences || '', gender: user.gender || '' }); setEditInfos(true); }} className="text-xs font-bold text-pen underline">Modifier</button>
                  : <div className="flex gap-2">
                      <button onClick={saveInfos} className={`${MINI_BTN} bg-tea`}>OK</button>
                      <button onClick={() => setEditInfos(false)} className={MINI_BTN}>Annuler</button>
                    </div>}
              </div>
              {editInfos ? (
                <div className="space-y-3">
                  <div>
                    <span className="block text-xs font-bold text-pen/60 mb-1.5">Orientation</span>
                    <div className="flex flex-wrap gap-1.5">
                      {ORIENTATIONS.map(o => (
                        <button key={o} onClick={() => setDraftInfos(d => ({ ...d, orientation: o }))}
                          className={`${CHIP} ${draftInfos.orientation === o ? 'bg-tea' : 'bg-matcha'}`}>{o}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-pen/60 mb-1.5">Genre</span>
                    <div className="flex flex-wrap gap-1.5">
                      {GENDERS.map(g => (
                        <button key={g} onClick={() => setDraftInfos(d => ({ ...d, gender: g }))}
                          className={`${CHIP} ${draftInfos.gender === g ? 'bg-pink' : 'bg-matcha'}`}>{g}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  <span className={`${CHIP} bg-tea/25`}>{user.sexual_preferences || '—'}</span>
                  <span className={`${CHIP} bg-pink/30`}>{user.gender || '—'}</span>
                  {user.city && <span className={`${CHIP} bg-matcha`}>{user.city}</span>}
                </div>
              )}
            </section>

            {}
            <section className={`${PANEL} p-5`}>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className={PANEL_T}>Intérêts</h3>
                {!editTags
                  ? <button onClick={() => { setDraftTags(interests); setEditTags(true); }} className="text-xs font-bold text-pen underline">Modifier</button>
                  : <div className="flex gap-2">
                      <button onClick={saveTags} className={`${MINI_BTN} bg-tea`}>OK</button>
                      <button onClick={() => setEditTags(false)} className={MINI_BTN}>Annuler</button>
                    </div>}
              </div>
              {editTags ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      maxLength={30}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNewTag(); } }}
                      placeholder="Nouveau tag..."
                      aria-label="Nouveau tag"
                      className="flex-1 min-w-0 border border-pen/60 rounded-lg px-2 py-1 text-sm font-semibold text-pen bg-matcha focus:outline-none focus:ring-2 focus:ring-tea"
                    />
                    <button type="button" onClick={addNewTag} className={`${MINI_BTN} bg-tea`}>Ajouter</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {availableTags.map(t => {
                      const on = draftTags.includes(t);
                      return (
                        <button key={t} onClick={() => setDraftTags(prev => on ? prev.filter(x => x !== t) : [...prev, t])}
                          className={`${CHIP} ${on ? 'bg-tea' : 'bg-matcha'}`}>#{t}</button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {interests.length ? interests.map((t, i) => (
                    <span key={t} className={`${CHIP} ${i % 2 ? 'bg-pink/30' : 'bg-tea/25'}`}>#{t}</span>
                  )) : <span className="text-sm text-pen/50">Aucun intérêt.</span>}
                </div>
              )}
            </section>
          </div>

          {}
          <section className={`${PANEL} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={PANEL_T}>Photos</h3>
              <div className="flex gap-2">
                <button onClick={() => setPhotoMode(m => m === 'setProfile' ? 'view' : 'setProfile')}
                  className={`${MINI_BTN} ${photoMode === 'setProfile' ? 'bg-tea' : ''}`}>Photo de profil</button>
                <button onClick={() => setPhotoMode(m => m === 'delete' ? 'view' : 'delete')}
                  className={`${MINI_BTN} ${photoMode === 'delete' ? 'bg-pink' : ''}`}>Supprimer</button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((p, idx) => (
                <button
                  key={p.id || idx}
                  onClick={() => onThumbClick(p, idx)}
                  className={`relative aspect-square border rounded-xl overflow-hidden
                    ${p.is_profile_picture ? 'border-tea' : 'border-pen/60'}
                    ${photoMode === 'delete' ? 'ring-2 ring-pink' : photoMode === 'setProfile' ? 'ring-2 ring-tea' : ''}`}
                  title={photoMode === 'delete' ? 'Supprimer' : photoMode === 'setProfile' ? 'Définir comme photo de profil' : 'Voir'}
                >
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                  {p.is_profile_picture && (
                    <span className="absolute top-1.5 left-1.5 text-[10px] font-extrabold bg-tea text-pen border border-pen/60 rounded px-1">profil</span>
                  )}
                </button>
              ))}
              {photos.length < 5 && (
                <button
                  onClick={() => document.getElementById('fileInput').click()}
                  className="aspect-square grid place-items-center border border-dashed border-pen/40 rounded-xl text-pen/40 text-3xl hover:border-pen hover:text-pen"
                  aria-label="Ajouter une photo"
                >+</button>
              )}
            </div>
          </section>

        </div>
      </main>

      <PhotoModal
        photos={photos}
        selectedPhotoIndex={selectedPhotoIndex}
        onClose={() => setSelectedPhotoIndex(null)}
        onPrevious={() => setSelectedPhotoIndex(prev => prev - 1)}
        onNext={() => setSelectedPhotoIndex(prev => prev + 1)}
      />
      <input type="file" id="fileInput" style={{ display: 'none' }} accept="image/*" onChange={handleAddPhoto} />
    </div>
  );
}

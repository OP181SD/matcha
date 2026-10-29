import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../component/profil/Navbar.jsx';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaFlag, FaBan, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { fetchProfileById, checkLikeStatus, toggleLike, reportProfile, blockProfile } from '../api/profile-api.js';
import { getConnectionStatus } from '../../utils/time.js';

export function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const loadProfile = useCallback(async () => {
    try {
      const data = await fetchProfileById(id);
      setProfile(data);
      const likedStatus = await checkLikeStatus(id);
      setLiked(likedStatus);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleLike = async () => {
    try {
      const data = await toggleLike(id, liked);

      setLiked(!liked);
      if (!data.match) toast.success(liked ? 'Like annulé' : 'Like ajouté');

      await loadProfile();
    } catch (err) {
      toast.error("Erreur lors du like/unlike.");
    }
  };
  const handleReport = async (reason) => {
    try {

      await reportProfile(id, reason);
      toast.success(`Signalement "${reason}" envoyé`);
      navigate('/meet-page');
    } catch (err) {
      toast.error("Erreur lors du signalement.");
    }
  };
  const handleBlock = async () => {
    try {
      await blockProfile(id);
      toast.success('Utilisateur bloqué');
      navigate('/meet-page');
    } catch (err) {
      toast.error("Erreur lors du blocage.");
    }
  };

  const nextPhoto = useCallback(() => {
    if (!profile || !profile.pictures.length) return;
    setSelectedPhotoIndex((prev) => (prev + 1) % profile.pictures.length);
  }, [profile]);

  const prevPhoto = useCallback(() => {
    if (!profile || !profile.pictures.length) return;
    setSelectedPhotoIndex((prev) => (prev - 1 + profile.pictures.length) % profile.pictures.length);
  }, [profile]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  useEffect(() => {
    if (selectedPhotoIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
      else if (e.key === 'ArrowLeft') prevPhoto();
      else if (e.key === 'ArrowRight') nextPhoto();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedPhotoIndex, prevPhoto, nextPhoto]);

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600 font-bold">{error}</div>;
  if (!profile) return <div className="flex justify-center items-center h-screen text-pen/60">Profil introuvable</div>;

  const {
    first_name, last_name, age, gender, sexual_preferences, biography,
    city, fame_rating, tags = [], pictures = [], likes_you, connected
  } = profile;

  const genderSymbol = gender === 'homme' ? '♂' : gender === 'femme' ? '♀' : '?';
  const profilePicture = pictures[0] || 'https://placehold.co/300x300';
  const connectionStatus = getConnectionStatus(profile);

  return (
    <div>
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-4 py-4 lg:h-[calc(100dvh-74px)]">
        <div className="matcha-card !p-6 h-full grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] overflow-hidden">

          {}
          <div className="flex flex-col items-center text-center min-h-0 lg:overflow-y-auto lg:border-r lg:border-pen/25 lg:pr-6">
            <img src={profilePicture} alt={`${first_name} profil`} className="w-36 h-36 rounded-full object-cover border-2 border-pen/60 matcha-shadow-sm" />
            <h1 className="mt-3 text-2xl font-extrabold text-pen">{first_name} {last_name} <span className="font-bold">{genderSymbol}</span></h1>
            <p className="mt-1 text-sm text-pen font-bold">{age} ans · {city || "Ville inconnue"}</p>
            <p className={`text-xs ${connectionStatus.style} mt-1`}>{connectionStatus.text}</p>

            {}
            {(connected || likes_you) && (
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {connected ? (
                  <span className="text-xs font-bold px-2.5 py-1 border border-pen/60 rounded-full bg-pink text-pen">Connecté ♥</span>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-1 border border-pen/60 rounded-full bg-tea text-pen">Vous a liké</span>
                )}
              </div>
            )}

            <div className="mt-3 w-full grid grid-cols-2 gap-2 text-left">
              <span className="matcha-eyebrow col-span-2">Infos</span>
              <p className="text-sm text-pen"><span className="text-pen/50">Orientation</span><br/>{sexual_preferences || "—"}</p>
              <p className="text-sm text-pen"><span className="text-pen/50">Popularité</span><br/>{fame_rating ?? "?"}</p>
            </div>

            <div className="mt-4 w-full flex flex-col gap-2">
              <button onClick={handleLike} className="matcha-btn bg-pink/30 w-full">
                {liked ? <FaHeart /> : <FaRegHeart />} {connected ? 'Se déconnecter' : (liked ? 'Annuler le like' : 'Like')}
              </button>
              <div className="flex gap-2">
                <button onClick={() => { setReporting(!reporting); setBlocking(false); }} className="matcha-btn bg-tea flex-1">
                  <FaFlag /> Signaler
                </button>
                <button onClick={() => { setBlocking(!blocking); setReporting(false); }} className="matcha-btn bg-violet text-white flex-1">
                  <FaBan /> Bloquer
                </button>
              </div>
            </div>

            {reporting && (
              <div className="mt-3 w-full flex flex-col gap-2">
                {['Faux profil', 'Pas intéressé(e)', 'Comportement inapproprié'].map(reason => (
                  <button key={reason} onClick={() => handleReport(reason)} className="matcha-btn bg-pink/30 w-full">
                    {reason}
                  </button>
                ))}
              </div>
            )}

            {blocking && (
              <div className="mt-3 w-full flex flex-col items-center gap-3">
                <p className="text-pen font-semibold text-center text-sm">
                  Bloquer cet utilisateur ? Il disparaîtra de vos recherches, ne pourra plus voir votre profil, et le chat sera coupé.
                </p>
                <div className="flex gap-2 w-full">
                  <button onClick={() => setBlocking(false)} className="matcha-btn bg-tea flex-1">Annuler</button>
                  <button onClick={handleBlock} className="matcha-btn bg-violet text-white flex-1">Confirmer</button>
                </div>
              </div>
            )}
          </div>

          {}
          <div className="flex flex-col gap-5 min-h-0 lg:overflow-y-auto pr-1">
            <div>
              <h2 className="matcha-eyebrow mb-2">Biographie</h2>
              <p className="text-pen">{biography || "Aucune biographie renseignée."}</p>
            </div>

            <div>
              <h2 className="matcha-eyebrow mb-2">Centres d'intérêt</h2>
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-full border border-pen/60 bg-tea text-pen font-bold text-sm">{tag}</span>
                  ))}
                </div>
              ) : (
                <p className="text-pen/50">Aucun intérêt renseigné.</p>
              )}
            </div>

            <div>
              <h2 className="matcha-eyebrow mb-2">Galerie</h2>
              {pictures.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pictures.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${first_name} ${idx + 1}`}
                      className="aspect-square w-full object-cover rounded-xl border border-pen/60 matcha-shadow-sm cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedPhotoIndex(idx)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-pen/50">Aucune photo disponible.</p>
              )}
            </div>
          </div>

        </div>
      </main>

      {selectedPhotoIndex !== null && pictures.length > 0 && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-matcha border border-pen/60 rounded-[20px] shadow-[3px_3px_0_rgba(89,67,71,0.28)] p-4 flex flex-col items-center gap-3 max-w-[92vw]"
          >
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              aria-label="Fermer"
              className="absolute -top-3 -right-3 w-9 h-9 grid place-items-center rounded-full bg-matcha text-pen border border-pen/60 shadow-[2px_2px_0_rgba(89,67,71,0.28)] hover:bg-pink/30 transition-colors"
            >
              <FaTimes />
            </button>

            <div className="flex items-center gap-3">
              {pictures.length > 1 && (
                <button
                  onClick={prevPhoto}
                  aria-label="Précédent"
                  className="flex-none w-10 h-10 grid place-items-center rounded-full bg-matcha text-pen border border-pen/60 hover:bg-pink/30 transition-colors"
                >
                  <FaArrowLeft />
                </button>
              )}

              <img
                src={pictures[selectedPhotoIndex]}
                alt={`${first_name} ${selectedPhotoIndex + 1}`}
                className="h-[78vh] w-auto max-w-[82vw] object-contain rounded-xl border border-pen/60"
              />

              {pictures.length > 1 && (
                <button
                  onClick={nextPhoto}
                  aria-label="Suivant"
                  className="flex-none w-10 h-10 grid place-items-center rounded-full bg-matcha text-pen border border-pen/60 hover:bg-pink/30 transition-colors"
                >
                  <FaArrowRight />
                </button>
              )}
            </div>

            {pictures.length > 1 && (
              <span className="matcha-eyebrow">{selectedPhotoIndex + 1} / {pictures.length}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
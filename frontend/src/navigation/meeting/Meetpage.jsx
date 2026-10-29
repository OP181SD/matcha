import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Navbar } from '../../component/profil/Navbar.jsx';
import { FilterComponent } from './component/FilterComponent.jsx';
import { fetchProfiles, fetchFilters, saveFilters, likeProfile, dislikeProfile } from '../api/meet-page-api.js';

const SORTS = [
  { value: 'distance', label: 'Trier : distance' },
  { value: 'age', label: 'Trier : âge' },
  { value: 'fame', label: 'Trier : popularité' },
  { value: 'tags', label: 'Trier : tags communs' },
];

export function Meetpage() {
  const [profiles, setProfiles] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [filters, setFilters] = useState({ ageRange: [18, 100], popularity: 0, distance: 15000, tags: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [isLoading, setIsLoading] = useState(true);
  const [swipe, setSwipe] = useState('');

  const navigate = useNavigate();
  const currentUser = profiles[0];
  const isMountedRef = useRef(true);
  useEffect(() => () => { isMountedRef.current = false; }, []);

  const loadProfiles = useCallback(async (sort = sortBy) => {
    setIsLoading(true);
    const data = await fetchProfiles(sort);
    if (!isMountedRef.current) return;
    setProfiles(data);
    setIsLoading(false);
  }, [sortBy]);

  const loadFilters = useCallback(async () => {
    const savedFilters = await fetchFilters();
    if (savedFilters && isMountedRef.current) setFilters(savedFilters);
  }, []);

  const handleApplyFilters = async (newFilters) => {
    await saveFilters(newFilters);
    loadProfiles();
    setShowFilters(false);
  };

  const removeCurrentProfile = () => setProfiles(prev => prev.slice(1));

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      await likeProfile(currentUser.id);
      removeCurrentProfile();
    } catch (err) {
      toast.error(err.message || "Erreur lors du like.");
    }
  };

  const handleDislike = async () => {
    if (!currentUser) return;
    try {
      await dislikeProfile(currentUser.id);
      removeCurrentProfile();
    } catch (err) {
      toast.error(err.message || "Erreur lors du dislike.");
    }
  };

  const handleSortChange = (newSort) => setSortBy(newSort);

  useEffect(() => { loadFilters(); }, [loadFilters]);
  useEffect(() => { loadProfiles(); }, [loadProfiles]);
  useEffect(() => { setCurrentPhotoIndex(0); }, [currentUser]);

  const { first_name, age, gender, biography, city, tags = [], distance, pictures = [], id } = currentUser || {};
  const photos = pictures.length ? pictures : ["https://placehold.co/400x500"];
  const currentPhoto = photos[currentPhotoIndex];
  const sexKanji = gender === 'femme' ? '女' : gender === 'homme' ? '男' : '?';
  const selectedTags = filters.tags || [];

  const doSwipe = (dir, action) => {
    if (!currentUser) return;
    setSwipe(dir);
    setTimeout(() => { setSwipe(''); action(); }, 260);
  };
  const passProfile = () => doSwipe('l', handleDislike);
  const likeCurrent = () => doSwipe('r', handleLike);

  const nextPhoto = () => setCurrentPhotoIndex((p) => (p + 1) % photos.length);
  const prevPhoto = () => setCurrentPhotoIndex((p) => (p - 1 + photos.length) % photos.length);

  useEffect(() => {
    const onKey = (e) => {
      if (showFilters || !currentUser) return;
      if (e.key === 'ArrowLeft') passProfile();
      else if (e.key === 'ArrowRight') likeCurrent();
      else if (e.code === 'Space') { e.preventDefault(); nextPhoto(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); 

  const upcoming = profiles.slice(1, 4);
  const shadowHard = 'shadow-[2px_2px_0_rgba(89,67,71,0.28)]';

  return (
    <>
      <Navbar />

      <main className="flex-1 w-full max-w-[1340px] mx-auto px-4 sm:px-8 py-6">
        <div className="grid gap-5 items-start lg:grid-cols-[262px_minmax(0,1fr)] xl:grid-cols-[262px_minmax(0,1fr)_288px]">

          {}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <FilterComponent filters={filters} onApply={handleApplyFilters} />
          </aside>

          {}
          <section className="flex flex-col items-center gap-4">

            {}
            <div className="flex items-center gap-2.5 flex-wrap w-full max-w-[370px]">
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-pen/60 bg-tea font-bold text-sm ${shadowHard}`}
              >
                Filtres
              </button>
              <select
                name="sortBy"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                aria-label="Trier par"
                className="font-bold text-sm px-3 py-2.5 pr-8 border border-pen/60 rounded-xl bg-matcha text-pen cursor-pointer appearance-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23594347' stroke-width='3'%3E%3Cpath d='M5 9l7 7 7-7'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {!isLoading && profiles.length > 0 && (
                <span className="ml-auto text-sm text-pen/50 font-mono">{profiles.length} profil{profiles.length > 1 ? 's' : ''}</span>
              )}
            </div>

            {isLoading ? (
              <p className="text-pen font-semibold mt-12">Chargement...</p>
            ) : currentUser ? (
              <div className="relative w-full max-w-[370px]">
                {}
                <div className="hidden sm:block absolute inset-0 border border-pen/60 rounded-[20px] bg-[#F4EEE2] rotate-3 translate-y-1.5 z-0" />
                <div className="hidden sm:block absolute inset-0 border border-pen/60 rounded-[20px] bg-[#F4EEE2] -rotate-2 translate-y-0.5 z-0" />

                <article
                  className={`relative z-10 bg-matcha border border-pen/60 rounded-[20px] shadow-[3px_3px_0_rgba(89,67,71,0.28)] p-3 transition-all duration-300 ease-out
                    ${swipe === 'l' ? '-translate-x-[120%] -rotate-12 opacity-0' : ''}
                    ${swipe === 'r' ? 'translate-x-[120%] rotate-12 opacity-0' : ''}`}
                >
                  {}
                  <div className="relative aspect-[5/6] border border-pen/60 rounded-[14px] overflow-hidden bg-gradient-to-br from-pink to-tea grid place-items-center">
                    <img
                      src={currentPhoto}
                      alt={`Profil de ${first_name}`}
                      className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        (e.clientX - rect.left < rect.width / 2) ? prevPhoto() : nextPhoto();
                      }}
                    />
                    {}
                    {photos.length > 1 && (
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex gap-1.5 z-20">
                        {photos.map((_, i) => (
                          <span key={i} className={`flex-1 h-1 rounded-full ${i === currentPhotoIndex ? 'bg-matcha' : 'bg-matcha/40'}`} />
                        ))}
                      </div>
                    )}
                    {}
                    {distance !== null && distance !== undefined && (
                      <span className="absolute top-6 right-3 z-20 inline-flex items-center bg-matcha border border-pen/60 rounded-full px-2.5 py-1 text-xs font-extrabold pointer-events-none">
                        {distance.toFixed(1)} km
                      </span>
                    )}
                    {}
                    <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-pen/80 to-transparent pointer-events-none z-10" />
                    {}
                    <div className="absolute left-3.5 right-3.5 bottom-3.5 z-20 text-matcha pointer-events-none">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-2xl font-extrabold tracking-tight">{first_name}, {age}</h2>
                        <span className="text-base font-semibold bg-pink text-pen border border-pen/60 rounded-lg px-2">{sexKanji}</span>
                      </div>
                      {city && <p className="text-sm opacity-90 mt-1">{city}</p>}
                    </div>
                  </div>

                  {}
                  <div className="pt-3 px-1 pb-1">
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {tags.map((t, i) => (
                          <span
                            key={t}
                            className={`text-xs font-bold px-2.5 py-1 border border-pen/60 rounded-full
                              ${selectedTags.includes(t) ? 'bg-tea' : i % 2 ? 'bg-pink/30' : 'bg-tea/25'}`}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-pen">
                      <span className="block text-[11px] font-extrabold tracking-widest uppercase text-pen/50 mb-1">À propos</span>
                      {biography || "Non renseigné"}
                    </p>

                    {}
                    <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-dashed border-pen/25">
                      <button
                        onClick={passProfile}
                        aria-label="Passer"
                        className={`w-12 h-12 grid place-items-center border border-pen/60 rounded-xl bg-matcha ${shadowHard} transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5`}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
                      </button>
                      <button
                        onClick={likeCurrent}
                        aria-label="Liker"
                        className={`w-[58px] h-[58px] grid place-items-center border border-pen/60 rounded-2xl bg-tea ${shadowHard} transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5`}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5S3.5 15 3.5 9.4A4.4 4.4 0 0112 7.3a4.4 4.4 0 018.5 2.1c0 5.6-8.5 11.1-8.5 11.1z" /></svg>
                      </button>
                      <button
                        onClick={() => navigate(`/profile/${id}`)}
                        aria-label="Voir le profil complet"
                        className="w-12 h-12 grid place-items-center border border-pen/60 rounded-[14px] bg-pink/30 shadow-[2px_2px_0_rgba(89,67,71,0.28)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="8" r="3.4" /><path d="M4.5 20a7.5 7.5 0 0115 0" /></svg>
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ) : (
              <div className="w-full max-w-[370px] flex flex-col gap-2 justify-center items-center p-6 min-h-[300px] border border-pen/60 rounded-[20px] bg-matcha shadow-[3px_3px_0_rgba(89,67,71,0.28)]">
                <p className="text-lg text-pink font-semibold">Aucun profil trouvé.</p>
                <p className="text-sm text-pen font-bold mb-2">Essayez de modifier vos filtres...</p>
                <button onClick={() => setShowFilters(true)} className={`lg:hidden px-4 py-2 rounded-xl border border-pen/60 bg-tea font-bold text-sm ${shadowHard}`}>
                  Modifier les filtres
                </button>
              </div>
            )}

            {currentUser && (
              <p className="hidden lg:flex gap-4 text-xs text-pen/50">
                <span><kbd className="font-mono text-[11px] font-bold bg-matcha border border-pen/60 border-b-2 rounded px-1.5 mr-1">←</kbd>passer</span>
                <span><kbd className="font-mono text-[11px] font-bold bg-matcha border border-pen/60 border-b-2 rounded px-1.5 mr-1">→</kbd>liker</span>
                <span><kbd className="font-mono text-[11px] font-bold bg-matcha border border-pen/60 border-b-2 rounded px-1.5 mr-1">espace</kbd>photo</span>
              </p>
            )}
          </section>

          {}
          <aside className="hidden xl:block">
            <section className="bg-matcha border border-pen/60 rounded-2xl shadow-[2px_2px_0_rgba(89,67,71,0.28)] p-5">
              <h3 className="text-[11.5px] font-extrabold tracking-widest uppercase text-pen/50 mb-4">À suivre</h3>
              {upcoming.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {upcoming.map((p) => (
                    <li key={p.id} className="flex items-center gap-3">
                      <span className="w-11 h-11 flex-none border border-pen/60 rounded-xl overflow-hidden bg-gradient-to-br from-pink to-tea grid place-items-center">
                        {p.pictures?.[0]
                          ? <img src={p.pictures[0]} alt={p.first_name} className="w-full h-full object-cover" />
                          : <span className="text-lg text-pen/40">{p.gender === 'femme' ? '女' : '男'}</span>}
                      </span>
                      <div className="min-w-0">
                        <b className="text-sm block truncate">{p.first_name}, {p.age}</b>
                        <span className="text-xs text-pen/50">
                          {p.distance != null ? `${p.distance.toFixed(1)} km` : ''}
                          {p.tags?.length ? ` · ${p.tags.length} tag${p.tags.length > 1 ? 's' : ''}` : ''}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-pen/50">Rien pour le moment.</p>
              )}
            </section>
          </aside>

        </div>
      </main>
    </>
  );
}

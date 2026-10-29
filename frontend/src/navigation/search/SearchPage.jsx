import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../component/profil/Navbar.jsx';
import { DoubleRangeSlider } from '../../component/shared/DoubleRangeSlider.jsx';
import { searchProfiles, fetchAllTags } from '../api/search-api.js';

const distanceSteps = [1, 2, 3, 5, 10, 25, 50, 100, 250, 500, 1000, 5000, 10000, 15000];

const DEFAULT_PICTURE = 'https://placehold.co/300x300';

export function SearchPage() {
  const navigate = useNavigate();

  const [ageRange, setAgeRange] = useState([18, 100]);
  const [popularityRange, setPopularityRange] = useState([0, 100]);
  const [distanceIndex, setDistanceIndex] = useState(distanceSteps.length - 1);
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [sortBy, setSortBy] = useState('fame');

  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllTags().then(setAvailableTags).catch(() => {});
  }, []);

  const handleTagChange = (e) => {
    const value = e.target.value;
    setTags(prev => e.target.checked ? [...prev, value] : prev.filter(t => t !== value));
  };

  const runSearch = async () => {
    setIsLoading(true);
    try {
      const data = await searchProfiles({
        ageMin: ageRange[0],
        ageMax: ageRange[1],
        popularityMin: popularityRange[0],
        popularityMax: popularityRange[1],
        distanceMax: distanceSteps[distanceIndex],
        tags,
        sortBy,
      });
      setResults(data);
    } catch (err) {
      setResults([]);
    } finally {
      setHasSearched(true);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAgeRange([18, 100]);
    setPopularityRange([0, 100]);
    setDistanceIndex(distanceSteps.length - 1);
    setTags([]);
    setSortBy('fame');
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto w-full">

        {}
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-5 border-2 border-tea rounded-3xl p-6 h-fit">
          <h1 className="text-2xl font-bold text-pen">Recherche avancée</h1>

          <DoubleRangeSlider label="Tranche d'âge" min={18} max={100} values={ageRange} onChange={setAgeRange} idPrefix="searchAge" />
          <DoubleRangeSlider label="Plage de popularité" min={0} max={100} values={popularityRange} onChange={setPopularityRange} idPrefix="searchPopularity" />

          <div className="flex flex-col items-start gap-2 w-full">
            <label htmlFor="searchDistance" className="text-lg text-pen">Distance max</label>
            <input
              id="searchDistance"
              type="range"
              min="0" max={distanceSteps.length - 1} step="1"
              value={distanceIndex}
              onChange={e => setDistanceIndex(Number(e.target.value))}
              className="w-full accent-tea"
            />
            <span className="text-pen">{distanceSteps[distanceIndex]} km</span>
          </div>

          <div className="flex flex-col items-start gap-2 w-full">
            <span className="text-lg font-semibold text-pen">Tags</span>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <label key={tag} className="flex items-center gap-1 text-pen text-sm">
                  <input type="checkbox" name="tags" value={tag} checked={tags.includes(tag)} onChange={handleTagChange} />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 w-full">
            <label htmlFor="searchSort" className="text-lg text-pen">Trier par</label>
            <select
              id="searchSort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full p-2 rounded border text-pen"
            >
              <option value="distance">Distance</option>
              <option value="age">Âge</option>
              <option value="fame">Popularité</option>
              <option value="tags">Tags communs</option>
            </select>
          </div>

          <div className="flex gap-3 w-full">
            <button onClick={handleReset} className="flex-1 px-4 py-2 rounded-full bg-tea text-white font-semibold hover:opacity-90 transition">
              Réinitialiser
            </button>
            <button onClick={runSearch} className="flex-1 px-4 py-2 rounded-full bg-pink text-white font-semibold hover:opacity-90 transition">
              Rechercher
            </button>
          </div>
        </aside>

        {}
        <section className="flex-1">
          {isLoading ? (
            <p className="text-center text-pen mt-12">Recherche en cours...</p>
          ) : !hasSearched ? (
            <p className="text-center text-pen mt-12">Choisissez vos critères puis lancez une recherche.</p>
          ) : results.length === 0 ? (
            <p className="text-center text-pen mt-12">Aucun profil ne correspond à ces critères.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => navigate(`/profile/${profile.id}`)}
                  className="flex flex-col text-left rounded-2xl border-2 border-pink overflow-hidden hover:scale-[1.02] transition"
                >
                  <img
                    src={(profile.pictures && profile.pictures[0]) || DEFAULT_PICTURE}
                    alt={profile.first_name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-3 flex flex-col gap-1">
                    <span className="font-bold text-pen">{profile.first_name}, {profile.age} ans</span>
                    <span className="text-sm text-pen">{profile.city || 'Ville inconnue'}</span>
                    <span className="text-sm text-pen">
                      Popularité : {profile.fame_rating ?? '?'}
                      {profile.distance !== null && profile.distance !== undefined && ` · ${Number(profile.distance).toFixed(1)} km`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

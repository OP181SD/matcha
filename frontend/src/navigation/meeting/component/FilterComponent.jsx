import { useState, useEffect } from 'react';
import api from '../../../utils/api.js';
import { DoubleRangeSlider } from '../../../component/shared/DoubleRangeSlider.jsx';

const distanceSteps = [1, 2, 3, 5, 10, 25, 50, 100, 250, 500, 1000, 5000, 10000, 15000];

export function FilterComponent({ filters = {}, onApply, onReset }) {
  const [ageRange, setAgeRange] = useState(filters.ageRange || [18, 100]);
  const [popularity, setPopularity] = useState(filters.popularity ?? 0);
  const [distanceIndex, setDistanceIndex] = useState(
    filters.distance ? distanceSteps.findIndex(d => d >= filters.distance) : distanceSteps.length - 1
  );
  const [tags, setTags] = useState(filters.tags || []);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    api.get('/api/tags/all')
      .then(r => { if (Array.isArray(r.data)) setAvailableTags(r.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setAgeRange(filters.ageRange || [18, 100]);
    setPopularity(filters.popularity ?? 0);
    setDistanceIndex(filters.distance ? distanceSteps.findIndex(d => d >= filters.distance) : distanceSteps.length - 1);
    setTags(filters.tags || []);
  }, [filters]);

  const toggleTag = (tag) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleApply = async () => {
    const filterData = { ageRange, popularity, distance: distanceSteps[distanceIndex], tags };
    try {
      await api.post("/api/filters", filterData);
      onApply?.(filterData);
    } catch (err) {
    }
  };

  const handleReset = () => {
    setAgeRange([18, 100]);
    setPopularity(0);
    setDistanceIndex(distanceSteps.length - 1);
    setTags([]);
    onReset?.();
  };

  return (
    <section className="bg-matcha border border-pen/60 rounded-2xl shadow-[2px_2px_0_rgba(89,67,71,0.28)] p-4">
      <h3 className="flex items-center justify-between gap-2 text-[11.5px] font-extrabold tracking-widest uppercase text-pen/50 mb-3">
        Filtres
        <button type="button" onClick={handleReset} className="text-xs font-bold text-pen normal-case tracking-normal underline">
          Réinitialiser
        </button>
      </h3>

      <div className="flex flex-col gap-3">
        <DoubleRangeSlider label="Âge" min={18} max={100} values={ageRange} onChange={setAgeRange} idPrefix="age" />

        <div className="pt-3 border-t border-dashed border-pen/20">
          <div className="flex items-baseline justify-between mb-1.5">
            <label htmlFor="filterDistance" className="text-sm font-bold">Distance</label>
            <output className="font-mono text-xs font-bold bg-tea/25 border border-pen/60 rounded px-1.5">{distanceSteps[distanceIndex]} km</output>
          </div>
          <input
            id="filterDistance" type="range" min="0" max={distanceSteps.length - 1} step="1"
            value={distanceIndex} onChange={e => setDistanceIndex(Number(e.target.value))}
            className="w-full accent-tea"
          />
        </div>

        <div className="pt-3 border-t border-dashed border-pen/20">
          <div className="flex items-baseline justify-between mb-1.5">
            <label htmlFor="filterPopularity" className="text-sm font-bold">Popularité min.</label>
            <output className="font-mono text-xs font-bold bg-tea/25 border border-pen/60 rounded px-1.5">{popularity}</output>
          </div>
          <input
            id="filterPopularity" type="range" min="0" max="100" step="1"
            value={popularity} onChange={e => setPopularity(Number(e.target.value))}
            className="w-full accent-tea"
          />
        </div>

        {availableTags.length > 0 && (
          <div className="pt-3 border-t border-dashed border-pen/20">
            <span className="block text-sm font-bold mb-1.5">Tags</span>
            <div className="flex flex-wrap gap-1.5 max-h-[132px] overflow-y-auto pr-1">
              {availableTags.map(tag => {
                const on = tags.includes(tag);
                return (
                  <button
                    key={tag} type="button" onClick={() => toggleTag(tag)} aria-pressed={on}
                    className={`text-xs font-bold px-2.5 py-1 border border-pen/60 rounded-full transition-transform hover:-translate-y-0.5 ${on ? 'bg-tea' : 'bg-matcha'}`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={handleApply}
          className="mt-1 inline-flex items-center justify-center gap-2 px-5 py-2 border border-pen/60 rounded-xl bg-pink font-bold text-sm shadow-[2px_2px_0_rgba(89,67,71,0.28)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
        >
          Appliquer
        </button>
      </div>
    </section>
  );
}

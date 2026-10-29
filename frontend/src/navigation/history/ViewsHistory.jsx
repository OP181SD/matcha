import { useEffect, useState } from 'react';
import { Navbar } from '../../component/profil/Navbar.jsx';
import api from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';
import { getTimeAgo, getConnectionStatus } from '../../utils/time.js';

export function ViewsHistory() {
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const { data } = await api.get('/api/views');

        const sorted = data.sort((a, b) => new Date(b.viewed_at) - new Date(a.viewed_at));
        setViews(sorted);
      } catch (err) {
        setError("Erreur lors du chargement des vues.");
      } finally {
        setLoading(false);
      }
    };

    fetchViews();
  }, []);

  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-pen mb-6">Profils qui vous ont visité</h1>

        {loading ? (
          <p className="text-pen/50">Chargement...</p>
        ) : error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : views.length === 0 ? (
          <p className="text-pen/50">Personne n'a encore visité votre profil.</p>
        ) : (
          <ul className="w-full max-w-3xl grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {views.map((view, index) => {
              const profilePic = view.pictures?.find(p => p.is_profile_picture);
              const photoUrl = profilePic?.url || 'https://placehold.co/100x100?text=Photo';
              const connectionStatus = getConnectionStatus(view);

              return (
                <li
                  key={index}
                  onClick={() => navigate(`/profile/${view.id}`)}
                  className="matcha-card !p-4 flex items-center space-x-4 hover:bg-tea/15 cursor-pointer transition"
                >
                  <img
                    src={photoUrl}
                    alt={`${view.first_name} ${view.last_name}`}
                    className="w-16 h-16 rounded-full object-cover border border-pen/60"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="text-pen font-semibold text-base">
                      {view.first_name} {view.last_name}
                    </span>
                    <span className="text-sm font-bold text-pen/50">
                      {view.city || 'Ville inconnue'}
                    </span>
                    <span className={`text-xs ${connectionStatus.style} mt-1`}>
                      {connectionStatus.text}
                    </span>
                    <span className="text-xs text-pen/40 mt-1">
                      A visité {getTimeAgo(view.viewed_at)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}

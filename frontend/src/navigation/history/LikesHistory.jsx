import { useEffect, useState } from 'react';
import { Navbar } from '../../component/profil/Navbar.jsx';
import api from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';
import { getTimeAgo, getConnectionStatus } from '../../utils/time.js';

const DEFAULT_PICTURE = "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F375.svg";

export function LikesHistory() {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { data } = await api.get('/api/likes');
        setLikes(data);
      } catch (err) {
        setError("Erreur lors du chargement des likes.");
      } finally {
        setLoading(false);
      }
    };
    fetchLikes();
  }, []);

  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-pen mb-6">Profils qui vous ont liké</h1>

        {loading ? (
          <p className="text-pen/50">Chargement...</p>
        ) : error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : likes.length === 0 ? (
          <p className="text-pen/50">Personne ne vous a encore liké.</p>
        ) : (
          <ul className="w-full max-w-3xl grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {likes.map((liker) => {
              const connectionStatus = getConnectionStatus(liker);
              return (
                <li
                  key={liker.id}
                  onClick={() => navigate(`/profile/${liker.id}`)}
                  className="matcha-card !p-4 flex items-center space-x-4 hover:bg-pink/15 cursor-pointer transition"
                >
                  <img
                    src={liker.profile_picture || DEFAULT_PICTURE}
                    alt={`${liker.first_name} ${liker.last_name}`}
                    className="w-16 h-16 rounded-full object-cover border border-pen/60"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="text-pen font-semibold text-base">
                      {liker.first_name} {liker.last_name}
                    </span>
                    <span className="text-sm font-bold text-pen/50">
                      {liker.city || 'Ville inconnue'}
                    </span>
                    <span className={`text-xs ${connectionStatus.style} mt-1`}>
                      {connectionStatus.text}
                    </span>
                    <span className="text-xs text-pen/40 mt-1">
                      A liké {getTimeAgo(liker.liked_at)}
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

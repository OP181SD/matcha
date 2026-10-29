import { useEffect, useState } from 'react';
import { Navbar } from '../../component/profil/Navbar.jsx';
import api from '../../utils/api.js';

const DEFAULT_PICTURE = "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F375.svg";

export function BlocPage() {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBlockedUsers = async () => {
    try {
      const { data } = await api.get('/api/blocked-users');
      setBlockedUsers(data);
    } catch (err) {
      setError("Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (unblockedId) => {
    try {
      await api.post('/api/unblock-user', { unblockedId });
      setBlockedUsers(prev => prev.filter(u => u.id !== unblockedId));
    } catch (err) {
      setError("Erreur lors du déblocage.");
    }
  };

  useEffect(() => { loadBlockedUsers(); }, []);

  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-pen mb-6">Utilisateurs bloqués</h1>

        {loading ? (
          <p className="text-pen/50">Chargement...</p>
        ) : error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : blockedUsers.length === 0 ? (
          <p className="text-pen/50">Vous n'avez bloqué aucun utilisateur.</p>
        ) : (
          <ul className="w-full max-w-2xl flex flex-col gap-3">
            {blockedUsers.map(user => (
              <li
                key={user.id}
                className="matcha-card !p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.profile_picture || DEFAULT_PICTURE}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-14 h-14 rounded-full object-cover border border-pen/60"
                  />
                  <div className="flex flex-col">
                    <span className="text-pen font-semibold">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="text-sm text-pen/50">@{user.username}</span>
                    <span className="text-sm text-pen/40">{user.city || 'Ville inconnue'}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleUnblock(user.id)}
                  className="matcha-btn matcha-btn-tea"
                >
                  Débloquer
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api.js';
import { useSocket } from '../../socket/Socket.jsx';
import { NotificationBell } from '../notifications/NotificationBell.jsx';
import { useNotifications } from '../../contexts/NotificationContext.jsx';
import { btnBase } from '../shared/ui.js';

const DEFAULT_PICTURE = "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F375.svg";

const ICO =
  'relative w-[42px] h-[42px] grid place-items-center border border-pen/60 rounded-[11px] ' +
  'transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_rgba(89,67,71,0.28)]';
const ICO_BADGE =
  'absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-pink text-pen border border-pen/60 ' +
  'rounded-full text-[11px] font-extrabold grid place-items-center leading-none';

export function Navbar() {
  const [error, setError] = useState(null);
  const { disconnectSocket } = useSocket();
  const { unreadMessagesCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(() =>
    localStorage.getItem("navbar_pp") || DEFAULT_PICTURE
  );
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    document.body.classList.add('has-bottomnav');
    return () => document.body.classList.remove('has-bottomnav');
  }, []);

  useEffect(() => {
    const handleStorageLogout = (e) => {
      if (e.key === 'logout-event') {
        disconnectSocket();
        navigate('/login');
      }
    };

    window.addEventListener('storage', handleStorageLogout);
    return () => window.removeEventListener('storage', handleStorageLogout);
  }, [disconnectSocket, navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');

      localStorage.setItem('logout-event', Date.now());

      localStorage.removeItem('navbar_pp');

      setTimeout(() => {
        localStorage.removeItem('logout-event');
      }, 1000);

      disconnectSocket();
      navigate('/login');
    } catch (err) {
      setError("Erreur lors de la déconnexion");
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const authFetchProfilePicture = async () => {
    try {
      const { data: meData } = await api.get('/api/me');
      const userId = meData.user.id;

      const { data: pics } = await api.get(`/api/pictures/${userId}`);
      const profile = pics.find(p => p.is_profile_picture)?.url || DEFAULT_PICTURE;

      setProfilePic(profile);
      localStorage.setItem("navbar_pp", profile);
    } catch (err) {
    }
  };

  useEffect(() => {
    authFetchProfilePicture();
    window.addEventListener("profilePictureChanged", authFetchProfilePicture);
    return () => window.removeEventListener("profilePictureChanged", authFetchProfilePicture);
  }, []);

  return (
    <>
    <header className="hidden lg:block sticky top-0 z-50 bg-matcha/90 backdrop-blur-md border-b border-pen/60">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-8 h-[74px] flex items-center gap-4">
        <Link to="/meet-page" className="text-[23px] font-extrabold tracking-tight text-pen">
          matcha {" "}<span className="font-quicksand text-pink">抹</span><span className="font-quicksand text-tea">茶</span>
        </Link>

        <nav className="flex items-center gap-2 ml-auto">
          <Link to="/meet-page" title="Découvrir" aria-label="Découvrir" className={`${ICO} ${isActive('/meet-page') ? 'bg-tea' : 'bg-matcha hover:bg-pink/20'}`}>
            <i className="fas fa-compass text-pen text-lg" />
          </Link>
          <Link to="/search" title="Recherche avancée" aria-label="Recherche" className={`${ICO} ${isActive('/search') ? 'bg-tea' : 'bg-matcha hover:bg-pink/20'}`}>
            <i className="fas fa-search text-pen text-lg" />
          </Link>
          <Link to="/view-history" title="Qui a vu mon profil" aria-label="Visites" className={`${ICO} ${isActive('/view-history') ? 'bg-tea' : 'bg-matcha hover:bg-pink/20'}`}>
            <i className="fas fa-eye text-pen text-lg" />
          </Link>
          <Link to="/like-history" title="Likes reçus" aria-label="Likes" className={`${ICO} ${isActive('/like-history') ? 'bg-tea' : 'bg-matcha hover:bg-pink/20'}`}>
            <i className="fas fa-heart text-pen text-lg" />
          </Link>

          <NotificationBell />

          <Link to="/message-page" title="Messages" aria-label="Messages" className={`${ICO} ${isActive('/message-page') ? 'bg-tea' : 'bg-matcha hover:bg-pink/20'}`}>
            <i className="fas fa-paper-plane text-pen text-lg" />
            {unreadMessagesCount > 0 && (
              <span className={ICO_BADGE}>{unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}</span>
            )}
          </Link>

          <span className="hidden md:block w-0.5 h-6 bg-[#E4DCD0] mx-1.5" />

          <Link to="/profil" title="Mon profil" className="hidden sm:block w-11 h-11 flex-none border border-pen/60 rounded-xl overflow-hidden">
            <img src={profilePic} alt="Profil" className="w-full h-full object-cover" />
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/settings" className={`${btnBase} bg-tea text-pen px-3.5 py-2 text-sm`}>Paramètres</Link>
            <button onClick={handleLogout} className={`${btnBase} bg-matcha text-pen px-3.5 py-2 text-sm`}>Se déconnecter</button>
          </div>

          <button onClick={toggleMenu} className="md:hidden text-pen focus:outline-none ml-1" aria-label="Menu">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>

      {error && (
        <div className="text-red-500 py-2 text-center text-sm">{error}</div>
      )}
    </header>

    {}
    {menuOpen && (
      <>
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
        <div className="lg:hidden fixed bottom-[70px] inset-x-3 z-40 p-2 bg-matcha border border-pen/60 rounded-2xl shadow-[3px_3px_0_rgba(89,67,71,0.28)] grid gap-2">
          <Link to="/profil" onClick={() => setMenuOpen(false)} className={`${btnBase} w-full bg-matcha text-pen px-4 py-2 text-sm`}>Mon profil</Link>
          <Link to="/search" onClick={() => setMenuOpen(false)} className={`${btnBase} w-full bg-matcha text-pen px-4 py-2 text-sm`}>Recherche</Link>
          <Link to="/notifications" onClick={() => setMenuOpen(false)} className={`${btnBase} w-full bg-matcha text-pen px-4 py-2 text-sm`}>Notifications</Link>
          <Link to="/settings" onClick={() => setMenuOpen(false)} className={`${btnBase} w-full bg-tea text-pen px-4 py-2 text-sm`}>Paramètres</Link>
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} className={`${btnBase} w-full bg-pink text-pen px-4 py-2 text-sm`}>Se déconnecter</button>
        </div>
      </>
    )}

    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-[64px] bg-matcha/95 backdrop-blur-md border-t border-pen/60 flex items-stretch">
      <BottomTab to="/meet-page" icon="fa-compass" label="Découvrir" active={isActive('/meet-page')} />
      <BottomTab to="/view-history" icon="fa-eye" label="Vues" active={isActive('/view-history')} />
      <BottomTab to="/like-history" icon="fa-heart" label="Likes" active={isActive('/like-history')} />
      <BottomTab to="/message-page" icon="fa-paper-plane" label="Messages" active={isActive('/message-page')} badge={unreadMessagesCount} />
      <button onClick={toggleMenu} aria-label="Menu" className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${menuOpen ? 'text-tea' : 'text-pen'}`}>
        <img src={profilePic} alt="Profil" className="w-7 h-7 rounded-full object-cover border border-pen/60" />
        <span className="text-[10px] font-bold leading-none">Menu</span>
      </button>
    </nav>
    </>
  );
}

function BottomTab({ to, icon, label, active, badge }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 ${active ? 'text-tea' : 'text-pen'}`}
    >
      <i className={`fas ${icon} text-xl`} />
      <span className="text-[10px] font-bold leading-none">{label}</span>
      {badge > 0 && (
        <span className="absolute top-1.5 right-[24%] min-w-[16px] h-4 px-1 bg-pink text-pen border border-pen/60 rounded-full text-[10px] font-extrabold grid place-items-center leading-none">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}
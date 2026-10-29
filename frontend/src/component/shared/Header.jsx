import { Link } from 'react-router-dom';
import { btnBase } from './ui.js';

export function Header({ title, kanji }) {
  return (
    <header className="sticky top-0 z-50 bg-matcha/90 backdrop-blur-md border-b border-pen/15">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-6">
        <Link
          to="/"
          className="font-quicksand font-extrabold text-2xl sm:text-[26px] text-pen tracking-tight whitespace-nowrap"
        >
          {title ? (
            <>
              {title}
              {kanji && (
                <span className="font-semibold ml-2">
                  {[...kanji].map((c, i) => (
                    <span key={i} className={i % 2 === 0 ? 'text-pink' : 'text-tea'}>{c}</span>
                  ))}
                </span>
              )}
            </>
          ) : (
            <>matcha<span className="text-pink ml-2">抹</span><span className="text-tea">茶</span></>
          )}
        </Link>

        <div className="flex items-center gap-5 sm:gap-7">
          <Link to="/login" className={`${btnBase} hidden sm:inline-flex bg-pink text-pen px-4 py-2 text-sm font-extrabold`}>
            Connexion
          </Link>
          <Link to="/signup" className={`${btnBase} bg-tea text-pen px-4 py-2 text-sm font-extrabold`}>
            Inscription
          </Link>
        </div>
      </div>
    </header>
  );
}

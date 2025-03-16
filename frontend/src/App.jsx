import React from 'react';
import matchaImage from './assets/matcha.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function App() {
  return (
    <div className="bg-matcha text-cream flex flex-col justify-center items-center min-h-screen font-nunito pb-32 relative">
      <img 
        src={matchaImage} 
        alt="Tasse de matcha" 
        className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] h-auto mb-4 drop-shadow-md"
      />
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold drop-shadow-md">matcha</h1>
      <p className="text-lg sm:text-xl md:text-2xl mt-2 font-bold text-white italic px-4 py-2 flex items-center gap-2">
        L’amour autour d’une tasse de thé.
        <FontAwesomeIcon icon={faHeart} className="text-2xl drop-shadow-md" />
      </p>
      <div className="px-4 py-2 flex gap-3">
        <button className="bg-matcha-light text-matcha-dark rounded-lg font-bold py-2 px-8 w-full drop-shadow-md hover:scale-105 transition-transform">
          Inscription 
        </button>
        <button className="bg-matcha-light text-matcha-dark rounded-lg font-bold py-2 px-8 w-full drop-shadow-md hover:scale-105 transition-transform">
          Connexion
        </button>
      </div>

      <footer className="absolute bottom-0 font-nunito py-4 font-bold text-xs sm:text-sm md:text-base lg:text-lg text-center w-full text-cream/90">
        © 2025 Matcha. Tous droits réservés par ي et ن.
      </footer>
    </div>
  );
}

export default App;

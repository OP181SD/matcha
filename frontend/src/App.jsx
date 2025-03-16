import React from 'react';
import matchaImage from './assets/matcha.png';

function App() {
  return (
    <div className="bg-matcha text-cream flex flex-col justify-center items-center min-h-screen font-nunito pb-32 relative">
      <img 
        src={matchaImage} 
        alt="Tasse de matcha" 
        className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] h-auto mb-4"
      />
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold">matcha</h1>
      <p className="text-lg sm:text-xl md:text-2xl mt-2 font-bold opacity-80 text-cream italic px-4 py-2">
        L’amour autour d’une tasse de matcha.
      </p>
      <div className="px-4 py-2 flex gap-2">
        <button className="bg-matcha-light text-matcha-dark rounded-lg font-bold py-2 px-8 w-full">
          Inscription 
        </button>
        <button className="bg-matcha-light text-matcha-dark rounded-lg font-bold py-2 px-8 w-full">
          Connexion
        </button>
      </div>

      <footer className="absolute bottom-0 w-full text-center py-4 border-t border-cream/50 text-sm opacity-80">
        © 2025 Matcha. Tous droits réservés par ي et ن.
      </footer>
    </div>
  );
}

export default App;

import React from 'react';
import matchaImage from './assets/matcha.png';

function App() {
  return (
    <div className="bg-matcha text-cream flex flex-col justify-center items-center min-h-screen font-nunito pb-32">
      <img 
        src={matchaImage} 
        alt="Tasse de matcha" 
        className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] h-auto mb-4"
      />
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold">matcha</h1>
      <p className="text-lg sm:text-xl md:text-2xl mt-2 opacity-80 italic">
        L’amour autour d’une tasse de matcha.
      </p>
      <button className="bg-matcha-light text-matcha-dark rounded-lg font-bold py-2 px-6">
      Sig in
    </button>
    </div>
  );
}

export default App;

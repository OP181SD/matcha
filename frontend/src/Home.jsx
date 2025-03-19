import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/matcha.png';
import { Signup } from './Signup';

export function Home() {
    return (
        <>
            {/* Section principale */}
            <div className="matcha-logo">
                <img 
                    src={logo} 
                    alt="Matcha Logo" 
                    className="w-36 sm:w-48 md:w-64 lg:w-72 h-auto mr-32" 
                />
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream ml-32">
                    matcha
                </h1>
                
                {/* Description de la page */}
                <div className="description">
                    <p className="typo-slogan text-lg sm:text-xl md:text-2xl">
                        <span className="text-pink">L'amour</span> autour d'une tasse de 
                        <span className="text-tea"> thé</span>.
                    </p>
                </div>
            </div>

            {/* Connexion et Button d'inscription (Section en dehors du parent principal) */}
            <div className="flex px-4 py-2 justify-center items-center mt-4 gap-2 flex-wrap">
    <Link to={"/signup"}>
        <button className='bg-pink w-full sm:w-64 h-12 rounded-full px-6 py-2 font-bold text-white'>
            Inscription
        </button>
    </Link>
    <Link to={"/login"}>
        <button className='bg-tea w-full sm:w-64 h-12 rounded-full px-6 py-2 font-bold text-white'>
            Connexion
        </button>
    </Link>
</div>


            <footer className="bottom-0 px-4 py-2 absolute w-full text-center">
            <p className='text-sm sm:text-lg md:text-xl font-nunito text-white font-bold'>
    &copy; 2025 matcha. Tous droits réservés par 
    <span className="font-amiri text-purple-100"> ي et ن</span>
</p>
            </footer>
        </>
    );
}

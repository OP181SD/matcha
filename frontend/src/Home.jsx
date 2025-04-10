import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='mobile-text mb-[15%] mr-[5%] flex flex-col'>
                <h1 className='title-matcha'>
                    Matcha <span className="text-[#A6BF80] text-outline-mat px-4 py-2">抹</span>
                </h1>
                <div className='flex gap-4 rounded-full items-center'>
                    <h1 className='title-japanese text-outline-cha'>
                        茶
                    </h1>
                    <button className='btn-style btn-inscription'>
                        <Link to="/signup">
                            Inscription
                        </Link>
                    </button>
                    <button className='btn-style btn-connexion'>
                        <Link to="/login">
                        Connexion
                        </Link>
                    </button>
                </div>
                <footer className='footer-style'>
                    Tout droit réservé par ي et ن
                </footer>
            </div>
        </div>
    );
}

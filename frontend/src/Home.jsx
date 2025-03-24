import React from 'react';



export function Home() {
    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='mobile-text mb-[15%] mr-[5%] flex flex-col'>
                {/* Utiliser une classe spéciale pour le contour du texte */}
                <h1 className='text-8xl font-black text-pen'>
                    Matcha <span className="text-[#A6BF80] text-outline-mat px-4 py-2">抹</span>
                </h1>
                <div className='flex gap-4 rounded-full items-center'>
                    <h1 className='text-8xl text-outline-cha  font-semibold font-quicksand text-[#F2C9D4] px-4 py-2'>
                        茶
                    </h1>
                    <button className='bg-[#F2C9D4] border-[2px] text-pen font-bold font-quicksand border-[#594347] text-[16px] sm:text-[18px] md:text-[20px] px-4 py-2 sm:px-6 sm:py-3 rounded-md'>
                        Inscription
                    </button>
                    <button className='bg-[#A6BF80] border-[2px] text-pen font-bold font-quicksand border-[#594347] text-[16px] sm:text-[18px] md:text-xl px-4 py-2 sm:px-6 sm:py-3 rounded-md'>
                        Connexion
                    </button>

                </div>
                <footer className='absolute bottom-0 left-1/2 text-pen font-bold transform text-[16px] sm:text-[18px] md:text-[20px] -translate-x-1/2 border-t-[2px] border-[#594347] px-4 py-2 whitespace-nowrap flex justify-center items-center'>
                    Tout droit réservé par ي et ن
                </footer>
            </div>
        </div>
    );
}

import React from 'react';



export function Home() {
    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='mobile-text mb-[15%] mr-[5%] flex flex-col'>
                {/* Utiliser une classe spéciale pour le contour du texte */}
                <h1 className='text-8xl font-bold font-quicksand text-pen px-4 py-2 text-outline'>
                    Matcha <span className="text-[#A6BF80] text-outline">抹</span>
                </h1>
                <div className='flex gap-4 rounded-full items-center'>
                    <h1 className='text-8xl  font-semibold font-quicksand text-[#F2C9D4] 
                                   px-4 py-'>
                        茶
                    </h1>
                    <button className='bg-[#F2C9D4] border-[2px] text-pen font-semibold font-quicksand border-[#594347] text-xl px-4 py-2 rounded-md'>
                        Inscription
                    </button>
                    <button className='bg-[#A6BF80] border-[2px] text-pen font-semibold font-quicksand border-[#594347] text-xl px-4 py-2 rounded-md'>
                        Connexion
                    </button>
                </div>
            </div>
        </div>
    );
}

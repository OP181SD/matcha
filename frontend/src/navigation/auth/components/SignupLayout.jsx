import { Link } from 'react-router-dom';

import { Header } from '../../../component/shared/Header.jsx';

export function SignupLayout({ children }) {
  return (
    <div className="min-h-screen bg-matcha text-pen flex flex-col">

      <Header title="inscription" kanji="碑文" />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-6 sm:py-20 grid lg:grid-cols-[1.06fr_.94fr] gap-6 lg:gap-16 items-center">

          <div className="flex flex-col items-start gap-6 order-last lg:order-none">

            {}

            <h1 className="font-quicksand font-extrabold text-3xl sm:text-4xl leading-tight max-w-[14ch]">
              Fais le premier pas vers une{' '}
              <mark className="bg-tea text-pen rounded px-1">
                vraie rencontre
              </mark>.
            </h1>

            <p className="text-pen/70 text-base sm:text-lg leading-relaxed max-w-[52ch]">
              Crée ton profil, partage ce qui te passionne et découvre des
              personnes qui pourraient te correspondre.
            </p>

            <p className="text-sm text-pen/60 max-w-[52ch]">
              Déjà inscrit ?{' '}
              <Link
                to="/login"
                className="font-bold underline text-tea"
              >
                Connecte-toi
              </Link>
              .
            </p>

          </div>

          <div className="relative grid place-items-center lg:min-h-[400px] order-first lg:order-none">

            <div className="hidden lg:block absolute z-0 w-[460px] h-[440px] bg-matcha border border-pen/60 rounded-[20px] shadow-[3px_3px_0_rgba(89,67,71,0.28)] opacity-40 rotate-5 translate-x-5 translate-y-2" />

            {children}
          </div>

        </section>
      </main>

    </div>
  );
}

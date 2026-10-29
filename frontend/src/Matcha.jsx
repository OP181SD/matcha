import { Header } from './component/shared/Header.jsx';

const btn =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-pen/60 ' +
  'font-quicksand font-extrabold transition-all shadow-[2px_2px_0_rgba(89,67,71,0.28)] ' +
  'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_rgba(89,67,71,0.28)] ' +
  'active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_rgba(89,67,71,0.28)]';

function MatchaLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 680 118" className={className} role="img" aria-label="Matcha 抹茶">
      <text x="0" y="90" textAnchor="start" fontFamily="Quicksand, sans-serif" fontWeight="800" fontSize="96">
        <tspan fill="#594347">Matcha</tspan>
        <tspan dx="22" fill="#F2C9D4">抹</tspan>
        <tspan fill="#A6BF80">茶</tspan>
      </text>
    </svg>
  );
}

function Pulse({ size = 'h-2 w-2' }) {
  return (
    <span className={`relative flex ${size} flex-none`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tea opacity-75" />
      <span className={`relative inline-flex rounded-full ${size} bg-tea`} />
    </span>
  );
}

export function Matcha() {
  return (
    <div className="min-h-screen flex flex-col bg-matcha text-pen">
      <Header />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-20 grid lg:grid-cols-[1.06fr_.94fr] gap-10 lg:gap-16 items-center">
          {}
          <div className="flex flex-col items-start gap-6">
            {}

            <MatchaLogo className="w-full max-w-[300px] sm:max-w-[400px] h-auto" />

            <h1 className="font-quicksand font-extrabold text-3xl sm:text-4xl leading-tight max-w-[14ch]">
              De l&apos;inscription à la{' '}
              <mark className="bg-tea text-pen rounded px-1">vraie rencontre</mark>.
            </h1>

            <p className="text-pen/70 text-base sm:text-lg leading-relaxed max-w-[52ch]">
              Remplis ton profil, cherche les profils autour de toi, like ceux qui te
              plaisent. Quand le like est réciproque, c&apos;est un match — et le chat
              s&apos;ouvre en temps réel.
            </p>

            </div>

          {}
          <div className="relative grid place-items-center min-h-0 lg:min-h-[400px]">
            <div className="hidden lg:block absolute z-0 w-[290px] bg-matcha border border-pen/60 rounded-[20px] p-3.5 shadow-[3px_3px_0_rgba(89,67,71,0.28)] opacity-55 -rotate-6 -translate-x-7 translate-y-2.5">
              <div className="aspect-square rounded-xl border border-pen/60 mb-3 grid place-items-center overflow-hidden bg-gradient-to-br from-pink to-tea">
                <span className="text-[74px] font-semibold text-pen/30">茶</span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <b className="text-lg font-extrabold">Camille, 26</b>
                <i className="not-italic text-sm text-pen/60">4,1 km</i>
              </div>
            </div>

            <div className="hidden lg:block absolute z-0 w-[290px] bg-matcha border border-pen/60 rounded-[20px] p-3.5 shadow-[3px_3px_0_rgba(89,67,71,0.28)] opacity-40 rotate-[5deg] translate-x-6 translate-y-1">
              <div className="aspect-square rounded-xl border border-pen/60 mb-3 grid place-items-center overflow-hidden bg-gradient-to-br from-pink to-tea">
                <span className="text-[74px] font-semibold text-pen/30">抹</span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <b className="text-lg font-extrabold">Sacha, 23</b>
                <i className="not-italic text-sm text-pen/60">1,8 km</i>
              </div>
            </div>

            <article className="relative z-10 w-full max-w-[290px] bg-matcha border border-pen/60 rounded-[20px] p-3.5 shadow-[3px_3px_0_rgba(89,67,71,0.28)] -rotate-1">
              <div className="relative aspect-square rounded-xl border border-pen/60 mb-3 grid place-items-center overflow-hidden bg-gradient-to-br from-pink to-tea">
                <span className="text-[74px] font-semibold text-pen/30">抹</span>
                <span className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-matcha border border-pen/60 rounded-full px-2 py-0.5 text-[11px] font-extrabold">
                  <Pulse size="h-1.5 w-1.5" /> En ligne
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <b className="text-lg font-extrabold">Léa, 24</b>
                <i className="not-italic text-sm text-pen/60">2,4 km · Paris</i>
              </div>
              <div className="flex flex-wrap gap-1.5 my-3">
                {['#escalade', '#vegan', '#jazz', '#geek'].map((t, i) => (
                  <span
                    key={t}
                    className={`text-xs font-bold px-2.5 py-1 border border-pen/60 rounded-full ${i % 2 ? 'bg-pink/25' : 'bg-tea/25'}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className={`${btn} bg-matcha text-pen py-2.5 text-sm shadow-[2px_2px_0_rgba(89,67,71,0.28)]`}>Passer</button>
                <button className={`${btn} bg-pink text-pen py-2.5 text-sm shadow-[2px_2px_0_rgba(89,67,71,0.28)]`}>Liker</button>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

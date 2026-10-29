export function Footer() {
  return (
    <footer className="border-t border-pen/10 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">

          {}
          <div className="flex items-center gap-2">

            <span className="text-[11px] tracking-[0.08em] text-pen/30">
              {new Date().getFullYear()}
            </span>

            {}
            <div className="flex items-center text-[11px] font-extrabold leading-none">
              <span className="text-pink mr-1">抹</span>
              <span className="text-tea">茶</span>
            </div>

          </div>

          {}
          <div className="flex items-center gap-3">

            {}
            <div className="hidden sm:block text-right leading-none">
              <span className="text-xs font-bold text-pen/60">
                <span className="text-pink">ヤシン</span>{' '}
                <span className="text-pen/60 mx-0.5">&amp;</span>{' '}
                <span className="text-tea">ナシム</span>{' '}
              </span>
            </div>

            {}
            <div className="hidden md:block pl-3 border-l border-pen/10">
              <div className="text-xs font-semibold tracking-[0.12em] text-pen/50">
                一期一会
              </div>

              <div className="mt-0.5 text-[9px] text-pen/30">
                chaque rencontre est unique
              </div>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
    >
      <div className="flex flex-col gap-6 md:gap-8 items-center lg:items-start text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight">
          Ваш шлях до <br className="hidden lg:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">
            бездоганних нігтів
          </span>
        </h1>

        <p className="text-base md:text-lg font-medium text-slate-600 max-w-lg">
          Забронюйте свій ідеальний візит онлайн за лічені хвилини. Отримуйте
          ексклюзивні пропозиції, керуйте бронюваннями та знаходьте улюблених
          майстрів.
        </p>
      </div>

      <div className="w-full relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl glass-panel group bg-pink-50 flex items-center justify-center text-pink-300">
        <img
          src="/hero-img.png"
          alt="Манікюр"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">Топ майстри</p>
            <p className="text-xs text-slate-600">Гарантія якості</p>
          </div>
        </div>
      </div>
    </section>
  );
}

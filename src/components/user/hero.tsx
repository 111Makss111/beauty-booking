import Link from "next/link";
import Form from "./form";

export default function Hero() {
  return (
    <section
      id="home"
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch"
    >
      <div className="glass-card p-6 md:p-10 flex flex-col justify-center">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 leading-tight mb-6 md:mb-8 text-center md:text-left">
          Beauty Nails: Ваш шлях до бездоганних нігтів.
        </h1>

        <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center">
          <div className="w-full sm:w-1/2 aspect-[4/5] relative rounded-2xl overflow-hidden shadow-md bg-pink-100 flex items-center justify-center text-pink-400">
            <span className="font-medium">Фото манікюру</span>
          </div>

          <div className="w-full sm:w-1/2 flex flex-col gap-4 md:gap-6 items-center md:items-start text-center md:text-left">
            <p className="text-base md:text-lg font-medium text-slate-700">
              Забронюйте свій ідеальний візит онлайн за лічені хвилини.
            </p>
            <div className="bg-white/60 p-4 rounded-xl text-sm text-slate-600 shadow-sm border border-white/60 backdrop-blur-sm">
              Отримуйте ексклюзивні пропозиції, керуйте бронюваннями та
              знаходьте улюблених майстрів.
            </div>
            <Link
              href="#services"
              className="btn-secondary text-center w-full md:w-max"
            >
              Почати бронювання
            </Link>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 md:p-10 flex flex-col justify-center">
        <h2 className="text-xl md:text-2xl font-bold text-center text-slate-800 mb-2">
          Новий користувач? Зареєструйтесь.
        </h2>
        <p className="text-center text-slate-500 mb-6 md:mb-8 text-xs md:text-sm">
          Щоб отримати повний доступ до кабінету, будь ласка, зареєструйтесь.
        </p>

        <Form />
      </div>
    </section>
  );
}

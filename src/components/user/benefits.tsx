export default function Benefits() {
  return (
    <section
      id="benefits"
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12"
    >
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 text-center md:text-left">
        Переваги для зареєстрованих користувачів
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="glass-panel p-5 md:p-6 flex flex-col gap-3 md:gap-4 hover:-translate-y-1 transition-transform duration-300 items-center md:items-start text-center md:text-left">
          <div className="w-12 h-12 bg-pink-100/80 rounded-2xl flex items-center justify-center text-pink-500 shadow-sm border border-pink-200">
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
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="m9 16 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-1 md:mb-2">
              Легке перенесення візитів
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Керуйте своїми записами в особистому кабінеті: скасовуйте або
              змінюйте час візиту в один клік без зайвих дзвінків
              адміністратору.
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 md:p-6 flex flex-col gap-3 md:gap-4 hover:-translate-y-1 transition-transform duration-300 items-center md:items-start text-center md:text-left">
          <div className="w-12 h-12 bg-pink-100/80 rounded-2xl flex items-center justify-center text-pink-500 shadow-sm border border-pink-200">
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
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect width="20" height="5" x="2" y="7" rx="1" ry="1" />
              <line x1="12" x2="12" y1="22" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-1 md:mb-2">
              Персональні знижки
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Отримуйте унікальні пропозиції, приємні бонуси до дня народження
              та беріть участь у нашій накопичувальній програмі лояльності.
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 md:p-6 flex flex-col gap-3 md:gap-4 hover:-translate-y-1 transition-transform duration-300 items-center md:items-start text-center md:text-left">
          <div className="w-12 h-12 bg-pink-100/80 rounded-2xl flex items-center justify-center text-pink-500 shadow-sm border border-pink-200">
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
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M6 14v-2a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M18 11a8 8 0 1 1-16 0" />
              <path d="M10 16a2 2 0 0 0 2 2v0a2 2 0 0 0 2-2" />
            </svg>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-1 md:mb-2">
              Ексклюзивні СПА-процедури
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Першими дізнавайтеся про нові послуги нашого салону та отримуйте
              пріоритетний доступ до закритих VIP-процедур.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

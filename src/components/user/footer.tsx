import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-6 md:py-8 px-4 md:px-8 border-t border-white/40 bg-white/30 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="text-lg md:text-xl font-bold text-slate-800 italic">
          Beauty Nails
        </div>

        <nav className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium text-slate-600">
          <Link
            href="#services"
            className="hover:text-pink-500 transition-colors"
          >
            Послуги
          </Link>
          <Link
            href="#gallery"
            className="hover:text-pink-500 transition-colors"
          >
            Галерея
          </Link>
          <Link href="#about" className="hover:text-pink-500 transition-colors">
            Про нас
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 text-slate-600">
          <button className="hover:text-pink-500 transition-colors p-2 bg-white/50 rounded-full shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
          <button className="hover:text-pink-500 transition-colors p-2 bg-white/50 rounded-full shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button className="hover:text-pink-500 transition-colors p-2 bg-white/50 rounded-full shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 md:py-6 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between relative z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-pink-100 p-2 rounded-lg">
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
            className="text-pink-500"
          >
            <path d="M8 2h8v4H8z" />
            <path d="M9 6v4c0 1.1-.9 2-2 2H6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2h-1c-1.1 0-2-.9-2-2V6" />
          </svg>
        </div>
        <span className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
          Beauty Nails
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link
          href="#services"
          className="text-slate-600 hover:text-pink-500 transition-colors font-medium"
        >
          Послуги
        </Link>
        <Link
          href="#gallery"
          className="text-slate-600 hover:text-pink-500 transition-colors font-medium"
        >
          Галерея
        </Link>
        <Link
          href="#about"
          className="text-slate-600 hover:text-pink-500 transition-colors font-medium"
        >
          Про нас
        </Link>
      </nav>

      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-full bg-white/60 border border-white/80 shadow-sm text-slate-700 font-medium hover:bg-white hover:shadow-md transition-all backdrop-blur-sm"
        >
          Log In
        </Link>
        <button className="p-3 rounded-full bg-white/60 border border-white/80 shadow-sm text-slate-700 hover:bg-white hover:shadow-md transition-all backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>

      <button
        className="md:hidden p-2 text-slate-700"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full glass-panel border-t-0 rounded-t-none flex flex-col items-center py-6 gap-4 md:hidden shadow-xl">
          <Link
            href="#services"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg font-medium text-slate-700"
          >
            Послуги
          </Link>
          <Link
            href="#gallery"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg font-medium text-slate-700"
          >
            Галерея
          </Link>
          <Link
            href="#about"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg font-medium text-slate-700"
          >
            Про нас
          </Link>
          <hr className="w-1/2 border-pink-100 my-2" />
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="btn-secondary w-2/3 text-center"
          >
            Log In
          </Link>
        </div>
      )}
    </header>
  );
}

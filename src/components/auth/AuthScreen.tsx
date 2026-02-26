import { signIn } from "next-auth/react";

export default function AuthScreen() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFF0F3] p-4">
      <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl p-10 rounded-[45px] shadow-xl border border-white/40 flex flex-col items-center min-h-[550px]">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-slate-500 font-medium mb-1 uppercase tracking-widest text-xs">
            Ласкаво просимо до
          </p>
          <h1 className="text-5xl font-serif italic text-[#D85C7B] mb-4">
            Beauty Nails
          </h1>
          <div className="w-16 h-1 bg-[#D85C7B]/20 rounded-full"></div>
        </div>
        <div className="w-full space-y-4">
          <button
            onClick={() => signIn("google")}
            className="w-full bg-[#D85C7B] text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-[#c44d6b] transition-all active:scale-95"
          >
            Увійти через Google
          </button>
        </div>
      </div>
    </main>
  );
}

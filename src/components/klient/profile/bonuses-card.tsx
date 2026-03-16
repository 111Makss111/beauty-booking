"use client";

export default function BonusesCard() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border border-white flex flex-col items-center text-center gap-5">
        <h3 className="text-slate-800 font-bold text-lg w-full text-left">
          Мої бонуси
        </h3>

        <div className="relative w-24 h-24 bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl flex items-center justify-center text-5xl shadow-inner shadow-pink-200 border border-pink-100/50">
          🎁
        </div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed px-2">
          Ви маєте <span className="font-bold text-pink-500 text-base">0</span>{" "}
          бонусних балів для використання на наступну послугу!
        </p>

        <button className="w-full py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-xl shadow-md shadow-pink-200 hover:shadow-lg hover:opacity-90 transition-all mt-2">
          Використати
        </button>
      </div>
      <div className="mt-auto pt-4">
        <button className="flex items-center justify-center gap-2 w-full py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-medium text-sm border border-transparent hover:border-rose-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          Видалити акаунт
        </button>
      </div>
    </div>
  );
}

"use client";

import { signOut } from "next-auth/react";

interface SidebarProps {
  user: {
    firstName: string;
    lastName: string;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({
  user,
  activeTab,
  setActiveTab,
}: SidebarProps) {
  // Перекладено українською, бейдж із повідомлень прибрано
  const navItems = [
    { id: "book", label: "Новий запис", icon: <CalendarIcon /> },
    { id: "appointments", label: "Мої записи", icon: <ClipboardListIcon /> },
    { id: "messages", label: "Повідомлення", icon: <MessageIcon /> },
    { id: "profile", label: "Мій профіль", icon: <UserIcon /> },
    { id: "settings", label: "Налаштування", icon: <SettingsIcon /> },
  ];

  return (
    <aside className="w-64 h-full bg-white/40 flex flex-col py-8 px-6 border-r border-pink-100/50">
      {/* 1. Логотип */}
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-400 rounded-lg flex items-center justify-center shadow-md shadow-pink-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-white"
          >
            <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
            <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13-8.733-4.703-8.737 4.704z" />
          </svg>
        </div>
        <h1
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 italic"
          style={{ fontFamily: "cursive" }}
        >
          Beauty Nails
        </h1>
      </div>

      {/* 2. Профіль користувача */}
      <div className="flex items-center gap-4 mb-8 pl-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-200 to-rose-100 p-1">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-pink-500 font-bold text-lg">
            {user.firstName.charAt(0)}
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Привіт,</p>
          <p className="text-base font-bold text-slate-800">
            {user.firstName}!
          </p>
        </div>
      </div>

      {/* 3. Навігаційне меню */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-white shadow-sm shadow-pink-100 text-pink-600 font-bold"
                  : "text-slate-500 font-medium hover:bg-white/60 hover:text-pink-500"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`${isActive ? "text-pink-500" : "text-slate-400"}`}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* 4. Кнопка виходу */}
      <div className="mt-auto">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-4 w-full px-4 py-3 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Вийти
        </button>
      </div>
    </aside>
  );
}

// === ІКОНКИ (SVG) залишаємо без змін ===
function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}
function ClipboardListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 15.75h3.75M15.75 9h.008v.008h-.008V9zm0 3h.008v.008h-.008V12zm0 3h.008v.008h-.008V15zm0 3h.008v.008h-.008v-.008zM19.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5z"
      />
    </svg>
  );
}
function MessageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

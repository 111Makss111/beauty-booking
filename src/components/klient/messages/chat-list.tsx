"use client";

import { useState, useEffect } from "react";
import { getContacts } from "@/messages/actions";

interface Contact {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  time: string;
  unread: number;
  averageRating: number;
}

interface ChatListProps {
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
}

export default function ChatList({
  activeChatId,
  onSelectChat,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (error) {
        console.error("Помилка завантаження контактів:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full h-full flex flex-col bg-white/70 backdrop-blur-md rounded-[2rem] shadow-sm border border-white overflow-hidden">
      <div className="p-6 pb-4 border-b border-pink-50/50">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Повідомлення</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Пошук..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm text-slate-700 placeholder-slate-400"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">
              Оновлення чатів...
            </p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center text-slate-400 text-sm mt-10 p-6">
            {searchQuery
              ? "Нікого не знайдено"
              : "У вас ще немає активних діалогів"}
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const isActive = activeChatId === contact.id;

            return (
              <button
                key={contact.id}
                onClick={() => onSelectChat(contact.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl transition-all text-left ${
                  isActive
                    ? "bg-white shadow-sm border border-pink-100"
                    : "hover:bg-white/40 border border-transparent"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-200 to-rose-100 flex items-center justify-center text-pink-500 font-bold overflow-hidden shadow-inner border border-white">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      contact.name.charAt(0)
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3
                      className={`font-bold truncate pr-2 text-sm ${isActive ? "text-pink-600" : "text-slate-800"}`}
                    >
                      {contact.name}
                    </h3>
                    <span className="text-[10px] font-medium text-slate-400 flex-shrink-0">
                      {contact.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xs text-slate-500 truncate max-w-[140px]">
                      {contact.lastMessage}
                    </p>
                    {contact.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm shadow-pink-200 animate-in zoom-in">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

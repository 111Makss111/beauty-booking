"use client";

import { useState, useRef, useEffect } from "react";
import {
  getMessages,
  sendMessage,
  markAsRead,
  getChatPartner,
} from "@/messages/actions";
import { pusherClient } from "@/lib/pusher";

interface Message {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
}

interface PusherMessagePayload {
  id: string;
  text: string;
  senderId: string;
  createdAt: string | Date;
}

interface PartnerInfo {
  name: string;
  avatar: string | null;
  rating: number;
}

interface ChatAreaProps {
  activeChatId: string | null;
  currentUserId: string;
  onBack?: () => void;
}

export default function ChatArea({
  activeChatId,
  currentUserId,
  onBack,
}: ChatAreaProps) {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<PartnerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = pusherClient.subscribe(`chat-${currentUserId}`);

    channel.bind("new-message", (data: PusherMessagePayload) => {
      if (data.senderId === activeChatId) {
        const newMessage: Message = {
          id: data.id,
          text: data.text,
          time: new Date(data.createdAt).toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMine: false,
        };
        setMessages((prev) => [...prev, newMessage]);
        markAsRead(activeChatId!);
      }
    });

    return () => {
      pusherClient.unsubscribe(`chat-${currentUserId}`);
    };
  }, [currentUserId, activeChatId]);

  useEffect(() => {
    if (!activeChatId) return;

    const loadData = async () => {
      setIsLoading(true);
      const [messagesData, partnerData] = await Promise.all([
        getMessages(activeChatId),
        getChatPartner(activeChatId),
      ]);

      setMessages(messagesData);
      setPartner(partnerData);
      await markAsRead(activeChatId);
      setIsLoading(false);
    };

    loadData();
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeChatId) return;

    const tempText = inputText;
    setInputText("");

    const optimisticMsg: Message = {
      id: Math.random().toString(),
      text: tempText,
      time: new Date().toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMine: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    await sendMessage(activeChatId, tempText);
  };

  if (!activeChatId) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white/70 backdrop-blur-md rounded-[2rem] shadow-sm border border-white">
        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center text-5xl mb-4 shadow-inner">
          💬
        </div>
        <h3 className="text-xl font-bold text-slate-700">
          Оберіть співрозмовника
        </h3>
        <p className="text-slate-500 mt-2 text-sm">
          Виберіть контакт зі списку ліворуч, щоб почати бесіду.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white/70 backdrop-blur-md rounded-[2rem] shadow-sm border border-white overflow-hidden">
      <div className="px-4 lg:px-6 py-4 border-b border-pink-50/50 flex items-center justify-between bg-white/40">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-pink-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-200 to-rose-100 flex items-center justify-center text-pink-500 font-bold border border-white shadow-inner overflow-hidden flex-shrink-0">
            {partner?.avatar ? (
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            ) : (
              partner?.name.charAt(0) || "?"
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-800 truncate">
              {partner?.name || "Завантаження..."}
            </h2>
            <div className="flex text-yellow-400 text-[10px] mt-0.5">
              {"★".repeat(Math.round(partner?.rating || 5))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
            Напишіть перше повідомлення...
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] lg:max-w-[80%] p-3 relative shadow-sm text-sm ${
                  msg.isMine
                    ? "bg-[#e2f5e9] text-slate-800 rounded-2xl rounded-br-none"
                    : "bg-white text-slate-800 rounded-2xl rounded-bl-none border border-pink-50"
                }`}
              >
                <p className="pb-4 break-words">{msg.text}</p>
                <span className="text-[9px] text-slate-400 absolute bottom-1.5 right-3">
                  {msg.time}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 lg:p-4 bg-white/40 border-t border-pink-50/50">
        <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-slate-100 focus-within:ring-2 focus-within:ring-pink-500/10 transition-all">
          <input
            type="text"
            placeholder="Ваше повідомлення..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent px-3 py-2 outline-none text-sm text-slate-700 placeholder-slate-400"
          />
          <button
            onClick={handleSend}
            className="p-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-all active:scale-95 shadow-md shadow-pink-200 shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 -rotate-45"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

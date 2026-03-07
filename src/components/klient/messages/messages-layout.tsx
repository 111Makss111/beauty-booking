"use client";

import { useState, useEffect } from "react";
import ChatList from "./chat-list";
import ChatArea from "./chat-area";
import { getCurrentUserId } from "@/messages/actions";

export default function MessagesLayout() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchId = async () => {
      try {
        const id = await getCurrentUserId();
        setCurrentUserId(id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchId();
  }, []);

  return (
    <div className="flex h-[calc(100vh-140px)] gap-0 lg:gap-6 p-2 lg:p-4">
      <div
        className={`${activeChatId ? "hidden lg:block" : "w-full"} lg:w-1/3 lg:min-w-[320px] h-full flex-shrink-0`}
      >
        <ChatList activeChatId={activeChatId} onSelectChat={setActiveChatId} />
      </div>

      <div
        className={`${!activeChatId ? "hidden lg:flex" : "flex"} flex-1 h-full min-w-0 w-full flex-col`}
      >
        {currentUserId ? (
          <ChatArea
            activeChatId={activeChatId}
            currentUserId={currentUserId}
            onBack={() => setActiveChatId(null)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white/70 backdrop-blur-md rounded-[2rem] shadow-sm border border-white">
            <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 text-sm font-medium animate-pulse italic">
              Підключення до мережі...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

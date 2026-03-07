"use client";

import { useState, useEffect } from "react";
import { X, ChevronsUpDown, Loader2 } from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string | null;
}

interface MasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterId: string | null;
}

export default function MasterModal({
  isOpen,
  onClose,
  masterId,
}: MasterModalProps) {
  const [formData, setFormData] = useState({
    userId: "",
    specialization: "",
    status: "WORKING",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsFetchingUsers(true);
      try {
        const usersRes = await fetch("/api/admin/users?role=CLIENT");
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }

        if (masterId) {
          const masterRes = await fetch(`/api/admin/masters/${masterId}`);
          if (masterRes.ok) {
            const masterData = await masterRes.json();
            setFormData({
              userId: masterData.userId,
              specialization: masterData.specialization,
              status: masterData.status,
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingUsers(false);
      }
    };

    if (isOpen) loadInitialData();
  }, [isOpen, masterId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = masterId
        ? `/api/admin/masters/${masterId}`
        : "/api/admin/masters";
      const method = masterId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-pink-50 p-5 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 text-slate-400 hover:text-pink-500 hover:bg-pink-50 p-2 rounded-full transition-colors z-10 bg-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 pr-10">
          {masterId ? "Редагувати майстра" : "Додати майстра"}
        </h2>

        <div className="overflow-y-auto custom-scrollbar flex-1 -mr-2 pr-2">
          <form onSubmit={handleSubmit} className="space-y-5 pb-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Оберіть користувача
              </label>
              <div className="relative">
                <select
                  required
                  disabled={!!masterId}
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <option value="">Оберіть людину зі списку...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
                {!masterId && (
                  <ChevronsUpDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Спеціалізація
              </label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-sm sm:text-base"
                placeholder="Наприклад: Топ-майстер манікюру"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Статус
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["WORKING", "VACATION"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={`py-3 rounded-2xl border text-sm font-bold transition-all ${
                      formData.status === s
                        ? "bg-pink-50 border-pink-200 text-pink-600 shadow-sm"
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                    }`}
                  >
                    {s === "WORKING" ? "Працює" : "Відпустка"}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 px-4 py-3.5 sm:py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl font-medium transition-colors order-2 sm:order-1"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={isLoading || isFetchingUsers}
                className="w-full sm:flex-1 px-4 py-3.5 sm:py-3 text-white bg-pink-500 hover:bg-pink-600 rounded-2xl font-medium transition-colors shadow-sm shadow-pink-200 disabled:opacity-70 flex items-center justify-center order-1 sm:order-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Зберегти"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

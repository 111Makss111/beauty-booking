"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, ShieldAlert, Lock } from "lucide-react";
import { updateUserPassword } from "@/profile/actions";

// Описуємо чіткий інтерфейс для пропсів
interface UserSecurityData {
  firstName?: string | null;
  hasPassword?: boolean;
}

interface SecurityFormProps {
  user: UserSecurityData;
}

export default function SecurityForm({ user }: SecurityFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSave = () => {
    setErrorMessage("");

    // Валідація
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setErrorMessage("Заповніть всі поля форми");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setErrorMessage("Нові паролі не співпадають");
      return;
    }
    if (passwords.new.length < 6) {
      setErrorMessage("Пароль має бути не менше 6 символів");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateUserPassword(
          passwords.current,
          passwords.new,
        );

        if (result.success) {
          setShowSuccess(true);
          setPasswords({ current: "", new: "", confirm: "" });
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          setErrorMessage(result.error || "Не вдалося оновити пароль");
        }
      } catch (error) {
        setErrorMessage("Помилка з'єднання з сервером");
      }
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 shadow-sm border border-white animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-50 rounded-lg">
            <Lock className="w-5 h-5 text-pink-500" />
          </div>
          <h3 className="text-slate-800 font-bold text-xl">Безпека акаунта</h3>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full animate-in fade-in slide-in-from-right-2">
            <Check className="w-4 h-4" /> Збережено
          </div>
        )}
      </div>

      {/* Якщо користувач залогінений через Google */}
      {user.hasPassword === false ? (
        <div className="flex flex-col items-center py-10 text-center bg-gradient-to-b from-pink-50/50 to-transparent rounded-[1.5rem] border border-pink-100/50">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-6 h-6"
              alt="Google"
            />
          </div>
          <p className="text-slate-700 font-bold mb-1">
            Використовується Google Auth
          </p>
          <p className="text-sm text-slate-500 px-8 max-w-sm">
            Ваш профіль захищено через Google. Пароль для цього способу входу не
            потрібен.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl flex items-center gap-3 animate-in fade-in">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 pl-1 uppercase tracking-wider">
                Поточний пароль
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 pl-1 uppercase tracking-wider">
                  Новий пароль
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 pl-1 uppercase tracking-wider">
                  Підтвердження
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full md:w-fit px-8 py-3.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 active:scale-[0.98]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Оновлення...
                </>
              ) : (
                "Оновити пароль"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

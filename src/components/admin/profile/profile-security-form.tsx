"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, ShieldAlert } from "lucide-react";
// TODO: Імпортуй сюди функцію зміни пароля, коли вона буде готова
// import { updatePassword } from "@/profile/actions";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  role: string;
  phone?: string | null;
  hasPassword?: boolean; // Додано для перевірки авторизації через Google
}

interface ProfileSecurityFormProps {
  user: UserData;
}

export default function ProfileSecurityForm({
  user,
}: ProfileSecurityFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Локальний стан для паролів
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSave = () => {
    setErrorMessage("");

    // Валідація
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setErrorMessage("Будь ласка, заповніть всі поля.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setErrorMessage("Нові паролі не співпадають.");
      return;
    }

    if (passwords.new.length < 6) {
      setErrorMessage("Новий пароль має містити щонайменше 6 символів.");
      return;
    }

    startTransition(async () => {
      try {
        // ТУТ БУДЕ ВИКЛИК СЕРВЕРНОЇ ФУНКЦІЇ
        // Наприклад: await updatePassword(passwords.current, passwords.new);

        // Поки що імітуємо затримку сервера для візуалу
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setShowSuccess(true);
        setPasswords({ current: "", new: "", confirm: "" }); // Очищаємо поля
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error("Помилка:", error);
        setErrorMessage("Виникла непередбачена помилка.");
      }
    });
  };

  const passwordLength = passwords.new.length;

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2rem] border border-white shadow-sm p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          Налаштування облікового запису
        </h2>
        {showSuccess && (
          <span className="flex items-center gap-1 text-emerald-500 text-sm font-medium animate-in fade-in">
            <Check className="w-4 h-4" /> Пароль змінено
          </span>
        )}
      </div>

      {/* Якщо користувач з Google (не має пароля) */}
      {user.hasPassword === false ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50/50 rounded-2xl border border-slate-100 animate-in fade-in">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-8 h-8"
            />
          </div>
          <h3 className="text-slate-800 font-bold mb-2 text-lg">
            Авторизація через Google
          </h3>
          <p className="text-sm text-slate-500 max-w-md">
            Ви увійшли в систему за допомогою свого облікового запису Google.
            Безпека вашого профілю керується компанією Google, тому зміна пароля
            тут недоступна.
          </p>
        </div>
      ) : (
        /* Якщо звичайний користувач (показуємо форму) */
        <div className="flex flex-col gap-6">
          {/* Повідомлення про помилку */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-500 text-sm rounded-xl flex items-start gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
            {/* Ліва колонка інпутів */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-500">
                  Поточний пароль:
                </label>
                <input
                  type="password"
                  placeholder="Введіть поточний пароль..."
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  className="bg-white/60 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-500">
                  Повторіть новий пароль:
                </label>
                <input
                  type="password"
                  placeholder="Повторіть новий пароль..."
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  className="bg-white/60 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                />
              </div>
            </div>

            {/* Права колонка інпутів та індикатор складності */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-500">
                  Новий пароль:
                </label>
                <input
                  type="password"
                  placeholder="Введіть новий пароль..."
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  className="bg-white/60 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                />
              </div>

              <div className="flex items-center justify-between px-2 pt-8">
                <span className="text-xs text-slate-500 font-medium">
                  Складність:{" "}
                  <span
                    className={
                      passwordLength >= 6
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }
                  >
                    {passwordLength >= 6 ? "Добра" : "Слабка"}
                  </span>
                </span>
                <div className="flex gap-1">
                  <div
                    className={`w-4 h-1.5 rounded-full transition-all duration-300 ${passwordLength > 0 ? "bg-pink-500" : "bg-slate-200"}`}
                  ></div>
                  <div
                    className={`w-4 h-1.5 rounded-full transition-all duration-300 ${passwordLength >= 6 ? "bg-pink-500" : "bg-slate-200"}`}
                  ></div>
                  <div
                    className={`w-4 h-1.5 rounded-full transition-all duration-300 ${passwordLength >= 10 ? "bg-pink-500" : "bg-slate-200"}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-pink-600 text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Змінити пароль
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

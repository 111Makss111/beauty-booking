"use client";

import { useState, useTransition, useRef } from "react";
import { Upload, Trash2, Loader2, Check } from "lucide-react";
import { updateUserProfile, updateUserAvatar } from "@/profile/actions";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  role: string;
  phone?: string | null;
}

interface ProfileGeneralFormProps {
  user: UserData;
}

export default function ProfileGeneralForm({ user }: ProfileGeneralFormProps) {
  // Стани для текстової форми
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  // Стани для завантаження фото
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "+380",
    email: user.email || "",
    image: user.image || null,
    notes: "",
  });

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

  // 1. Логіка збереження тексту (Ім'я, Прізвище, Номер)
  const handleSaveText = () => {
    startTransition(async () => {
      try {
        await updateUserProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error("Помилка збереження тексту", error);
      }
    });
  };

  // 2. Логіка завантаження фото (Твоя робоча логіка з клієнта)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Файл занадто великий! Максимум 2MB.");
      return;
    }

    setIsUploadingAvatar(true);

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        },
      );

      const data = await res.json();

      if (data.secure_url) {
        // Оновлюємо картинку на екрані
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        // Зберігаємо посилання в нашу базу даних
        await updateUserAvatar(data.secure_url);
      } else {
        throw new Error("Не вдалося отримати посилання від Cloudinary");
      }
    } catch (error) {
      console.error("Помилка завантаження фото:", error);
      alert("Помилка при завантаженні фото. Спробуйте ще раз.");
    } finally {
      setIsUploadingAvatar(false);
      // Очищаємо інпут, щоб можна було завантажити той самий файл ще раз, якщо треба
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 3. Логіка видалення фото
  const handleDeleteAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      setFormData((prev) => ({ ...prev, image: null }));
      await updateUserAvatar(""); // Передаємо порожній рядок у БД
    } catch (error) {
      console.error("Помилка видалення фото", error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2rem] border border-white shadow-sm p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Профіль</h2>
        {showSuccess && (
          <span className="flex items-center gap-1 text-emerald-500 text-sm font-medium animate-in fade-in">
            <Check className="w-4 h-4" /> Збережено
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ЛІВИЙ БЛОК: Аватар та кнопки завантаження */}
        <div className="flex flex-col items-center gap-4 min-w-[160px]">
          <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-pink-50 flex items-center justify-center group">
            {formData.image ? (
              <img
                src={formData.image}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-pink-300 font-bold uppercase">
                {formData.firstName ? formData.firstName.charAt(0) : "?"}
              </span>
            )}

            {/* Спінер при завантаженні або видаленні */}
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <div className="flex flex-col w-full gap-2">
            {/* Прихований інпут */}
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="w-full py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-pink-100 shadow-sm disabled:opacity-50"
            >
              <Upload className="w-3 h-3" />
              {isUploadingAvatar ? "Завантаження..." : "Завантажити фото"}
            </button>

            <button
              onClick={handleDeleteAvatar}
              disabled={isUploadingAvatar || !formData.image}
              className="w-full py-2 text-slate-400 hover:text-rose-500 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3 h-3" />
              Видалити
            </button>
          </div>
        </div>

        {/* ПРАВИЙ БЛОК: Текстова форма */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label className="text-sm font-medium text-slate-500">Імя:</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="sm:col-span-2 bg-white/60 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label className="text-sm font-medium text-slate-500">
              Прізвище:
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="sm:col-span-2 bg-white/60 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label className="text-sm font-medium text-slate-500">
              Телефон:
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="sm:col-span-2 bg-white/60 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label className="text-sm font-medium text-slate-500">Email:</label>
            <div className="sm:col-span-2 relative">
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4 border-t border-slate-100 pt-4">
            <button
              onClick={handleSaveText}
              disabled={isPending}
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Зберегти зміни
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

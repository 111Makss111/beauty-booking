"use client";

import { useState, useRef } from "react";
import { updateUserAvatar } from "@/profile/actions";

interface AvatarUploadProps {
  image?: string | null;
  firstName?: string | null;
}

export default function AvatarUpload({ image, firstName }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState(image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initial = firstName ? firstName.charAt(0).toUpperCase() : "?";

  // Сюди встав свої дані з Cloudinary!

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Перевірка розміру (макс 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Файл занадто великий! Максимум 2MB.");
      return;
    }

    setIsUploading(true);

    // Готуємо дані для відправки в Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      // 1. Відправляємо фото напряму в Cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (data.secure_url) {
        // 2. Якщо успішно, оновлюємо картинку на екрані
        setCurrentImage(data.secure_url);
        // 3. Зберігаємо посилання в нашу базу даних
        await updateUserAvatar(data.secure_url);
      } else {
        throw new Error("Не вдалося отримати посилання");
      }
    } catch (error) {
      console.error("Помилка завантаження:", error);
      alert("Помилка при завантаженні фото. Спробуйте ще раз.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 shadow-sm border border-white flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-4xl text-slate-400 font-bold group">
        {currentImage ? (
          <img
            src={currentImage}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}

        {/* Анімація завантаження */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        {/* Прихований справжній інпут для файлів */}
        <input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {/* Наша красива кнопка, яка клікає по прихованому інпуту */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2 bg-pink-50 text-pink-600 font-medium rounded-xl hover:bg-pink-100 transition-colors text-sm disabled:opacity-50"
        >
          {isUploading ? "Завантаження..." : "Змінити фото"}
        </button>
        <p className="text-xs text-slate-400">JPG, PNG до 2MB</p>
      </div>
    </div>
  );
}

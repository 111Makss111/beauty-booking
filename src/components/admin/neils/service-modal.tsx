"use client";

import { useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
}

interface ServiceFormData {
  name: string;
  duration: number;
  price: number;
  image: string;
}

export default function ServiceModal({
  isOpen,
  onClose,
  serviceId,
}: ServiceModalProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    duration: 60,
    price: 0,
    image: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (serviceId) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      } else {
        setFormData({
          name: "",
          duration: 60,
          price: 0,
          image: "",
        });
        setImageFile(null);
        setPreviewUrl(null);
      }
    };

    fetchServiceData();
  }, [serviceId]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
    );

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      },
    );

    if (!response.ok) {
      throw new Error("Cloudinary error");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalImageUrl = formData.image;

      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }

      const dataToSend = {
        ...formData,
        image: finalImageUrl,
      };

      const endpoint = serviceId
        ? `/api/admin/services/${serviceId}`
        : "/api/admin/services";

      const method = serviceId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("DB error");
      }

      setIsLoading(false);
      onClose();
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-pink-50 p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-pink-500 hover:bg-pink-50 p-2 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6 pr-8">
          {serviceId ? "Редагувати послугу" : "Додати нову послугу"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Зображення послуги (необовязково)
            </label>
            <div className="relative w-full h-32 border-2 border-dashed border-pink-200 rounded-2xl bg-pink-50/50 flex flex-col items-center justify-center overflow-hidden group hover:bg-pink-50 transition-colors">
              {previewUrl || formData.image ? (
                <>
                  <img
                    src={previewUrl || formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      Змінити фото
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-pink-300 mb-2" />
                  <span className="text-sm text-pink-500 font-medium">
                    Завантажити фото
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Назва послуги
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Тривалість (хв)
              </label>
              <input
                type="number"
                required
                min="15"
                step="15"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: Number(e.target.value),
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Ціна (€)
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl font-medium transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-white bg-pink-500 hover:bg-pink-600 rounded-2xl font-medium transition-colors shadow-sm shadow-pink-200 disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

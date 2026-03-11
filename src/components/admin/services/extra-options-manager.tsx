"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, X } from "lucide-react";

interface ExtraOption {
  id: string;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export default function ExtraOptionsManager() {
  const [options, setOptions] = useState<ExtraOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ExtraOption | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "30",
    isActive: true,
  });

  const fetchOptions = async () => {
    try {
      const res = await fetch("/api/admin/extra-options");
      if (res.ok) {
        const data = await res.json();
        setOptions(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleOpenModal = (option?: ExtraOption) => {
    if (option) {
      setEditingOption(option);
      setFormData({
        name: option.name,
        price: option.price.toString(),
        duration: option.duration.toString(),
        isActive: option.isActive,
      });
    } else {
      setEditingOption(null);
      setFormData({ name: "", price: "", duration: "30", isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOption(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingOption ? "PUT" : "POST";
    const url = editingOption
      ? `/api/admin/extra-options/${editingOption.id}`
      : "/api/admin/extra-options";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchOptions();
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю опцію?")) return;

    try {
      const res = await fetch(`/api/admin/extra-options/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchOptions();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleActive = async (option: ExtraOption) => {
    try {
      const res = await fetch(`/api/admin/extra-options/${option.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !option.isActive }),
      });
      if (res.ok) fetchOptions();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Додаткові послуги
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Керування опціями (зняття, дизайн тощо)
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-2xl font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Додати опцію
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option) => (
          <div
            key={option.id}
            className={`p-5 rounded-[1.8rem] border transition-all ${
              option.isActive
                ? "bg-white border-slate-100 shadow-sm"
                : "bg-slate-50 border-slate-200 opacity-60"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-800 line-clamp-2">
                {option.name}
              </h3>
              <div className="flex items-center gap-1 bg-pink-50 text-pink-600 px-2 py-1 rounded-lg font-black text-sm">
                €{option.price}
              </div>
            </div>

            <div className="text-xs font-medium text-slate-500 mb-4">
              Час: {option.duration} хв
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => toggleActive(option)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                  option.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {option.isActive ? "Активна" : "На паузі"}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(option)}
                  className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(option.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {options.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-400 text-sm">
            Ще немає жодної додаткової послуги
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-6">
              {editingOption ? "Редагувати опцію" : "Нова опція"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Назва послуги
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-pink-200 transition-all text-sm font-medium"
                  placeholder="Наприклад: Френч"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Ціна (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-pink-200 transition-all text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Час (хв)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-pink-200 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-slate-300 text-pink-500 focus:ring-pink-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-bold text-slate-700 cursor-pointer"
                >
                  Активна послуга (видно клієнтам)
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-2xl transition-colors mt-4"
              >
                Зберегти
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

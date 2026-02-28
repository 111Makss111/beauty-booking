"use client";

import { useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const products = [
  {
    id: 1,
    title: "Класичний манікюр",
    price: "Від 50 zł",
    img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Апаратний педикюр",
    price: "Від 80 zł",
    img: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Нарощування гелем",
    price: "Від 120 zł",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Ніжний френч",
    price: "Від 70 zł",
    img: "https://images.unsplash.com/photo-1516975080661-46bfa2c281c7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Складний дизайн",
    price: "Від 30 zł",
    img: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Products() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const slides = products.map((item) => ({ src: item.img }));

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -344 : 344;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <section
      id="gallery"
      className="w-full max-w-7xl mx-auto px-8 py-12 md:py-16 overflow-hidden"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Наші роботи та послуги
          </h2>
          <p className="text-slate-500">
            Оберіть ідеальний дизайн для ваших нігтів
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-pink-500 hover:bg-white hover:shadow-md transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-pink-500 hover:bg-white hover:shadow-md transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-8 px-8 md:mx-0 md:px-2"
      >
        {products.map((item, index) => (
          <div
            key={item.id}
            className="min-w-[280px] md:min-w-[320px] snap-center glass-panel p-3 flex flex-col gap-4 group cursor-pointer hover:shadow-lg transition-all"
            onClick={() => openLightbox(index)}
          >
            <div className="w-full h-[320px] rounded-xl overflow-hidden relative bg-pink-50">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex justify-between items-center px-2 pb-2">
              <h3 className="text-lg font-semibold text-slate-800">
                {item.title}
              </h3>
              <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-lg text-sm font-bold">
                {item.price}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={slides}
      />
    </section>
  );
}

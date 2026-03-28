"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const banners = [
  {
    title: "The air specialist",
    subtitle: "Shop now",
    desc: "Easy EMI | Cashback: upto Rs.3000",
    bg: "bg-gradient-to-r from-[#207bb4] to-[#12588c]",
    ad: true,
  },
  {
    title: "Nova 2 5G | Android 16",
    subtitle: "Launching 9th Apr",
    desc: "Safe. Secure. Yours.",
    bg: "bg-gradient-to-r from-[#8a7ba9] to-[#6a5b88]",
    ad: true,
  },
  {
    title: "Spark 50 5G",
    subtitle: "From ₹16,999",
    desc: "Sale starts on 3rd April, 12 PM",
    bg: "bg-[#f5f5f5]",
    ad: false,
    textDark: true,
  },
  {
    title: "Best-selling refrigerators",
    subtitle: "From ₹8,990*",
    desc: "Prepaids | SuperCoins | Exch. offers",
    bg: "bg-gradient-to-r from-[#d4a373] to-[#bc8348]",
    ad: false,
  },
];

export default function BannerCarousel() {
  return (
    <div className="container mx-auto px-4 lg:px-20 mt-4 mb-4 select-none">
      <Swiper 
        modules={[Autoplay, Pagination]}
        spaceBetween={16} 
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ 
          clickable: true,
          el: '.custom-pagination',
        }}
        className="pb-8"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index} className="h-full">
            <div
              className={`rounded-[12px] p-6 pr-10 flex flex-col justify-center h-[240px] relative overflow-hidden transition-transform hover:scale-[1.01] duration-300 shadow-sm border border-gray-100/50 dark:border-gray-800 ${banner.bg} ${banner.textDark ? 'text-[#212121] dark:text-gray-100' : 'text-white'}`}
            >
              <div className="relative z-10 max-w-[75%] space-y-2.5">
                <h2 className="text-2xl font-black leading-tight tracking-tight mt-6">
                  {banner.title}
                </h2>
                <p className="text-xl font-bold tracking-tight opacity-90">
                  {banner.subtitle}
                </p>
                <p className={`text-sm tracking-wide mt-2 ${banner.textDark ? 'text-gray-600 font-medium' : 'text-blue-50/80 font-normal'}`}>
                  {banner.desc}
                </p>
              </div>

              {/* Decorative Brand Logos (Placeholders) */}
              <div className="absolute top-4 left-6 py-1 px-2.5 bg-white/95 rounded shadow-sm z-10">
                 <span className="font-black italic text-[#2874f0] text-sm tracking-tighter">BRAND</span>
              </div>

              {/* AD Badge */}
              {banner.ad && (
                <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white z-10">
                  AD
                </div>
              )}
              
              {/* Decorative Abstract Shapes for Premium Feel */}
              {!banner.textDark && (
                <>
                  <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                  <div className="absolute right-0 bottom-0 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
                </>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Container */}
      <div className="custom-pagination flex justify-center space-x-1 mt-2 mb-2"></div>

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #c2c2c2;
          opacity: 1;
          transition: all 0.3s ease;
          border-radius: 12px;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          width: 16px;
          background: #808080;
        }
      `}</style>
    </div>
  );
}

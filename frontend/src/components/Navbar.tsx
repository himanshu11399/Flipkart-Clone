"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaSun, FaMoon } from "react-icons/fa";
import { useFilter } from "@/context/FilterContext";
import { useTheme } from "@/context/ThemeContext";
import LoginDropdown from "./LoginDropdown";
import MoreDropdown from "./MoreDropdown";
import { 
  Search as LuSearch, 
  ShoppingCart as LuShoppingCart, 
  User as LuUser, 
  ChevronDown as LuChevronDown, 
  MapPin as LuMapPin, 
  Plane as LuPlane,
  LayoutGrid as LuLayoutGrid,
  Shirt as LuShirt,
  Smartphone as LuSmartphone,
  Sparkles as LuSparkles,
  Monitor as LuMonitor,
  Home as LuHome,
  Tv as LuTv,
  Baby as LuBaby,
  UtensilsCrossed as LuUtensilsCrossed,
  Car as LuCar,
  Bike as LuBike,
  Trophy as LuTrophy,
  BookOpen as LuBookOpen,
  Armchair as LuArmchair
} from 'lucide-react';

const categories = [
  { name: "For You", icon: LuLayoutGrid },
  { name: "Fashion", icon: LuShirt },
  { name: "Mobiles", icon: LuSmartphone },
  { name: "Beauty", icon: LuSparkles },
  { name: "Electronics", icon: LuMonitor },
  { name: "Home", icon: LuHome },
  { name: "Appliances", icon: LuTv },
  { name: "Toys, Baby", icon: LuBaby },
  { name: "Food & Health", icon: LuUtensilsCrossed },
  { name: "Auto Acc...", icon: LuCar },
  { name: "2 Wheele...", icon: LuBike },
  { name: "Sports & More", icon: LuTrophy },
  { name: "Books & More", icon: LuBookOpen },
  { name: "Furniture", icon: LuArmchair },
];


export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useFilter();
  
  const isHomeActive = pathname === "/";

  useEffect(() => {
    let lastScrollYValue = window.scrollY;
    let ticking = false;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 15);

      if (currentScrollY > 80) {
        // use a 10px delta threshold buffer to prevent jitter
        if (currentScrollY - lastScrollYValue > 8) {
          setShowCategories(false);
          lastScrollYValue = currentScrollY;
        } else if (lastScrollYValue - currentScrollY > 8) {
          setShowCategories(true);
          lastScrollYValue = currentScrollY;
        }
      } else {
        setShowCategories(true);
        lastScrollYValue = currentScrollY;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 font-sans select-none flex flex-col pointer-events-none">
      <div className={`w-full bg-white dark:bg-gray-950 relative z-50 pointer-events-auto transition-all duration-300 border-b border-transparent dark:border-gray-800/50 ${isScrolled ? 'shadow-[0_4px_12px_rgba(0,0,0,0.05)]' : 'shadow-sm'}`}>
        {/* Row 1: Top Strip */}
        <div className="container mx-auto px-2 sm:px-4 lg:px-20 py-1.5 flex items-center justify-between overflow-hidden">
          <div className="flex items-center space-x-3">
            {/* Flipkart Logo Case */}
            <Link href="/" onClick={() => setSelectedCategory('For You')} className="bg-[#ffe11b] px-3 py-1.5 rounded-[4px] flex items-center group cursor-pointer">
              <span className="text-[#2874f0] font-[900] italic text-xl mr-1 leading-none">f</span>
              <span className="text-[#212121] font-bold italic tracking-tighter text-[15px]">Flipkart</span>
            </Link>
            
            {/* Travel Button */}
            <Link href="#" className="bg-[#f0f2f5] dark:bg-gray-800 px-4 py-1.5 rounded-[4px] flex items-center space-x-2 hover:bg-[#e8eaed] dark:hover:bg-gray-700 transition-colors border border-transparent">
              <LuPlane size={18} className="text-[#fb641b]" />
              <span className="text-[#212121] dark:text-gray-200 text-[13px] font-medium">Travel</span>
            </Link>
          </div>

          {/* Location Selector */}
          <div className="hidden md:flex items-center space-x-1.5 text-[#212121] dark:text-gray-300">
            <LuMapPin size={18} className="text-[#212121] dark:text-gray-300" />
            <span className="text-[14px]">Location not set</span>
            <button className="text-[#2874f0] hover:underline font-semibold text-[14px] flex items-center group">
              Select delivery location
              <span className="ml-1 text-[11px] group-hover:translate-x-0.5 transition-transform font-bold outline-none leading-none mt-0.5 text-[#2874f0]">{">"}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Search & Actions */}
        <div className="container mx-auto px-2 sm:px-4 lg:px-20 py-2.5 flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Search Input Container */}
          <div className={`flex-1 relative flex items-center bg-[#f0f5ff] dark:bg-gray-800/50 rounded-[8px] border-[1.5px] transition-all duration-200 h-[42px] ${isSearchFocused ? 'border-[#2874f0] bg-white dark:bg-gray-900 ring-2 ring-[#2874f0]/10 shadow-sm' : 'border-[#2874f0]/30 dark:border-gray-700'}`}>
            <div className="flex items-center justify-center w-12 text-[#878787] dark:text-gray-400">
              <LuSearch size={19} />
            </div>
            <input 
              type="text" 
              placeholder="Search for Products, Brands and More" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[#212121] dark:text-gray-100 outline-none text-[15px] placeholder:text-[#878787] dark:placeholder:text-gray-500 font-normal"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-6 text-[#212121] dark:text-gray-200">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group relative overflow-hidden active:scale-90"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: 20, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {theme === "light" ? (
                    <FaMoon size={18} className="text-[#2874f0]" />
                  ) : (
                    <FaSun size={18} className="text-[#ff9f00]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Home Icon */}
            <Link 
              href="/" 
              title="Go to Home"
              onClick={() => setSelectedCategory('For You')}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <FaHome 
                  size={20} 
                  className={`transition-colors duration-200 ${isHomeActive ? 'text-[#2874f0]' : 'text-[#212121] dark:text-gray-300 group-hover:text-[#2874f0]'}`} 
                />
                <span className={`text-[15px] font-medium transition-colors hidden xl:inline ${isHomeActive ? 'text-[#2874f0]' : 'text-[#212121] dark:text-gray-300 group-hover:text-[#2874f0]'}`}>
                  Home
                </span>
              </motion.div>
            </Link>

            {/* Login Dropdown */}
            <div className="flex items-center gap-4">
              <LoginDropdown />
            </div>

            {/* More Action */}
            <MoreDropdown />

            {/* Cart Section */}
            <Link href="/cart" className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 sm:px-3 py-2 rounded-lg transition-colors font-medium text-[#212121] dark:text-gray-200">
              <LuShoppingCart size={22} className="text-[#212121] dark:text-gray-200" />
              <span className="hidden sm:inline text-[15px]">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Category Navigator (Hardware accelerated slide only) */}
      <div 
        className={`w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-40 transition-all duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform pointer-events-auto ${
          showCategories ? 'translate-y-0 shadow-sm' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-20">
          <div className="flex items-center overflow-x-auto no-scrollbar py-3 space-x-8 md:space-x-10 lg:space-x-14">
            {categories.map((cat, i) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex flex-col items-center gap-2 transition-all min-w-fit whitespace-nowrap relative group cursor-pointer outline-none border-none bg-transparent hover:outline-none`}
                >
                  <div className={`p-1.5 rounded-[12px] transition-colors duration-200 ${isActive ? 'bg-[#f0f5ff] dark:bg-[#2874f0]/20' : 'group-hover:bg-[#f0f5ff] dark:group-hover:bg-[#2874f0]/10 bg-transparent'}`}>
                    <cat.icon 
                      size={22} 
                      className={`transition-colors duration-200 stroke-[1.5] ${isActive ? 'text-[#2874f0]' : 'text-[#212121] dark:text-gray-300 group-hover:text-[#2874f0]'}`} 
                    />
                  </div>
                  <span className={`text-[13px] tracking-tight transition-colors ${isActive ? 'text-[#2874f0] font-[800]' : 'text-[#212121] dark:text-gray-400 font-[600] opacity-90 group-hover:opacity-100 group-hover:text-[#2874f0]'}`}>
                    {cat.name}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="category-underline"
                      className="absolute -bottom-3 left-0 right-0 h-[3px] bg-[#2874f0] rounded-t-full shadow-[0_-2px_6px_rgba(40,116,240,0.3)] pointer-events-none" 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}

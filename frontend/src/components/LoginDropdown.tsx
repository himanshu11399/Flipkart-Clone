"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Sparkles, 
  Package, 
  Heart, 
  Store, 
  Award, 
  CreditCard, 
  Bell, 
  Headphones, 
  TrendingUp, 
  Download,
  ChevronDown
} from "lucide-react";

export default function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = null; // Removed Clerk user

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    { name: "My Profile", icon: User, href: "#" },
    { name: "Flipkart Plus Zone", icon: Sparkles, href: "#" },
    { name: "Orders", icon: Package, href: "/orders" },
    { name: "Wishlist", icon: Heart, href: "#" },
    { name: "Rewards", icon: Award, href: "#" },
    { name: "Gift Cards", icon: CreditCard, href: "#" },
  ];

  const moreItems = [
    { name: "Become a Seller", icon: Store, href: "#" },
    { name: "Notifications", icon: Bell, href: "#" },
    { name: "Customer Care", icon: Headphones, href: "#" },
    { name: "Advertise", icon: TrendingUp, href: "#" },
    { name: "Download App", icon: Download, href: "#" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl transition-all duration-300 group cursor-pointer border-none outline-none ${
          isOpen ? 'bg-[#2874f0] text-white shadow-md' : 'hover:bg-[#2874f0]/10 text-[#212121] dark:text-gray-200 dark:hover:bg-gray-800'
        }`}
      >
        <User size={22} className={isOpen ? "text-white" : "text-[#2874f0] group-hover:text-[#2874f0]"} />
        <span className="hidden sm:inline text-[15px] font-semibold">
          Customer
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'group-hover:rotate-180 text-[#2874f0]'}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-[320px] z-50"
          >
            {/* Caret pointing up */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 rotate-45 border-l border-t border-gray-900/5 dark:border-gray-700 shadow-[-2px_-2px_4px_rgba(0,0,0,0.02)] z-0 rounded-tl-sm"></div>

            {/* Main Card */}
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] ring-1 ring-gray-900/5 dark:ring-gray-700/50 overflow-hidden relative z-10">
              
                <div className="mx-2 mt-2 mb-1 p-3 bg-gradient-to-r from-blue-50/80 to-blue-50/40 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl transition-colors border border-blue-100/50 dark:border-blue-800/30 flex justify-between items-center group/banner">
                  <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">Explore Flipkart Plus</span>
                </div>

              {/* Menu List */}
              <div className="py-2 max-h-[400px] overflow-y-auto no-scrollbar pb-3">
                {menuItems.map((item, index) => (
                  <Link 
                    key={index}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#f0f5ff] dark:group-hover:bg-[#f0f5ff]/10 transition-colors">
                      <item.icon size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-[#2874f0] transition-colors group-hover:scale-110 duration-200" />
                    </div>
                    <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#212121] dark:group-hover:text-white transition-colors">{item.name}</span>
                  </Link>
                ))}
                
                <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200/60 to-transparent my-2 w-full" />
                
                {moreItems.map((item, index) => (
                  <Link 
                    key={index}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#f0f5ff] dark:group-hover:bg-[#f0f5ff]/10 transition-colors">
                      <item.icon size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-[#2874f0] transition-colors group-hover:scale-110 duration-200" />
                    </div>
                    <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#212121] dark:group-hover:text-white transition-colors">{item.name}</span>
                  </Link>
                ))}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Bell, Headphones, TrendingUp, ChevronDown, MoreVertical } from "lucide-react";

const menuItems = [
  {
    name: "Become a Seller",
    icon: Store,
    href: "#",
    description: "Sell on Flipkart",
  },
  {
    name: "Notification Settings",
    icon: Bell,
    href: "#",
    description: "Manage alerts",
  },
  {
    name: "24x7 Customer Care",
    icon: Headphones,
    href: "#",
    description: "We're always here",
  },
  {
    name: "Advertise on Flipkart",
    icon: TrendingUp,
    href: "#",
    description: "Grow your business",
  },
];

export default function MoreDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2 sm:px-4 py-2 rounded-xl transition-all duration-300 group cursor-pointer border-none outline-none ${
          isOpen ? "bg-[#2874f0] text-white shadow-md" : "hover:bg-[#2874f0]/10 text-[#212121] dark:text-gray-200 dark:hover:bg-gray-800"
        }`}
      >
        <MoreVertical 
          size={20} 
          className={`sm:hidden ${isOpen ? "text-white" : "text-[#2874f0] group-hover:text-[#2874f0]"}`} 
        />
        <span className="hidden sm:inline text-[15px] font-semibold">More</span>
        <ChevronDown
          size={16}
          className={`hidden sm:block transition-transform duration-300 ${
            isOpen ? "rotate-180 text-white" : "group-hover:rotate-180 text-[#2874f0]"
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-[calc(100%+0.5rem)] right-[-50px] sm:right-0 w-[240px] sm:w-[280px] z-50"
          >
            {/* Caret */}
            <div className="absolute -top-2 right-[60px] sm:right-6 w-4 h-4 bg-white dark:bg-gray-900 rotate-45 border-l border-t border-gray-900/5 dark:border-gray-800 z-0 rounded-tl-sm" />

            {/* Card */}
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] ring-1 ring-gray-900/5 dark:ring-gray-800 overflow-hidden relative z-10 py-2">
              {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#f0f5ff] dark:group-hover:bg-[#2874f0]/10 transition-colors flex-shrink-0">
                      <item.icon
                        size={18}
                        className="text-gray-500 dark:text-gray-400 group-hover:text-[#2874f0] transition-colors"
                      />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#212121] dark:group-hover:text-white transition-colors leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

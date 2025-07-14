"use client";

import { useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onSearchClick?: () => void;
  onForecastClick?: () => void;
}

export function Header({ onSearchClick, onForecastClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearchClick = () => {
    setIsMenuOpen(false);
    onSearchClick?.();
  };

  const handleForecastClick = () => {
    setIsMenuOpen(false);
    onForecastClick?.();
  };

  return (
    <header className="fixed top-6 left-6 right-6 z-50">
      <nav className="backdrop-blur-lg bg-black/20 border border-white/10 rounded-2xl px-6 py-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        {/* Logo - Cursor style */}
        <div className="flex items-center justify-between lg:justify-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-white"
          >
            Forecazt
          </motion.div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop Navigation - Cursor style */}
        <div className="hidden lg:flex items-center gap-8">
          <button 
            onClick={handleSearchClick}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Search
          </button>
          <button 
            onClick={handleForecastClick}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Forecast
          </button>
        </div>

        {/* Theme Toggle - Cursor style */}
        <div className="hidden lg:flex justify-end">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pt-4 border-t border-white/20"
            >
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleSearchClick}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors text-left"
                >
                  Search
                </button>
                <button 
                  onClick={handleForecastClick}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors text-left"
                >
                  Forecast
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white self-start"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

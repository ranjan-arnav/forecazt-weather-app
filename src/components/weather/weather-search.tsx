"use client";

import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherSearchProps {
  onSearch?: (city: string) => void;
}

export interface WeatherSearchRef {
  focus: () => void;
}

export const WeatherSearch = forwardRef<WeatherSearchRef, WeatherSearchProps>(
  ({ onSearch }, ref) => {
    const [city, setCity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }));

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!city.trim()) return;

      setIsLoading(true);
      try {
        onSearch?.(city.trim());
      } finally {
        setIsLoading(false);
      }
    };

    const handleQuickSearch = (quickCity: string) => {
      setCity(quickCity);
      onSearch?.(quickCity);
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-2xl p-4 flex items-center gap-4">
          <MapPin className="text-gray-300 flex-shrink-0" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-lg min-w-0"
          />
          <motion.button
            type="submit"
            disabled={isLoading || !city.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white p-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Search size={20} />
              </motion.div>
            ) : (
              <Search size={20} />
            )}
          </motion.button>
        </div>
      </form>

      {/* Quick access cities - Modern style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        {["New York", "London", "Tokyo", "Paris", "Mumbai"].map((quickCity) => (
          <button
            key={quickCity}
            onClick={() => handleQuickSearch(quickCity)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all border border-white/20 hover:border-white/40"
          >
            {quickCity}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
});

WeatherSearch.displayName = "WeatherSearch";

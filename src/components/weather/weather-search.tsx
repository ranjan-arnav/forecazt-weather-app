"use client";

import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { Search, MapPin, Clock, X } from "lucide-react";
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
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load recent searches from localStorage on component mount
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('weather-recent-searches');
        if (saved) {
          setRecentSearches(JSON.parse(saved));
        }
      }
    }, []);

    // Save recent searches to localStorage
    const saveRecentSearch = (searchCity: string) => {
      if (typeof window !== 'undefined') {
        const updated = [searchCity, ...recentSearches.filter(c => c !== searchCity)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('weather-recent-searches', JSON.stringify(updated));
      }
    };

    // Clear all recent searches
    const clearRecentSearches = () => {
      setRecentSearches([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('weather-recent-searches');
      }
    };

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
        const searchCity = city.trim();
        saveRecentSearch(searchCity);
        onSearch?.(searchCity);
      } finally {
        setIsLoading(false);
      }
    };

    const handleQuickSearch = (quickCity: string) => {
      setCity(quickCity);
      saveRecentSearch(quickCity);
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
        <div className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
          <MapPin className="text-gray-300 flex-shrink-0" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-base sm:text-lg min-w-0"
          />
          <motion.button
            type="submit"
            disabled={isLoading || !city.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white p-2.5 sm:p-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Search size={18} />
              </motion.div>
            ) : (
              <Search size={18} />
            )}
          </motion.button>
        </div>
      </form>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 sm:mt-8"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Clock className="text-gray-400" size={16} />
              <span className="text-gray-300 text-sm font-medium">Recent Searches</span>
            </div>
            <button
              onClick={clearRecentSearches}
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="Clear recent searches"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {recentSearches.map((recentCity, index) => (
              <motion.button
                key={`${recentCity}-${index}`}
                onClick={() => handleQuickSearch(recentCity)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all border border-white/20 hover:border-white/40 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Clock size={12} className="text-gray-400" />
                {recentCity}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Popular cities (shown when no recent searches) */}
      {recentSearches.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 sm:mt-8"
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <MapPin className="text-gray-400" size={16} />
            <span className="text-gray-300 text-sm font-medium">Popular Cities</span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
            {["New York", "London", "Tokyo", "Paris", "Mumbai"].map((quickCity, index) => (
              <motion.button
                key={quickCity}
                onClick={() => handleQuickSearch(quickCity)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all border border-white/20 hover:border-white/40"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {quickCity}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

WeatherSearch.displayName = "WeatherSearch";

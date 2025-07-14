import { Header } from "@/components/layout/header";
import { WeatherSearch } from "@/components/weather/weather-search";
import { WeatherDisplay } from "@/components/weather/weather-display";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section with Cursor-style design */}
      <section className="relative px-4 pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Background gradient animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Beautiful Weather
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Get real-time weather information for any city around the world with our elegant, responsive interface.
          </p>
          
          {/* Weather Search Component */}
          <WeatherSearch />
        </div>
      </section>

      {/* Weather Display Section */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <WeatherDisplay />
        </div>
      </section>

      <Footer />
    </main>
  );
}

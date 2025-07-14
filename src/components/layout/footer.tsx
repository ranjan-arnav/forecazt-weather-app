export function Footer() {
  return (
    <footer className="px-4 py-16 mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Forecazt
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Built to make you extraordinarily informed about weather patterns worldwide
            </p>
            <div className="mt-8 pt-6 border-t border-white/20 text-sm text-gray-400">
              © 2025 Forecazt. Built with Next.js, Tailwind CSS, and Open-Meteo API.<br />
              by arn4v, more at <a href="https://github.com/ranjan-arnav" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">https://github.com/ranjan-arnav</a>.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

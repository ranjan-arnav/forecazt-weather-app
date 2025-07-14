# Forecazt Weather App 🌤️

A modern, responsive weather application inspired by Cursor.com's design system. Built with Next.js, TypeScript, and Tailwind CSS.

![Weather App Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-38B2AC)

## ✨ Features

### 🌍 Weather Data
- **Real-time weather** from Open-Meteo API (no API key required)
- **Current conditions** with temperature, humidity, wind speed
- **24-hour forecasts** with interactive charts
- **7-day detailed forecasts** with precipitation and conditions
- **Global city search** with error handling

### 🎨 Design System
- **Cursor.com-inspired UI** with glassmorphism effects
- **Dark gradient themes** with backdrop blur
- **Responsive design** optimized for all devices
- **Smooth animations** with Framer Motion
- **Interactive charts** using Recharts library

### 🚀 Technical Stack
- **Next.js 14+** with App Router and TypeScript
- **Static export** ready for GitHub Pages
- **Mobile-first** responsive design
- **Performance optimized** with proper loading states
- **Accessibility compliant** with ARIA labels

## 🚀 Quick Deploy to GitHub Pages

### Option 1: Use the Deploy Script
```bash
# Run the automated deployment script
deploy.bat
```

### Option 2: Manual Deployment
1. Create a GitHub repository named `forecazt-weather-app`
2. Make it **public** (required for free GitHub Pages)
3. Run these commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/forecazt-weather-app.git
git push -u origin main
```
4. Enable GitHub Pages in repository Settings > Pages > GitHub Actions

**Your app will be live at:** `https://YOUR_USERNAME.github.io/forecazt-weather-app/`

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Generate static export
npm run export
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main weather app page
│   ├── layout.tsx            # Root layout with theme
│   └── globals.css           # Global styles
├── components/
│   ├── layout/
│   │   ├── header.tsx        # Navigation header
│   │   └── footer.tsx        # App footer
│   └── weather/
│       ├── weather-search.tsx    # City search component
│       ├── weather-charts.tsx    # Interactive charts
│       └── weather-forecast.tsx  # 7-day forecast
└── lib/
    └── fast-weather-service.ts   # Open-Meteo API service
```

## 🌐 API Integration

Uses [Open-Meteo API](https://open-meteo.com/):
- **No API key required** - completely free
- **Global coverage** with accurate forecasts
- **Comprehensive data** including temperature, precipitation, wind
- **Geocoding service** for city search

## 🎯 Features Overview

### Current Weather
- Temperature with "feels like"
- Weather conditions and icons
- Humidity, wind speed, visibility
- UV index and atmospheric pressure

### Interactive Charts
- 24-hour temperature trends
- Humidity and wind comparison
- Precipitation forecasts
- Responsive mobile design

### 7-Day Forecast
- Daily high/low temperatures
- Weather condition icons
- Precipitation probability
- Wind speed and direction

### User Experience
- Functional navigation with search focus
- Forecast section auto-scroll
- Loading states and error handling
- Mobile-optimized touch interactions

## 🔧 Configuration Files

- **`next.config.js`** - GitHub Pages static export setup
- **`.github/workflows/deploy.yml`** - Automated deployment
- **`tailwind.config.ts`** - Custom design system
- **`public/.nojekyll`** - GitHub Pages optimization

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest) 
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or personal use.

---

**Built with ❤️ using the Cursor.com design system philosophy**

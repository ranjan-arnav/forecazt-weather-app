# Weather App with Google Search Integration

A beautiful, modern weather application that fetches real weather data using Google search results, built with Next.js and inspired by Cursor.com's design system.

## 🌟 Features

### Weather Data Sources
1. **Google Search Weather** (Primary) - Scrapes weather data from Google search results
2. **OpenWeatherMap API** (Fallback) - Traditional weather API
3. **Mock Data** (Final Fallback) - Local weather data for testing

### User Interface
- **Glassmorphism Design** - Translucent cards with backdrop blur effects
- **Gradient Animations** - Smooth animated background gradients
- **Dark/Light Mode** - Toggle between themes with persistence
- **Temperature Units** - Switch between Celsius and Fahrenheit
- **Responsive Design** - Works perfectly on all devices
- **7-Day Forecast** - Extended weather predictions

### Search Functionality
- **City Search** - Search for any city worldwide
- **Quick Search** - Predefined popular cities
- **Real-time Results** - Instant weather updates

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open your browser:**
```
http://localhost:3000
```

## 🔧 Configuration

### Google Search Weather (Default)
The app automatically uses Google search to fetch weather data. No configuration needed!

### OpenWeatherMap API (Optional)
To use the traditional weather API as backup:

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Add to `.env.local` file:
```bash
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```
3. Restart the development server

## 🔍 How Google Search Weather Works

### API Endpoint
```
GET /api/weather/google?city=CityName
```

### Process
1. **Search Query** - Searches Google for "CityName weather"
2. **HTML Parsing** - Extracts weather data from Google's weather widget
3. **Data Processing** - Converts to standardized format
4. **Fallback Chain** - Falls back to OpenWeatherMap API, then mock data

### Data Extracted
- Current temperature
- Weather condition  
- Humidity percentage
- Wind speed
- Visibility
- Location information
- 7-day forecast (generated)

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles with Cursor design system
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Main weather app page
├── components/
│   ├── layout/
│   │   ├── header.tsx       # Navigation header with theme toggle
│   │   └── footer.tsx       # App footer
│   ├── providers/
│   │   └── theme-provider.tsx # Theme management
│   ├── weather/
│   │   ├── weather-search.tsx   # City search component
│   │   └── weather-display.tsx  # Weather information display
│   └── ui/                  # Reusable UI components
```

## 🎨 Design System

### Color Palette
- **Brand Colors**: Blue gradient system (50-900)
- **Accent Colors**: Orange gradient system (50-900)
- **Theme Support**: Automatic dark/light mode adaptation

### Typography
- **Font**: Inter for clean, modern readability
- **Sizes**: Responsive typography scale
- **Weights**: 400-700 for proper hierarchy

### Animations
- **Blob Animation**: Floating background elements
- **Gradient Animation**: Moving background gradients
- **Hover Effects**: Interactive button states
- **Page Transitions**: Smooth component mounting

### Components
- **Glass Effects**: Backdrop blur with border styling
- **Button System**: Cursor-style interactive buttons
- **Cards**: Glassmorphism weather information cards
- **Navigation**: Fixed header with rounded design

## 🌐 API Integration

Currently uses mock data for demonstration. To integrate with a real weather API:

1. Sign up for a weather service (OpenWeatherMap, WeatherAPI, etc.)
2. Add your API key to environment variables
3. Update the `WeatherDisplay` component to fetch real data
4. Implement error handling and loading states

### Environment Variables
```env
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
NEXT_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

## 🔧 Customization

### Adding New Weather Features
1. Extend the `WeatherData` interface
2. Update the `WeatherDisplay` component
3. Add new icons and animations

### Modifying the Design System
1. Update `tailwind.config.ts` for new colors/animations
2. Modify `globals.css` for new glass effects
3. Extend the theme provider for additional modes

## 📱 Responsive Design

- **Mobile**: Optimized for touch interactions
- **Tablet**: Balanced layout with grid adjustments
- **Desktop**: Full-featured layout with hover effects
- **Custom Breakpoints**: `xs: 475px` for better mobile control

## 🎭 Animations & Interactions

- **Loading States**: Spinning animations and skeleton screens
- **Hover Effects**: Radial gradient masks and scale transforms
- **Page Transitions**: Smooth enter/exit animations
- **Gesture Support**: Touch-friendly interactions

## 🧪 Performance

- **Static Generation**: Pre-rendered pages for fast loading
- **Code Splitting**: Automatic chunk optimization
- **Image Optimization**: Next.js image optimization
- **CSS Optimization**: Tailwind CSS purging

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **Cursor.com** for the inspiration and design patterns
- **Next.js Team** for the excellent framework
- **Tailwind CSS** for the utility-first styling approach
- **Framer Motion** for smooth animations
- **Lucide** for the beautiful icon system

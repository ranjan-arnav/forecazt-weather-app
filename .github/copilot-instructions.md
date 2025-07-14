<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Weather App with Modern Design System

This is a Next.js weather application that features a sleek, modern design system.

## Design System Guidelines

### Modern Architecture Principles
- **Glassmorphism**: Use backdrop-blur effects and translucent elements
- **Gradient Backgrounds**: Complex layered gradients with CSS variables
- **Interactive Animations**: Canvas-based hero animations, smooth transitions
- **Theme System**: Comprehensive dark/light mode support with custom tab selectors
- **Responsive Design**: Mobile-first approach with custom breakpoints

### Component Architecture
- **Layout**: Fixed header with rounded design, grid-based navigation
- **Cards**: Feature cards with glassmorphism effects and hover interactions
- **Buttons**: Complex layered button system with gradient overlays
- **Forms**: Clean input fields with focus states and animations

### Styling Conventions
- Use Tailwind CSS utility classes extensively
- Implement CSS variables for dynamic styling (--mask-x, --mask-y)
- Follow modern brand color tokens and spacing system
- Include motion-reduce preferences for accessibility
- Implement radial gradient masks on interactive elements

### Technical Stack
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Weather API** integration

### Weather App Features
- City search functionality
- Current weather display with condition icons
- Temperature unit toggle (Celsius/Fahrenheit)
- Responsive design across all devices
- Loading states and error handling
- Theme switching capability

### Code Quality
- Use TypeScript interfaces for all data structures
- Implement proper error boundaries
- Follow React best practices for state management
- Use semantic HTML and ARIA labels for accessibility
- Optimize images and assets for performance

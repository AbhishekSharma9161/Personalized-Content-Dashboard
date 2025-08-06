# ContentHub Dashboard 🚀

<div align="center">
  
  **A modern, responsive content dashboard with drag-and-drop functionality**
  
  Built with React 18, TypeScript, Tailwind CSS, and Framer Motion

  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4.11-blue?style=flat-square&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-6.2.2-blue?style=flat-square&logo=vite" alt="Vite" />

</div>

---

## 🖼️ Screenshots

### Desktop View

<img width="1901" height="888" alt="Image" src="https://github.com/user-attachments/assets/a2352fa8-bdc1-4661-b43d-b783847db25a" />



### Mobile View

<img width="548" height="801" alt="Image" src="https://github.com/user-attachments/assets/062f7b62-a6ab-40da-ae4a-ad9056cc99d9" />

---

## ✨ Features

### 🎯 **Core Functionality**

- **Personalized Content Feed** - Curated content based on user preferences
- **Interactive Content Cards** - Beautiful cards with images, descriptions, and ratings
- **Multi-Source Content** - News articles, movies, and social media posts
- **Smart Categorization** - Technology, Sports, Entertainment, Business, Science, Health, and more

### 🎨 **User Experience**

- **Drag & Drop Reordering** - Intuitive content organization in feed section
- **Advanced Search** - Real-time search with debounced filtering
- **Section Navigation** - Feed, Trending, and Favorites with smooth transitions
- **Favorites System** - Save and manage your favorite content
- **Dark/Light Mode** - Beautiful theme switching with system preference detection

### 📱 **Responsive Design**

- **Mobile-First** - Optimized for all screen sizes (320px to 4K+)
- **Touch-Friendly** - Optimized interactions for mobile and tablet
- **Adaptive Layout** - Dynamic grid system that adjusts to screen size
- **Progressive Enhancement** - Works beautifully on any device

### 🎭 **Animations & Interactions**

- **Smooth Transitions** - Framer Motion powered animations
- **Hover Effects** - Interactive feedback on all elements
- **Loading States** - Beautiful loading spinners and skeleton screens
- **Micro-interactions** - Delightful details that enhance UX

### ⚙️ **Customization**

- **User Preferences** - Customizable content categories and display options
- **Settings Panel** - Comprehensive settings with tabs for different options
- **Notifications System** - Real-time notifications with badge counters
- **Persistent Storage** - Preferences saved across sessions

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd contenthub-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:8080
   ```

---

## 📦 Available Scripts

### Development

```bash
npm run dev          # Start development server with backend
npm run build        # Build for production
npm start            # Start production server
```

### Testing

```bash
npm run test:unit            # Run unit tests
npm run test:unit:watch      # Run unit tests in watch mode
npm run test:unit:coverage   # Run unit tests with coverage
npm run test:e2e             # Run end-to-end tests
npm run test:e2e:ui          # Run E2E tests with UI
npm run test:all             # Run all tests
```

### Code Quality

```bash
npm run typecheck    # Type checking
npm run format       # Format code with Prettier
```

---

## 🏗️ Project Structure

```
contenthub-dashboard/
├── client/               # Frontend React application
│   ├── components/       # React components
│   │   ├── Layout/       # Layout components
│   │   ├── Settings/     # Settings panel
│   │   ├── Notifications/# Notifications system
│   │   └── ui/          # Reusable UI components
│   ├── pages/           # Main page components
│   ├── store/           # Redux store & state management
│   │   ├── slices/      # Redux slices
│   │   ├── api/         # RTK Query API
│   │   └── middleware/  # Custom middleware
│   ├── main.tsx         # Application entry point
│   ├── App.tsx          # Main app component
│   └── global.css       # Global styles & Tailwind
├── src/                 # Mirrored source structure
├── tests/               # Testing files
���   ├── e2e/            # End-to-end tests
│   └── __tests__/      # Unit & integration tests
├── server/              # Express backend (optional)
├── public/              # Static assets
├── jest.config.js       # Jest configuration
├── playwright.config.ts # Playwright E2E config
├── tailwind.config.ts   # Tailwind CSS config
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies & scripts
```

---

## 🛠️ Technology Stack

### **Frontend Framework**

- **React 18.3.1** - Modern React with concurrent features
- **TypeScript 5.5.3** - Type-safe development
- **Vite 6.2.2** - Lightning-fast build tool

### **State Management**

- **Redux Toolkit 2.8.2** - Predictable state container
- **RTK Query** - Powerful data fetching and caching
- **React Redux** - Official React bindings for Redux

### **Styling & UI**

- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful SVG icons
- **Framer Motion 12.6.2** - Production-ready motion library

### **Functionality**

- **@hello-pangea/dnd** - Beautiful drag and drop (React 18 compatible)
- **React Router 6** - Declarative routing
- **React Hook Form** - Performant forms
- **Date-fns** - Modern date utility library

### **Testing**

- **Jest** - JavaScript testing framework
- **React Testing Library** - Simple and complete testing utilities
- **Playwright** - Cross-browser end-to-end testing
- **User Event** - Fire events the same way the user does

---

## 🎯 Key Features Deep Dive

### **Drag & Drop System**

- Powered by `@hello-pangea/dnd` (React 18 compatible)
- Smooth animations and visual feedback
- Dark Mode: Implement dark mode toggle using CSS custom properties and Tailwind CSS.
- Works only in Feed section for better UX
- Touch-friendly for mobile devices

### **State Management Architecture**

```typescript
// Redux store structure
{
  userPreferences: {
    categories: string[],
    language: string,
    darkMode: boolean,
    layout: 'grid' | 'list'
  },
  content: {
    feed: ContentItem[],
    favorites: ContentItem[],
    trending: ContentItem[]
  },
  ui: {
    activeSection: string,
    sidebarOpen: boolean,
    theme: 'light' | 'dark'
  }
}
```

### **Responsive Breakpoints**

- **Mobile**: 320px - 639px (1 column)
- **Tablet**: 640px - 1023px (2 columns)
- **Desktop**: 1024px - 1279px (3 columns)
- **Large**: 1280px+ (4 columns)

### **Performance Optimizations**

- **Code Splitting** - Lazy loading for optimal bundle size
- **Memoization** - React.memo and useMemo for expensive operations
- **Debounced Search** - Optimized search performance
- **Image Optimization** - Lazy loading and responsive images

---

## 🧪 Testing Strategy

### **Unit Tests** (Jest + React Testing Library)

- Component rendering and behavior
- User interaction simulation
- State management logic
- Edge cases and error scenarios

### **Integration Tests**

- Component interaction flows
- API data fetching and error handling
- Local storage persistence
- Theme switching functionality

### **End-to-End Tests** (Playwright)

- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility compliance

### **Running Tests**

```bash
# Unit tests with coverage
npm run test:unit:coverage

# E2E tests with visual debugging
npm run test:e2e:ui

# All tests in CI/CD pipeline
npm run test:all
```

---

## 🎨 Customization

### **Theme Customization**

Modify `tailwind.config.ts` to customize colors and styling:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      // Add your custom colors
    },
  },
}
```

### **Content Categories**

Add new categories in `client/components/Settings/SettingsPanel.tsx`:

```typescript
const availableCategories = [
  { id: "technology", label: "Technology", icon: "💻", color: "bg-blue-500" },
  {
    id: "your-category",
    label: "Your Category",
    icon: "🎯",
    color: "bg-purple-500",
  },
  // Add more categories
];
```

### **API Integration**

Replace mock data with real APIs in `client/store/api/contentApi.ts`:

```typescript
// Example: News API integration
const response = await fetch(
  `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&category=${category}`,
);
```

---

## 🔧 Configuration

### **Environment Variables**

Create a `.env` file for API keys and configuration:

```env
VITE_NEWS_API_KEY=your_news_api_key
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_APP_TITLE=ContentHub Dashboard
```

### **Vite Configuration**

The project uses Vite for fast development and building:

```typescript
// vite.config.ts
export default defineConfig({
  server: { port: 8080 },
  build: { outDir: "dist/spa" },
  resolve: { alias: { "@": path.resolve(__dirname, "./client") } },
});
```

---

## 📱 Mobile Features

The dashboard is fully responsive and includes:

### **Touch Gestures**

- **Swipe Navigation** - Intuitive section switching
- **Touch Drag** - Drag and drop on touch devices
- **Tap Interactions** - Optimized for touch input

### **Mobile Layout**

- **Collapsible Sidebar** - Hidden by default on mobile
- **Adaptive Grid** - Single column on mobile, multi-column on larger screens
- **Touch-Friendly Spacing** - Optimized for thumb navigation

---

## 🚀 Deployment

### **Vercel (Recommended)**

```bash
npm install -g vercel
vercel --prod
```

### **Netlify**

```bash
npm run build
# Upload dist/ folder to Netlify
```

### **Traditional Server**

```bash
npm run build
npm start
# Serves on port 8080
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**

- **TypeScript** - Strict mode enabled
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Testing** - Unit and E2E tests required

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.



<div align="center">
  <p>Built with ❤️ By Abhishek Sharma</p>
  <p>
    <a href="#">⭐ Star us on GitHub</a> •
    <a href="#">🐦 Follow on Twitter</a> •
    <a href="#">💬 Join Discord</a>
  </p>
</div>

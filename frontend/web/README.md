# 🌐 Logity Landing Page & Web App

A modern, responsive landing page and web application for Logity's AI-powered automotive log analysis platform.

## 🚀 Quick Start

```powershell
# From project root
cd frontend/web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` (or next available port) to see the landing page.

## 🛠️ Tech Stack

- **Vite**: Fast build tool and development server
- **HTML5/CSS3**: Modern web standards
- **Vanilla JavaScript**: Lightweight, framework-free interactions
- **TailwindCSS**: Utility-first CSS framework
- **PostCSS**: CSS processing and optimization
- **Responsive Design**: Mobile-first approach

## 📦 Available Scripts

```powershell
# Development
pnpm dev              # Start Vite development server

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build locally

# Code Quality
pnpm format           # Format code with Prettier
```

## 🏗️ Project Structure

```
frontend/web/
├── src/
│   ├── styles/
│   │   └── main.css          # Main stylesheet with custom CSS variables
│   └── js/
│       └── main.js           # JavaScript interactions
├── public/                   # Static assets
├── index.html               # Main landing page
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## 🎨 Design System

### Color Palette

The landing page uses a warm, professional color scheme inspired by automotive engineering:

```css
:root {
  --bg-primary: #f5e6d3; /* Warm beige background */
  --bg-secondary: #f0e4d7; /* Secondary background */
  --text-primary: #2d1b0e; /* Deep brown headings */
  --text-secondary: #5d4037; /* Medium brown body text */
  --accent-primary: #8b4513; /* Warm brown buttons */
  --accent-hover: #a0522d; /* Hover states */
}
```

### Features

- **TikTok-style scroll snapping**: Full-screen sections with smooth navigation
- **Responsive grid layouts**: Adaptive card grids for different screen sizes
- **Interactive hover effects**: Smooth animations and transitions
- **Custom scrollbars**: Themed scrollbar styling
- **Mobile-optimized**: Touch-friendly interactions

## 🔧 Development Workflow

### 1. Local Development

```powershell
# Start the development server
pnpm dev

# The server will automatically:
# - Hot reload on file changes
# - Optimize dependencies
# - Serve on available port
```

### 2. Building for Production

```powershell
# Create optimized production build
pnpm build

# Preview the production build
pnpm preview
```

### 3. Code Formatting

```powershell
# Format all files with Prettier
pnpm format
```

## 📱 Responsive Breakpoints

The landing page is optimized for all device sizes:

- **Mobile**: `< 768px` - Single column layout, touch-optimized
- **Tablet**: `768px - 1024px` - Two-column grids, adapted spacing
- **Desktop**: `> 1024px` - Multi-column layouts, full features
- **Large Desktop**: `> 1200px` - Optimized for wide screens

## 🚀 Deployment

The web app generates static files that can be deployed to any hosting service:

### Recommended Platforms

- **Vercel**: Zero-config deployment with Git integration
- **Netlify**: Drag-and-drop deployment with form handling
- **Cloudflare Pages**: Fast global CDN with edge computing
- **GitHub Pages**: Free hosting for open source projects

### Build Output

```powershell
pnpm build
# Generates optimized files in dist/ directory:
# ├── index.html
# ├── assets/
# │   ├── main-[hash].css
# │   └── main-[hash].js
# └── [other static assets]
```

## 🎯 Key Features

### Landing Page Sections

1. **Hero Section**: Main value proposition with call-to-action
2. **Featured Updates**: Interactive cards showcasing platform features
3. **Mission Statement**: Company vision and statistics
4. **Call-to-Action**: Download links and contact information

### Interactive Elements

- **Scroll Navigation**: Dot indicators for section navigation
- **Feature Cards**: Hover effects and modal details
- **Responsive Navigation**: Mobile-friendly header
- **Smooth Animations**: CSS transitions and keyframe animations

## 🔍 SEO & Performance

### Optimizations

- **Semantic HTML**: Proper heading hierarchy and structure
- **Meta Tags**: Open Graph and Twitter Card support
- **Performance**: Optimized images and CSS
- **Accessibility**: ARIA labels and keyboard navigation
- **Mobile-First**: Responsive design principles

### Lighthouse Scores Target

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 95+

## 🐛 Troubleshooting

### Development Issues

```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item pnpm-lock.yaml
pnpm install
pnpm dev
```

### Build Issues

```powershell
# Clean build directory
Remove-Item -Recurse -Force dist
pnpm build
```

### Common Problems

**Port Already in Use:**

- Vite automatically finds the next available port
- Check console output for the actual URL

**CSS Not Loading:**

- Ensure TailwindCSS is properly configured
- Check `vite.config.js` for CSS processing

**Assets Not Found:**

- Verify file paths in `public/` directory
- Check Vite asset handling configuration

## 🤝 Contributing

1. Make changes to HTML, CSS, or JavaScript files
2. Test locally with `pnpm dev`
3. Format code with `pnpm format`
4. Build to verify: `pnpm build`
5. Test production build: `pnpm preview`

## 📚 Documentation

- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [PostCSS Documentation](https://postcss.org/)

---

**Part of the Logity monorepo** - See [main README](../../README.md) for project overview.

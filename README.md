# 🌐 Logity Landing Page & Web Application

**AI-Powered Automotive Log Analysis Platform**

A modern, responsive landing page and web application for Logity - the AI-powered tool that analyzes automotive logs (CAN, DoIP, DLT), detects faults, and delivers plain-language explanations and fixes, streamlining debugging for engineers.

## 🏗️ Project Overview

This is the **frontend web component** of the Logity platform, providing:

- **Landing Page**: Modern, responsive landing page showcasing Logity's capabilities
- **Web Application**: Browser-based interface for automotive log analysis
- **User Interface**: Clean, intuitive design built with modern web technologies
- **Integration Ready**: API integration with Logity's backend services

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18 or higher [Download](https://nodejs.org/)
- **pnpm**: Package manager `npm install -g pnpm` [Installation](https://pnpm.io/installation)

### Installation & Development

```bash
# Clone and navigate to the project
git clone https://github.com/yourusername/logity-web.git
cd logity-web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000/`

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with hot reload
pnpm preview      # Preview production build locally

# Building
pnpm build        # Build for production
pnpm format       # Format code with Prettier

# Deployment
pnpm build && pnpm preview  # Build and test before deployment
```

## 🛠️ Tech Stack

### Core Technologies

- **Vite**: Lightning-fast build tool and development server
- **HTML5/CSS3**: Modern web standards and semantic markup
- **JavaScript (ES6+)**: Modern JavaScript features and modules
- **TailwindCSS**: Utility-first CSS framework for rapid UI development

### Integrations

- **Supabase**: Backend-as-a-Service for authentication and data
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Modern Web APIs**: File handling, drag-and-drop, and more

### Development Tools

- **Prettier**: Consistent code formatting
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic vendor prefixing

## 📁 Project Structure

```
frontend/
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── styles/            # CSS stylesheets and TailwindCSS
│   ├── services/          # API integration and business logic
│   └── config/            # Configuration files
├── public/                # Static assets
│   ├── images/            # Images and icons
│   ├── favicon.ico        # Site favicon
│   └── robots.txt         # SEO configuration
├── index.html             # Main HTML entry point
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # TailwindCSS configuration
├── package.json           # Dependencies and scripts
├── .env.local.example     # Environment variables template
└── README.md              # This file
```

## ⚙️ Configuration

### Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_BASE_URL=http://localhost:8000  # Backend API URL
VITE_ENVIRONMENT=development
```

### Customization

**Styling**: Modify `tailwind.config.js` to customize colors, fonts, and design tokens.

**Components**: Add new components in `src/components/` following the existing patterns.

**API Integration**: Update `src/services/` to integrate with your backend services.

## 🎯 Key Features

### Landing Page Features

- **Hero Section**: Clear value proposition and call-to-action
- **Feature Showcase**: Highlight key Logity capabilities
- **Protocol Support**: Visual representation of supported automotive protocols
- **Interactive Demo**: Live demonstration of log analysis capabilities
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Web Application Features

- **File Upload**: Drag-and-drop interface for automotive log files
- **Real-time Analysis**: Live processing status and results
- **Interactive Visualizations**: Charts and graphs for log data
- **Export Capabilities**: Download results in various formats
- **User Dashboard**: Personalized experience and history

### Supported Automotive Protocols

- **CAN Bus**: Controller Area Network protocol analysis
- **DoIP**: Diagnostics over Internet Protocol
- **DLT**: Diagnostic Log and Trace
- **PCAP**: Packet capture file processing
- **LIN**: Local Interconnect Network

## 🚀 Deployment

### Production Build

```bash
# Create optimized production build
pnpm build

# Test production build locally
pnpm preview
```

### Deployment Options

**Static Hosting** (Recommended):

- **Vercel**: `vercel --prod`
- **Netlify**: Deploy `dist/` directory
- **Cloudflare Pages**: Connect repository for automatic deployments
- **GitHub Pages**: Deploy from `dist/` directory

**Custom Server**:

- Deploy `dist/` directory to any web server
- Ensure proper MIME types for assets
- Configure routing for single-page application

### Environment-Specific Builds

```bash
# Development
VITE_ENVIRONMENT=development pnpm build

# Staging
VITE_ENVIRONMENT=staging pnpm build

# Production
VITE_ENVIRONMENT=production pnpm build
```

## 🔧 Development Workflow

### File Organization

- **Components**: Keep components small and focused (< 200 lines)
- **Styles**: Use TailwindCSS utility classes, extract complex patterns to components
- **Services**: Separate API calls and business logic from UI components
- **Assets**: Optimize images and use appropriate formats (WebP, SVG)

### Code Quality

```bash
# Format code
pnpm format

# Check for common issues
npm run lint  # If linting is configured

# Type checking (if using TypeScript)
npm run check  # If TypeScript is configured
```

### Performance Optimization

- **Lazy Loading**: Load components and assets on demand
- **Image Optimization**: Use responsive images and modern formats
- **Bundle Analysis**: Monitor bundle size and eliminate unused code
- **Caching**: Leverage browser caching for static assets

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**

```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
pnpm dev --port 3001
```

**Dependencies Issues:**

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Build Errors:**

```bash
# Clean build cache
rm -rf dist
pnpm build
```

**Environment Variables Not Loading:**

- Ensure `.env.local` exists and variables start with `VITE_`
- Restart development server after adding new variables
- Check that variables are properly imported in `vite.config.js`

### Performance Issues

**Slow Development Server:**

- Check for unnecessary watchers or large files in `public/`
- Consider excluding `node_modules` from file watchers
- Use `--host` flag if running in containers

**Large Bundle Size:**

- Analyze bundle with `pnpm build && npx vite-bundle-analyzer dist/`
- Remove unused dependencies
- Use dynamic imports for large components

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Responsive Design**: Test on mobile, tablet, and desktop
- [ ] **Cross-browser**: Test on Chrome, Firefox, Safari, Edge
- [ ] **File Upload**: Verify drag-and-drop functionality
- [ ] **API Integration**: Test with backend services
- [ ] **Performance**: Check loading times and interactions
- [ ] **Accessibility**: Verify keyboard navigation and screen readers

### Load Testing

```bash
# Install lighthouse CLI
npm install -g lighthouse

# Run performance audit
lighthouse http://localhost:3000 --view
```

## 🤝 Contributing

### Development Guidelines

1. **Follow the established code style** (Prettier configuration)
2. **Keep components small and focused** (< 200 lines)
3. **Write descriptive commit messages**
4. **Test thoroughly before submitting PRs**
5. **Update documentation** for new features

### Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper documentation
4. Test thoroughly across different devices/browsers
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request with detailed description

## 📊 Analytics & Monitoring

### Performance Metrics

- **Core Web Vitals**: LCP, FID, CLS monitoring
- **User Analytics**: Page views, user interactions
- **Error Tracking**: JavaScript errors and API failures
- **Load Times**: Page load and asset loading performance

### SEO Optimization

- **Meta Tags**: Proper title, description, and Open Graph tags
- **Sitemap**: Auto-generated sitemap for search engines
- **Schema Markup**: Structured data for better search visibility
- **Performance**: Fast loading times and mobile optimization

## 📄 License

This project is licensed under the [Logity Repository License](../LICENSE.md). Please read and acknowledge the license before contributing.

## 🆘 Support & Documentation

- **Main Documentation**: [../docs/](../docs/)
- **API Documentation**: Backend API reference
- **Component Documentation**: [src/components/README.md](src/components/README.md)
- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Community support and questions

## 🔗 Related Projects

- **Logity Desktop**: Native desktop application with advanced features
- **Logity Backend**: Python FastAPI backend with AI processing
- **Logity Shared**: Shared utilities and configurations

---

**Built for automotive engineers who demand precision in their debugging workflow.**

_Visit [logity.com](https://logity.com) to learn more about our AI-powered automotive log analysis platform._

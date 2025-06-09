# CSS Organization for Logity Labs

## Overview

The CSS has been reorganized into modular files for better maintainability and organization.

## File Structure

```
frontend/src/styles/
├── index.css       # Main entry point - imports all CSS modules
├── main.css        # Base styles, variables, typography, modals, page layouts
├── navbar.css      # All navigation/header related styles
├── footer.css      # All footer related styles
├── docs.css        # Documentation page specific styles
└── main-old.css    # Backup of original monolithic CSS file
```

## Usage

### In HTML Files

```html
<link rel="stylesheet" href="/src/styles/index.css" />
```

### In JavaScript/TypeScript

```javascript
import "/src/styles/index.css";
```

## What's in Each File

### `index.css`

- Main entry point that imports all other CSS files
- Ensures correct import order for CSS cascade
- Use this file in your HTML/JS imports

### `main.css`

- CSS custom properties (variables) for the design system
- Base styles and typography
- Button styles
- Layout utilities (containers, sections)
- Hero section styles
- Modal system (standardized across the app)
- Page-specific styles (mission, stats, pricing, etc.)
- Responsive design utilities

### `navbar.css`

- Fixed navigation header styles
- Logo and navigation links
- Mobile hamburger menu
- Mobile navigation drawer
- Navigation responsive design
- Logo sizing utilities

### `footer.css`

- Footer layout and styling
- Footer links and sections
- Footer logo and copyright
- Footer responsive design

## Benefits of This Organization

1. **Modularity**: Each component's styles are isolated
2. **Maintainability**: Easier to find and edit specific component styles
3. **Performance**: Can selectively load only needed CSS in the future
4. **Collaboration**: Multiple developers can work on different components
5. **Cleaner main.css**: Focuses on base styles and page layouts

## Import Order

The order in `index.css` is important:

1. `main.css` - Base styles and variables first
2. `navbar.css` - Component styles
3. `footer.css` - Component styles

This ensures CSS cascade works correctly and variables are available to all components.

## Migration Notes

- All HTML files have been updated to use `index.css` instead of `main.css`
- All existing functionality is preserved
- No breaking changes to existing styles
- Original `main.css` content has been preserved in `main-old.css` as backup

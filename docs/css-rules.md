# CSS Best Practices for Single-Page Apps with Dynamic Layouts

## Table of Contents

- [CSS Methodologies](#css-methodologies)
- [Media Queries and Responsiveness](#media-queries-and-responsiveness)
- [CSS Preprocessors](#css-preprocessors)
- [CSS-in-JS or Styled Components](#css-in-js-or-styled-components)
- [Optimize and Remove Unused CSS](#optimize-and-remove-unused-css)
- [Lazy Loading of Styles](#lazy-loading-of-styles)
- [CSS Grid and Flexbox](#css-grid-and-flexbox)
- [CSS Optimization Tools](#css-optimization-tools)
- [Component-Based Design](#component-based-design)

---

## CSS Methodologies

When working on large projects, it is essential to follow a **CSS methodology** to keep your code clean, modular, and maintainable. Common methodologies include:

### BEM (Block Element Modifier)

- Break down styles into logical blocks and their components. For example, a button component could be represented as:
  - `.btn` for the base button
  - `.btn-primary` for a primary button style
  - `.btn--large` for a large button variation

### OOCSS (Object-Oriented CSS)

- Separate the structure of elements (e.g., buttons) from their styling (e.g., color, size).
- Example:
  - `.button` for structure (width, height, padding)
  - `.btn-primary` for style (background color, border)

### SMACSS (Scalable and Modular Architecture for CSS)

- Categorizes CSS rules into five types: Base, Layout, Module, State, and Theme.
- Helps organize your styles in a way that scales as your project grows.

---

## Media Queries and Responsiveness

### Mobile-First Approach

- Start by designing for mobile devices and scale up using media queries for larger devices.
- This results in smaller and more manageable CSS files.

### Reusable Media Queries

- Use variables or mixins for common breakpoints, making it easier to reuse styles across media queries.
- Example:

  ```scss
  @mixin media-query($breakpoint) {
    @media (min-width: $breakpoint) {
      @content;
    }
  }

  .example {
    @include media-query(768px) {
      font-size: 18px;
    }
  }
  ```

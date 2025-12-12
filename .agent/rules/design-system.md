---
trigger: always_on
---

# Premium Design System

## 1. Typography
*   **Font**: Inter (sans-serif) + Fira Code (mono).
*   **Headings**:
    *   H1: Gradient Text (`bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent`).
    *   H2: White text, border-bottom separator.
*   **Prose**: Large base size (18px), relaxed line-height (1.8).

## 2. Glassmorphism
*   **Utility**: `.glass` or `.glass-card`.
*   **CSS**:
    *   Background: `rgba(255, 255, 255, 0.05)`
    *   Border: `1px solid rgba(255, 255, 255, 0.1)`
    *   Backdrop Filter: `blur(12px)`

## 3. Colors
*   **Background**: Slate-900 (`#0f172a`)
*   **Primary Accent**: Blue-500 (`#3b82f6`)
*   **Secondary Accent**: Purple-500 (`#a855f7`)
*   **Text**: Slate-100 (`#f1f5f9`) for headings, Slate-300 (`#cbd5e1`) for body.

# Virtual Sachin - The Digital Twin

> "Complexity is the enemy of execution."

This is the source code for [virtualsach.github.io](https://virtualsach.github.io), a high-performance personal portfolio and digital garden built for a Modern Technocrat. It serves as a repository of "War Stories" from 20+ years of Infrastructure & Cloud Architecture.

## 🚀 Technology Stack

Built for speed, scored **100/100** on Lighthouse, and designed with a "No-JavaScript-bloat" philosophy.

* **Framework**: [Astro v5](https://astro.build) (Static Site Generation).
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + Custom Glassmorphism.
* **Interactivity**: Vanilla TS + Astro View Transitions (Zero-Framework Architecture).
* **Deployment**: GitHub Pages (via GitHub Actions).

## 🎨 Design System: "The Technocrat"

The site features a bespoke design system capable of standing out in a sea of generic portfolios.

* **Aesthetic**: Dark Mode, Glassmorphism, Cybernetic Gradients.
* **Typography**: Inter (UI) + Fira Code (Technical Data).
* **Visuals**:
  * **Cybernetic Grid**: A subtle, animated canvas background.
  * **View Transitions**: Native SPA-like navigation with cross-fades.
  * **Interactive Timeline**: Vertical career history with scroll animations.

## 🛠️ Key Features

### 1. Command Palette (`Cmd+K`)

A developer-first navigation modal. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) anywhere to:

* Jump to Projects or Blogs.
* Access external links (GitHub, LinkedIn).
* Execute actions (Email).

### 2. High-Readability Content Standard

All content follows a strict editorial format designed for scannability:

* **The 2-3-1 Rule**: Short paragraphs, 1 idea per block.
* **Visual Anchors**: Bold concepts, clearly defined "Key Takeaways".
* **War Stories**: Content is not generic tutorials; it is grounded in real-world outages and architecture battles.

## 📂 Project Structure

```text
/
├── .github/workflows  # CI/CD Pipeline
├── src/
│   ├── components/    # UI Building Blocks (CommandPalette, Timeline, etc.)
│   ├── content/       # MDX Content (Blog & Projects)
│   ├── layouts/       # Global Layouts (Base HTML, Head)
│   ├── pages/         # Astro Routing
│   └── styles/        # Global Tailwind CSS
└── astro.config.mjs   # Configuration
```

## 🧞 Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |

## 📄 License

MIT License. Feel free to fork and adapt for your own portfolio.

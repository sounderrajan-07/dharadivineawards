# Dhara Foundations — Promotional Page Design System & Master Prompt

This document serves as the authoritative design system specification and copy-paste AI prompt for developers or AI assistants creating promotional landing pages, campaign microsites, or new features for **Dhara Foundations**.

---

## Part 1: Copy-Paste Master Prompt for Your Teammate / AI Developer

Copy the prompt block below inside the code block and provide it directly to any AI coding assistant (or use it as a developer specification checklist) when creating promotional pages:

```markdown
You are building a high-converting, state-of-the-art promotional landing page for **Dhara Foundations**, a premier non-profit trust dedicated to Sanatana Dharma revival, temple restoration, community socio-cultural elevation, and holistic welfare across Tamil Nadu.

Your task is to build this promotional page in React/Next.js and Tailwind CSS while strictly adhering to Dhara Foundations' established design system, brand colors, 3-font typography system, and Framer Motion animation principles.

═══════════════════════════════════
1. COLOR PALETTE & DESIGN TOKENS
═══════════════════════════════════
• Primary Solid Accent: `#9A8678` (Earthy Taupe-Brown) — Used for primary buttons, active badges, and highlight borders.
• Deep Forest (Dark Primary): `#0A3A2A` / `#082B2B` — Used for hero sections, dark cards, banners, and strong typography.
• Saffron Glow (Spiritual Highlight): `#F3A712` / `#F59E0B` — Used for glowing badges, star ratings, spiritual icons, and CTA accents.
• Warm Cream Background (Page Surface): `#F9F7F2` — The default light page background (never use harsh pure white `#FFFFFF` for the page background).
• Card Surfaces: `#FFFFFF` or `#F4EFE6` with subtle borders (`border border-[#D9CBB0]/60` or `border-outline-variant/30`).
• Text Colors: Primary headers in `#1A231E` (`text-deep-forest`), body copy in `#4A534D` (`text-on-surface-variant`).

═══════════════════════════════════
2. 3-FONT TYPOGRAPHY SYSTEM
═══════════════════════════════════
1. Headline Serif/Display (e.g., Outfit / Playfair Display): Bold, dignified headings (`text-3xl sm:text-5xl font-bold`).
2. Body Sans-Serif (e.g., Inter / Plus Jakarta Sans): Clean, modern readability (`text-sm sm:text-base leading-relaxed`).
3. Monospace / Label (e.g., Roboto Mono): Used exclusively for category pills, dates, and metadata tags with uppercase tracking (`text-xs font-mono uppercase tracking-[2px] text-primary`).

═══════════════════════════════════
3. COMPONENT LAYOUT & AESTHETICS
═══════════════════════════════════
• Rounded Cinematic Containers: Use large border radiuses (`rounded-3xl` / `rounded-2xl`) for cards, hero containers, and modals.
• Glassmorphism: Use frosted glass overlays (`bg-white/95 backdrop-blur-xl` or `bg-deep-forest/90 backdrop-blur-2xl`) for floating navbars, tooltips, and overlay badges.
• Rich Shadows: Cards should have smooth elevation (`shadow-md hover:shadow-2xl transition-shadow duration-300`).
• Imagery: All images must be wrapped in `overflow-hidden rounded-3xl` containers with internal zoom on hover (`group-hover:scale-105 transition-transform duration-500`).

═══════════════════════════════════
4. ANIMATION & INTERACTION RULES (FRAMER MOTION)
═══════════════════════════════════
• Scroll Reveal Rule: Sections must animate IN once the first time they enter viewport (`whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}`).
• Performance Rule: Stick strictly to `opacity` and `transform` (`y`, `x`, `scale`, `rotate`). Never animate layout properties (`width`, `height`, `margin`).
• Micro-Interactions:
  - Cards: Spring lift on hover (`whileHover={{ scale: 1.02, y: -6 }}`).
  - Buttons: Press bounce (`whileTap={{ scale: 0.95 }}`) and subtle hover scale (`scale: 1.05`).
  - Rotating Elements: For circular badges or seals, use gentle hover spin (`group-hover:[animation:spin_8s_linear_infinite]`).
• Accessibility Rule: Always wrap motion logic with `useReducedMotion()` from Framer Motion so animations fall back gracefully if the user has OS reduced motion enabled.

Build the page with rich visual hierarchy, interactive hover states, and premium finish.
```

---

## Part 2: Visual & Technical Reference Guide

### 1. Color Palette Matrix

| Token Name | Hex Code | Tailwind Equivalent | Usage Context |
| :--- | :--- | :--- | :--- |
| **Primary Accent** | `#9A8678` | `bg-primary` / `text-primary` | Primary action buttons, active pill tabs, section borders |
| **Deep Forest** | `#0A3A2A` | `bg-deep-forest` | Hero backgrounds, dark thematic sections, footer |
| **Saffron Glow** | `#F3A712` | `text-saffron-glow` | Spiritual highlights, decorative icons, glowing borders |
| **Warm Cream** | `#F9F7F2` | `bg-[#F9F7F2]` | Page body background (soft devotional warmth) |
| **Surface Card** | `#FFFFFF` | `bg-white` | Individual cards, modals, testimonials |
| **Card Border** | `#D9CBB0` | `border-[#D9CBB0]/60` | Subtle framing around cards and badges |

---

### 2. Ready-to-Use Code Snippets

#### A. Standard Section Scroll Reveal Wrapper
```tsx
import { motion, useReducedMotion } from "framer-motion";

export function SectionWrapper({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-12">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-b border-[#D9CBB0]/60 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="text-xs font-mono font-bold text-primary uppercase tracking-[2px] mb-1">
            {subtitle}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-deep-forest">
            {title}
          </h2>
        </div>
      </motion.div>

      {children}
    </section>
  );
}
```

#### B. Interactive Modern Card with Image Zoom & Spring Lift
```tsx
import { motion, useReducedMotion } from "framer-motion";

export function PromoCard({ title, category, desc, imgUrl, linkUrl }: { title: string; category: string; desc: string; imgUrl: string; linkUrl: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-3xl border border-[#D9CBB0]/60 overflow-hidden shadow-md hover:shadow-2xl transition-shadow flex flex-col group cursor-pointer"
    >
      <div className="h-64 relative overflow-hidden bg-[#F4EFE6]">
        <img
          src={imgUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-deep-forest text-saffron-glow px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow">
          {category}
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
        <h3 className="text-xl font-bold text-deep-forest group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {desc}
        </p>
        <div className="pt-2">
          <a
            href={linkUrl}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-deep-forest underline hover:text-primary transition-colors"
          >
            <span>Learn More & Support</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
```

#### C. Spinning Decorative Seal / Badge (Slow Gentle Spin on Hover)
```tsx
export function RotatingPromoBadge({ text }: { text: string }) {
  return (
    <div className="relative w-32 h-32 rounded-full bg-deep-forest border-4 border-[#F9F7F2] shadow-xl flex items-center justify-center cursor-pointer group">
      {/* Outer Text Ring that rotates smoothly over 8s when hovered */}
      <div className="absolute inset-2 pointer-events-none flex items-center justify-center group-hover:[animation:spin_8s_linear_infinite]">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path id="promoCircle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
          <text className="text-[10px] font-mono font-bold uppercase fill-saffron-glow tracking-[2px]">
            <textPath href="#promoCircle">{text}</textPath>
          </text>
        </svg>
      </div>
      {/* Stable Center Icon */}
      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-inner group-hover:bg-saffron-glow group-hover:text-deep-forest group-hover:scale-110 transition-all duration-300">
        <span className="material-symbols-outlined">volunteer_activism</span>
      </div>
    </div>
  );
}
```

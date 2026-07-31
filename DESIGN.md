---
name: Materia
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c4c6cd'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8e9197'
  outline-variant: '#44474c'
  surface-tint: '#b9c8de'
  primary: '#b9c8de'
  on-primary: '#233143'
  primary-container: '#94a3b8'
  on-primary-container: '#2b394b'
  inverse-primary: '#516072'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#bdc2ff'
  on-tertiary: '#131e8c'
  tertiary-container: '#8f99ff'
  on-tertiary-container: '#1e2894'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d4e4fa'
  primary-fixed-dim: '#b9c8de'
  on-primary-fixed: '#0d1c2d'
  on-primary-fixed-variant: '#39485a'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#e0e0ff'
  tertiary-fixed-dim: '#bdc2ff'
  on-tertiary-fixed: '#000767'
  on-tertiary-fixed-variant: '#2f3aa3'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system is built upon the "Refined Laboratory" narrative—a fusion of rigorous material science and high-end gaming performance. It targets a sophisticated audience that values precision, technical depth, and a focused environment free from the "gamer-aesthetic" clutter.

The visual style is a hybrid of **Minimalism** and **Glassmorphism**. It evokes the feeling of interacting with a high-contrast terminal housed within a clean-room environment. The emotional response should be one of calm focus, technical mastery, and tactile quality. Surfaces are treated like layered panes of reinforced glass and brushed alloys, utilizing subtle translucency and internal glows to represent "active" states or energy signatures.

## Colors
The palette is anchored in a deep, nocturnal base of **Deep Slate (#0F172A)** to minimize eye strain and maximize focus. **Brushed Steel (#94A3B8)** serves as the primary structural color, used for borders, secondary text, and inactive states.

Vibrancy is introduced through "Elemental Accents"—low-saturation neon hues used sparingly to categorize content, much like periodic table groupings.
- **Primary (Steel):** Structural elements and iconography.
- **Secondary (Noble Blue):** Primary actions and highlights.
- **Elemental Tones:** Desaturated reds, purples, and teals are reserved for specific data visualization or categorical tagging, ensuring the UI remains professional and not "overly colorful."

## Typography
The system employs a dual-typeface strategy to reinforce the material science aesthetic. **Inter** provides a clean, neutral, and highly readable foundation for all UI copy and headings, ensuring the professional "SaaS-like" feel remains intact.

**JetBrains Mono** is used as a functional secondary font. It is reserved for chemical symbols, technical data strings, "periodic table" style labels, and small metadata. This monospaced contrast emphasizes the "laboratory" theme, treating data as if it were being read from a precision instrument. Headings should utilize tighter letter-spacing to feel more "engineered" and impactful.

## Layout & Spacing
The layout follows a **Fluid Grid** model with high internal margins to create a sense of "vacuum" and cleanliness.

- **Desktop:** 12-column grid with wide 64px outer margins to center the focus.
- **Mobile:** 4-column grid with 16px margins.
- **Rhythm:** All spacing is derived from an 8px base unit. Component internal padding should be generous (16px or 24px) to allow elements to "breathe" within their glass containers. Information-dense areas (like inventory or stats) should drop to a 4px "compact" rhythm to maintain technical utility.

## Elevation & Depth
Depth is achieved through **Glassmorphism** and **Tonal Layering** rather than traditional heavy shadows.

- **Level 0 (Base):** Deep Slate (#0F172A).
- **Level 1 (Panels):** Slightly lighter slate with a 1px "Brushed Steel" border at 10% opacity.
- **Level 2 (Modals/Overlays):** Translucent background-blur (20px) with a semi-transparent white tint (2%).
- **Glows:** "Active" elements emit a soft, 8px-16px outer glow (spread 0, blur 12) using the secondary or elemental accent colors. This represents an "energized" state of the material.

## Shapes
The shape language is "Soft-Industrial." Components use a consistent **0.25rem (4px)** radius for most UI elements (buttons, inputs, cards) to maintain a precise, sharp look that isn't aggressive.

Larger containers or sections can scale up to **0.75rem (12px)** to soften the overall composition and suggest a premium, manufactured quality. Interactive elements should never be fully circular (pill-shaped) unless they are tiny status indicators, as sharp corners feel more like laboratory equipment.

## Components
- **Buttons:** Primary buttons use a solid Steel (#94A3B8) background with dark text. Secondary buttons are "Ghost" style with a 1px border and a subtle internal glow on hover.
- **Cards/Panels:** Use a "Glass-Steel" treatment: a subtle gradient border from top-left (light) to bottom-right (dark) to simulate a beveled edge.
- **Periodic Chips:** Categorical tags (e.g., [He], [Li]) use the JetBrains Mono font inside a small, square container with a background color corresponding to their elemental group.
- **Inputs:** Darker than the base background, with a 1px bottom-border that illuminates in Noble Blue (#38BDF8) when focused.
- **Lists:** Clean rows separated by 1px dividers at 5% opacity. Hovering a row should trigger a very subtle "backlight" effect using a backdrop blur.
- **Progress Bars:** Thin (4px) with a high-contrast glow on the leading edge of the "material" filling the bar.

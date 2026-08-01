---
name: Obsidian & Ember
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e9bcb6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#b08782'
  outline-variant: '#5f3f3a'
  surface-tint: '#ffb4aa'
  primary: '#ffb4aa'
  on-primary: '#690003'
  primary-container: '#ff5546'
  on-primary-container: '#5c0002'
  inverse-primary: '#c0000b'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#929090'
  on-tertiary-container: '#2a2a2a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930006'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 96px
    fontWeight: '800'
    lineHeight: 100px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 24px
  section-gap: 160px
---

## Brand & Style

This design system is built for a high-end web design agency that prioritizes narrative, impact, and cinematic quality. The brand personality is mysterious, authoritative, and avant-garde. It evokes the feeling of a premium film production house—bold, dark, and meticulously crafted.

The aesthetic leans heavily into **Cinematic Minimalism** with a touch of **Glassmorphism**. It utilizes expansive "true black" surfaces, dramatic light leaks, and razor-sharp typography to create a sense of depth and prestige. The emotional response is one of exclusive sophistication; it is a design system that doesn't scream for attention but commands it through intentionality and high-contrast drama.

## Colors

The palette is rooted in the "Obsidian" base—a pure black that allows neon accents to thrive. 

- **Primary (Electric Ember):** A vibrant neon red used sparingly for high-impact calls to action, light-leak gradients, and interactive states.
- **Secondary (Pure White):** Reserved primarily for typography to ensure maximum legibility against the dark background.
- **Surface Tiers:** Tertiary and Neutral tones are used to create subtle depth, defining containers and borders without breaking the dark-mode immersion.

Gradients should simulate optical light leaks, transitioning from `#FF1E1E` to transparent, rather than traditional linear blends.

## Typography

The typography system relies on a high-contrast pairing. **Plus Jakarta Sans** provides a geometric, bold character for headlines that feels modern and architectural. For body and UI elements, **Hanken Grotesk** offers a clean, technical precision that ensures professional readability.

Large display headings should use tight letter-spacing to create a "block" effect similar to cinematic title cards. Labels are always presented in uppercase with generous tracking to maintain an "Identity" or "Metadata" aesthetic.

## Layout & Spacing

This system utilizes a **Fixed Grid** on desktop to maintain a gallery-like presentation, transitioning to a fluid model on smaller screens. 

- **Desktop:** 12-column grid with wide 80px margins to allow the content to breathe against the void of the black background.
- **Sectioning:** Large vertical gaps (160px+) are used to separate case studies and services, forcing a slow, intentional scroll.
- **Rhythm:** Spacing follows a 4px baseline, but internal component padding remains generous to reinforce the premium feel.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Background Blurs** rather than traditional drop shadows.

1.  **The Void (Base):** Pure `#000000` background.
2.  **Surfaces:** Cards and containers use a very subtle `#080808` or `#1A1A1A` with low-opacity borders (`rgba(255,255,255,0.1)`).
3.  **Glow:** High-priority elements use "Ambient Glow"—a soft, red-tinted outer blur that mimics the light leaks seen in the reference photography.
4.  **Glass:** Navigation bars and overlays use a high-saturation backdrop blur (20px+) to create a frosted lens effect over the content below.

## Shapes

The shape language is **Soft** but leans towards precision. While sharp corners are too aggressive, overly rounded "pill" shapes feel too casual for a high-end agency. 

Standard components use a 0.25rem (4px) radius to maintain a crisp, professional edge. Larger containers like portfolio cards may scale up to 0.75rem (12px) to soften the transition between large image assets and the black background.

## Components

### Buttons
- **Primary:** Solid Red (`#FF1E1E`) background with White text. No border. On hover, a subtle red glow effect (box-shadow) appears.
- **Secondary:** Transparent background with a thin White border (1px). Text is White.
- **Tertiary/Ghost:** Text only with an animated underline that expands from the center on hover.

### Cards
Portfolio cards are the centerpiece. They should be borderless, using high-quality imagery that fades into the black background. Title and category metadata should appear as "Label-Caps" typography positioned at the corners of the card.

### Input Fields
Minimalist under-line style. Only the bottom border is visible (`rgba(255,255,255,0.3)`). On focus, the border turns Primary Red and a subtle red glow is applied to the line.

### Chips/Labels
Small, uppercase text within a dark grey (`#1A1A1A`) capsule. Used for tagging project industries or technologies.

### Navigation
A minimalist top bar with a deep backdrop blur. Navigation items should use "Label-Caps" style. The active state is indicated by a small Primary Red dot beneath the text.
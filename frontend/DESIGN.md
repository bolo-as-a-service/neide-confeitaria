---
name: Artisanal Confectionery System
colors:
  surface: '#fff8f6'
  surface-dim: '#ffcfc5'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ee'
  surface-container: '#ffe9e5'
  surface-container-high: '#ffe2dc'
  surface-container-highest: '#ffdad3'
  on-surface: '#33110a'
  on-surface-variant: '#514441'
  inverse-surface: '#4d251d'
  inverse-on-surface: '#ffede9'
  outline: '#837470'
  outline-variant: '#d5c2be'
  surface-tint: '#7e544a'
  primary: '#32140d'
  on-primary: '#ffffff'
  primary-container: '#4b2820'
  on-primary-container: '#c08d82'
  inverse-primary: '#f1baad'
  secondary: '#70585b'
  on-secondary: '#ffffff'
  secondary-container: '#f8d8db'
  on-secondary-container: '#755d5f'
  tertiary: '#1b1d1d'
  on-tertiary: '#ffffff'
  tertiary-container: '#303232'
  on-tertiary-container: '#999a9a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#f1baad'
  on-primary-fixed: '#31130c'
  on-primary-fixed-variant: '#643d34'
  secondary-fixed: '#fbdbde'
  secondary-fixed-dim: '#debfc2'
  on-secondary-fixed: '#281719'
  on-secondary-fixed-variant: '#574144'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fff8f6'
  on-background: '#33110a'
  surface-variant: '#ffdad3'
typography:
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.5px
  price-display:
    fontFamily: Be Vietnam Pro
    fontSize: 22px
    fontWeight: '800'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  section-gap: 4rem
---

## Brand & Style

The brand personality is warm, artisanal, and comforting, evoking the sensory delight of a premium bakery. It targets customers seeking high-quality, handcrafted sweets through a digital experience that feels as inviting as a physical shop.

The design style is **Tactile & Soft**, utilizing organic "melted" wave patterns to represent chocolate ganache and frosting. It leans into a modern-nostalgic aesthetic where rounded corners, soft shadows, and a rich, edible color palette create a sense of approachability and premium quality. The visual language is defined by fluid transitions between sections and high-contrast typography that remains legible and friendly.

## Colors

The palette is centered around "Chocolate" and "Strawberry Cream" tones to stimulate appetite and brand recognition.

- **Primary (Chocolate):** Used for primary actions, headings, and the top wave header. It provides the necessary weight and grounding for the UI.
- **Secondary (Soft Pink):** Used as the primary background color for page bodies and decorative elements, maintaining a soft, sweet atmosphere.
- **Surface (White):** Used for cards, input fields, and containers to ensure content clarity and a sense of cleanliness.
- **Accent/Neutral:** A lighter shade of brown used for secondary text and borders to maintain harmony without the harshness of black.

## Typography

The typography system pairs two friendly, contemporary sans-serifs to ensure a balance between editorial elegance and functional readability.

- **Headlines:** Use **Be Vietnam Pro**. Its contemporary shapes feel fresh yet sophisticated. Headlines should always use the Primary Chocolate color.
- **Body & UI Elements:** Use **Plus Jakarta Sans**. The soft, rounded terminals of this font complement the "wave" aesthetic of the design system. 
- **Hierarchy:** Prices should be emphasized using a heavier weight of the headline font to ensure they stand out within product cards.

## Layout & Spacing

The design system utilizes a **Fluid Grid** model with generous white space to allow product photography to breathe. 

- **The "Wave" Framework:** The top of the page features a deep Chocolate wave (concave), while the footer uses a similar wave (convex) to frame the content.
- **Grid:** A 12-column system is used for desktop, collapsing to 1 column for mobile. 
- **Rhythm:** Elements within cards use an 8px base unit. Section spacing is intentionally large (64px+) to maintain the "premium" feel of a high-end confectionery.
- **Mobile Adaptations:** For mobile, side margins are reduced to 16px, and product grids transition from 4 columns to 1 or 2 depending on the product type.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and subtle **Ambient Shadows**.

- **Surface Level 0:** The Soft Pink background.
- **Surface Level 1:** White cards and containers. These use a very soft, diffused shadow (0px 4px 20px rgba(75, 40, 32, 0.08)) to appear as if they are resting gently on the pink surface.
- **Interactive Depth:** Buttons and active cards use a slightly more pronounced shadow upon hover to simulate a "clickable" physical object.
- **Outlines:** Low-contrast 1px borders in a diluted brown (#E5D3D0) are used for form inputs and secondary containers to provide structure without visual noise.

## Shapes

The shape language is dominated by high-radius curves to reflect the softness of the brand.

- **Core Elements:** Product cards, buttons, and input fields use a `rounded-lg` (1rem) corner radius.
- **Decorative Elements:** Category filters and "Add" buttons may use the "Pill" style for a more playful, organic feel.
- **Wave Patterns:** Large-scale wave shapes must be SVG-based to ensure smooth scaling. They should appear "heavy" and viscous, like flowing chocolate or thick cream.

## Components

### Buttons
- **Primary:** Solid Chocolate background with White text. Rounded (pill-shaped).
- **Secondary:** White background with Chocolate border and text.
- **Icon Buttons:** Circular with a Soft Pink background and Chocolate icon.

### Cards
- **Product Card:** White background, 1rem border radius. Features a top-aligned image followed by the product name in `headline-sm` and price in `price-display`. The "Add" button is always anchored to the bottom right.
- **Cart Card:** Horizontal layout with a small thumbnail, quantity controls, and a delete icon in a subtle red.

### Input Fields
- **Text Inputs:** White background, 1px light brown border, `rounded-lg`. Placeholder text in a muted brown.
- **Selection:** Custom radio buttons using a Chocolate outer ring and a pink center dot when selected.

### Navigation & Feedback
- **Category Chips:** Circular or pill-shaped containers with illustrative icons above text labels.
- **Status Indicators:** The "Open/Closed" badge uses a pill shape with a soft green or red background and a small status dot.
# Glide App Style Reference

Use this as the shared design system for the Glide product family.

Derived from:
- `src/App.tsx`
- `src/HowTo.tsx`
- `src/index.css`
- `.repo-scout/vidconv26-github/video_converter_modern.py`
- `.repo-scout/vidconv26-github/create_icons.py`

## 1. Family Thesis

Glide apps should feel like precision desktop tools for media workflows:
- dark, matte, cinematic surfaces
- one warm action color
- one restrained cool atmospheric accent
- strong brand name treatment
- minimal clutter
- fast, technical, local-first

The family should read as:
- premium but not flashy
- creative but not playful
- technical but not sterile
- modern but not trend-chasing

Working phrase:

`Studio-black utility software with amber actions and subtle spectral atmosphere.`

## 2. Visual Thesis

Every Glide app should look like a focused workstation, not a generic SaaS dashboard.

The first screen should communicate:
1. product name
2. exact job the tool does
3. one primary action
4. one central workspace

The visual energy should come from:
- black negative space
- oversized typography
- rounded geometry
- restrained glow or blur in the background
- one memorable icon/mark

## 3. Content Plan

For a Glide landing page or web app:
1. Hero
   Brand mark, product name, one-line promise, primary action.
2. Workspace
   The actual tool surface should appear immediately, not below a long marketing intro.
3. Support
   One or two short explanatory areas only if needed.
4. Output / proof
   Preview, saved output, export state, or system summary.

For a Glide desktop app:
1. Header
   Small capsule label, square icon, product name, one-line utility summary.
2. Main control row
   Inputs, presets, or configuration.
3. Primary workspace
   Queue, preview, timeline, or generated result.
4. Action footer
   One dominant button, one quiet cancel/secondary action.

## 4. Interaction Thesis

Required motion ideas for Glide apps:
- entrance fade/slide for hero and primary workspace
- one meaningful workflow transition
  examples: swap, replace, merge, convert, insert, preview
- subtle hover response on primary actions

Motion rules:
- short
- clean
- visible in a recording
- never ornamental by itself
- avoid bouncy consumer-app behavior

Good defaults:
- fade in with 16-24px vertical offset
- CTA hover scale 1.03 to 1.05
- duration around 180-300ms
- use soft opacity and translate, not aggressive spin or bounce

## 5. Core Palette

Use this as the base family palette.

### Surfaces
- Canvas: `#0A0A0A`
- Desktop matte: `#050505`
- Surface 1: `#121212`
- Surface 2: `#1B1B1B`
- Surface glass: `rgba(255,255,255,0.05)`

### Action
- Primary action: `#D86B21`
- Primary hover: `#F28135`
- Soft amber accent: `#FFB36B`
- Gold highlight: `#F6B26B`

### Text
- Text primary: `#F5EFE6`
- Text secondary: `#AB9A88`
- Text muted: `#7A6D61`

### Lines / UI
- Border dark amber: `#2D2118`
- Progress track: `#24170F`
- White 10 line fallback: `rgba(255,255,255,0.10)`

### Atmospheric support
- Cool haze blue: `#60A5FA`
- Cyan spectral accent: `#6CF0FF`
- Magenta spectral accent: `#FF6AC9`

Rules:
- amber is the interface action color
- blue/cyan/magenta are for atmosphere, glow, icons, and brand art only
- do not run the interface with multiple competing action colors

## 6. Typography

Use at most 3 families:

### Display
- `Space Grotesk`
- use for product names, major headers, modal titles, feature callouts

### UI Sans
- `Inter`
- use for body copy, labels, descriptions, general web UI

### Mono
- `JetBrains Mono`
- use for technical metadata, timing, hashes, engine labels, status chips

Recommended hierarchy:
- Product name: large, tight tracking, heavy weight
- Utility summary: short, low contrast
- Labels: medium weight, functional
- Meta: uppercase mono, tiny, spaced out

Never:
- use decorative script fonts
- use more than one display font in the same app
- use default Arial/Roboto-only stacks as the visible brand voice

## 7. Logo System

The Glide logo system has two layers:

### A. Family icon
- square
- centered
- readable at 16px up through store tile scale
- always presented on a dark matte

### B. Product wordmark
- separate from the icon
- never stretch a non-square asset into a banner shape
- treat icon and wordmark as a pair, not a single distorted image block

Rules:
- store/desktop/taskbar icons must be square-first
- use black or near-black behind transparent or extracted marks
- keep generous padding around the mark
- if the provided artwork is raster and flattened to white, strip edge background and re-matte it onto black

## 8. Brand Architecture

Naming pattern:
- `Glide` + one clear function word

Good examples:
- GlideBlend
- GlideConvert
- GlideTrim
- GlideSync
- GlideStitch
- GlideFlow

Rules:
- second word should feel active, tool-like, and clear
- avoid jargon-heavy codec/ML terms in the name
- avoid vague mood names
- avoid more than 2 words in the core product name

Store subtitle formula:
- `Desktop [artifact] tool for [outcome]`

Example:
- `Desktop clip utility for smoother transitions`
- `Desktop video converter for fast local exports`

## 9. Layout Rules

### Glide web apps
- first viewport should feel like a poster plus tool surface
- use a centered hero with restrained atmosphere
- avoid dashboard-card mosaics
- use large rounded upload or workspace panels
- leave more black space than you think you need

### Glide desktop apps
- top area should be compact and branded
- control rows should be clean, horizontal, readable
- the main workspace should dominate the window
- one bold CTA at the bottom or center

### Containers
- card radius: 20-28px
- pill radius: full / rounded-full
- border weight: 1px usually enough
- shadows should be soft and low-contrast

## 10. Component Recipes

### Header
- small utility capsule
- icon + product name
- one-line explanation
- action cluster on the right

### Primary CTA
- amber fill
- dark or black text
- bold label
- pill shape
- subtle hover glow or scale

### Secondary CTA
- transparent or glass background
- thin border
- quiet text
- only one step below the primary

### Panels
- dark fill
- thin border
- no heavy chrome
- no thick boxed framing around every section

### Status / metadata
- mono labels
- tiny uppercase
- low contrast
- use separators and alignment before adding more boxes

## 11. Background Treatment

A Glide screen should not be flat-black and dead.

Use restrained atmosphere:
- warm blur in the upper-left or center-left
- cool blur in the lower-right
- low opacity only
- no noisy mesh backgrounds

This is the approved family backdrop:
- `orange/amber haze + cool blue/cyan haze on black`

Keep it subtle enough that product UI still feels serious.

## 12. Copy Style

Glide copy should be:
- short
- direct
- utility-led
- local-first
- no hype

Good tone:
- `Match frames and export a cleaner transition locally.`
- `Batch convert clips with reusable presets.`
- `Drop files in, choose a preset, and export.`

Avoid:
- `revolutionary`
- `AI magic`
- `next-generation`
- long emotional headlines
- trying to sound like a startup pitch deck

## 13. Product Surface Rules

Every Glide app should make its core workflow obvious in under 5 seconds.

Required:
- one central task
- one primary action
- one obvious result area

Avoid:
- too many tabs
- multiple equal CTAs
- marketing sections inside the main app surface
- decorative cards that do not carry interaction

## 14. Do / Don't

Do:
- use black as the dominant field
- use amber as the action signal
- use Space Grotesk for brand/display moments
- use square icon treatment
- keep layouts clean and breathable
- make the main workflow visible immediately

Don't:
- use light mode by default for the Glide family
- stretch logos into banners
- mix 3-4 accent colors in the interface
- fill the screen with cards
- add unnecessary sidebars
- let screenshots, tiles, or headers become visually inconsistent between apps

## 15. Store and Launch Assets

### itch.io
- dark cover image
- square icon or strong centered mark
- big product name
- one short promise
- no collage of tiny UI elements

### Microsoft Store
- square tile first
- dark matte background
- icon centered with generous padding
- no screenshots embedded into tile graphics
- screenshots should show the real workflow, not only empty states

## 16. Cross-App Tokens

Use these as the stable family tokens moving forward.

```txt
glide.canvas = #0A0A0A
glide.matte = #050505
glide.surface.1 = #121212
glide.surface.2 = #1B1B1B
glide.action = #D86B21
glide.action.hover = #F28135
glide.action.soft = #FFB36B
glide.text.primary = #F5EFE6
glide.text.secondary = #AB9A88
glide.text.muted = #7A6D61
glide.border = #2D2118
glide.haze.warm = amber/orange at 8-20% opacity
glide.haze.cool = blue/cyan at 6-14% opacity
```

## 17. Product Differentiation Within the Family

The shell should feel shared, but each app needs one unique cue.

### GlideBlend
- emphasis: transition matching, cinematic continuity
- strongest cue: clip-to-clip pairing, merge result, frame matching

### GlideConvert
- emphasis: fast exports, reusable presets, batch queue
- strongest cue: preset workflow, file queue, conversion output

### Future Glide apps
Keep the family shell the same, then choose one dominant motif:
- Trim: time selection
- Sync: alignment / pairing
- Flow: sequencing
- Stitch: assembly
- Cut: removal / cleanup

Only one motif per app.

## 18. Starter Prompt For The Next Glide App

Use this when kicking off the next concept:

`Design a new Glide-family desktop utility. Keep the Glide visual system: matte-black background, amber primary actions, subtle warm/cool atmospheric blur, Space Grotesk display typography, Inter UI text, JetBrains Mono metadata, square icon treatment, and a single dominant workspace. The product name must be the loudest text. Avoid dashboard-card clutter. One core workflow, one primary CTA, one visible output/result area.`

## 19. Build Checklist

Before shipping a new Glide app, check:
- Is the icon square and properly matted on black?
- Is the product name unmistakable in the first screen?
- Is amber the only true action color?
- Is there one clear primary action?
- Is the first viewport a working surface, not a document?
- Is the copy short and functional?
- Would this still feel premium if shadows were reduced?
- Does it clearly belong to GlideBlend and GlideConvert without looking copied?

---
name: Danta Labs
description: A luminous archive for stories of space exploration.
colors:
  void: "#0C0918"
  deep-purple: "#241642"
  cosmic-blue: "#354B9A"
  nebula-violet: "#9C71E8"
  pale-cyan: "#74D6E4"
  starlight: "#F2ECFA"
  warm-gold: "#F4C36A"
typography:
  display:
    fontFamily: "Gabarito Variable, sans-serif"
    fontSize: "clamp(3.8rem, 8.6vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.06em"
  headline:
    fontFamily: "Gabarito Variable, sans-serif"
    fontSize: "clamp(2.7rem, 5.7vw, 4.8rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.06em"
  title:
    fontFamily: "Gabarito Variable, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: "Gabarito Variable, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Gabarito Variable, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 500
rounded:
  capsule: "999px"
  panel: "1.75rem"
spacing:
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
components:
  action-primary:
    backgroundColor: "{colors.warm-gold}"
    textColor: "{colors.void}"
    rounded: "{rounded.capsule}"
    padding: "0.65rem 1.1rem"
    height: "3rem"
  action-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.pale-cyan}"
  route-active:
    backgroundColor: "{colors.cosmic-blue}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.capsule}"
    padding: "0.55rem 0.8rem"
    height: "2.75rem"
  status-pill:
    backgroundColor: "{colors.nebula-violet}"
    textColor: "{colors.void}"
    rounded: "{rounded.capsule}"
    padding: "0.35rem 0.75rem"
  story-panel:
    backgroundColor: "{colors.starlight}"
    textColor: "{colors.void}"
    rounded: "{rounded.panel}"
    padding: "6rem 3rem 9rem"
  gameplay-panel:
    backgroundColor: "{colors.cosmic-blue}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.panel}"
    padding: "8rem 3rem 9rem"
---

# Design System: Danta Labs

## Overview

**Creative North Star: "The Nebula Archive"**

The homepage frames space-exploration stories in a quiet, luminous night sky. A near-black violet field and restrained star points establish the atmosphere; pale reading panels make the project and team easy to scan, while a cosmic-blue gameplay section gives the rules preview its own clear place. The existing Gabarito typography keeps the presentation warm and approachable without weakening the dark, archival mood.

The visual language is made from color, spacing, capsule navigation, and alternating section surfaces. Preserve the project's explicit in-development status and factual storytelling focus; the design presents an unfinished tabletop concept, not established gameplay.

**Key Characteristics:**
- Near-black violet frame with a subtle, repeating star-point texture.
- Starlight reading panels alternating with a cosmic-blue gameplay panel.
- Gabarito headlines and readable, open body copy.
- Capsule links and status markers use cyan, violet, and warm gold as focused accents.

## Colors

The palette pairs a violet-black night field with pale starlight surfaces, using cosmic blue for the gameplay region and luminous accents for navigation and status.

### Primary
- **Void**: The continuous page field and dark text on light or gold surfaces.

### Secondary
- **Cosmic Blue**: The gameplay-preview section surface, separating rules-in-progress from the surrounding night field.
- **Nebula Violet**: Project-status capsules and team-role markers.
- **Pale Cyan**: Keyboard focus, active navigation, text links, and the brand mark accent.
- **Warm Gold**: The primary action, preview status, and Mars destination marker.

### Tertiary
- **Deep Purple**: Deep-space destination and the back-to-start link.

### Neutral
- **Starlight**: Default reading text and the project-story and team panels.

### Named Rules
**The Night-Sky Frame Rule.** Keep the near-black violet field as the page's continuous frame; use the star points as a subtle texture behind, not in place of, readable content.

**The Luminous Reading Rule.** Keep long-form project and team copy on starlight surfaces, reserving cosmic blue for the gameplay preview.

## Typography

**Display Font:** Gabarito Variable (with sans-serif fallback)<br>
**Body Font:** Gabarito Variable (with sans-serif fallback)

**Character:** A single rounded sans-serif family keeps navigation, display, and explanatory text cohesive. Large headings use tight tracking and compact line-height; body text uses a more open rhythm for comfortable reading.

### Hierarchy
- **Display** (500, `clamp(3.8rem, 8.6vw, 6rem)`, 0.95 line-height, `-0.06em` tracking): Homepage title.
- **Headline** (500, `clamp(2.7rem, 5.7vw, 4.8rem)`, 0.98 line-height, `-0.06em` tracking): Project, gameplay, and team section headings.
- **Title** (500, `clamp(1.5rem, 2.4vw, 2rem)`, 1.2 line-height): Gameplay preview lead.
- **Body** (500, 1.15rem, 1.5 line-height): Main explanatory copy, generally limited to 65ch.
- **Label** (500, 0.8–0.95rem): Navigation, status details, and compact role markers.

## Layout

Use a centered content frame capped at 76rem. At desktop widths, the header and sections use 2rem outer gutters; at 760px and below, gutters reduce to 1rem and the project-story, gameplay, and team layouts become single-column. The project story and team are light panels; gameplay is a blue panel. At 390px and below, the team list becomes one column and navigation spacing tightens. Generous section padding and open gaps separate content rather than adding nested cards.

## Elevation & Depth

The page uses no box shadows. Depth comes from the contrast of the dark frame, starlight panels, and blue gameplay region, with a low-opacity repeating field of tiny radial star points behind the content. Keep those points decorative and subdued.

## Shapes

Interactive links, status labels, destinations, and role markers use capsule silhouettes (999px). The three large section panels use softly rounded corners (1.75rem). Text links and panel boundaries remain simple; visible keyboard focus uses a cyan outline with a 4px offset.

## Components

### Buttons
- **Shape:** Capsule (999px).
- **Primary:** Warm-gold fill with void text, a cyan hover state, and 0.65rem 1.1rem padding; minimum height 3rem.
- **Secondary:** Unfilled text link in pale cyan.
- **Hover / Focus:** Actions lift 2px on hover; keyboard focus receives a 3px cyan outline with a 4px offset.

### Chips
- **Style:** Capsule markers with compact padding and no heavy outline.
- **State:** Nebula violet marks project status, warm gold marks the gameplay preview and Mars, pale cyan marks the Moon, and deep purple with starlight text marks deep space. Keep status copy explicit.

### Cards / Containers
- **Corner Style:** Softly rounded panels (1.75rem).
- **Background:** Starlight for the project-story and team sections; cosmic blue for gameplay.
- **Shadow Strategy:** No shadows; use the surface contrast and generous padding described in Elevation & Depth.
- **Internal Padding:** 3rem horizontal on wide layouts, with section-specific vertical spacing; at mobile widths use 1.25rem horizontal padding.

### Navigation
- **Style:** Standard section links arranged as capsules, with a small colored route marker.
- **Default / Hover:** Transparent on the night field; markers identify project, gameplay, and team, and links lift 2px on hover.
- **Active:** Cosmic-blue fill, pale-cyan border, and a leading enlarged marker.
- **Mobile:** Links wrap under the brand rather than collapsing to icons.

## Do's and Don'ts

### Do:
- **Do** use the documented night, starlight, blue, violet, cyan, and gold palette roles.
- **Do** keep Gabarito Variable across display and body text, with the established tight heading tracking and readable body measure.
- **Do** preserve capsule interaction markers, visible keyboard focus, and the contrast between reading panels and gameplay.
- **Do** keep the project and gameplay status explicit while rules remain in development.

### Don't:
- **Don't** weaken the starlight reading surfaces by placing long-form copy directly over the star texture.
- **Don't** present unconfirmed setup, play sequence, or goals as established rules.
- **Don't** let decorative star points compete with the content or become navigation.

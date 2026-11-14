---
name: Danta Labs
description: A playful guide-map for a tabletop journey through stories of space exploration.
colors:
  land: "#8ed462"
  water: "#f5f1e4"
  ink: "#2c2e2a"
  sun: "#f5e211"
  coral: "#ff705d"
  blue: "#2ba0ff"
  lilac: "#ebc1ff"
typography:
  display:
    fontFamily: "Gabarito Variable, sans-serif"
    fontSize: "clamp(3.8rem, 8.6vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.06em"
  body:
    fontFamily: "Gabarito Variable, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  pill: "999px"
spacing:
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  action-primary:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.65rem 1.1rem"
    height: "3rem"
  route-active:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 0.8rem"
    height: "2.75rem"
  status-pill:
    backgroundColor: "{colors.lilac}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.75rem"
---

# Design System: Danta Labs

## Overview

**Creative North Star: "The Garden-Guide Map"**

The page reads like a friendly field guide to space stories. Broad, flat land shapes set the scene; familiar headings and a normal reading order keep the project easy to understand. Warm paper-colored water, expressive Gabarito typography, and small capsule markers add a playful sense of exploration without relying on paid services or external imagery.

The visual system should feel curious and welcoming, not like a control panel. Keep project status and unfinished gameplay explicit so the map's invitation never overstates what the prototype can do.

**Key Characteristics:**
- Flat green land against warm cream water.
- Rounded, high-contrast markers for routes, destinations, and project status.
- Oversized, closely tracked headlines paired with readable body copy.
- Map motion decorates the page; standard links remain the navigation.

## Colors

Garden green carries the map; warm paper gives the content room, while bright route-marker colors identify topics and states.

### Primary
- **Garden Land** (#8ed462): The large map lobe and the primary field color.

### Secondary
- **Solar Yellow** (#f5e211): Primary calls to action, active navigation, and the gameplay status marker.
- **Launch Coral** (#ff705d): The Moon/Mars palette and team-leader marker.

### Tertiary
- **Atmosphere Blue** (#2ba0ff): The deep-space destination and gameplay route marker.
- **Lunar Lilac** (#ebc1ff): Project-status and return-to-start capsules.

### Neutral
- **Warm Water** (#f5f1e4): Page background and open space between land shapes.
- **Mission Ink** (#2c2e2a): Text, outlines, and dividers.

## Typography

**Display Font:** Gabarito Variable (with sans-serif fallback)

**Body Font:** Gabarito Variable (with sans-serif fallback)

**Character:** One rounded, variable grotesk keeps the experience cohesive and approachable. Large headlines use tight tracking and compact line-height; body text stays open and comfortably readable.

### Hierarchy
- **Display** (500, `clamp(3.8rem, 8.6vw, 6rem)`, 0.95 line-height): Main project title.
- **Headline** (500, `clamp(2.7rem, 5.7vw, 4.8rem)`, 0.98 line-height): Project, gameplay, and team section headings.
- **Title** (500, `clamp(1.5rem, 2.4vw, 2rem)`, 1.2 line-height): Gameplay preview lead.
- **Body** (500, 1.15rem, 1.5 line-height): Explanatory copy, generally limited to 65ch.
- **Label** (500, 0.85–0.95rem): Navigation, chips, and compact status details.

## Layout

Use a centered content column capped at 76rem, with 2rem desktop gutters and 1rem gutters at widths up to 760px. The hero is a spacious first stop; the project story, gameplay preview, and team stack into a single column on mobile. At widths up to 390px, the team list becomes one column. Let section spacing create rhythm instead of enclosing every block in a card.

## Elevation & Depth

The system is flat: it uses no shadows. Depth comes from the contrast between land and water, changes in scale, whitespace, and fine ink-colored rules.

**The Flat-By-Default Rule.** Keep surfaces unraised; use color and spacing to establish hierarchy.

## Shapes

Capsules use a 999px radius. The map is a broad, asymmetric SVG coastline that changes with scroll progress; it is decorative and must remain behind content. Thin ink outlines and dividers provide structure without turning sections into cards.

## Components

### Buttons
- **Shape:** Capsule (`999px`).
- **Primary:** Solar-yellow action with mission-ink text, a 1px ink outline, 0.65rem 1.1rem padding, and 3rem minimum height.
- **Hover / Focus:** Lift the action by 2px on hover; retain a clearly visible 3px blue keyboard-focus outline.
- **Secondary:** Use a plain text link when an action is lower priority.

### Chips
- **Style:** Capsule markers with ink text and no heavy container treatment.
- **State:** Use yellow for the primary action/active route; use coral, blue, and lilac for destinations and status. Keep status text explicit.

### Navigation
- **Style:** Standard section links with a small colored route marker.
- **Active:** Yellow fill, ink outline, and a leading marker; inactive links remain open on the page background.
- **Mobile:** Let links wrap below the wordmark rather than shrinking them into icons.

### Signature Component: Coastline Map
Use one flat SVG land shape behind the reading surface. Its edge may interpolate with scroll, but reduced-motion users get discrete section-based states. Do not turn the coastline into a navigation control.

## Do's and Don'ts

### Do:
- **Do** use the established palette: land `#8ed462`, water `#f5f1e4`, ink `#2c2e2a`, with the existing capsule accents.
- **Do** keep headings large, closely tracked, and in Gabarito Variable.
- **Do** keep the map decorative and preserve normal document reading order.
- **Do** label unfinished gameplay as in development; only publish rules the team has confirmed.

### Don't:
- **Don't** add gradients, grain, or map-shaped navigation.
- **Don't** invent player counts, turns, setup, or win conditions.
- **Don't** make remote fonts, paid APIs, or paid services required for the page.

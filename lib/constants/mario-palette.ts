/**
 * Mario NES color palette — single source of truth for TS-side color access.
 *
 * These hex values MUST stay in sync with the CSS custom properties in
 * `app/globals.css` (`--color-mario-*`). Tailwind classes like `bg-mario-red`
 * resolve from those CSS vars; this module exists for runtime use (inline
 * `style={}`, SVG `fill`, JS-calculated colors) where a Tailwind class is
 * not an option.
 */
export const MARIO = {
  red:        "#E40000",
  redDark:    "#880000",
  gold:       "#FFD000",
  goldDark:   "#804000",
  green:      "#00A800",
  greenDark:  "#006800",
  blue:       "#0058F8",
  sky:        "#5C94FC",
  navy:       "#000058",
  navyDark:   "#000030",
  brown:      "#C88040",
  brownDark:  "#8B4000",
  stone:      "#A8A8A8",
  stoneDark:  "#505050",
  light:      "#A8C8F8",
  cream:      "#E8D8A8",
  slate:      "#6878A8",
  slateDark:  "#4858A8",
  parchment:  "#F8F0DC",
  inactive:   "#D0C8B8",
  purple:     "#8838C8",
  black:      "#000000",
  white:      "#FFFFFF",
} as const;

export type MarioColor = keyof typeof MARIO;

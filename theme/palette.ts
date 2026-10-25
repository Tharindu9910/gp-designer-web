/**
 * The only place colors are defined. Components use the semantic roles below through
 * Tailwind tokens (bg-accent, text-fg/60, …) or var(--role); JS that needs a literal imports `theme`.
 * Also read by scripts/gen-placeholders.mjs (Node strips the types).
 */
export const palette = {
  black: "#070707", // panels, footer, reel
  onyx: "#121110", // main page surface
  graphite: "#1C1A17", // pills, tabs, device frames
  ash: "#8F8A80", // muted text
  ivory: "#F3EDE1", // body text
  gold: "#C9A44C", // primary accent, buttons
  goldBright: "#E3C77E", // accent words on onyx, hovers
  goldDeep: "#8E7134", // hairlines, image details
} as const;

/** Semantic roles; each key becomes a CSS custom property (--bg, --fg, …). */
export const theme = {
  bg: palette.onyx,
  fg: palette.ivory,
  muted: palette.ash,
  dark: palette.black,
  "fg-inverse": palette.ivory,
  accent: palette.gold,
  "accent-2": palette.goldBright,
  "on-accent": palette.black, // text on gold
  pill: palette.graphite,
  line: "rgba(243,237,225,0.12)",
  "line-dark": "rgba(201,164,76,0.28)", // gold hairlines on black
  backdrop: palette.black, // body color behind the page during a transition
  scrim: "rgba(0,0,0,0.6)",
} as const;

export type ThemeRole = keyof typeof theme;

export const themeCss = () =>
  `:root{${Object.entries(theme)
    .map(([k, v]) => `--${k}:${v}`)
    .join(";")}}`;

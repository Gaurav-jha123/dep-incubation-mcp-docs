/**
 * Hex colors used exclusively for Recharts chart elements.
 * Recharts cannot consume Tailwind class names — it requires raw color values.
 * All other UI coloring should use Tailwind classes via scoreStyles / theme.
 */
export const CHART_COLORS = {
  strong: "#34d399",   // matches Tailwind emerald-400
  mid: "#fbbf24",      // matches Tailwind amber-400
  weak: "#f87171",     // matches Tailwind red-400
  grid: "#1e2028",
  axisText: "#6b7280", // matches Tailwind gray-500
  tooltipBg: "#1e2028",
  tooltipBorder: "#374151", // matches Tailwind gray-700
};
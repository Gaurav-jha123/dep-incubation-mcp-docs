/**
 * Returns Tailwind utility classes based on a numeric score (0–100).
 * Use these everywhere in JSX instead of inline hex colors.
 */

export const scoreTextClass = (value: number) => {
  if (value >= 75) return "text-emerald-400";
  if (value >= 50) return "text-amber-400";
  return "text-red-400";
};

export const scoreBarClass = (value: number) => {
  if (value >= 75) return "bg-emerald-400";
  if (value >= 50) return "bg-amber-400";
  return "bg-red-400";
};
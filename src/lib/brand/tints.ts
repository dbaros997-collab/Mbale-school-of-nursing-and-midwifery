/** Approved MBSNM tint scales for tables and charts — primary hues only. */
export const CHART_TINTS = [
  "#16357f", /* navy */
  "#198f34", /* service green */
  "#7eb8cc", /* sky (darkened for contrast) */
  "#1c428f", /* navy light */
  "#15782c", /* green dark */
] as const;

export const TINT_SCALE = {
  navy: ["#eef2f9", "#d4dff0", "#a9bfe1", "#7e9fd2", "#5280c3", "#16357f", "#0e2456"],
  sky: ["#f4fafb", "#dceef5", "#b5d9e5", "#8ec4d5", "#67afc5", "#4a98b0", "#3a7a8f"],
  green: ["#e8f5ea", "#c5e6cb", "#9dd4a8", "#75c285", "#198f34", "#15782c", "#0f5f22"],
  ivory: ["#ffffff", "#f4fafb", "#eef5f7", "#e8eff2"],
} as const;

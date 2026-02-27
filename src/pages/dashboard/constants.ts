export const DASHBOARD_ANIMATION_STYLE = `
  @keyframes fillProgress {
    from { width: 0%; }
    to { width: 100%; }
  }
  .animate-fill {
    animation: fillProgress 1s ease-out forwards;
  }
`;

export const STATUS_CONFIG = {
  RUNNING: { color: "bg-green-500", text: "가동중" },
  MAINTENANCE: { color: "bg-yellow-500", text: "점검중" },
  STOPPED: { color: "bg-red-500", text: "비가동" },
} as const;

export const STATUS_LEGEND = [
  { dot: "bg-green-500", label: "가동중" },
  { dot: "bg-yellow-500", label: "점검중" },
  { dot: "bg-red-500", label: "비가동" },
] as const;

export const CHART_BADGES = {
  BAR: { text: "BAR CHART", className: "bg-blue-100 text-blue-600" },
  LINE: {
    text: "Line Chart",
    className: "bg-green-100 text-green-600 uppercase",
  },
} as const;

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  hourly: () => [...dashboardKeys.all, "hourly"] as const,
  equipment: () => [...dashboardKeys.all, "equipment"] as const,
};

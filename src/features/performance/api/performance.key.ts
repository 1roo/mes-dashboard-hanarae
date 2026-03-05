export const performanceKeys = {
  all: ["performance"] as const,
  list: () => [...performanceKeys.all, "list"] as const,
  users: () => [...performanceKeys.all, "users"] as const,
};

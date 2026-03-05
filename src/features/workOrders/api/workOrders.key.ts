export const workOrdersKeys = {
  all: ["workOrders"] as const,
  list: () => [...workOrdersKeys.all, "list"] as const,
};

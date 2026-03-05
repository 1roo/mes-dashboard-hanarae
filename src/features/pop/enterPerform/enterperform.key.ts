export const enterPerformKeys = {
  all: () => ["enterPerform"] as const,

  me: () => [...enterPerformKeys.all(), "me"] as const,

  workOrdersByOperator: (operatorName: string) =>
    [...enterPerformKeys.all(), "workOrdersByOperator", operatorName] as const,

  todayResultsByOperator: (operatorId: string, ymd: string) =>
    [
      ...enterPerformKeys.all(),
      "todayResultsByOperator",
      operatorId,
      ymd,
    ] as const,
};

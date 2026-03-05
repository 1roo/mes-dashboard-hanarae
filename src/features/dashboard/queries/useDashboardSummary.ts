import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";
import { dashboardKeys } from "./dashboard.keys";

export const useDashboardSummaryQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: dashboardApi.summary,
    staleTime: 30_000,
  });
};

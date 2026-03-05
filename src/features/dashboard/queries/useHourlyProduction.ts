import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";
import { dashboardKeys } from "./dashboard.keys";

export const useHourlyProductionQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.hourly(),
    queryFn: dashboardApi.hourly,
    staleTime: 10_000,
  });
};

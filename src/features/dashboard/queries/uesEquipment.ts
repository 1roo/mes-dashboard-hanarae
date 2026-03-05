import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";
import { dashboardKeys } from "./dashboard.keys";

export const useEquipmentQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.equipment(),
    queryFn: dashboardApi.equipment,
    staleTime: 10_000,
  });
};

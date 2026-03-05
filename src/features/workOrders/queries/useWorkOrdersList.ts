import { useQuery } from "@tanstack/react-query";
import { workOrdersApi } from "../api/workOrders.api";
import { workOrdersKeys } from "../api/workOrders.key";

export const useWorkOrdersList = () => {
  const q = useQuery({
    queryKey: workOrdersKeys.list(),
    queryFn: workOrdersApi.list,
  });

  return {
    rows: q.data ?? [],
    loading: q.isLoading,
    error: q.error,
    refetch: q.refetch,
  };
};

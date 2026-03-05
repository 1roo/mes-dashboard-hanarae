import { useDashboardSummaryQuery } from "./useDashboardSummary";
import { useHourlyProductionQuery } from "./useHourlyProduction";
import { useEquipmentQuery } from "./uesEquipment";

export const useDashboard = () => {
  const summaryQuery = useDashboardSummaryQuery();
  const hourlyQuery = useHourlyProductionQuery();
  const equipQuery = useEquipmentQuery();

  const summaryData = summaryQuery.data ?? [];
  const hourlyData = hourlyQuery.data ?? [];
  const equipData = equipQuery.data ?? [];

  const summary = summaryData[0];

  const loading =
    summaryQuery.isLoading || hourlyQuery.isLoading || equipQuery.isLoading;

  return {
    summary,
    summaryData,
    hourlyData,
    equipData,
    loading,
  };
};

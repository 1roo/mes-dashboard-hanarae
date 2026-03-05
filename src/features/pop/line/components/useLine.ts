import { useLineData } from "./useLineData";
import { useLineMetrics } from "./useLineMetrics";
import type { LineValue } from "../type";

type Params = {
  refreshKey: number;
  onRefreshed: () => void;
  selectedLine: LineValue;
};

export const useLine = ({ refreshKey, onRefreshed, selectedLine }: Params) => {
  const { loading, rows, hourlyProduction, equipment } = useLineData({
    refreshKey,
    onRefreshed,
  });

  const { lineRows, metrics } = useLineMetrics({ rows, selectedLine });

  return {
    loading,
    metrics,
    lineRows,
    hourlyProduction,
    equipment,
  };
};

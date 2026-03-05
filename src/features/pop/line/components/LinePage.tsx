import Spinner from "../../../../shared/ui/Spinner";
import { useLine } from "./useLine";
import type { LineValue } from "../type";
import SummaryCard from "./SummaryCard";
import WorkOrderPanel from "./WorkOrderPanel";
import HourlyProduction from "./HourlyProduction";
import EquipmentPanel from "./EquipmentPanel";

type Props = {
  refreshKey: number;
  onRefreshed: () => void;
  selectedLine: LineValue;
};

const LinePage = ({ refreshKey, onRefreshed, selectedLine }: Props) => {
  const { loading, metrics, lineRows, hourlyProduction, equipment } = useLine({
    refreshKey,
    onRefreshed,
    selectedLine,
  });

  if (loading) return <Spinner />;

  return (
    <div className="p-2 flex flex-col min-h-0">
      <SummaryCard metrics={metrics} selectedLine={selectedLine} />

      <div className="flex justify-between mt-5 flex-1 min-h-0 gap-5">
        <div className="w-1/3 min-h-0 h-full">
          <WorkOrderPanel rows={lineRows} selectedLine={selectedLine} />
        </div>

        <div className="w-1/3 min-h-0 h-full">
          <HourlyProduction data={hourlyProduction} />
        </div>

        <div className="w-1/3 min-h-0 h-full">
          <EquipmentPanel rows={equipment} selectedLine={selectedLine} />
        </div>
      </div>
    </div>
  );
};
export default LinePage;

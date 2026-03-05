import DashBoardChart from "./DashBoardChart";
import SummaryCards from "./SummaryCard";
import DashBoardTable from "./DashBoardTable";
import { useDashboard } from "../queries/useDashBoard";

const DashBoardPage = () => {
  const { summary, hourlyData, equipData, loading } = useDashboard();

  return (
    <div className="h-full min-h-0 flex flex-col gap-4 bg-gray-50">
      <div className="shrink-0">
        <SummaryCards summary={summary} loading={loading} />
      </div>

      <div className="shrink-0">
        <DashBoardChart hourlyData={hourlyData} />
      </div>

      <div className="flex-1 min-h-0">
        <DashBoardTable equipData={equipData} loading={loading} />
      </div>
    </div>
  );
};

export default DashBoardPage;

import DashBoardChart from "./DashBoardChart";
import SummaryCards from "./SummaryCard";
import DashBoardTable from "./DashBoardTable";
import { useDashBoard } from "./useDashBoard";

const DashBoardPage = () => {
  const { summary, hourlyData, equipData, loading } = useDashBoard();

  return (
    <div className=" bg-gray-50 ">
      <SummaryCards summary={summary} loading={loading} />

      <DashBoardChart hourlyData={hourlyData} />

      <DashBoardTable equipData={equipData} loading={loading} />
    </div>
  );
};

export default DashBoardPage;

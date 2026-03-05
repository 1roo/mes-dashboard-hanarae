import { HourlyProductionLine } from "./HourlyProductionLine";
import { LineProductionBar } from "./LineProductionBar";
import { DefectTypePie } from "./DefectTypePie";
import { DefectRateArea } from "./DefectRateArea";
import { PercentGauge } from "./PercentGauge";
import { TargetVsActual } from "./TargetVsActual";

export default function MesDashboardChartsDemo() {
  const hourly = [
    { hour: "08:00", planned: 60, actual: 58 },
    { hour: "09:00", planned: 60, actual: 62 },
    { hour: "10:00", planned: 60, actual: 55 },
    { hour: "11:00", planned: 60, actual: 63 },
    { hour: "12:00", planned: 30, actual: 28 },
    { hour: "13:00", planned: 60, actual: 61 },
    { hour: "14:00", planned: 60, actual: 57 },
    { hour: "15:00", planned: 60, actual: 65 },
    { hour: "16:00", planned: 60, actual: 59 },
    { hour: "17:00", planned: 60, actual: 62 },
  ];

  const byLine = [
    { line: "A라인", qty: 420 },
    { line: "B라인", qty: 390 },
    { line: "C라인", qty: 455 },
  ];

  const defectType = [
    { type: "스크래치", count: 12 },
    { type: "오염", count: 7 },
    { type: "치수불량", count: 4 },
    { type: "기타", count: 2 },
  ];

  const defectRate = [
    { date: "03-01", rate: 1.4 },
    { date: "03-02", rate: 1.1 },
    { date: "03-03", rate: 1.7 },
    { date: "03-04", rate: 1.3 },
    { date: "03-05", rate: 1.5 },
  ];

  const targetVs = [
    { label: "A라인", target: 450, actual: 420 },
    { label: "B라인", target: 420, actual: 390 },
    { label: "C라인", target: 480, actual: 455 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <HourlyProductionLine data={hourly} />
      <LineProductionBar data={byLine} />
      <DefectTypePie data={defectType} />
      <DefectRateArea data={defectRate} />
      <PercentGauge title="가동률" value={86.4} />
      <TargetVsActual data={targetVs} />
    </div>
  );
}

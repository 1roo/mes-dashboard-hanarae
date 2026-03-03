import type { LineMetrics, LineValue } from "./type";

type Props = {
  metrics: LineMetrics;
  selectedLine: LineValue;
};

const formatNumber = (v: number) => v.toLocaleString("ko-KR");

const SummaryCard = ({ metrics, selectedLine }: Props) => {
  const width = Math.min(metrics.achievementRate, 100);

  return (
    <section className="grid grid-cols-4 gap-4 mt-4">
      <div className="bg-white p-3 rounded-md shadow-sm">
        <div>오늘 목표</div>
        <div className="text-3xl font-bold">
          {formatNumber(metrics.plannedTotal)}
        </div>
        <div>EA({selectedLine})</div>
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm">
        <div>현재 실적</div>
        <div className="text-3xl font-bold text-blue-600">
          {formatNumber(metrics.completedTotal)}
        </div>
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm">
        <div>달성률</div>
        <div className="text-3xl font-bold text-green-600">
          {metrics.achievementRate.toFixed(1)}%
        </div>
        <div className="w-full bg-gray-200 h-2 mt-3">
          <div className="bg-green-600 h-full" style={{ width: `${width}%` }} />
        </div>
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm">
        <div>불량률</div>
        <div className="text-3xl font-bold text-red-600">
          {metrics.defectRate.toFixed(1)}%
        </div>
        <div>{formatNumber(metrics.defectTotal)}개 불량 발생</div>
      </div>
    </section>
  );
};

export default SummaryCard;

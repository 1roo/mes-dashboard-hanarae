import Spinner from "../../../shared/ui/Spinner";
import { DASHBOARD_ANIMATION_STYLE } from "./constants";
import { LINES, useLine } from "./useLine";
import type { LinePageProps as Props } from "./type";

const formatNumber = (value: number) => value.toLocaleString("ko-KR");

const LinePage = ({ refreshKey, onRefreshed }: Props) => {
  const { selectedLine, setSelectedLine, loading, metrics } = useLine({
    refreshKey,
    onRefreshed,
  });

  if (loading) return <Spinner />;

  return (
    <div className="p-2">
      <style>{DASHBOARD_ANIMATION_STYLE}</style>

      <div className="flex gap-2">
        {LINES.map((l) => {
          const active = selectedLine === l.value;
          return (
            <button
              key={l.value}
              type="button"
              onClick={() => setSelectedLine(l.value)}
              className={[
                "px-4 py-1 border border-blue-600 rounded-md",
                active
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 hover:bg-gray-200",
              ].join(" ")}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      <section className="grid grid-cols-4 gap-4 mt-4">
        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">오늘 목표</span>
          <p className="text-5xl font-bold text-violet-600 mt-3">
            {formatNumber(metrics.plannedTotal)}
          </p>
          <span className="text-sm text-gray-500 font-medium">
            EA({selectedLine})
          </span>
        </article>

        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">현재 실적</span>
          <p className="text-5xl font-bold text-blue-600 mt-3">
            {formatNumber(metrics.completedTotal)}
          </p>
          <span className="text-sm text-gray-500 font-medium">EA생산완료</span>
        </article>

        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">달성률</span>
          <p className="text-5xl font-bold text-green-600 mt-3">
            {`${metrics.achievementRate.toFixed(1)}%`}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-7">
            <div
              className="bg-green-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${metrics.achievementWidth.toFixed(1)}%` }}
            />
          </div>
        </article>

        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">불량률</span>
          <p className="text-5xl font-bold text-red-600 mt-3">
            {`${metrics.defectRate.toFixed(1)}%`}
          </p>
          <span className="text-sm text-gray-500">
            {formatNumber(metrics.defectTotal)}개 불량 발생
          </span>
        </article>
      </section>
    </div>
  );
};
export default LinePage;

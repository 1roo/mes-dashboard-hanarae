import Spinner from "../../shared/ui/Spinner";
import { CircularProgress } from "../../shared/ui/DonutChart";
import type { DashboardSummary } from "./type";
import { DASHBOARD_ANIMATION_STYLE } from "./constants";

type Props = {
  summary?: DashboardSummary;
  loading: boolean;
};

const SummaryCards = ({ summary, loading }: Props) => {
  const plannedQty = summary?.plannedQty ?? 0;
  const actualQty = summary?.actualQty ?? 0;

  const actualWidth =
    plannedQty > 0 ? Math.min((actualQty / plannedQty) * 100, 100) : 0;

  if (loading) {
    return (
      <section className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <article
            key={i}
            className="border border-gray-200 rounded-md bg-white shadow-sm min-h-35 flex items-center justify-center"
          >
            <Spinner />
          </article>
        ))}
      </section>
    );
  }

  return (
    <>
      <style>{DASHBOARD_ANIMATION_STYLE}</style>

      <section className="grid grid-cols-4 gap-4">
        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">생산계획</span>
          <p className="text-2xl font-bold text-violet-600 mt-1">
            {plannedQty.toLocaleString()}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-7 overflow-hidden">
            <div className="bg-violet-600 h-full rounded-full w-0 animate-fill" />
          </div>
        </article>

        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">실 생산</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {actualQty.toLocaleString()}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-7">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${actualWidth}%` }}
            />
          </div>
        </article>

        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm flex flex-col items-center">
          <div className="w-full text-left mb-2">
            <span className="text-sm text-gray-500 font-medium">달성률</span>
          </div>
          <CircularProgress
            rate={summary?.achievementRate || 0}
            color="#16a34a"
          />
        </article>

        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm flex flex-col items-center">
          <div className="w-full text-left mb-2">
            <span className="text-sm text-gray-500 font-medium">불량률</span>
          </div>
          <CircularProgress rate={summary?.defectRate || 0} color="#dc2626" />
        </article>
      </section>
    </>
  );
};

export default SummaryCards;

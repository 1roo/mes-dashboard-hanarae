import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "./ChartCard";

type TargetActualPoint = {
  label: string; // "A라인" or "08:00"
  target: number;
  actual: number;
};

const formatNumber = (v: unknown) =>
  typeof v === "number" ? v.toLocaleString("ko-KR") : String(v ?? "");

export function TargetVsActual({ data }: { data: TargetActualPoint[] }) {
  return (
    <ChartCard title="목표 대비 실적">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 18, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={(v) => formatNumber(v)} />
          <Tooltip formatter={(v) => formatNumber(v)} />
          <Bar dataKey="target" />
          <Line type="monotone" dataKey="actual" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

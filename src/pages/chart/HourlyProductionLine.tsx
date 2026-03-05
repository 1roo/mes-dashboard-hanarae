import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "./ChartCard";

type HourlyProductionPoint = {
  hour: string; // "08:00"
  actual: number;
  planned: number;
};

const formatNumber = (v: unknown) =>
  typeof v === "number" ? v.toLocaleString("ko-KR") : String(v ?? "");

export function HourlyProductionLine({
  data,
}: {
  data: HourlyProductionPoint[];
}) {
  return (
    <ChartCard title="시간별 생산량">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 18, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis tickFormatter={(v) => formatNumber(v)} />
          <Tooltip formatter={(v) => formatNumber(v)} />
          <Line type="monotone" dataKey="planned" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="actual" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

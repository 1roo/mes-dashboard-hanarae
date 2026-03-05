import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "./ChartCard";

type LineProductionPoint = {
  line: string; // "A라인"
  qty: number;
};

const formatNumber = (v: unknown) =>
  typeof v === "number" ? v.toLocaleString("ko-KR") : String(v ?? "");

export function LineProductionBar({ data }: { data: LineProductionPoint[] }) {
  return (
    <ChartCard title="라인별 생산량">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 18, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="line" />
          <YAxis tickFormatter={(v) => formatNumber(v)} />
          <Tooltip formatter={(v) => formatNumber(v)} />
          <Bar dataKey="qty" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

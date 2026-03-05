import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "./ChartCard";

type DefectRatePoint = {
  date: string; // "03-01"
  rate: number; // 0~100
};

export function DefectRateArea({ data }: { data: DefectRatePoint[] }) {
  return (
    <ChartCard title="불량률(%) 추이">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 18, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Area type="monotone" dataKey="rate" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

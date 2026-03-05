import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";
import { ChartCard } from "./ChartCard";

type DefectTypePoint = {
  type: string; // "스크래치"
  count: number;
};

const formatNumber = (v: unknown) =>
  typeof v === "number" ? v.toLocaleString("ko-KR") : String(v ?? "");

export function DefectTypePie({ data }: { data: DefectTypePoint[] }) {
  return (
    <ChartCard title="불량 유형 비중">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip formatter={(v) => formatNumber(v)} />
          <Legend />
          <Pie
            data={data}
            dataKey="count"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={85}
            label
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// src/shared/ui/GroupedBarChart.tsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 데이터를 넘겨주는 쪽의 타입과 이름을 맞춥니다.
interface BarData {
  hour: string;
  planned: number;
  actual: number;
}

interface Props {
  data: BarData[];
}

export const GroupedBarChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
        />
        {/* dataKey를 'time'으로 수정 */}
        <XAxis
          dataKey="hour"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
        />
        {/* <Tooltip
          cursor={{ fill: "#f9fafb" }}
          contentStyle={{ borderRadius: "8px", border: "none" }}
        /> */}
        <Legend
          verticalAlign="bottom"
          align="left"
          iconType="rect"
          formatter={(value) => (
            <span className="text-[12px] text-gray-400">{value}</span>
          )}
          wrapperStyle={{ paddingLeft: "20px" }}
        />

        {/* dataKey를 'planned'와 'actual'로 수정 */}
        <Bar
          dataKey="planned"
          name="계획"
          fill="#7c3aed"
          radius={[2, 2, 0, 0]}
          barSize={12}
        />
        <Bar
          dataKey="actual"
          name="실생산"
          fill="#3b82f6"
          radius={[2, 2, 0, 0]}
          barSize={12}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: {
    hour: string;
    planned: number;
    actual: number;
  }[];
}

export const TrendLineChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          {/* 실생산용 그라데이션 */}
          <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
          {/* 계획용 그라데이션 */}
          <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
        />
        <XAxis
          dataKey="hour"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 11 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 11 }}
        />

        {/* <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        /> */}

        {/* 범례 추가 */}
        <Legend
          verticalAlign="bottom"
          align="left"
          iconType="rect"
          iconSize={12}
          formatter={(value) => (
            <span className="text-[12px] text-gray-400 ml-1">{value}</span>
          )}
          wrapperStyle={{ paddingTop: "20px", marginLeft: "20px" }}
        />

        <Area
          type="monotone"
          dataKey="planned"
          stroke="#7c3aed"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorPlanned)"
          name="계획"
          activeDot={false}
        />

        <Area
          type="monotone"
          dataKey="actual"
          stroke="#16a34a"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorActual)"
          name="실생산"
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";

type GaugeProps = {
  title: string;
  value: number; // 0~100
};

export function PercentGauge({ title, value }: GaugeProps) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

  const data = [{ name: title, value: safe }];

  return (
    <ChartCard
      title={title}
      right={
        <span className="text-sm font-bold text-gray-900">
          {safe.toFixed(1)}%
        </span>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            dataKey="value"
            tick={false}
            axisLine={false}
          />

          <RadialBar dataKey="value" cornerRadius={999} background />
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

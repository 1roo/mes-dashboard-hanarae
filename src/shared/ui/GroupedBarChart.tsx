import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export interface BarData {
  hour: string;
  planned: number;
  actual: number;
}

type Props = {
  data: BarData[];

  // ✅ 새 옵션 (안 주면 기존과 동일하게 동작)
  showNowLine?: boolean; // 기본 false
  nowLineColor?: string; // 기본 "#ef4444"
  nowLineDash?: string; // 기본 "6 6"
};

const getNearestHourLabel = (data: BarData[]) => {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  let best: { label: string; diff: number } | null = null;

  for (const d of data) {
    const [hh, mm] = d.hour.split(":").map(Number);
    const m = hh * 60 + mm;
    const diff = Math.abs(m - nowMinutes);
    if (!best || diff < best.diff) best = { label: d.hour, diff };
  }

  return best?.label ?? null;
};

const getNowText = () => {
  return `NOW`;
};

export const GroupedBarChart = ({
  data,
  showNowLine = false,
  nowLineColor = "#ef4444",
  nowLineDash = "6 6",
}: Props) => {
  const nowHourLabel = showNowLine ? getNearestHourLabel(data) : null;

  return (
    <ResponsiveContainer width="100%" height={200}>
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

        <Legend
          verticalAlign="bottom"
          align="left"
          iconType="rect"
          formatter={(value) => (
            <span className="text-[12px] text-gray-400">{value}</span>
          )}
          wrapperStyle={{ paddingLeft: "20px" }}
        />

        {/* ✅ 옵션 켰을 때만 현재시간 점선과 라벨 */}
        {showNowLine && nowHourLabel && (
          <ReferenceLine
            x={nowHourLabel}
            stroke={nowLineColor}
            strokeDasharray={nowLineDash}
            label={{
              value: getNowText(),
              position: "top",
              fill: nowLineColor,
              fontSize: 12,
            }}
          />
        )}

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

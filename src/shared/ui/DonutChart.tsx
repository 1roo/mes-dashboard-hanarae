import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  rate: number; // 퍼센트 (0~100)
  color: string; // 진행바 색상 (예: '#2563eb')
}

export const CircularProgress = ({ rate, color }: Props) => {
  // 1. 차트 데이터 구성
  const data = [{ value: rate }, { value: 100 - rate }];

  // 2. 색상 설정 (배경색은 연한 회색으로 고정하거나 이것도 props로 받을 수 있음)
  const COLORS = [color, "#E5E7EB"];

  return (
    <div className="h-24 w-28 relative mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="60%"
            innerRadius={40}
            outerRadius={50}
            paddingAngle={0}
            dataKey="value"
            startAngle={180}
            endAngle={0}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* 중앙 텍스트 수치 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold" style={{ color }}>
          {rate}%
        </span>
      </div>
    </div>
  );
};

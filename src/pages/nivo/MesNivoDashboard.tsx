import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";

/** ---------- 공통 카드 ---------- */
function Card({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {subtitle ? (
            <p className="text-xs text-gray-500">{subtitle}</p>
          ) : null}
        </div>
        {right}
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}

/** ---------- Nivo 공통 theme ---------- */
const nivoTheme = {
  background: "transparent",
  text: { fontSize: 12, fill: "#111827" },
  axis: {
    domain: { line: { stroke: "#E5E7EB" } },
    ticks: {
      line: { stroke: "#E5E7EB" },
      text: { fill: "#6B7280" },
    },
    legend: { text: { fill: "#6B7280" } },
  },
  grid: { line: { stroke: "#F3F4F6" } },
  legends: { text: { fill: "#6B7280" } },
  tooltip: {
    container: {
      background: "white",
      color: "#111827",
      fontSize: 12,
      borderRadius: 12,
      boxShadow: "0 10px 25px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
      padding: "10px 12px",
    },
  },
} as const;

const fmt = (n: number) => n.toLocaleString("ko-KR");

/** ---------- (1) 라인별 생산량 Bar: 목표 vs 실적 ---------- */
type LineRow = { line: string; target: number; actual: number };
function LineProductionBar({ data }: { data: LineRow[] }) {
  const totalTarget = data.reduce((s, r) => s + r.target, 0);
  const totalActual = data.reduce((s, r) => s + r.actual, 0);
  const rate = totalTarget <= 0 ? 0 : (totalActual / totalTarget) * 100;

  return (
    <Card
      title="라인별 생산량"
      subtitle="목표 vs 실적"
      right={
        <div className="text-right">
          <div className="text-xs text-gray-500">달성률</div>
          <div className="text-lg font-extrabold text-gray-900">
            {rate.toFixed(1)}%
          </div>
        </div>
      }
    >
      <ResponsiveBar
        data={data}
        keys={["target", "actual"]}
        indexBy="line"
        margin={{ top: 10, right: 18, bottom: 40, left: 52 }}
        padding={0.35}
        groupMode="grouped"
        enableLabel={false}
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 0, tickPadding: 10 }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          legend: "수량",
          legendOffset: -42,
          legendPosition: "middle",
        }}
        gridYValues={5}
        colors={({ id }) => (id === "actual" ? "#2563EB" : "#94A3B8")}
        borderRadius={6}
        theme={nivoTheme}
        tooltip={({ id, value, indexValue }) => (
          <div>
            <div className="text-xs text-gray-500">{String(indexValue)}</div>
            <div className="font-semibold">
              {String(id)}: {fmt(Number(value))}
            </div>
          </div>
        )}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom",
            direction: "row",
            translateY: 42,
            itemWidth: 90,
            itemHeight: 18,
            symbolSize: 10,
            symbolShape: "circle",
          },
        ]}
      />
    </Card>
  );
}

/** ---------- (2) 시간별 생산량 Line: 계획/실적 ---------- */
type SeriesPoint = { x: string; y: number };
type Series = { id: string; data: SeriesPoint[] };

function HourlyProductionLine({ series }: { series: Series[] }) {
  return (
    <Card title="시간별 생산량" subtitle="계획/실적 추이">
      <ResponsiveLine
        data={series}
        margin={{ top: 10, right: 18, bottom: 40, left: 52 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: 0, max: "auto", stacked: false }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 0, tickPadding: 10 }}
        axisLeft={{ tickSize: 0, tickPadding: 10 }}
        colors={(d) => (d.id === "실적" ? "#2563EB" : "#94A3B8")}
        lineWidth={3}
        pointSize={6}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointColor="#FFFFFF"
        enableArea
        areaOpacity={0.08}
        enableGridX={false}
        gridYValues={5}
        useMesh
        theme={nivoTheme}
        tooltip={({ point }) => (
          <div>
            <div className="text-xs text-gray-500">{String(point.data.x)}</div>
            <div className="font-semibold">
              {String(point.serieId)}: {fmt(Number(point.data.y))}
            </div>
          </div>
        )}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            translateY: 42,
            itemWidth: 80,
            itemHeight: 18,
            symbolSize: 10,
            symbolShape: "circle",
          },
        ]}
      />
    </Card>
  );
}

/** ---------- (3) 불량 유형 파레토: Bar(건수) + Line(누적%) ---------- */
type DefectRow = { type: string; count: number };

function DefectPareto({ rows }: { rows: DefectRow[] }) {
  // count desc 정렬 + 누적 비율 계산
  const sorted = [...rows].sort((a, b) => b.count - a.count);
  const total = sorted.reduce((s, r) => s + r.count, 0) || 1;

  const barData = sorted.map((r) => ({ type: r.type, count: r.count }));
  let acc = 0;
  const lineSeries: Series[] = [
    {
      id: "누적%",
      data: sorted.map((r) => {
        acc += r.count;
        const pct = (acc / total) * 100;
        return { x: r.type, y: Number(pct.toFixed(1)) };
      }),
    },
  ];

  return (
    <Card title="불량 유형 파레토" subtitle="불량 건수 + 누적 비율(%)">
      <div className="grid h-full grid-cols-12 gap-3">
        <div className="col-span-7">
          <ResponsiveBar
            data={barData}
            keys={["count"]}
            indexBy="type"
            margin={{ top: 10, right: 10, bottom: 60, left: 52 }}
            padding={0.35}
            enableLabel={false}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 10,
              tickRotation: -25,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 10,
              legend: "건수",
              legendOffset: -42,
              legendPosition: "middle",
            }}
            gridYValues={5}
            colors={() => "#2563EB"}
            borderRadius={6}
            theme={nivoTheme}
            tooltip={({ value, indexValue }) => (
              <div>
                <div className="text-xs text-gray-500">
                  {String(indexValue)}
                </div>
                <div className="font-semibold">건수: {fmt(Number(value))}</div>
              </div>
            )}
          />
        </div>

        <div className="col-span-5">
          <ResponsiveLine
            data={lineSeries}
            margin={{ top: 10, right: 18, bottom: 60, left: 46 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: 100, stacked: false }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 10,
              tickRotation: -25,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 10,
              tickValues: [0, 20, 40, 60, 80, 100],
              format: (v) => `${v}%`,
            }}
            colors={() => "#94A3B8"}
            lineWidth={3}
            pointSize={6}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointColor="#FFFFFF"
            enableArea={false}
            enableGridX={false}
            gridYValues={[0, 20, 40, 60, 80, 100]}
            useMesh
            theme={nivoTheme}
            tooltip={({ point }) => (
              <div>
                <div className="text-xs text-gray-500">
                  {String(point.data.x)}
                </div>
                <div className="font-semibold">
                  누적: {Number(point.data.y)}%
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </Card>
  );
}

/** ---------- (4) 가동률 게이지: Pie(도넛) ---------- */
function PercentGauge({
  title,
  value,
}: {
  title: string;
  value: number; // 0~100
}) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

  const data = [
    { id: "filled", label: "filled", value: safe },
    { id: "empty", label: "empty", value: 100 - safe },
  ];

  return (
    <Card
      title={title}
      subtitle="현재 가동률"
      right={
        <div className="text-right">
          <div className="text-xs text-gray-500">가동률</div>
          <div className="text-lg font-extrabold text-gray-900">
            {safe.toFixed(1)}%
          </div>
        </div>
      }
    >
      <ResponsivePie
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        innerRadius={0.75}
        padAngle={1}
        cornerRadius={10}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        colors={(d) => (d.id === "filled" ? "#2563EB" : "#E5E7EB")}
        theme={nivoTheme}
        tooltip={({ datum }) =>
          datum.id === "filled" ? (
            <div className="font-semibold">{safe.toFixed(1)}%</div>
          ) : (
            <div className="font-semibold">{(100 - safe).toFixed(1)}%</div>
          )
        }
        legends={[]}
      />
      <div className="pointer-events-none relative -mt-40 flex h-40 items-center justify-center">
        <div className="text-center">
          <div className="text-xs text-gray-500">OEE / 가동률</div>
          <div className="text-2xl font-extrabold text-gray-900">
            {safe.toFixed(1)}%
          </div>
        </div>
      </div>
    </Card>
  );
}

/** ---------- 대시보드 페이지 ---------- */
export default function MesNivoDashboard() {
  const byLine: LineRow[] = [
    { line: "A라인", target: 450, actual: 420 },
    { line: "B라인", target: 420, actual: 390 },
    { line: "C라인", target: 480, actual: 455 },
  ];

  const hourlySeries: Series[] = [
    {
      id: "계획",
      data: [
        { x: "08:00", y: 60 },
        { x: "09:00", y: 60 },
        { x: "10:00", y: 60 },
        { x: "11:00", y: 60 },
        { x: "12:00", y: 30 },
        { x: "13:00", y: 60 },
        { x: "14:00", y: 60 },
        { x: "15:00", y: 60 },
        { x: "16:00", y: 60 },
        { x: "17:00", y: 60 },
      ],
    },
    {
      id: "실적",
      data: [
        { x: "08:00", y: 58 },
        { x: "09:00", y: 62 },
        { x: "10:00", y: 55 },
        { x: "11:00", y: 63 },
        { x: "12:00", y: 28 },
        { x: "13:00", y: 61 },
        { x: "14:00", y: 57 },
        { x: "15:00", y: 65 },
        { x: "16:00", y: 59 },
        { x: "17:00", y: 62 },
      ],
    },
  ];

  const defectRows: DefectRow[] = [
    { type: "스크래치", count: 12 },
    { type: "오염", count: 7 },
    { type: "치수불량", count: 4 },
    { type: "기타", count: 2 },
  ];

  const uptime = 86.4;

  return (
    <div className="space-y-4">
      {/* 상단 요약 바(원하면 KPI 카드들 추가 가능) */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              MES 대시보드
            </h2>
            <p className="text-sm text-gray-500">
              생산/불량/가동률 요약 (Nivo)
            </p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl bg-gray-50 px-4 py-2">
              <div className="text-xs text-gray-500">총 목표</div>
              <div className="text-base font-bold text-gray-900">
                {fmt(byLine.reduce((s, r) => s + r.target, 0))}
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 px-4 py-2">
              <div className="text-xs text-gray-500">총 실적</div>
              <div className="text-base font-bold text-gray-900">
                {fmt(byLine.reduce((s, r) => s + r.actual, 0))}
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 px-4 py-2">
              <div className="text-xs text-gray-500">가동률</div>
              <div className="text-base font-bold text-gray-900">
                {uptime.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 그리드 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LineProductionBar data={byLine} />
        <HourlyProductionLine series={hourlySeries} />
        <DefectPareto rows={defectRows} />
        <PercentGauge title="가동률" value={uptime} />
      </div>
    </div>
  );
}

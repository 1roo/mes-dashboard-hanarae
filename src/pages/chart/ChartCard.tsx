import React from "react";

export function ChartCard({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {right}
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}

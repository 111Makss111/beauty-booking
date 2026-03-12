"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface ServicesPieChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  "#ec4899",
  "#f43f5e",
  "#d946ef",
  "#8b5cf6",
  "#3b82f6",
  "#06b6d4",
];

export default function ServicesPieChart({ data }: ServicesPieChartProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 border border-white shadow-sm flex flex-col h-full min-h-[300px]">
      <h3 className="text-lg font-bold text-slate-800 mb-1">
        Популярні послуги
      </h3>
      <p className="text-xs font-medium text-slate-400 mb-4">
        За доходом (поточний місяць)
      </p>

      <div className="flex-1 w-full relative">
        {data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
            Немає завершених записів
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                // ВИПРАВЛЕНО ТУТ: Безпечний тип
                formatter={(
                  value:
                    | string
                    | number
                    | readonly (string | number)[]
                    | undefined,
                ) => {
                  const safeValue = Array.isArray(value) ? value[0] : value;
                  return [`${safeValue ?? 0} ₴`, "Дохід"];
                }}
                contentStyle={{
                  borderRadius: "1rem",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ fontWeight: "bold", color: "#334155" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

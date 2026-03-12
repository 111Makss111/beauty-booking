"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/utils/currency"; // Імпортуємо утиліту

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 border border-white shadow-sm h-[350px] flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-6">
        Динаміка доходів
      </h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "1rem",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(
                value:
                  | string
                  | number
                  | readonly (string | number)[]
                  | undefined,
              ) => {
                // Витягуємо чисте число
                const numericValue = Array.isArray(value)
                  ? Number(value[0])
                  : Number(value);

                // Використовуємо нашу утиліту для злотих (zł)
                return [formatPrice(numericValue || 0), "Дохід"];
              }}
              labelStyle={{
                color: "#64748b",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#ec4899"
              strokeWidth={4}
              dot={{ r: 4, fill: "#ec4899", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

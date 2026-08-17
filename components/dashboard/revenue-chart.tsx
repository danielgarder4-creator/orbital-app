"use client";

import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { day: "Mon", revenue: 210 }, { day: "Tue", revenue: 340 }, { day: "Wed", revenue: 280 },
  { day: "Thu", revenue: 460 }, { day: "Fri", revenue: 520 }, { day: "Sat", revenue: 610 },
  { day: "Sun", revenue: 590 },
];

export function RevenueChart() {
  return (
    <div className="surface-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-medium">Revenue, last 7 days</h3>
          <p className="data-figure mt-1 text-xl font-semibold">€3,010</p>
        </div>
        <span className="rounded-pill bg-signal-success/10 px-2.5 py-1 text-xs font-mono text-signal-success">
          +18.4%
        </span>
      </div>
      <div className="mt-6 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C6CFF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#7C6CFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" stroke="#5C5C6E" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} />
            <YAxis stroke="#5C5C6E" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} width={40} />
            <Tooltip
              contentStyle={{ background: "#181822", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: "#9A9AAE" }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#7C6CFF" strokeWidth={2} fill="url(#revenueFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

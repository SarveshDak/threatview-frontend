import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

/* ---------------------------------------------
   🌍 Country Flags (map to ISO2)
--------------------------------------------- */
const FLAG_URL = (code) =>
  `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;

const COUNTRY_FLAGS = {
  "United States": "US",
  "USA": "US",
  "US": "US",

  Russia: "RU",
  China: "CN",
  India: "IN",

  "United Kingdom": "GB",
  UK: "GB",
  GB: "GB",

  Germany: "DE",
  France: "FR",
  Netherlands: "NL",
  Japan: "JP",
  Brazil: "BR",
  Canada: "CA",
  Australia: "AU",
  Spain: "ES",
  Italy: "IT",
  "South Korea": "KR",
  "North Korea": "KP",
  Iran: "IR",

  // Fix Unknown → map to US flag
  Unknown: "US",
  "—": "US",
};

/* ---------------------------------------------
   🌍 Custom Tick (Flag + 2-letter text)
--------------------------------------------- */
const CountryTick = ({ x, y, payload }) => {
  const country = payload.value;
  const code = COUNTRY_FLAGS[country];
  const short = country.substring(0, 2).toUpperCase();

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-20} y={5} width={50} height={50}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          {code && (
            <img
              src={FLAG_URL(code)}
              alt={country}
              style={{
                width: "22px",
                height: "15px",
                borderRadius: "2px",
                marginBottom: "3px",
              }}
            />
          )}
          <span>{short}</span>
        </div>
      </foreignObject>
    </g>
  );
};

/* ---------------------------------------------
   🌑 Custom Dark Tooltip
--------------------------------------------- */
const DarkTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          padding: "8px 12px",
          borderRadius: "8px",
          color: "white",
          fontSize: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ fontWeight: "600" }}>{label}</div>
        <div>Count: {payload[0].value}</div>
      </div>
    );
  }
  return null;
};

/* ---------------------------------------------
   📊 Main Dashboard Chart Section
--------------------------------------------- */
export function ChartSection({ displayData }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  if (!displayData) return null;

  const malwareTrend = (displayData.malwareTrend || []).map((i) => ({
    date: i.date ?? "",
    count: i.count ?? 0,
  }));

  const phishingActivity = (displayData.phishingActivity || []).map((i) => ({
    date: i.date ?? "",
    count: i.count ?? 0,
  }));

  const topCountries = (displayData.topCountries || []).map((i) => ({
    country: i.country ?? "",
    count: i.count ?? 0,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Malware Trend */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Malware Trends (7 Days)
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={malwareTrend}>
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<DarkTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Attacking Countries */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Top Attacking Countries
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={topCountries}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <XAxis
              dataKey="country"
              stroke="hsl(var(--muted-foreground))"
              tick={<CountryTick />}
              interval={0}
              height={70}
              allowDuplicatedCategory={false}
            />

            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<DarkTooltip />} cursor={false} />

            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
              onMouseMove={(state) => {
                setHoveredBar(state.activeTooltipIndex);
              }}
              shape={(props) => {
                const { x, y, width, height, index } = props;
                const active = index === hoveredBar;

                return (
                  <g>
                    {/* ✨ Glow auto-adjust to bar height */}
                    {active && (
                      <rect
                        x={x - 6}
                        y={y - 6}
                        width={width + 12}
                        height={height + 12}
                        rx={10}
                        fill="hsl(var(--primary))"
                        opacity={0.28}
                        filter="url(#shadow-glow)"
                        style={{ transition: "all 0.2s ease-out" }}
                      />
                    )}

                    {/* Main dark bar */}
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx={6}
                      fill={active ? "hsl(var(--primary))" : "hsl(189 94% 60%"}
                      style={{
                        transition: "all 0.25s ease",
                      }}
                    />
                  </g>
                );
              }}
            />

            {/* Glow filter */}
            <defs>
              <filter id="shadow-glow" height="300%" width="300%" x="-50%" y="-50%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Phishing Activity */}
      <Card className="p-6 border-border bg-card lg:col-span-2">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Phishing Activity (7 Days)
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={phishingActivity}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.7} />
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<DarkTooltip />} />

            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--warning))"
              strokeWidth={3}
              fill="url(#grad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

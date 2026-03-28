import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const randomInRange = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 10) / 10;

function generateData(hours: number) {
  const points = hours <= 24 ? 24 : 7 * 4;
  return Array.from({ length: points }, (_, i) => ({
    time: hours <= 24 ? `${String(i).padStart(2, "0")}:00` : `Day ${Math.floor(i / 4) + 1}`,
    temperature: randomInRange(3.2, 6.5),
    humidity: randomInRange(42, 62),
  }));
}

export function HistoricalChart() {
  const [tab, setTab] = useState<"24h" | "7d">("24h");
  const data = useMemo(() => generateData(tab === "24h" ? 24 : 168), [tab]);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Historical Data</h3>
        <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
          {(["24h", "7d"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-3 py-1 rounded-md transition-colors ${
                tab === t ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "24h" ? "Last 24 Hours" : "Last 7 Days"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 22%)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(200 15% 55%)" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(200 15% 55%)" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(215 25% 14%)",
                border: "1px solid hsl(215 20% 22%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(200 20% 95%)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Line type="monotone" dataKey="temperature" stroke="hsl(174 62% 47%)" strokeWidth={2} dot={false} name="Temp (°C)" />
            <Line type="monotone" dataKey="humidity" stroke="hsl(210 70% 55%)" strokeWidth={2} dot={false} name="Humidity (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

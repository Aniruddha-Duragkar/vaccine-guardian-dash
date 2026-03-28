import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface DataPoint {
  time: string;
  temperature: number;
  humidity: number;
}

export function HistoricalChart() {
  const [tab, setTab] = useState<"24h" | "7d">("24h");
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const hoursAgo = tab === "24h" ? 24 : 168;
      const since = new Date(Date.now() - hoursAgo * 3600000).toISOString();

      const { data: readings } = await supabase
        .from("temperature_readings")
        .select("temperature, humidity, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: true })
        .limit(200);

      if (readings) {
        setData(
          readings.map((r) => ({
            time:
              tab === "24h"
                ? new Date(r.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                : new Date(r.created_at).toLocaleDateString("en-IN", { weekday: "short", hour: "2-digit" }),
            temperature: Number(r.temperature),
            humidity: Number(r.humidity),
          }))
        );
      }
    };

    fetchHistory();
  }, [tab]);

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

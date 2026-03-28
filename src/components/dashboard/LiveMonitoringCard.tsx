import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Thermometer, Droplets } from "lucide-react";
import type { TemperaturePoint, VaccineData } from "@/hooks/useVaccineData";

interface Props {
  currentTemp: number;
  targetTemp: number;
  humidity: number;
  systemStatus: VaccineData["systemStatus"];
  history: TemperaturePoint[];
  onTargetChange: (temp: number) => void;
}

const statusColors: Record<string, string> = {
  Stable: "bg-success/20 text-success",
  Cooling: "bg-primary/20 text-primary",
  Heating: "bg-warning/20 text-warning",
  Warning: "bg-destructive/20 text-destructive",
};

export function LiveMonitoringCard({
  currentTemp,
  targetTemp,
  humidity,
  systemStatus,
  history,
  onTargetChange,
}: Props) {
  const [editTarget, setEditTarget] = useState(false);
  const [tempInput, setTempInput] = useState(targetTemp.toString());

  const handleSave = () => {
    const val = parseFloat(tempInput);
    if (!isNaN(val) && val >= 2 && val <= 8) onTargetChange(val);
    setEditTarget(false);
  };

  const tempColor =
    currentTemp > 8 || currentTemp < 2
      ? "text-destructive"
      : currentTemp > 7 || currentTemp < 3
      ? "text-warning"
      : "text-primary";

  return (
    <div className="glass-card p-5 glow-teal">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Live Monitoring
        </h2>
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusColors[systemStatus]}`}>
          {systemStatus}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="text-center">
          <Thermometer className={`w-5 h-5 mx-auto mb-1 ${tempColor}`} />
          <p className={`text-3xl font-bold font-mono ${tempColor}`}>{currentTemp}°C</p>
          <p className="text-[10px] text-muted-foreground mt-1">Current Temp</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground mb-1">Target</p>
          {editTarget ? (
            <div className="flex items-center justify-center gap-1">
              <input
                type="number"
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                className="w-14 text-center text-sm bg-secondary border border-border rounded px-1 py-0.5 text-foreground font-mono"
                min={2}
                max={8}
                step={0.5}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              <button onClick={handleSave} className="text-xs text-primary hover:underline">✓</button>
            </div>
          ) : (
            <p
              onClick={() => { setEditTarget(true); setTempInput(targetTemp.toString()); }}
              className="text-2xl font-bold font-mono text-foreground cursor-pointer hover:text-primary transition-colors"
            >
              {targetTemp}°C
            </p>
          )}
          <p className="text-[10px] text-muted-foreground mt-1">Click to edit</p>
        </div>
        <div className="text-center">
          <Droplets className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-2xl font-bold font-mono text-foreground">{humidity}%</p>
          <p className="text-[10px] text-muted-foreground mt-1">Humidity</p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 22%)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(200 15% 55%)" }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "hsl(200 15% 55%)" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(215 25% 14%)",
                border: "1px solid hsl(215 20% 22%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(200 20% 95%)",
              }}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="hsl(174 62% 47%)"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Activity(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}

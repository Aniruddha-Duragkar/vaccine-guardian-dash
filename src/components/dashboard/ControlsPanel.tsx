import { Snowflake, Flame, StopCircle, RefreshCw } from "lucide-react";

interface Props {
  onOverride: (mode: "cool" | "heat" | "stop") => void;
}

export function ControlsPanel({ onOverride }: Props) {
  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Manual Controls</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onOverride("cool")}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25 transition-colors"
        >
          <Snowflake className="w-3.5 h-3.5" /> Cool
        </button>
        <button
          onClick={() => onOverride("heat")}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-warning/15 text-warning text-xs font-medium hover:bg-warning/25 transition-colors"
        >
          <Flame className="w-3.5 h-3.5" /> Heat
        </button>
        <button
          onClick={() => onOverride("stop")}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-destructive/15 text-destructive text-xs font-medium hover:bg-destructive/25 transition-colors"
        >
          <StopCircle className="w-3.5 h-3.5" /> Stop
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>
    </div>
  );
}

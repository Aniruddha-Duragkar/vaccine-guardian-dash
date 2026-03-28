import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { Alert } from "@/hooks/useVaccineData";

interface Props {
  alerts: Alert[];
}

const iconMap = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  critical: "text-destructive border-destructive/30 bg-destructive/5",
  warning: "text-warning border-warning/30 bg-warning/5",
  info: "text-primary border-primary/30 bg-primary/5",
};

export function AlertsPanel({ alerts }: Props) {
  return (
    <div className="glass-card p-4 h-full">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-warning" />
        Recent Alerts
      </h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {alerts.map((alert) => {
          const Icon = iconMap[alert.level];
          return (
            <div key={alert.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${colorMap[alert.level]}`}>
              <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs leading-tight">{alert.message}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{alert.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

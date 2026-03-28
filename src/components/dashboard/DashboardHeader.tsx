import { Battery, Wifi, WifiOff } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface Props {
  batteryLevel: number;
  deviceOnline: boolean;
}

export function DashboardHeader({ batteryLevel, deviceOnline }: Props) {
  const batteryColor =
    batteryLevel > 50 ? "text-success" : batteryLevel > 20 ? "text-warning" : "text-destructive";

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div>
          <h1 className="text-sm font-semibold text-foreground">Smart Vaccine Micro-Climate</h1>
          <p className="text-[10px] text-muted-foreground">PID-Controlled Peltier Cooling System</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {deviceOnline ? (
            <Wifi className="w-4 h-4 text-success" />
          ) : (
            <WifiOff className="w-4 h-4 text-destructive" />
          )}
          <span className={`text-xs font-medium ${deviceOnline ? "text-success" : "text-destructive"}`}>
            {deviceOnline ? "Online" : "Offline"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Battery className={`w-4 h-4 ${batteryColor}`} />
          <span className={`text-xs font-medium font-mono ${batteryColor}`}>
            {batteryLevel.toFixed(0)}%
          </span>
        </div>
      </div>
    </header>
  );
}

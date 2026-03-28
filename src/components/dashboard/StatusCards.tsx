import { Battery, Snowflake, DoorOpen, DoorClosed, Wifi } from "lucide-react";
import type { VaccineData } from "@/hooks/useVaccineData";

interface Props {
  batteryLevel: number;
  peltierStatus: VaccineData["peltierStatus"];
  doorStatus: VaccineData["doorStatus"];
  signalStrength: number;
}

export function StatusCards({ batteryLevel, peltierStatus, doorStatus, signalStrength }: Props) {
  const cards = [
    {
      label: "Battery",
      value: `${batteryLevel.toFixed(0)}%`,
      icon: Battery,
      color: batteryLevel > 50 ? "text-success" : batteryLevel > 20 ? "text-warning" : "text-destructive",
    },
    {
      label: "Peltier",
      value: peltierStatus,
      icon: Snowflake,
      color: peltierStatus === "Cooling" ? "text-primary" : peltierStatus === "Heating" ? "text-warning" : "text-muted-foreground",
    },
    {
      label: "Door",
      value: doorStatus,
      icon: doorStatus === "Closed" ? DoorClosed : DoorOpen,
      color: doorStatus === "Closed" ? "text-success" : "text-destructive",
    },
    {
      label: "Signal",
      value: `${signalStrength}%`,
      icon: Wifi,
      color: signalStrength > 60 ? "text-success" : signalStrength > 30 ? "text-warning" : "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="glass-card p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${card.color}`}>
            <card.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{card.label}</p>
            <p className={`text-sm font-semibold font-mono ${card.color}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

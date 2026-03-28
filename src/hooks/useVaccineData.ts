import { useState, useEffect, useCallback } from "react";

export interface TemperaturePoint {
  time: string;
  temperature: number;
  humidity: number;
}

export interface Alert {
  id: string;
  message: string;
  timestamp: string;
  level: "critical" | "warning" | "info";
}

export interface VaccineData {
  currentTemp: number;
  targetTemp: number;
  humidity: number;
  batteryLevel: number;
  peltierStatus: "Cooling" | "Heating" | "Idle";
  doorStatus: "Closed" | "Open";
  signalStrength: number;
  deviceOnline: boolean;
  systemStatus: "Stable" | "Cooling" | "Heating" | "Warning";
  temperatureHistory: TemperaturePoint[];
  alerts: Alert[];
}

const generateTimeLabel = (minutesAgo: number) => {
  const d = new Date(Date.now() - minutesAgo * 60000);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const randomInRange = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 10) / 10;

const generateHistory = (points: number): TemperaturePoint[] =>
  Array.from({ length: points }, (_, i) => ({
    time: generateTimeLabel(points - i),
    temperature: randomInRange(3.5, 6.8),
    humidity: randomInRange(40, 65),
  }));

const sampleAlerts: Alert[] = [
  { id: "1", message: "Temperature exceeded 8°C", timestamp: "14:32", level: "critical" },
  { id: "2", message: "Door opened for >30s", timestamp: "13:15", level: "warning" },
  { id: "3", message: "Battery below 20%", timestamp: "12:48", level: "warning" },
  { id: "4", message: "Temperature spike detected", timestamp: "11:20", level: "critical" },
  { id: "5", message: "System cooled to target", timestamp: "10:05", level: "info" },
];

export function useVaccineData() {
  const [data, setData] = useState<VaccineData>({
    currentTemp: 4.8,
    targetTemp: 5,
    humidity: 52,
    batteryLevel: 73,
    peltierStatus: "Cooling",
    doorStatus: "Closed",
    signalStrength: 85,
    deviceOnline: true,
    systemStatus: "Stable",
    temperatureHistory: generateHistory(20),
    alerts: sampleAlerts,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newTemp = Math.max(2, Math.min(8.5, prev.currentTemp + randomInRange(-0.4, 0.4)));
        const newHumidity = Math.max(35, Math.min(70, prev.humidity + randomInRange(-2, 2)));
        const newBattery = Math.max(0, prev.batteryLevel - 0.1);
        const newPoint: TemperaturePoint = {
          time: generateTimeLabel(0),
          temperature: newTemp,
          humidity: newHumidity,
        };

        let status: VaccineData["systemStatus"] = "Stable";
        let peltier: VaccineData["peltierStatus"] = "Idle";
        if (newTemp > 7) { status = "Warning"; peltier = "Cooling"; }
        else if (newTemp > prev.targetTemp + 0.5) { status = "Cooling"; peltier = "Cooling"; }
        else if (newTemp < prev.targetTemp - 0.5) { status = "Heating"; peltier = "Heating"; }

        return {
          ...prev,
          currentTemp: Math.round(newTemp * 10) / 10,
          humidity: Math.round(newHumidity * 10) / 10,
          batteryLevel: Math.round(newBattery * 10) / 10,
          peltierStatus: peltier,
          systemStatus: status,
          temperatureHistory: [...prev.temperatureHistory.slice(-19), newPoint],
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const setTargetTemp = useCallback((temp: number) => {
    setData((prev) => ({ ...prev, targetTemp: temp }));
  }, []);

  const manualOverride = useCallback((mode: "cool" | "heat" | "stop") => {
    setData((prev) => ({
      ...prev,
      peltierStatus: mode === "cool" ? "Cooling" : mode === "heat" ? "Heating" : "Idle",
      systemStatus: mode === "cool" ? "Cooling" : mode === "heat" ? "Heating" : "Stable",
    }));
  }, []);

  return { data, setTargetTemp, manualOverride };
}

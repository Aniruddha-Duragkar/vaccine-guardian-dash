import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const randomInRange = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 10) / 10;

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
    temperatureHistory: [],
    alerts: [],
  });

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const [readingsRes, alertsRes] = await Promise.all([
        supabase
          .from("temperature_readings")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(30),
        supabase
          .from("device_alerts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (readingsRes.data && readingsRes.data.length > 0) {
        const latest = readingsRes.data[readingsRes.data.length - 1];
        const history: TemperaturePoint[] = readingsRes.data.map((r) => ({
          time: formatTime(r.created_at),
          temperature: Number(r.temperature),
          humidity: Number(r.humidity),
        }));

        const temp = Number(latest.temperature);
        const peltier = latest.peltier_status as VaccineData["peltierStatus"];
        let status: VaccineData["systemStatus"] = "Stable";
        if (temp > 7) status = "Warning";
        else if (peltier === "Cooling") status = "Cooling";
        else if (peltier === "Heating") status = "Heating";

        setData((prev) => ({
          ...prev,
          currentTemp: temp,
          humidity: Number(latest.humidity),
          batteryLevel: Number(latest.battery_level),
          peltierStatus: peltier,
          doorStatus: latest.door_status as VaccineData["doorStatus"],
          signalStrength: latest.signal_strength,
          systemStatus: status,
          temperatureHistory: history,
        }));
      }

      if (alertsRes.data) {
        const alerts: Alert[] = alertsRes.data.map((a) => ({
          id: a.id,
          message: a.message,
          timestamp: formatTime(a.created_at),
          level: a.level as Alert["level"],
        }));
        setData((prev) => ({ ...prev, alerts }));
      }
    };

    fetchData();
  }, []);

  // Simulate live updates and push to DB
  useEffect(() => {
    const interval = setInterval(async () => {
      setData((prev) => {
        const newTemp = Math.max(2, Math.min(8.5, prev.currentTemp + randomInRange(-0.4, 0.4)));
        const newHumidity = Math.max(35, Math.min(70, prev.humidity + randomInRange(-2, 2)));
        const newBattery = Math.max(0, prev.batteryLevel - 0.1);
        const roundedTemp = Math.round(newTemp * 10) / 10;
        const roundedHumidity = Math.round(newHumidity * 10) / 10;
        const roundedBattery = Math.round(newBattery * 10) / 10;

        let status: VaccineData["systemStatus"] = "Stable";
        let peltier: VaccineData["peltierStatus"] = "Idle";
        if (roundedTemp > 7) { status = "Warning"; peltier = "Cooling"; }
        else if (roundedTemp > prev.targetTemp + 0.5) { status = "Cooling"; peltier = "Cooling"; }
        else if (roundedTemp < prev.targetTemp - 0.5) { status = "Heating"; peltier = "Heating"; }

        const newPoint: TemperaturePoint = {
          time: formatTime(new Date().toISOString()),
          temperature: roundedTemp,
          humidity: roundedHumidity,
        };

        // Insert into DB (fire and forget)
        supabase.from("temperature_readings").insert({
          temperature: roundedTemp,
          humidity: roundedHumidity,
          battery_level: roundedBattery,
          peltier_status: peltier,
        }).then();

        return {
          ...prev,
          currentTemp: roundedTemp,
          humidity: roundedHumidity,
          batteryLevel: roundedBattery,
          peltierStatus: peltier,
          systemStatus: status,
          temperatureHistory: [...prev.temperatureHistory.slice(-19), newPoint],
        };
      });
    }, 3000);
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

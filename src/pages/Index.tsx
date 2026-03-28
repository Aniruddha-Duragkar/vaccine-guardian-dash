import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LiveMonitoringCard } from "@/components/dashboard/LiveMonitoringCard";
import { StatusCards } from "@/components/dashboard/StatusCards";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { HistoricalChart } from "@/components/dashboard/HistoricalChart";
import { ControlsPanel } from "@/components/dashboard/ControlsPanel";
import { useVaccineData } from "@/hooks/useVaccineData";

const Index = () => {
  const { data, setTargetTemp, manualOverride } = useVaccineData();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader batteryLevel={data.batteryLevel} deviceOnline={data.deviceOnline} />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Main content */}
              <div className="flex-1 space-y-4 lg:space-y-6 min-w-0">
                <StatusCards
                  batteryLevel={data.batteryLevel}
                  peltierStatus={data.peltierStatus}
                  doorStatus={data.doorStatus}
                  signalStrength={data.signalStrength}
                />
                <LiveMonitoringCard
                  currentTemp={data.currentTemp}
                  targetTemp={data.targetTemp}
                  humidity={data.humidity}
                  systemStatus={data.systemStatus}
                  history={data.temperatureHistory}
                  onTargetChange={setTargetTemp}
                />
                <HistoricalChart />
              </div>

              {/* Right sidebar */}
              <div className="w-full lg:w-72 xl:w-80 space-y-4 shrink-0">
                <AlertsPanel alerts={data.alerts} />
                <ControlsPanel onOverride={manualOverride} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

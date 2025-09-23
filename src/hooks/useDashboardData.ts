import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useDashboardData() {
  const [stats, setStats] = useState(api.getStats());
  const [areaData, setAreaData] = useState(api.getApplicationsOverTime());
  const [heatmapData, setHeatmapData] = useState(api.getHeatmap());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(api.getStats());
      setAreaData(api.getApplicationsOverTime());
      setHeatmapData(api.getHeatmap());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return { stats, areaData, heatmapData };
}

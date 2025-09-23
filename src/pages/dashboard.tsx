// src/pages/dashboard.tsx

import Layout from "@/components/layout";
import SimpleStats from "@/components/SimpleStats";
import Heatmap from "@/components/Heatmap";
import MiniAreaChart from "@/components/MiniAreaChart";
import TopJobs from "@/components/TopJobs";
import TopCandidates from "@/components/TopCandidates";
import RecentAssessments from "@/components/RecentAssesments";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Users, Briefcase, CalendarClock, Target } from "lucide-react";
import HiringPipeline from "@/components/HiringPipeline";

export default function Dashboard() {
  const { areaData, heatmapData } = useDashboardData();

  const updatedStats = [
    {
      title: "Total Candidates",
      value: "1,780",
      change: "+5%",
      changeType: "positive" as const,
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Active Jobs",
      value: "582",
      change: "+2",
      changeType: "positive" as const,
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: "Interviews Scheduled",
      value: "609",
      change: "Today",
      changeType: "neutral" as const,
      icon: <CalendarClock className="h-5 w-5" />,
    },
    {
      title: "Avg. Time to Hire",
      value: "6.17 days",
      change: "-1 day",
      changeType: "negative" as const,
      icon: <Target className="h-5 w-5" />,
    },
  ];

  return (
    <Layout>
      <main className="flex-1 px-6 pb-6 pt-0 overflow-y-auto bg-slate-50">
        <div className="space-y-6">
          <SimpleStats stats={updatedStats} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MiniAreaChart data={areaData} />
              <Heatmap data={heatmapData} />
              <RecentAssessments />
              <HiringPipeline /> {/* 👈 MOVED to the main column */}
            </div>
            <div className="space-y-6">
              <TopJobs />
              <TopCandidates />
              {/* 👈 REMOVED from the right column */}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
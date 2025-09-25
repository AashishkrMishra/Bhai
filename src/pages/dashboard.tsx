import React from "react";
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

// --- INLINE STYLES FOR THEME AND ANIMATION ---
const Style = () => (
    <style>{`
        .content-card {
            background-color: white; border-radius: 0.75rem;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05);
            border: 1px solid #e2e8f0;
            position: relative; overflow: hidden;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .content-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 15px -2px rgba(0, 0, 0, 0.07), 0 0 0 2px rgba(20, 184, 166, 0.3);
        }
        /* Mouse-tracking radial glow */
        .content-card::before {
            content: ''; position: absolute;
            top: var(--mouse-y, 0px); left: var(--mouse-x, 0px);
            width: 300px; height: 300px;
            background: radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0) 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
        }
        .content-card:hover::before {
            opacity: 1;
        }
        /* Mirror sheen effect */
        .content-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            width: 75%;
            height: 100%;
            transform: skewX(-25deg);
            background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.7s ease-in-out;
            z-index: 2;
        }
        .content-card:hover::after {
            left: 150%;
        }
        .stat-icon {
            width: 2.5rem; height: 2.5rem; border-radius: 0.5rem;
            display: flex; align-items: center; justify-content: center;
        }
        /* Applying teal theme to SimpleStats icons */
        .stat-card-Total-Candidates .stat-icon { background-color: #ccfbf1; color: #0d9488; }
        .stat-card-Active-Jobs .stat-icon { background-color: #ccfbf1; color: #0d9488; }
        .stat-card-Interviews-Scheduled .stat-icon { background-color: #ccfbf1; color: #0d9488; }
        .stat-card-Avg-Time-to-Hire .stat-icon { background-color: #ccfbf1; color: #0d9488; }
    `}</style>
);


export default function Dashboard() {
  const { areaData, heatmapData } = useDashboardData();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

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
      <Style />
      <main className="flex-1 px-6 pb-6 pt-6 overflow-y-auto bg-slate-50">
        <div className="space-y-6">
          {/* We assume SimpleStats takes this prop to pass to its internal cards */}
          <SimpleStats stats={updatedStats} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="content-card" onMouseMove={handleMouseMove}>
                <MiniAreaChart data={areaData} />
              </div>
              <div className="content-card" onMouseMove={handleMouseMove}>
                <Heatmap data={heatmapData} />
              </div>
              <div className="content-card" onMouseMove={handleMouseMove}>
                <RecentAssessments />
              </div>
              <div className="content-card" onMouseMove={handleMouseMove}>
                <HiringPipeline />
              </div>
            </div>
            <div className="space-y-6">
              <div className="content-card" onMouseMove={handleMouseMove}>
                <TopJobs />
              </div>
              <div className="content-card" onMouseMove={handleMouseMove}>
                <TopCandidates />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}


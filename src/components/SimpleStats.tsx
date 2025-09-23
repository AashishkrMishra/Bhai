// src/components/SimpleStats.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Briefcase, CalendarClock, Target } from "lucide-react";
import { ReactNode } from "react";

// Define the type for a single stat object
type Stat = {
  title: string;
  value: string; // Value can be a string like "535" or "Today"
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: ReactNode;
};

// Define the props for the component
type SimpleStatsProps = {
  stats: Stat[];
};

// Animation variants for the container and items
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger the animation of children by 0.1s
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 0.9 },
};

// Helper to determine text color for the change value
const getChangeColor = (type: Stat["changeType"]) => {
  switch (type) {
    case "positive":
      return "text-green-500";
    case "negative":
      return "text-red-500";
    default:
      return "text-slate-400";
  }
};

export default function SimpleStats({ stats }: SimpleStatsProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {stats.map((stat) => (
        <motion.div key={stat.title} variants={itemVariants}>
          <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300 border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.title}
              </CardTitle>
              <div className="text-slate-400">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
              <p className={`text-xs ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
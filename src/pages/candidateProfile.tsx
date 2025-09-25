// candidateprofile.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Calendar, Briefcase } from "lucide-react";
import {  Candidate, Note, TimelineEvent } from "@/mock/type";
import { db } from "@/mock/db";
import Layout from "@/components/layout";
import CandidateTimeline from "@/components/CandidatesTimeline";
import CandidateNotes from "@/components/CandidatesNotes";
// Import framer-motion for animations
import { motion } from "framer-motion";

// --- Helper function for dynamic status badge styling ---
const getStatusBadgeClass = (stage: string) => {
  switch (stage.toLowerCase()) {
    case "hired":
      return "bg-green-100 text-green-800 border border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border border-red-200";
    case "screening":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "interview":
      return "bg-purple-100 text-purple-800 border border-purple-200";
    default:
      return "bg-slate-100 text-slate-800 border border-slate-200";
  }
};

// --- A simple skeleton component for a better loading experience ---
const LoadingSkeleton = () => (
  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
    <div className="lg:col-span-2 space-y-6">
      <div className="h-28 bg-slate-200 rounded-lg"></div>
      <div className="h-36 bg-slate-200 rounded-lg"></div>
      <div className="h-64 bg-slate-200 rounded-lg"></div>
    </div>
    <div className="space-y-6">
      <div className="h-48 bg-slate-200 rounded-lg"></div>
      <div className="h-64 bg-slate-200 rounded-lg"></div>
    </div>
  </div>
);

export default function CandidateProfile() {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [isDark, setIsDark] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!candidateId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const c = await db.candidates.get(Number(candidateId));
        if (c) {
          setCandidate(c);
          const n = await db.notes
            .where("candidateId")
            .equals(c.id!)
            .reverse()
            .sortBy("createdAt");
          const t = await db.timeline
            .where("candidateId")
            .equals(c.id!)
            .sortBy("createdAt");
          setNotes(n);
          setTimeline(t.reverse());
        }
      } catch (error) {
        console.error("Failed to load candidate data:", error);
      } finally {
        setLoading(false); // Stop loading regardless of outcome
      }
    };
    load();
  }, [candidateId]);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // --- Animation Variants for Framer Motion ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSkeleton />
      </Layout>
    );
  }

  if (!candidate) {
    return (
      <Layout>
        <div className="p-6 text-center text-slate-600">
          <h2 className="text-2xl font-bold">Candidate Not Found</h2>
          <p>The candidate you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  const daysSinceApplied = Math.floor(
    (Date.now() - new Date(candidate.appliedDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Layout>
      {/* The main container is now a motion.div for staggered animations */}
      <motion.div
        onMouseMove={handleMouseMove}
        className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-6 relative overflow-hidden transition-colors duration-300 ease-in-out group/page"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- Spotlight hover effect for the entire page background --- */}
        <div
          className="pointer-events-none fixed inset-0 z-30 transition duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${
              isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.04)'
            }, transparent 80%)`,
          }}
        />
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-800">
                    {candidate.name}
                  </h1>
                  <p className="flex items-center gap-2 text-slate-500 mt-1">
                    <Briefcase size={16} /> {candidate.jobTitle}
                  </p>
                </div>
                <span
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full capitalize ${getStatusBadgeClass(
                    candidate.stage
                  )}`}
                >
                  {candidate.stage}
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <p className="flex items-center gap-3 text-slate-600">
                  <Mail size={18} className="text-slate-400" /> {candidate.email}
                </p>
                <p className="flex items-center gap-3 text-slate-600">
                  <Phone size={18} className="text-slate-400" /> {candidate.phone}
                </p>
                <p className="flex items-center gap-3 text-slate-600">
                  <Calendar size={18} className="text-slate-400" />
                  Applied on {new Date(candidate.appliedDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Timeline Component */}
          {candidate.id !== undefined && (
            <motion.div variants={itemVariants}>
              <CandidateTimeline candidateId={candidate.id} timeline={timeline} />
            </motion.div>
          )}
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Application Summary */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Application Summary
              </h2>
              <ul className="space-y-3 text-slate-600">
                 <li className="flex justify-between"><span>Current Stage:</span> <span className="font-semibold text-slate-800 capitalize">{candidate.stage}</span></li>
                 <li className="flex justify-between"><span>Days Since Applied:</span> <span className="font-semibold text-slate-800">{daysSinceApplied}</span></li>
                 <li className="flex justify-between"><span>Assessments:</span> <span className="font-semibold text-slate-800">0</span></li>
                 <li className="flex justify-between"><span>Notes:</span> <span className="font-semibold text-slate-800">{notes.length}</span></li>
                 <li className="flex justify-between"><span>Timeline Events:</span> <span className="font-semibold text-slate-800">{timeline.length}</span></li>
              </ul>
            </Card>
          </motion.div>

          {/* Notes Component */}
          {candidate.id !== undefined && (
            <motion.div variants={itemVariants}>
                <CandidateNotes candidateId={candidate.id} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
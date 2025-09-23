import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Calendar } from "lucide-react";
import { db, Candidate, Note, TimelineEvent } from "@/mock/db";
import Layout from "@/components/layout";
import CandidateTimeline from "@/components/CandidatesTimeline";
import CandidateNotes from "@/components/CandidatesNotes";

export default function CandidateProfile() {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (!candidateId) return;

    const load = async () => {
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
    };
    load();
  }, [candidateId]);

  if (!candidate)
    return <div className="p-6 text-white">Candidate not found</div>;

  const daysSinceApplied = Math.floor(
    (Date.now() - new Date(candidate.appliedDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Layout>
      <div className="p-6 text-white grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card className="p-6 bg-slate-900 border border-slate-800">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{candidate.name}</h1>
                <p className="text-slate-400">{candidate.jobTitle}</p>
              </div>
              <span className="px-4 py-1 text-sm rounded-full capitalize bg-purple-700">
                {candidate.stage}
              </span>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6 bg-slate-900 border border-slate-800">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <p className="flex items-center gap-2 text-slate-300">
              <Mail size={16} /> {candidate.email}
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <Phone size={16} /> {candidate.phone}
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <Calendar size={16} />{" "}
              {new Date(candidate.appliedDate).toDateString()}
            </p>
          </Card>

          {/* Timeline Component */}
          <CandidateTimeline candidateId={candidate.id}/>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Application Summary */}
          <Card className="p-6 bg-slate-900 border border-slate-800">
            <h2 className="text-lg font-semibold mb-4">Application Summary</h2>
            <ul className="space-y-2 text-slate-300">
              <li>Current Stage: {candidate.stage}</li>
              <li>Days Since Applied: {daysSinceApplied}</li>
              <li>Assessments: 0</li>
              <li>Notes: {notes.length}</li>
              <li>Timeline Events: {timeline.length}</li>
            </ul>
          </Card>

          {/* Notes Component */}
          <CandidateNotes candidateId={candidate.id} />
        </div>
      </div>
    </Layout>
  );
}

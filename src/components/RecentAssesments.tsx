import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Assessment = {
  id: number;
  jobId: number;
  jobTitle?: string;
  role?: string;
  sectionCount?: number;
  totalQuestions?: number;
  submissions?: number;
  duration?: string;
};

export function RecentAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch("/assessments");
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();

        // ✅ Sort by id (latest first) and take only top 5
        const recent = result.data
          .sort((a: Assessment, b: Assessment) => b.id - a.id)
          .slice(0, 6);

        setAssessments(recent);
      } catch (err) {
        console.error("Error fetching recent assessments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecent();
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading assessments...</p>}
        {!loading && assessments.length === 0 && <p>No assessments found.</p>}

        <div className="grid grid-cols-3 gap-3">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="h-28 rounded-md bg-purple-100 shadow-sm flex flex-col justify-center items-center hover:shadow-md transition p-2"
            >
              
              <p className="text-xs text-gray-500">{a.role || "No Role"}</p>
              <p className="text-xs text-gray-600">
                {a.totalQuestions ?? 0} Qs • {a.sectionCount ?? 0} Sections
              </p>
              <p className="text-xs text-gray-600">
                Duration: {a.duration || "N/A"}
              </p>
              <p className="text-xs text-gray-600">
                Submissions: {a.submissions ?? 0}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentAssessments;
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Assessment = {
  jobId: number;
  jobTitle: string;
  questions: { id: string; text: string; options: string[] }[];
  responses?: Record<string, string>;
};

export function RecentAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const res = await fetch("/assessments");
        const result = await res.json();
        setAssessments(result.data.slice(0, 5)); // only show latest 5
      } catch (err) {
        console.error("Failed to fetch assessments", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAssessments();
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
          {assessments.map((a, idx) => (
            <div
              key={idx}
              className="h-20 rounded-md bg-purple-100 shadow-sm flex flex-col justify-center items-center hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-gray-800 text-center">
                {a.jobTitle}
              </p>
              <p className="text-xs text-gray-500">
                {a.questions.length} Questions
              </p>
              <p
                className={`text-xs font-semibold mt-1 ${
                  a.responses ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {a.responses ? "Submitted" : "Pending"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentAssessments;

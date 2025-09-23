import { useEffect, useState } from "react";
import { candidateService } from "@/lib/candidate";
import { Candidate, CandidateStage } from "@/mock/db";

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getCandidates();
      setCandidates(data);
    } catch (err: any) {
      setError(err.message || "Error fetching candidates");
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (id: number, stage: CandidateStage) => {
    await candidateService.updateCandidateStage(id, stage);
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage } : c))
    );
  };

  return { candidates, loading, error, updateStage, reload: load };
}

import { Candidate, CandidateStage } from "@/mock/type";

export const candidateService = {
  async getCandidates(): Promise<Candidate[]> {
    const res = await fetch("/api/candidates"); // <-- your backend endpoint
    if (!res.ok) throw new Error("Failed to fetch candidates");
    return res.json();
  },

  async updateCandidateStage(candidateId: number, newStage: CandidateStage): Promise<void> {
    const res = await fetch(`/api/candidates/${candidateId}/stage`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });
    if (!res.ok) throw new Error("Failed to update stage");
  },
};

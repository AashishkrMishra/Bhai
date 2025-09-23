"use client";

import { useEffect, useState } from "react";
import { db, TimelineEvent } from "@/mock/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CandidateTimelineProps {
  candidateId: number;
}

export default function CandidateTimeline({ candidateId }: CandidateTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    loadTimeline();
  }, [candidateId]);

  async function loadTimeline() {
    const e = await db.timeline
      .where("candidateId")
      .equals(candidateId)
      .sortBy("createdAt");
    setEvents(e);
  }

  function eventIcon(type: TimelineEvent["type"]) {
    switch (type) {
      case "system":
        return "⚙️";
      case "note":
        return "📝";
      case "stage-change":
        return "🔄";
      default:
        return "📌";
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 && (
          <p className="text-sm text-gray-500">No timeline events yet.</p>
        )}
        <div className="relative border-l pl-4 space-y-4">
          {events.map((ev) => (
            <div key={ev.id} className="relative">
              <div className="absolute -left-6">{eventIcon(ev.type)}</div>
              <div className="p-3 border rounded-lg bg-white shadow-sm">
                <p className="text-sm">{ev.description}</p>
                {ev.type === "stage-change" && ev.fromStage && ev.toStage && (
                  <Badge className="mt-1">
                    {ev.fromStage} → {ev.toStage}
                  </Badge>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {ev.author ? `by ${ev.author} • ` : ""}
                  {new Date(ev.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

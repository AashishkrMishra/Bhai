
// db.ts
import Dexie, { Table } from "dexie";
import {Job,Candidate,Assessment,Note,TimelineEvent,UserResponse} from "@/mock/type"

// ------------------ Dexie DB ------------------
class AppDB extends Dexie {
  jobs!: Table<Job, number>;
  candidates!: Table<Candidate, number>;
  assessments!: Table<Assessment, number>;
  notes!: Table<Note, number>;
  timeline!: Table<TimelineEvent, number>;
  responses!: Table<UserResponse, number>; 

  constructor() {
    super("MockHRDB");
    this.version(3).stores({
      jobs: "++id, title, slug, status, order",
      candidates: "++id, jobId, name, email, phone, appliedDate, stage",
      assessments: "++id,jobId",
      notes: "++id, candidateId, createdAt",
      timeline: "++id, candidateId, createdAt",
      responses: "++id, assessmentId, questionId",
    });
  }
}

export const db = new AppDB();

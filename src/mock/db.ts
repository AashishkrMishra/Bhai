// db.ts
import Dexie, { Table } from "dexie";

// ------------------ Types ------------------
export type JobStatus = "active" | "archived";
export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface Job {
  id?: number;
  title: string;
  slug: string;
  status: JobStatus;
  type: JobType;
  location: string;
  description: string;
  requirements: string[];
  tags: string[];
  order: number;
}

export type CandidateStage =
  | "applied"
  | "screen"
  | "tech"
  | "offer"
  | "hired"
  | "rejected";

export interface Candidate {
  id?: number;
  jobId: number;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  appliedDate: string;
  stage: CandidateStage;
}

export interface Assessment {
  jobId: number;
  questions: { id: string; text: string; options: string[] }[];
  responses?: Record<string, string>;
}

// ✅ Notes
export interface Note {
  id?: number;
  candidateId: number;
  author: string;
  content: string;
  createdAt: string;
}

// ✅ Timeline Events
export interface TimelineEvent {
  id?: number;
  candidateId: number;
  type: "system" | "note" | "stage-change";
  description: string;
  createdAt: string;
  author?: string;
  fromStage?: CandidateStage;
  toStage?: CandidateStage;
}

// ------------------ Dexie DB ------------------
class AppDB extends Dexie {
  jobs!: Table<Job, number>;
  candidates!: Table<Candidate, number>;
  assessments!: Table<Assessment, number>;
  notes!: Table<Note, number>;
  timeline!: Table<TimelineEvent, number>;

  constructor() {
    super("MockHRDB");
    this.version(3).stores({
      jobs: "++id, title, slug, status, order",
      candidates: "++id, jobId, name, email, phone, appliedDate, stage",
      assessments: "jobId",
      notes: "++id, candidateId, createdAt",
      timeline: "++id, candidateId, createdAt",
    });
  }
}

export const db = new AppDB();

// ------------------ Helpers ------------------
function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

const FIRST_NAMES = ["John", "Alice", "David", "Sophia", "Michael", "Emma", "Daniel", "Olivia", "James", "Ava"];
const LAST_NAMES = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Clark", "Lewis", "Walker", "Young", "King"];

function generateName(i: number) {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[i % LAST_NAMES.length];
  return `${first} ${last}`;
}

function randomPhone() {
  return `+1-${Math.floor(100 + Math.random() * 900)}-${Math.floor(
    100 + Math.random() * 900
  )}-${Math.floor(1000 + Math.random() * 9000)}`;
}

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

// ------------------ Seed Data ------------------
export async function seed() {
  const jobCount = await db.jobs.count();
  if (jobCount > 0) return; // already seeded

  // 25 Jobs
  const jobTitles = [
    "Frontend Developer","Backend Engineer","Full Stack Developer","DevOps Engineer",
    "Data Scientist","Machine Learning Engineer","Product Manager","UI/UX Designer",
    "QA Engineer","Mobile App Developer","Cloud Architect","Security Analyst",
    "Business Analyst","Technical Writer","Solutions Architect","Database Administrator",
    "Game Developer","AI Researcher","Systems Engineer","Site Reliability Engineer",
    "Project Manager","IT Support Specialist","Network Engineer","Software Engineer Intern",
    "Blockchain Developer",
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const statuses = ["active", "archived"];
  const locations = [
    "San Francisco, CA","New York, NY","London, UK","Berlin, Germany",
    "Toronto, Canada","Bangalore, India","Remote",
  ];
  const jobRequirements: Record<string, string[]> = {
    "Frontend Developer": [
      "Proficiency in React, Vue, or Angular",
      "Strong knowledge of HTML, CSS, and JavaScript",
      "Experience with responsive design and cross-browser compatibility",
    ],
    "Backend Engineer": [
      "Experience with Node.js, Python, or Java",
      "Understanding of RESTful APIs and microservices",
      "Database design and query optimization skills",
    ],
    "Data Scientist": [
      "Strong knowledge of Python and machine learning libraries",
      "Experience with data visualization tools",
      "Understanding of statistics and data modeling",
    ],
    "Product Manager": [
      "Strong communication and leadership skills",
      "Experience with agile methodologies",
      "Ability to define product roadmap and strategy",
    ],
    default: [
      "Bachelor's degree in relevant field",
      "Strong problem-solving skills",
      "Excellent communication and teamwork",
    ],
  };

  const jobs: Job[] = Array.from({ length: 25 }).map((_, i) => {
    const title = jobTitles[i % jobTitles.length];
    const type = jobTypes[i % jobTypes.length] as JobType;
    const status = statuses[Math.random() > 0.3 ? 0 : 1] as JobStatus;
    const location = locations[i % locations.length];
    const requirements = jobRequirements[title] ?? jobRequirements.default;

    return {
      id: i + 1,
      title,
      slug: slugify(title),
      status,
      type,
      location,
      description: `We are looking for a ${title} to join our growing team.`,
      requirements,
      tags: [
        title.split(" ")[0].toLowerCase(),
        type.toLowerCase(),
        location.includes("Remote") ? "remote" : "onsite",
      ],
      order: i + 1,
    };
  });

  const jobIds = await db.jobs.bulkAdd(jobs, { allKeys: true });

  // 1000 Candidates
  const stages: CandidateStage[] = ["applied", "screen", "tech", "offer", "hired", "rejected"];

  const candidates: Candidate[] = Array.from({ length: 1000 }).map((_, i) => {
    const name = generateName(i);
    const jobId = jobIds[Math.floor(Math.random() * jobIds.length)] as number;
    const job = jobs.find((j) => j.id === jobId);
    const jobTitle = job ? job.title : "Unknown Role";

    return {
      jobId,
      jobTitle,
      name,
      email: `${name.replace(/\s+/g, ".").toLowerCase()}@example.com`,
      phone: randomPhone(),
      appliedDate: daysAgo(Math.floor(Math.random() * 60)),
      stage: stages[Math.floor(Math.random() * stages.length)],
    };
  });

  const candidateIds = await db.candidates.bulkAdd(candidates, { allKeys: true });

  // Seed Notes + Timeline for each candidate
  for (const id of candidateIds) {
    const notes: Note[] = [
      {
        candidateId: id as number,
        author: "Sarah Johnson",
        content:
          "Initial phone screening completed. Candidate shows strong technical background and good communication skills. @John Smith please review for next steps.",
        createdAt: daysAgo(35),
      },
      {
        candidateId: id as number,
        author: "Mike Chen",
        content:
          "Technical assessment results look promising. Scored well on algorithms and system design. Ready for technical interview round.",
        createdAt: daysAgo(33),
      },
    ];
    await db.notes.bulkAdd(notes);

    const timeline: TimelineEvent[] = [
      {
        candidateId: id as number,
        type: "system",
        description: "Application received",
        createdAt: daysAgo(36),
      },
      {
        candidateId: id as number,
        type: "note",
        description: "Added initial screening notes",
        author: "Sarah Johnson",
        createdAt: daysAgo(35),
      },
      {
        candidateId: id as number,
        type: "stage-change",
        description: "Stage changed from applied to screen",
        fromStage: "applied",
        toStage: "screen",
        author: "HR Team",
        createdAt: daysAgo(35),
      },
      {
        candidateId: id as number,
        type: "stage-change",
        description: "Stage changed from screen to tech",
        fromStage: "screen",
        toStage: "tech",
        author: "HR Team",
        createdAt: daysAgo(33),
      },
    ];
    await db.timeline.bulkAdd(timeline);
  }

  // 3 Assessments
  const assessments: Assessment[] = jobIds.slice(0, 3).map((jobId) => ({
    jobId: jobId as number,
    questions: Array.from({ length: 12 }).map((_, i) => ({
      id: `q${i + 1}`,
      text: `Question ${i + 1}`,
      options: ["A", "B", "C", "D"],
    })),
  }));

  await db.assessments.bulkAdd(assessments);
}

// handlers.ts
import { http, HttpResponse, delay } from "msw";
import { Job, Candidate, Assessment, UserResponse } from "./type";
import { db } from "@/mock/db"; // Dexie instance
import { randomDelay, maybeError } from "@/lib/utils";

// ------------------ Handlers ------------------
export const handlers = [
  http.get("/jobs", async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);

    const search = url.searchParams.get("search") ?? "";
    const status = url.searchParams.get("status");
    const tags = url.searchParams.getAll("tags"); // ✅ multiple tags support
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") ?? "10", 10);
    const sort = url.searchParams.get("sort") ?? "order";

    let jobs = await db.jobs.toArray();

    // ✅ filter by search (case-insensitive)
    if (search) {
      const s = search.toLowerCase();
      jobs = jobs.filter((j) => {
        const inTitle = j.title?.toLowerCase().includes(s);
        const inDescription = j.description?.toLowerCase().includes(s);
        const inRequirements = j.requirements?.some((req: string) =>
          req.toLowerCase().includes(s)
        );
        const inTags = j.tags?.some((tag: string) =>
          tag.toLowerCase().includes(s)
        );
        return inTitle || inDescription || inRequirements || inTags;
      });
    }

    // ✅ filter by status (case-insensitive)
    if (status) {
      jobs = jobs.filter(
        (j) => j.status?.toLowerCase() === status.toLowerCase()
      );
    }

    // ✅ filter by tags (case-insensitive, all tags must match)
    if (tags.length > 0) {
      const normalizedTags = tags.map((t) => t.toLowerCase());
      jobs = jobs.filter((j) =>
        normalizedTags.every((tag) =>
          j.tags?.some((jobTag: string) => jobTag.toLowerCase() === tag)
        )
      );
    }

    // ✅ sorting
    jobs.sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title) : a.order - b.order
    );

    // ✅ pagination
    const start = (page - 1) * pageSize;
    const paginated = jobs.slice(start, start + pageSize);

    return HttpResponse.json({ data: paginated, total: jobs.length });
  }),

  http.get("/jobs/:id", async ({ params }) => {
    const { id } = params;
    const job = await db.jobs.get(Number(id));

    if (!job) {
      return HttpResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return HttpResponse.json(job);
  }),

  http.post("/jobs", async ({ request }) => {
    await randomDelay();
    maybeError();
    const body = (await request.json()) as Omit<Job, "id" | "slug">;
    const job: Job = {
      ...body,
      slug: body.title.toLowerCase().replace(/\s+/g, "-"),
      status: body.status || "active",
    };
    const id = await db.jobs.add(job);
    return HttpResponse.json({ ...job, id });
  }),

  http.patch("/jobs/:id", async ({ params, request }) => {
    await randomDelay();
    maybeError();
    const id = Number(params.id);
    const patch = (await request.json()) as Partial<Job>;
    await db.jobs.update(id, patch);
    const job = await db.jobs.get(id);
    return HttpResponse.json(job);
  }),

  http.patch("/jobs/:id/reorder", async ({ request }) => {
    await randomDelay();
    maybeError();
    const { fromOrder, toOrder } = (await request.json()) as {
      fromOrder: number;
      toOrder: number;
    };

    const jobs = await db.jobs.toArray();
    const moving = jobs.find((j) => j.order === fromOrder);
    if (!moving)
      return HttpResponse.json({ error: "Job not found" }, { status: 404 });

    jobs.forEach((j) => {
      if (fromOrder < toOrder && j.order > fromOrder && j.order <= toOrder)
        j.order--;
      else if (fromOrder > toOrder && j.order < fromOrder && j.order >= toOrder)
        j.order++;
    });
    moving.order = toOrder;

    await db.jobs.bulkPut(jobs);
    return HttpResponse.json(moving);
  }),

  http.get("/jobs/:jobId/candidates", async ({ params }) => {
    const jobId = Number(params.jobId);
    if (isNaN(jobId)) {
      return HttpResponse.json({ error: "Invalid jobId" }, { status: 400 });
    }

    const candidates = await db.candidates
      .where("jobId")
      .equals(jobId)
      .toArray();
    return HttpResponse.json({ jobId, candidates });
  }),

  http.get("/jobs/:jobId/assignments", async ({ params }) => {
    const jobId = Number(params.jobId);
    if (isNaN(jobId)) {
      return HttpResponse.json({ error: "Invalid jobId" }, { status: 400 });
    }

    const assignments = await db.assessments
      .where("jobId")
      .equals(jobId)
      .toArray();
    return HttpResponse.json({ jobId, assignments });
  }),

  // ---- Candidates ----
  http.get("/candidates", async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? "";
    const stage = url.searchParams.get("stage");
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = 20;

    let candidates = await db.candidates.toArray();
    if (search) candidates = candidates.filter((c) => c.name.includes(search));
    if (stage) candidates = candidates.filter((c) => c.stage === stage);

    const start = (page - 1) * pageSize;
    const paginated = candidates.slice(start, start + pageSize);

    return HttpResponse.json({ data: paginated, total: candidates.length });
  }),

  http.post("/candidates", async ({ request }) => {
    await randomDelay();
    maybeError();
    const body = (await request.json()) as Candidate;
    const id = await db.candidates.add(body);
    return HttpResponse.json({ ...body, id });
  }),

  http.patch("/candidates/:id", async ({ params, request }) => {
    await randomDelay();
    maybeError();
    const id = Number(params.id);
    const patch = (await request.json()) as Partial<Candidate>;
    await db.candidates.update(id, patch);
    const candidate = await db.candidates.get(id);
    return HttpResponse.json(candidate);
  }),

  http.get("/candidates/:id/timeline", async ({ params }) => {
    await randomDelay();
    const id = Number(params.id);
    const candidate = await db.candidates.get(id);
    if (!candidate)
      return HttpResponse.json({ error: "Not found" }, { status: 404 });

    const timeline = [
      { stage: "applied", date: new Date().toISOString() },
      { stage: candidate.stage, date: new Date().toISOString() },
    ];
    return HttpResponse.json(timeline);
  }),

  // GET all assessments (optionally filter by jobId)
  http.get("/assessments", async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const jobId = url.searchParams.get("jobId");

    let assessments = await db.assessments.toArray();
    const jobs = await db.jobs.toArray();

    if (jobId) {
      assessments = assessments.filter((a) => a.jobId === Number(jobId));
    }

    const data = assessments.map((a) => {
      const job = jobs.find((j) => j.id === a.jobId);

      const sectionCount = a.sections?.length || 0;
      const totalQuestions =
        a.sections?.reduce((sum, s) => sum + (s.questions?.length || 0), 0) ||
        0;

      return {
        ...a,
        jobTitle: job ? job.title : "Unknown Job",
        sectionCount,
        totalQuestions,
        submissions: a.submissions ?? 0,
        duration: a.duration || `${totalQuestions * 2} mins`, // fallback
      };
    });

    return HttpResponse.json({ data });
  }),

  // GET a single assessment by id
  http.get("/assessments/:id", async ({ params }) => {
    await randomDelay();
    const id = Number(params.id);
    const assessment = await db.assessments.get(id);
    if (!assessment) {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(assessment);
  }),

  // CREATE new assessment
  http.post("/assessments", async ({ request }) => {
    await randomDelay();
    maybeError();
    const body = (await request.json()) as Assessment;
    const id = await db.assessments.add(body);
    return HttpResponse.json({ ...body, id });
  }),

 http.post("/assessments/:jobId", async ({ request, params }) => {
  const body = (await request.json()) as Assessment;
  const jobId = Number(params.jobId);

  // 🔍 Lookup job from DB
  const job = await db.jobs.get(jobId);
  if (!job) {
    return HttpResponse.json(
      { error: `Job with id ${jobId} not found` },
      { status: 404 }
    );
  }

  const newAssessment = {
    ...body,
    jobId,
    role: job.title, // ✅ store job role/title
   };
  const id = await db.assessments.add(newAssessment); // Dexie assigns id
  return HttpResponse.json({ ...newAssessment, id });
}),
  // UPDATE assessment
  http.put("/assessments/:id", async ({ params, request }) => {
    await randomDelay();
    maybeError();
    const id = Number(params.id);
    const body = (await request.json()) as Assessment;
    await db.assessments.put({ ...body, id });
    return HttpResponse.json(body);
  }),

  // DELETE assessment
  http.delete("/assessments/:id", async ({ params }) => {
    await randomDelay();
    const id = Number(params.id);
    await db.assessments.delete(id);
    return HttpResponse.json({ success: true });
  }),

  // SUBMIT response to an assessment
  http.post("/assessments/:id/submit", async ({ params, request }) => {
    await randomDelay();
    maybeError();
    const assessmentId = Number(params.id);
    const body = (await request.json()) as Record<
      number,
      string | number | string[]
    >;
    // body = { questionId: answer }

    const assessment = await db.assessments.get(assessmentId);
    if (!assessment) {
      return HttpResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    const createdAt = new Date().toISOString();

    // convert answers into UserResponse records
    const responses = Object.entries(body).map(([qid, answer]) => ({
      id: Date.now() + Math.floor(Math.random() * 10000), // quick unique ID
      assessmentId,
      questionId: Number(qid),
      answer,
      createdAt,
    })) as UserResponse[];

    await db.responses.bulkAdd(responses);

    // bump submissions count on the assessment
    await db.assessments.update(assessmentId, {
      submissions: (assessment.submissions ?? 0) + 1,
    });

    return HttpResponse.json({ success: true, responses });
  }),
];
// Simulated API using localStorage (dummy dynamic values)
export const api = {
  getStats: () => {
    let stats = localStorage.getItem("stats");
    let parsed;
    if (stats) parsed = JSON.parse(stats);
    else {
      parsed = [
        { title: "Total Candidates", value: 1200, change: "+5%" },
        { title: "Active Jobs", value: 20, change: "+2" },
        { title: "Interviews Scheduled", value: 15, change: "Today" },
        { title: "Avg. Time to Hire", value: 14, change: "-1 day" },
      ];
    }
    parsed = parsed.map((s: any) => {
      if (typeof s.value === "number") {
        s.value = s.value + Math.floor(Math.random() * 3);
      }
      return s;
    });
    localStorage.setItem("stats", JSON.stringify(parsed));
    return parsed;
  },

  getApplicationsOverTime: () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    return months.map((m) => ({
      name: m,
      value: Math.floor(Math.random() * 1200),
    }));
  },

  getHeatmap: () => {
    const today = new Date();
    const days = 30;
    const matrix: { date: string; value: number }[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      matrix.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: Math.floor(Math.random() * 20),
      });
    }
    return matrix.reverse();
  },

  getJobs: () => {
    const stored = localStorage.getItem("jobs");
    if (stored) return JSON.parse(stored);

    // Initial dummy jobs if none exist in localStorage
    const jobs = [
      {
        id: 1,
        title: "Node.js Developer",
        status: "Active",
        location: "New York, NY",
        type: "full time",
        date: "Sep 21, 2025",
        description: "We are looking for a talented Node.js Developer...",
        requirements: ["3+ years of experience", "Proficient in Node.js", "REST APIs"],
        tags: ["Node.js", "Express", "MongoDB", "AWS"],
      },
      {
        id: 2,
        title: "Backend Engineer",
        status: "Archived",
        location: "Berlin, Germany",
        type: "full time",
        date: "Sep 21, 2025",
        description: "We are looking for a talented Backend Engineer...",
        requirements: ["5+ years experience", "Java/Spring Boot", "Cloud services"],
        tags: ["Java", "Spring Boot", "Docker", "Kubernetes"],
      },
      {
        id: 3,
        title: "Software Architect",
        status: "Active",
        location: "Miami, FL",
        type: "full time",
        date: "Sep 21, 2025",
        description: "Looking for a skilled Software Architect...",
        requirements: ["Architecture design", "Cloud-native systems"],
        tags: ["Microservices", "AWS", "CI/CD", "TypeScript"],
      },
    ];

    localStorage.setItem("jobs", JSON.stringify(jobs));
    return jobs;
  },
};

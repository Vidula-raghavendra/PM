/**
 * daily-log.mjs — Generates a daily project log from git history + Supabase stats.
 * Called by .github/workflows/daily-log.yml via GitHub Actions cron.
 *
 * Env vars required:
 *   SUPABASE_URL         — project URL
 *   SUPABASE_SERVICE_KEY  — service-role key (bypasses RLS)
 */

import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// Simple Supabase REST helper (no SDK needed — keeps the script dependency-free)
async function supabaseQuery(table, { select = "*", filters = [] } = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;

  const params = new URLSearchParams({ select });
  for (const f of filters) params.append(f.col, f.val);

  const res = await fetch(`${url}/rest/v1/${table}?${params}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error(`Supabase ${table}: ${res.status} ${await res.text()}`);
    return null;
  }
  return res.json();
}

async function supabaseCount(table, filters = []) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;

  const params = new URLSearchParams({ select: "*" });
  for (const f of filters) params.append(f.col, f.val);

  const res = await fetch(`${url}/rest/v1/${table}?${params}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "count=exact",
      Range: "0-0",
    },
  });

  if (!res.ok) return null;
  const range = res.headers.get("content-range"); // e.g. "0-0/42"
  if (!range) return null;
  const total = range.split("/")[1];
  return total === "*" ? null : parseInt(total, 10);
}

// ---------------------------------------------------------------------------
// Git activity
// ---------------------------------------------------------------------------

function getGitActivity() {
  const log = run(`git log --since="24 hours ago" --pretty=format:"- %h %s (%an)" --no-merges`);
  const stats = run(`git log --since="24 hours ago" --shortstat --no-merges`);

  // Parse insertions/deletions from shortstat lines
  let filesChanged = 0, insertions = 0, deletions = 0;
  for (const line of stats.split("\n")) {
    const fc = line.match(/(\d+) files? changed/);
    const ins = line.match(/(\d+) insertions?/);
    const del = line.match(/(\d+) deletions?/);
    if (fc) filesChanged += parseInt(fc[1], 10);
    if (ins) insertions += parseInt(ins[1], 10);
    if (del) deletions += parseInt(del[1], 10);
  }

  const commitCount = log ? log.split("\n").filter(Boolean).length : 0;

  return { log: log || "- No commits in the last 24 hours.", commitCount, filesChanged, insertions, deletions };
}

// ---------------------------------------------------------------------------
// Supabase stats
// ---------------------------------------------------------------------------

async function getProjectStats() {
  const stats = {};

  // Totals
  stats.totalProjects = await supabaseCount("projects");
  stats.activeProjects = await supabaseCount("projects", [{ col: "status", val: "eq.ACTIVE" }]);
  stats.completedProjects = await supabaseCount("projects", [{ col: "status", val: "eq.COMPLETED" }]);

  // Tasks
  stats.totalTasks = await supabaseCount("tasks");
  stats.todoTasks = await supabaseCount("tasks", [{ col: "status", val: "eq.TODO" }]);
  stats.inProgressTasks = await supabaseCount("tasks", [{ col: "status", val: "eq.IN_PROGRESS" }]);
  stats.doneTasks = await supabaseCount("tasks", [{ col: "status", val: "eq.DONE" }]);

  // Milestones
  stats.pendingMilestones = await supabaseCount("milestones", [{ col: "status", val: "eq.PENDING" }]);
  stats.paidMilestones = await supabaseCount("milestones", [{ col: "status", val: "eq.PAID" }]);

  // Users & collaborators
  stats.totalUsers = await supabaseCount("profiles");
  stats.totalCollaborators = await supabaseCount("collaborators");

  // Upcoming meetings (next 7 days)
  const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString();
  stats.upcomingMeetings = await supabaseCount("calendar_events", [
    { col: "start_time", val: `gte.${new Date().toISOString()}` },
    { col: "start_time", val: `lte.${weekFromNow}` },
  ]);

  return stats;
}

// ---------------------------------------------------------------------------
// Build markdown
// ---------------------------------------------------------------------------

function buildLog(git, stats) {
  const date = today();
  const lines = [
    `# Daily Log — ${date}`,
    "",
    "## Git Activity (last 24h)",
    "",
    `**${git.commitCount}** commits | **${git.filesChanged}** files changed | **+${git.insertions}** / **-${git.deletions}**`,
    "",
    git.log,
    "",
  ];

  if (stats && stats.totalProjects !== null) {
    lines.push(
      "## Project Stats",
      "",
      "| Metric | Count |",
      "|--------|-------|",
      `| Total Projects | ${stats.totalProjects ?? "—"} |`,
      `| Active Projects | ${stats.activeProjects ?? "—"} |`,
      `| Completed Projects | ${stats.completedProjects ?? "—"} |`,
      `| Total Tasks | ${stats.totalTasks ?? "—"} |`,
      `| To-Do | ${stats.todoTasks ?? "—"} |`,
      `| In Progress | ${stats.inProgressTasks ?? "—"} |`,
      `| Done | ${stats.doneTasks ?? "—"} |`,
      `| Pending Milestones | ${stats.pendingMilestones ?? "—"} |`,
      `| Paid Milestones | ${stats.paidMilestones ?? "—"} |`,
      `| Registered Users | ${stats.totalUsers ?? "—"} |`,
      `| Collaborators | ${stats.totalCollaborators ?? "—"} |`,
      `| Upcoming Meetings (7d) | ${stats.upcomingMeetings ?? "—"} |`,
      "",
    );
  } else {
    lines.push(
      "## Project Stats",
      "",
      "_Supabase credentials not configured — skipped._",
      "",
    );
  }

  lines.push(`---`, `_Generated at ${new Date().toISOString()}_`, "");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const git = getGitActivity();
  const stats = await getProjectStats();
  const markdown = buildLog(git, stats);

  const logsDir = join(process.cwd(), "logs");
  mkdirSync(logsDir, { recursive: true });

  const outPath = join(logsDir, `${today()}.md`);
  writeFileSync(outPath, markdown, "utf-8");

  console.log(`Daily log written to ${outPath}`);
  console.log(markdown);
}

main().catch((err) => {
  console.error("Failed to generate daily log:", err);
  process.exit(1);
});

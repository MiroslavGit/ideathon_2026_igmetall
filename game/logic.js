export const ACTION = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  STOP: "STOP",
};

export const DEFAULT_SESSION_SECONDS = 60;

export const TASKS = [
  {
    id: "rush-order",
    title: "Rush order",
    description: "Customer wants it today. Push output.",
    icon: "⚡",
    correct: ACTION.RIGHT,
    effectCorrect: { performance: +10, energy: -8, quality: -2, safety: -1 },
    impact: { pro: "Perf +", con: "Energy −" },
    tags: ["factory", "logistics"],
  },
  {
    id: "quality-check",
    title: "Quality check",
    description: "Pause to measure and verify specs.",
    icon: "🔍",
    correct: ACTION.LEFT,
    effectCorrect: { quality: +10, performance: -3, energy: -2, safety: +1 },
    impact: { pro: "Qual +", con: "Perf −" },
    tags: ["factory", "technician"],
  },
  {
    id: "safety-guard-missing",
    title: "Safety guard missing",
    description: "Guard is off — STOP the line.",
    icon: "🛑",
    correct: ACTION.STOP,
    effectCorrect: { safety: +14, quality: +6, performance: -2, energy: -2 },
    impact: { pro: "Safe ++", con: "Must stop" },
    isHazard: true,
    tags: ["factory"],
  },
  {
    id: "overtime-request",
    title: "Overtime request",
    description: "Extra shift offered. Decline to rest.",
    icon: "🕒",
    correct: ACTION.LEFT,
    effectCorrect: { energy: +10, safety: +3, performance: -3, quality: 0 },
    impact: { pro: "Energy +", con: "Perf −" },
    tags: ["common"],
  },
  {
    id: "machine-jam",
    title: "Machine jam",
    description: "Something’s stuck — STOP and clear safely.",
    icon: "⚙️",
    correct: ACTION.STOP,
    effectCorrect: { quality: +10, safety: +10, performance: -3, energy: -2 }, impact: { pro: "Safe +", con: "Must stop" }, isHazard: true,
    tags: ["factory", "technician"],
  },
  {
    id: "shortcut-temptation",
    title: "Shortcut temptation",
    description: "Skip a step to go faster? Don’t.",
    icon: "😬",
    correct: ACTION.LEFT,
    effectCorrect: { safety: +10, quality: +4, performance: -2, energy: 0 }, impact: { pro: "Safe +", con: "Slower" }, tags: ["factory", "common"],
  },
  // Shopfloor / Factory extras
  {
    id: "heavy-load",
    title: "Heavy load",
    description: "Lift or move safely — don’t rush it.",
    icon: "🏋️",
    correct: ACTION.LEFT,
    effectCorrect: { safety: +10, energy: -2, performance: -2, quality: +2 }, impact: { pro: "Safe +", con: "Energy −" }, tags: ["factory", "logistics"],
  },
  {
    id: "tooling-change",
    title: "Tooling change",
    description: "Set up properly before producing again.",
    icon: "🔧",
    correct: ACTION.LEFT,
    effectCorrect: { quality: +10, performance: -2, energy: -1, safety: +2 },
    impact: { pro: "Qual +", con: "Perf −" },
    tags: ["factory", "technician"],
  },
  {
    id: "forklift-near-miss",
    title: "Forklift near-miss",
    description: "Close call in the aisle — STOP the line.",
    icon: "🚧",
    correct: ACTION.STOP,
    effectCorrect: { safety: +14, quality: +4, performance: -2, energy: -2 },
    impact: { pro: "Safe ++", con: "Must stop" },
    isHazard: true,
    tags: ["factory", "logistics"],
  },
  // Office / Engineering tasks
  {
    id: "deadline-pressure",
    title: "Deadline pressure",
    description: "Management wants it now. Push output.",
    icon: "⏱️",
    correct: ACTION.RIGHT,
    effectCorrect: { performance: +10, energy: -7, quality: -2, safety: 0 },
    impact: { pro: "Perf +", con: "Energy −" },
    tags: ["engineer"],
  },
  {
    id: "spec-review",
    title: "Spec review",
    description: "Check requirements before shipping decisions.",
    icon: "📎",
    correct: ACTION.LEFT,
    effectCorrect: { quality: +10, performance: -2, energy: -2, safety: +1 },
    impact: { pro: "Qual +", con: "Slower" },
    tags: ["engineer"],
  },
  {
    id: "safety-compliance",
    title: "Safety compliance checklist",
    description: "Verify compliance — boring, but vital.",
    icon: "✅",
    correct: ACTION.LEFT,
    effectCorrect: { safety: +10, performance: -2, energy: -1, quality: +2 },
    impact: { pro: "Safe +", con: "Perf −" },
    tags: ["engineer", "common"],
  },
  {
    id: "overtime-email",
    title: "Overtime email",
    description: "Another late meeting? Protect your energy.",
    icon: "📧",
    correct: ACTION.LEFT,
    effectCorrect: { energy: +10, safety: +2, performance: -3, quality: 0 },
    impact: { pro: "Energy +", con: "Perf −" },
    tags: ["engineer", "common"],
  },
  {
    id: "payslip-confusion",
    title: "Payslip confusion",
    description: "Numbers don’t add up. Clarify properly.",
    icon: "🧾",
    correct: ACTION.LEFT,
    effectCorrect: { quality: +8, performance: -2, energy: -1, safety: +1 }, impact: { pro: "Qual +", con: "Time cost" }, tags: ["engineer", "common"],
  },
  {
    id: "meeting-overload",
    title: "Meeting overload",
    description: "Too many calls. Protect your focus.",
    icon: "📅",
    correct: ACTION.LEFT,
    effectCorrect: { energy: +8, performance: -2, quality: +2, safety: 0 },
    impact: { pro: "Energy +", con: "Perf −" },
    tags: ["engineer"],
  },
  // Logistics tasks
  {
    id: "late-truck",
    title: "Late truck",
    description: "Shipment delayed — push to catch up.",
    icon: "🚚",
    correct: ACTION.RIGHT,
    effectCorrect: { performance: +10, energy: -6, safety: -1, quality: -1 },
    impact: { pro: "Perf +", con: "Energy −" },
    tags: ["logistics"],
  },
  {
    id: "inventory-mismatch",
    title: "Inventory mismatch",
    description: "Counts don’t match. Fix before moving on.",
    icon: "📦",
    correct: ACTION.LEFT,
    effectCorrect: { quality: +10, performance: -2, energy: -2, safety: +1 }, impact: { pro: "Qual +", con: "Slower" }, tags: ["logistics"],
  },
  // Common / HR-ish tasks
  {
    id: "written-warning-threat",
    title: "Written warning threat",
    description: "Pressure tactic. Stay calm and document.",
    icon: "⚠️",
    correct: ACTION.LEFT,
    effectCorrect: { safety: +8, quality: +6, performance: -2, energy: 0 },
    impact: { pro: "Safe +", con: "Time cost" },
    tags: ["common"],
  },
  {
    id: "illness-paperwork",
    title: "Long-term illness paperwork",
    description: "Handle forms correctly to reduce stress.",
    icon: "🧑‍⚕️",
    correct: ACTION.LEFT,
    effectCorrect: { safety: +4, energy: +8, performance: -2, quality: +2 },
    impact: { pro: "Energy +", con: "Perf −" },
    tags: ["common"],
  },
];

export function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

export function clamp100(x) {
  return Math.max(0, Math.min(100, Math.round(x)));
}

export function mulberry32(seed) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const s = `${y}-${m}-${d}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function cadenceMsAt(progress01) {
  const p = clamp01(progress01);
  // ~1.6s to ~0.9s
  const start = 1600;
  const end = 900;
  return Math.round(start + (end - start) * p);
}

export function decisionWindowMsAt(progress01) {
  const p = clamp01(progress01);
  // More time to choose: 5s down to 3.5s
  const start = 5000;
  const end = 3500;
  return Math.round(start + (end - start) * p);
}

export function hazardChanceAt(progress01) {
  const p = clamp01(progress01);
  // Slight increase over time
  return 0.12 + 0.10 * p; // ~12% -> 22%
}

function filterByRole(tasks, role) {
  if (!role) return tasks;
  if (role === "technician") {
    // Technician: mostly shopfloor + maintenance, some common
    return tasks.filter((t) =>
      (t.tags || []).some((x) => x === "technician" || x === "factory" || x === "common")
    );
  }
  if (role === "engineer") {
    return tasks.filter((t) => (t.tags || []).some((x) => x === "engineer" || x === "common"));
  }
  if (role === "logistics") {
    return tasks.filter((t) => (t.tags || []).some((x) => x === "logistics" || x === "common" || x === "factory"));
  }
  // factory
  return tasks.filter((t) => (t.tags || []).some((x) => x === "factory" || x === "common"));
}

export function pickTask(rng, progress01, role, previousHazardCount = 0) {
  // DEPRECATED: This function is replaced by createTaskBag approach for better action distribution
  // Kept for backwards compatibility but not used
  const hazardChance = hazardChanceAt(progress01);
  const wantHazard = previousHazardCount < 2 && rng() < hazardChance;
  const roleTasks = filterByRole(TASKS, role);
  const pool = wantHazard
    ? roleTasks.filter((t) => t.correct === ACTION.STOP)
    : roleTasks.filter((t) => t.correct !== ACTION.STOP);

  const idx = Math.floor(rng() * pool.length);
  return pool[idx];
}

// Task bag state for balanced distribution
let taskBag = [];
let taskBagIndex = 0;
let lastTaskId = null;
let lastActions = []; // Track last 3 actions

/**
 * Create a balanced bag of tasks with controlled action distribution
 * Target: LEFT 40-45%, RIGHT 35-40%, STOP 15-20%
 */
function createTaskBag(rng, role, bagSize = 20) {
  const roleTasks = filterByRole(TASKS, role);

  // Group tasks by action
  const leftTasks = roleTasks.filter(t => t.correct === ACTION.LEFT);
  const rightTasks = roleTasks.filter(t => t.correct === ACTION.RIGHT);
  const stopTasks = roleTasks.filter(t => t.correct === ACTION.STOP);

  // Target distribution for bag of 20
  const leftCount = 9;   // 45%
  const rightCount = 8;  // 40%
  const stopCount = 3;   // 15%

  const bag = [];

  // Fill bag with balanced selection
  for (let i = 0; i < leftCount; i++) {
    if (leftTasks.length > 0) {
      bag.push(leftTasks[Math.floor(rng() * leftTasks.length)]);
    }
  }
  for (let i = 0; i < rightCount; i++) {
    if (rightTasks.length > 0) {
      bag.push(rightTasks[Math.floor(rng() * rightTasks.length)]);
    }
  }
  for (let i = 0; i < stopCount; i++) {
    if (stopTasks.length > 0) {
      bag.push(stopTasks[Math.floor(rng() * stopTasks.length)]);
    }
  }

  // Shuffle bag using Fisher-Yates
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }

  return bag;
}

/**
 * Pick next task with action balancing and constraints
 * - No same task twice in a row
 * - Max 3 same action in a row
 * - Max 2 STOP in a row
 */
export function pickTaskBalanced(rng, progress01, role, previousHazardCount = 0) {
  // Refill bag when empty or low
  if (taskBagIndex >= taskBag.length - 2 || taskBag.length === 0) {
    taskBag = createTaskBag(rng, role);
    taskBagIndex = 0;
  }

  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    const candidate = taskBag[taskBagIndex];

    // Constraint 1: No same task twice in a row
    if (candidate.id === lastTaskId) {
      // Swap with next task if possible
      if (taskBagIndex < taskBag.length - 1) {
        [taskBag[taskBagIndex], taskBag[taskBagIndex + 1]] =
          [taskBag[taskBagIndex + 1], taskBag[taskBagIndex]];
        attempts++;
        continue;
      }
    }

    // Constraint 2: Max 3 same action in a row
    if (lastActions.length >= 3) {
      const last3 = lastActions.slice(-3);
      if (last3.every(a => a === candidate.correct)) {
        if (taskBagIndex < taskBag.length - 1) {
          [taskBag[taskBagIndex], taskBag[taskBagIndex + 1]] =
            [taskBag[taskBagIndex + 1], taskBag[taskBagIndex]];
          attempts++;
          continue;
        }
      }
    }

    // Constraint 3: Max 2 STOP in a row (hazard prevention)
    if (candidate.correct === ACTION.STOP && previousHazardCount >= 2) {
      if (taskBagIndex < taskBag.length - 1) {
        [taskBag[taskBagIndex], taskBag[taskBagIndex + 1]] =
          [taskBag[taskBagIndex + 1], taskBag[taskBagIndex]];
        attempts++;
        continue;
      }
    }

    // Valid task found
    taskBagIndex++;
    lastTaskId = candidate.id;
    lastActions.push(candidate.correct);
    if (lastActions.length > 5) lastActions.shift(); // Keep last 5

    return candidate;
  }

  // Fallback: return current task if constraints can't be satisfied
  const fallback = taskBag[taskBagIndex] || filterByRole(TASKS, role)[0];
  taskBagIndex++;
  lastTaskId = fallback.id;
  lastActions.push(fallback.correct);
  if (lastActions.length > 5) lastActions.shift();

  return fallback;
}

/**
 * Reset task picker state (call when starting new game)
 */
export function resetTaskPicker() {
  taskBag = [];
  taskBagIndex = 0;
  lastTaskId = null;
  lastActions = [];
}

export function applyMeters(meters, delta) {
  return {
    performance: clamp100(meters.performance + (delta.performance || 0)),
    quality: clamp100(meters.quality + (delta.quality || 0)),
    safety: clamp100(meters.safety + (delta.safety || 0)),
    energy: clamp100(meters.energy + (delta.energy || 0)),
  };
}

export function resolveDecision({
  task,
  action,
  meters,
  streak,
  score,
}) {
  const isCorrect = action === task.correct;

  if (isCorrect) {
    const nextStreak = streak + 1;
    const base = 120;
    const combo = Math.min(180, nextStreak * 12);
    const nextScore = score + base + combo;

    return {
      isCorrect: true,
      nextMeters: applyMeters(meters, task.effectCorrect),
      nextStreak,
      nextScore,
      pointsGained: base + combo,
    };
  }

  // Wrong decision: break streak and take a meaningful hit
  const wrongPenalty = {
    performance: -6,
    quality: -6,
    safety: -8,
    energy: -8,
  };

  return {
    isCorrect: false,
    nextMeters: applyMeters(meters, wrongPenalty),
    nextStreak: 0,
    nextScore: Math.max(0, score - 40),
    pointsGained: -40,
  };
}

export function resolveNoDecision({ meters, streak, score }) {
  // Mild penalty: feels fair but encourages action.
  return {
    nextMeters: applyMeters(meters, { energy: -10, performance: -2 }),
    nextStreak: 0,
    nextScore: Math.max(0, score - 20),
    pointsGained: -20,
  };
}

export function shouldEnd(meters, secondsLeft) {
  if (secondsLeft <= 0) return true;
  if (meters.energy <= 0) return true;
  if (meters.safety <= 0) return true;
  return false;
}

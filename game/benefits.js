export const BENEFITS = [
  {
    id: "legal",
    title: "Legal protection",
    icon: "⚖️",
    micro: "Free legal help at work",
    hook: "Know your rights when work gets unfair.",
    bullets: [
      "Support in employment and social welfare matters",
      "Also help on tax/residence topics when they affect employment",
      "Guidance that keeps you from standing alone",
    ],
  },
  {
    id: "strike",
    title: "Strike assistance",
    icon: "✊", micro: "Strike pay when needed", hook: "If there’s a strike, members can get support.",
    bullets: [
      "Strike pay in the event of a strike",
      "Membership period matters",
      "Not paid for token strikes",
    ],
  },
  {
    id: "disciplinary",
    title: "Disciplinary + lockout support",
    icon: "🛡️",
    micro: "Protection from unfair treatment",
    hook: "Protection against disadvantages and discrimination.",
    bullets: [
      "Assistance in disciplinary measures and lockouts",
      "Protection against being treated unfairly",
      "Helps reduce pressure and fear tactics",
    ],
  },
  {
    id: "leisure",
    title: "Leisure accident insurance",
    icon: "🚴",
    micro: "Worldwide coverage outside work",
    hook: "Covered worldwide outside work — even in sports.",
    bullets: [
      "Worldwide, outside work",
      "Sports, gardening, cycling, holiday",
      "A “life happens” safety net",
    ],
  },
  {
    id: "emergency",
    title: "Extraordinary emergencies",
    icon: "🧰",
    micro: "Quick hardship aid",
    hook: "Quick hardship aid when emergencies hit.",
    bullets: [
      "Assistance in extraordinary emergencies",
      "Hardship aid and quick support",
      "Also in collective emergencies",
    ],
  },
  {
    id: "death",
    title: "Support in the event of death",
    icon: "🕯️",
    micro: "Support for families",
    hook: "Members support families too — respectfully.",
    bullets: [
      "Survivor support depending on membership duration",
      "Partner support can be included",
      "A safety net for families",
    ],
  },
];

export function getBenefit(id) {
  return BENEFITS.find((b) => b.id === id);
}

/**
 * Unlock rules are evaluated client-side using current run state.
 * runState shape (expected):
 * { meters, leftCount, maxStreak, correctStopCount, hadDip, recoveredFromDip, secondsLeft, sessionSeconds }
 */
export function evaluateUnlocks(runState) {
  const s = runState;
  const elapsed = Math.max(0, s.sessionSeconds - s.secondsLeft);

  const unlocked = {};

  // 1) Legal protection: handle payslip/warning/illness paperwork task correctly (tracked via legalTaskHandled flag)
  unlocked.legal = s.legalTaskHandled === true;

  // 2) Strike assistance: Performance > 55 AND Safety > 35 at 45s (balanced)
  unlocked.strike = elapsed >= 45 && s.meters.performance > 55 && s.meters.safety > 35;

  // 3) Disciplinary/lockout: maintain Safety > 40 for at least 20s
  unlocked.disciplinary = elapsed >= 20 && s.meters.safety > 40;

  // 4) Leisure accident insurance: Energy > 45 at 30s
  unlocked.leisure = elapsed >= 30 && s.meters.energy > 45;

  // 5) Extraordinary emergencies: recover from a dip (any meter <30 then back >40)
  unlocked.emergency = s.recoveredFromDip === true;

  // 6) Death assistance: shown at end (always “available”, unlocked at end)
  unlocked.death = s.secondsLeft <= 0 || s.meters.energy <= 0 || s.meters.safety <= 0;

  return unlocked;
}

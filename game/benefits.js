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
    icon: "✊",
    micro: "Strike pay when needed",
    hook: "If there's a strike, members can get support.",
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
      "A 'life happens' safety net",
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
 * Unlock rules for quiz-based game.
 * runState shape:
 * { stats: { tagCounts, correctByTag }, maxStreak, wrongStreak, secondsLeft, recoveredFromDip }
 */
export function evaluateUnlocks(runState) {
  const s = runState;
  const stats = s.stats || {};
  const correctByTag = stats.correctByTag || {};

  const unlocked = {};

  // 1) Legal protection: answer at least 2 correct questions tagged pay/paperwork/discipline
  const legalTags = ['pay', 'paperwork', 'discipline'];
  const legalCorrect = legalTags.reduce((sum, tag) => sum + (correctByTag[tag] || 0), 0);
  unlocked.legal = legalCorrect >= 2;

  // 2) Strike assistance: answer at least 1 correct question tagged 'strike' AND streak >= 3 at any point
  const strikeCorrect = correctByTag['strike'] || 0;
  unlocked.strike = strikeCorrect >= 1 && s.maxStreak >= 3;

  // 3) Disciplinary + lockout: answer at least 2 correct questions tagged discipline/discrimination
  const disciplinaryTags = ['discipline', 'discrimination'];
  const disciplinaryCorrect = disciplinaryTags.reduce((sum, tag) => sum + (correctByTag[tag] || 0), 0);
  unlocked.disciplinary = disciplinaryCorrect >= 2;

  // 4) Leisure accident insurance: answer at least 1 correct question tagged 'leisure'
  const leisureCorrect = correctByTag['leisure'] || 0;
  unlocked.leisure = leisureCorrect >= 1;

  // 5) Extraordinary emergencies: recover after 2 wrong answers then get 3 correct in a row
  unlocked.emergency = s.recoveredFromDip === true;

  // 6) Death assistance: always shown at end (not flashy during play)
  unlocked.death = s.secondsLeft <= 0;

  return unlocked;
}

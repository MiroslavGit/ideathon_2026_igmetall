// Quiz questions for FAIR SHIFT game
// Each question has a statement, correct answer (fair/shortcut), tags, and role weights

export const ANSWER = {
  FAIR: "FAIR",
  SHORTCUT: "SHORTCUT",
};

// Extra questions pack (IG Metall themed)
// Assumes: ANSWER = { FAIR: "fair", SHORTCUT: "shortcut" }
export const QUESTIONS_IGM_PACK = [
  // --- Tariff / working time / fairness ---
  {
    id: "tariff-rights-know",
    text: "Your company ignores the collective agreement rules. Just accept it to avoid trouble?",
    correct: ANSWER.FAIR,
    tags: ["tariff", "pay", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "azubi-pay-fairness",
    text: "An apprentice gets less than agreed. 'It's normal' — ignore it?",
    correct: ANSWER.FAIR,
    tags: ["pay", "tariff"],
    roleWeight: { factory: 2, tech: 2, engineer: 1, logistics: 2 },
  },
  {
    id: "time-off-trade",
    text: "You can choose extra time off instead of money. Is it okay to ask for it?",
    correct: ANSWER.FAIR,
    tags: ["working-time", "leisure"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "four-day-week-pressure",
    text: "A 4-day week is discussed, but management says 'never'. Stop talking about it?",
    correct: ANSWER.FAIR,
    tags: ["working-time", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  // --- AI / digitalization (big topic) ---
  {
    id: "ai-performance-rating",
    text: "Company introduces AI that rates your performance. Accept it with no rules?",
    correct: ANSWER.FAIR,
    tags: ["ai", "discipline", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "ai-human-final-say",
    text: "AI suggests decisions. Is it okay that a human must make the final call?",
    correct: ANSWER.FAIR,
    tags: ["ai", "safety"],
    roleWeight: { factory: 1, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "ai-data-transparency",
    text: "New software logs your actions. 'No need to tell workers' — accept?",
    correct: ANSWER.FAIR,
    tags: ["ai", "paperwork", "discipline"],
    roleWeight: { factory: 1, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "ai-safety-risk-check",
    text: "AI changes your workflow. Skip the safety risk assessment to save time?",
    correct: ANSWER.FAIR,
    tags: ["ai", "safety", "quality"],
    roleWeight: { factory: 2, tech: 3, engineer: 3, logistics: 1 },
  },

  // --- Legal protection / discipline (Rechtsschutz) ---
  {
    id: "dismissal-deadline",
    text: "You get a dismissal letter. Wait a month before seeking help?",
    correct: ANSWER.FAIR,
    tags: ["legal", "paperwork", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "warning-sign-fast",
    text: "HR wants your signature on a warning today. Sign without advice?",
    correct: ANSWER.FAIR,
    tags: ["legal", "paperwork", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  // --- Strike / collective action ---
  {
    id: "warnstreik-support",
    text: "There is a warning strike. Join, even if management dislikes it?",
    correct: ANSWER.FAIR,
    tags: ["strike"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "strike-pay-info",
    text: "You fear losing pay in a strike. Is it fair to ask about strike support?",
    correct: ANSWER.FAIR,
    tags: ["strike", "pay"],
    roleWeight: { factory: 2, tech: 2, engineer: 1, logistics: 2 },
  },
  {
    id: "lockout-threat",
    text: "Employer threatens a lockout because of union action. Stay silent?",
    correct: ANSWER.FAIR,
    tags: ["strike", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  // --- Safety + health (IG Metall often links it with rights) ---
  {
    id: "heat-stress-breaks",
    text: "It's very hot on the shopfloor. Skip breaks to keep output high?",
    correct: ANSWER.FAIR,
    tags: ["safety", "working-time"],
    roleWeight: { factory: 3, tech: 2, engineer: 1, logistics: 2 },
  },
  {
    id: "near-miss-report",
    text: "A near-accident happens. 'No injury, no report' — okay?",
    correct: ANSWER.FAIR,
    tags: ["safety", "discipline"],
    roleWeight: { factory: 3, tech: 2, engineer: 1, logistics: 2 },
  },

  // --- Qualification / future skills ---
  {
    id: "training-for-new-tech",
    text: "New tech/AI arrives. 'Just learn on your own' — accept it?",
    correct: ANSWER.FAIR,
    tags: ["training", "ai"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "upskilling-right",
    text: "Your job changes due to transformation. Ask for proper training time?",
    correct: ANSWER.FAIR,
    tags: ["training", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 2 },
  },

  // --- Leisure accident insurance / boundaries ---
  {
    id: "off-duty-accident",
    text: "You get injured off duty. 'Work insurance won't help' — just pay yourself?",
    correct: ANSWER.FAIR,
    tags: ["leisure", "safety"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "weekend-calls",
    text: "Your manager expects weekend replies. Is it fair to set boundaries?",
    correct: ANSWER.FAIR,
    tags: ["leisure", "discipline"],
    roleWeight: { factory: 1, tech: 2, engineer: 3, logistics: 2 },
  },

  // --- Extraordinary emergencies / solidarity ---
  {
    id: "flood-emergency-help",
    text: "A flood damages your home. 'You're on your own' — accept it?",
    correct: ANSWER.FAIR,
    tags: ["emergency"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  // --- Respectful: death benefit ---
  {
    id: "bereaved-support",
    text: "A coworker’s family needs support after a death. Is it fair to ask for guidance?",
    correct: ANSWER.FAIR,
    tags: ["death", "legal"],
    roleWeight: { factory: 1, tech: 1, engineer: 1, logistics: 1 },
  },

  // --- Fix for your wrong one (suggested replacement) ---
  {
    id: "emergency-real-fixed",
    text: "Real equipment emergency: stop work and alert everyone immediately.",
    correct: ANSWER.FAIR,
    tags: ["safety"],
    roleWeight: { factory: 3, tech: 3, engineer: 2, logistics: 2 },
  },
];


// Utility to filter questions by role
export function getQuestionsForRole(role) {
  return QUESTIONS.map((q) => ({
    ...q,
    weight: q.roleWeight[role] || 1,
  }));
}

// Quiz questions for FAIR SHIFT game
// Each question has a statement, correct answer (fair/shortcut), tags, and role weights

export const ANSWER = {
  FAIR: "FAIR",
  SHORTCUT: "SHORTCUT",
};

// Extra questions pack (IG Metall themed)
// Assumes: ANSWER = { FAIR: "fair", SHORTCUT: "shortcut" }
export const QUESTIONS_IGM_PACK = [
  {
    id: "tariff-rights-know",
    text: "Your company ignores the collective agreement. Stay quiet to avoid trouble?",
    correct: ANSWER.FAIR,
    tags: ["tariff", "pay", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "azubi-pay-fairness",
    text: "An apprentice is underpaid. Ignore it because 'it's normal'?",
    correct: ANSWER.FAIR,
    tags: ["pay", "tariff"],
    roleWeight: { factory: 2, tech: 2, engineer: 1, logistics: 2 },
  },
  {
    id: "time-off-trade",
    text: "You can choose time off instead of money. Don’t ask because it might annoy management?",
    correct: ANSWER.FAIR,
    tags: ["working-time", "leisure"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "four-day-week-pressure",
    text: "A 4-day week is discussed. Management says 'never'. Drop it and stay quiet?",
    correct: ANSWER.FAIR,
    tags: ["working-time", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  {
    id: "ai-performance-rating",
    text: "Company introduces AI to rate your performance. Accept it with no clear rules?",
    correct: ANSWER.FAIR,
    tags: ["ai", "discipline", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "ai-human-final-say",
    text: "AI suggests decisions. Let AI decide without a human check?",
    correct: ANSWER.FAIR,
    tags: ["ai", "safety"],
    roleWeight: { factory: 1, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "ai-data-transparency",
    text: "New software logs your work. Accept it even if nobody explains what’s tracked?",
    correct: ANSWER.FAIR,
    tags: ["ai", "paperwork", "discipline"],
    roleWeight: { factory: 1, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "ai-safety-risk-check",
    text: "AI changes your workflow. Skip the safety risk check to save time?",
    correct: ANSWER.FAIR,
    tags: ["ai", "safety", "quality"],
    roleWeight: { factory: 2, tech: 3, engineer: 3, logistics: 1 },
  },

  {
    id: "dismissal-deadline",
    text: "You get a dismissal letter. Wait weeks before asking for help?",
    correct: ANSWER.FAIR,
    tags: ["legal", "paperwork", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "warning-sign-fast",
    text: "HR wants your signature on a warning today. Sign it without advice?",
    correct: ANSWER.FAIR,
    tags: ["legal", "paperwork", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  {
    id: "warnstreik-support",
    text: "There is a warning strike. Stay away because management might be angry?",
    correct: ANSWER.FAIR,
    tags: ["strike"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "strike-pay-info",
    text: "You fear losing pay in a strike. Don’t ask about strike support?",
    correct: ANSWER.FAIR,
    tags: ["strike", "pay"],
    roleWeight: { factory: 2, tech: 2, engineer: 1, logistics: 2 },
  },
  {
    id: "lockout-threat",
    text: "Employer threatens a lockout. Stay silent and just comply?",
    correct: ANSWER.FAIR,
    tags: ["strike", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  {
    id: "heat-stress-breaks",
    text: "It’s very hot at work. Skip breaks to keep output high?",
    correct: ANSWER.FAIR,
    tags: ["safety", "working-time"],
    roleWeight: { factory: 3, tech: 2, engineer: 1, logistics: 2 },
  },
  {
    id: "near-miss-report",
    text: "A near-accident happens. Ignore it because nobody got hurt?",
    correct: ANSWER.FAIR,
    tags: ["safety", "discipline"],
    roleWeight: { factory: 3, tech: 2, engineer: 1, logistics: 2 },
  },

  {
    id: "training-for-new-tech",
    text: "New tech/AI arrives. Accept 'learn it on your own' with no training time?",
    correct: ANSWER.FAIR,
    tags: ["training", "ai"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "upskilling-right",
    text: "Your job changes. Don’t ask for proper training time to avoid conflict?",
    correct: ANSWER.FAIR,
    tags: ["training", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 2 },
  },

  {
    id: "off-duty-accident",
    text: "You get injured off duty. Don’t ask for support and just pay yourself?",
    correct: ANSWER.FAIR,
    tags: ["leisure", "safety"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "weekend-calls",
    text: "Your manager expects weekend replies. Accept it and drop your boundaries?",
    correct: ANSWER.FAIR,
    tags: ["leisure", "discipline"],
    roleWeight: { factory: 1, tech: 2, engineer: 3, logistics: 2 },
  },

  {
    id: "flood-emergency-help",
    text: "A flood damages your home. Assume you're on your own and don’t ask for help?",
    correct: ANSWER.FAIR,
    tags: ["emergency"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  {
    id: "bereaved-support",
    text: "A coworker dies. Avoid asking for guidance because it feels awkward?",
    correct: ANSWER.FAIR,
    tags: ["death", "legal"],
    roleWeight: { factory: 1, tech: 1, engineer: 1, logistics: 1 },
  },

  {
    id: "emergency-real-fixed",
    text: "Real equipment emergency: keep working to avoid delays?",
    correct: ANSWER.FAIR,
    tags: ["safety"],
    roleWeight: { factory: 3, tech: 3, engineer: 2, logistics: 2 },
  },
];


// Main questions export (using IGM pack)
export const QUESTIONS = QUESTIONS_IGM_PACK;

// Utility to filter questions by role
export function getQuestionsForRole(role) {
  return QUESTIONS.map((q) => ({
    ...q,
    weight: q.roleWeight[role] || 1,
  }));
}

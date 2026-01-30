// Quiz questions for FAIR SHIFT game
// Each question has a statement, correct answer (speak up/stay quiet), tags, and role weights

export const ANSWER = {
  SPEAK_UP: "SPEAK_UP",
  STAY_QUIET: "STAY_QUIET",
};

// Extra questions pack (IG Metall themed)
// // Answer enum: SPEAK_UP = speaking up for rights, STAY_QUIET = holding back/de-escalation
export const QUESTIONS_IGM_PACK = [
  // --- Tariff / working time / fairness ---
  {
    id: "tariff-rights-know",
    text: "Your company ignores the collective agreement. Do you stay quiet, or speak up?",
    correct: ANSWER.SPEAK_UP,
    tags: ["tariff", "pay", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "azubi-pay-fairness",
    text: "An apprentice is underpaid. Do you ignore it, or help fix it?",
    correct: ANSWER.SPEAK_UP,
    tags: ["pay", "tariff"],
    roleWeight: { factory: 2, tech: 2, engineer: 1, logistics: 2 },
  },
  // {
  //   id: "time-off-trade",
  //   text: "You can choose time off instead of money. Do you avoid asking, or ask for it?",
  //   correct: ANSWER.SPEAK_UP,
  //   tags: ["working-time", "leisure"],
  //   roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  // },
  {
    id: "four-day-week-pressure",
    text: "A 4-day week is discussed. Do you drop it to keep peace, or keep talking about it?",
    correct: ANSWER.SPEAK_UP,
    tags: ["working-time", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  // --- AI / digitalization ---
  {
    id: "ai-performance-rating",
    text: "AI will rate your performance. Do you accept it with no rules, or demand clear rules?",
    correct: ANSWER.SPEAK_UP,
    tags: ["ai", "discipline", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "ai-human-final-say",
    text: "AI suggests decisions. Do you let AI decide alone, or insist a human checks it?",
    correct: ANSWER.SPEAK_UP,
    tags: ["ai", "safety"],
    roleWeight: { factory: 1, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "ai-data-transparency",
    text: "New software tracks your work. Do you accept it blindly, or ask what data is tracked?",
    correct: ANSWER.SPEAK_UP,
    tags: ["ai", "paperwork", "discipline"],
    roleWeight: { factory: 1, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "ai-safety-risk-check",
    text: "AI changes your workflow. Do you skip the risk check, or do the safety assessment?",
    correct: ANSWER.SPEAK_UP,
    tags: ["ai", "safety", "quality"],
    roleWeight: { factory: 2, tech: 3, engineer: 3, logistics: 1 },
  },

  // --- Legal protection / discipline ---
  {
    id: "dismissal-deadline",
    text: "You get a dismissal letter. Do you confront your boss alone, or get advice first?",
    correct: ANSWER.STAY_QUIET, // HOLD BACK / get advice first
    tags: ["legal", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "warning-sign-fast",
    text: "HR wants your signature today. Do you sign fast, or take it for advice first?",
    correct: ANSWER.STAY_QUIET, // don't sign on the spot
    tags: ["legal", "paperwork", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  // --- Strike / collective action ---
  {
    id: "warnstreik-support",
    text: "There is a warning strike. Do you stay away out of fear, or join in solidarity?",
    correct: ANSWER.SPEAK_UP,
    tags: ["strike"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "strike-pay-info",
    text: "You worry about strike pay. Do you stay silent, or ask how strike support works?",
    correct: ANSWER.SPEAK_UP,
    tags: ["strike", "pay"],
    roleWeight: { factory: 2, tech: 2, engineer: 1, logistics: 2 },
  },
  {
    id: "lockout-threat",
    text: "Employer threatens a lockout. Do you comply quietly, or report/seek support?",
    correct: ANSWER.SPEAK_UP,
    tags: ["strike", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  // --- Safety + health ---
  {
    id: "heat-stress-breaks",
    text: "It's very hot at work. Do you skip breaks, or take breaks for safety?",
    correct: ANSWER.SPEAK_UP,
    tags: ["safety", "working-time"],
    roleWeight: { factory: 3, tech: 2, engineer: 1, logistics: 2 },
  },
  {
    id: "near-miss-report",
    text: "A near-accident happens. Do you ignore it, or report it so it won’t repeat?",
    correct: ANSWER.SPEAK_UP,
    tags: ["safety", "discipline"],
    roleWeight: { factory: 3, tech: 2, engineer: 1, logistics: 2 },
  },

  // --- Qualification / future skills ---
  {
    id: "training-for-new-tech",
    text: "New tech arrives. Do you learn at home for free, or ask for training on work time?",
    correct: ANSWER.SPEAK_UP,
    tags: ["training", "ai"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "upskilling-right",
    text: "Your job changes. Do you avoid asking for training, or request proper upskilling time?",
    correct: ANSWER.SPEAK_UP,
    tags: ["training", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 2 },
  },

  // --- Leisure / boundaries ---
  {
    id: "off-duty-accident",
    text: "You get injured off duty. Do you pay alone, or ask about support/insurance options?",
    correct: ANSWER.SPEAK_UP,
    tags: ["leisure", "safety"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "weekend-calls",
    text: "Your manager expects weekend replies. Do you answer instantly, or set boundaries?",
    correct: ANSWER.SPEAK_UP,
    tags: ["leisure", "discipline"],
    roleWeight: { factory: 1, tech: 2, engineer: 3, logistics: 2 },
  },

  // --- Emergencies / solidarity ---
  {
    id: "flood-emergency-help",
    text: "A flood damages your home. Do you handle it alone, or ask for emergency support?",
    correct: ANSWER.SPEAK_UP,
    tags: ["emergency"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "bereaved-support",
    text: "A coworker dies. Do you avoid it, or ask how to support the family properly?",
    correct: ANSWER.SPEAK_UP,
    tags: ["death", "legal"],
    roleWeight: { factory: 1, tech: 1, engineer: 1, logistics: 1 },
  },

  // --- Safety emergency ---
  {
    id: "emergency-real-fixed",
    text: "Real equipment emergency. Do you keep working to avoid delay, or stop and alert everyone?",
    correct: ANSWER.SPEAK_UP,
    tags: ["safety"],
    roleWeight: { factory: 3, tech: 3, engineer: 2, logistics: 2 },
  },

  // --- De-escalation / smart process (LEFT correct = HOLD BACK / avoid escalation) ---
  {
    id: "argument-on-floor",
    text: "A conflict escalates on the shopfloor. Do you keep arguing, or cool down and step back?",
    correct: ANSWER.STAY_QUIET,
    tags: ["discipline", "safety"],
    roleWeight: { factory: 3, tech: 2, engineer: 1, logistics: 2 },
  },
  {
    id: "report-anonymously",
    text: "You saw a problem but fear backlash. Do you confront publicly, or report through the proper channel?",
    correct: ANSWER.STAY_QUIET,
    tags: ["discipline", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "dont-sign-now",
    text: "HR pushes a document 'right now'. Do you sign immediately, or refuse and review first?",
    correct: ANSWER.STAY_QUIET,
    tags: ["legal", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  }
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

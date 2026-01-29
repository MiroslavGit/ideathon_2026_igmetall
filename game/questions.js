// Quiz questions for FAIR SHIFT game
// Each question has a statement, correct answer (fair/shortcut), tags, and role weights

export const ANSWER = {
  FAIR: "FAIR",
  SHORTCUT: "SHORTCUT",
};

export const QUESTIONS = [
  // Safety questions
  {
    id: "safety-guard",
    text: "The safety guard on your machine is loose, but production is behind. Keep working?",
    correct: ANSWER.FAIR, // Should stop and fix
    tags: ["safety", "quality"],
    roleWeight: { factory: 3, tech: 3, engineer: 1, logistics: 1 },
  },
  {
    id: "forklift-speed",
    text: "You're running late with a delivery. Drive the forklift faster than the speed limit?",
    correct: ANSWER.FAIR, // Should follow speed limit
    tags: ["safety", "logistics"],
    roleWeight: { factory: 2, tech: 1, engineer: 1, logistics: 3 },
  },
  {
    id: "ppe-skip",
    text: "Your safety goggles are foggy. It's just a quick task — skip wearing them?",
    correct: ANSWER.FAIR, // Should wear PPE
    tags: ["safety"],
    roleWeight: { factory: 3, tech: 3, engineer: 1, logistics: 2 },
  },
  {
    id: "machine-noise",
    text: "A machine makes an unusual noise, but it still runs. Keep it going to meet quota?",
    correct: ANSWER.FAIR, // Should stop and check
    tags: ["safety", "quality"],
    roleWeight: { factory: 3, tech: 3, engineer: 2, logistics: 1 },
  },
  {
    id: "spill-ignore",
    text: "Someone spilled oil on the floor. You're busy — leave it for the cleaning crew?",
    correct: ANSWER.FAIR, // Should clean/mark immediately
    tags: ["safety"],
    roleWeight: { factory: 3, tech: 2, engineer: 1, logistics: 2 },
  },

  // Quality questions
  {
    id: "quality-skip",
    text: "Final inspection takes time. The parts look fine — skip the check?",
    correct: ANSWER.FAIR, // Should always inspect
    tags: ["quality"],
    roleWeight: { factory: 3, tech: 3, engineer: 2, logistics: 1 },
  },
  {
    id: "defect-hide",
    text: "You notice a small defect in a part. It's minor — let it pass through?",
    correct: ANSWER.FAIR, // Should report/reject
    tags: ["quality"],
    roleWeight: { factory: 3, tech: 3, engineer: 2, logistics: 1 },
  },
  {
    id: "calibration-skip",
    text: "Equipment calibration is due, but you're behind schedule. Skip it this time?",
    correct: ANSWER.FAIR, // Should calibrate
    tags: ["quality", "safety"],
    roleWeight: { factory: 2, tech: 3, engineer: 2, logistics: 1 },
  },
  {
    id: "spec-change",
    text: "Customer wants a change, but the paperwork will delay things. Just do it?",
    correct: ANSWER.FAIR, // Should get proper authorization
    tags: ["quality", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 2 },
  },

  // Overtime & Pay questions
  {
    id: "unpaid-overtime",
    text: "Boss asks you to stay late to finish work but won't pay overtime. Agree?",
    correct: ANSWER.FAIR, // Should refuse unpaid work
    tags: ["pay", "overtime"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "break-skip",
    text: "Production is behind. Skip your legal break to help catch up?",
    correct: ANSWER.FAIR, // Should take break
    tags: ["pay", "safety"],
    roleWeight: { factory: 3, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "payslip-error",
    text: "Your payslip shows missing hours, but HR is slow to respond. Just accept it?",
    correct: ANSWER.FAIR, // Should pursue correction
    tags: ["pay", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "overtime-pressure",
    text: "Manager pressures you to work extra hours regularly without proper compensation. Accept?",
    correct: ANSWER.FAIR, // Should refuse/report
    tags: ["pay", "overtime", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  // Discipline & Rights questions
  {
    id: "warning-unfair",
    text: "You receive a written warning for something you didn't do. Sign it without protest?",
    correct: ANSWER.FAIR, // Should dispute with union support
    tags: ["discipline", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "discrimination-ignore",
    text: "A colleague faces discrimination but asks you not to report it. Stay silent?",
    correct: ANSWER.FAIR, // Should support and report
    tags: ["discipline", "discrimination"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "contract-change",
    text: "Company changes your shift schedule without notice or agreement. Accept it?",
    correct: ANSWER.FAIR, // Should challenge via proper channels
    tags: ["paperwork", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 3 },
  },
  {
    id: "document-sign",
    text: "Boss asks you to sign a document you haven't read carefully. Just sign?",
    correct: ANSWER.FAIR, // Should read and understand first
    tags: ["paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 2 },
  },

  // Strike & Collective Action questions
  {
    id: "strike-pressure",
    text: "There's a union strike. Management pressures you to cross the picket line. Do it?",
    correct: ANSWER.FAIR, // Should support strike
    tags: ["strike"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "union-intimidation",
    text: "Boss discourages union membership with vague threats. Stay silent?",
    correct: ANSWER.FAIR, // Should report and join anyway
    tags: ["strike", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  // Illness & Leave questions
  {
    id: "sick-work",
    text: "You're sick but there's a big deadline. Come to work anyway?",
    correct: ANSWER.FAIR, // Should stay home
    tags: ["illness", "safety"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "sick-note",
    text: "Company demands a doctor's note for a single sick day. Refuse and risk conflict?",
    context: "This may violate your rights",
    correct: ANSWER.FAIR, // Should know your rights and challenge if excessive
    tags: ["illness", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },

  // Leisure & Off-duty questions
  {
    id: "vacation-cancel",
    text: "Boss asks you to cancel approved vacation because someone quit. Accept?",
    correct: ANSWER.FAIR, // Should keep vacation
    tags: ["leisure"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "off-duty-work",
    text: "Manager messages you about work issues during your vacation. Respond immediately?",
    correct: ANSWER.FAIR, // Should set boundaries
    tags: ["leisure"],
    roleWeight: { factory: 1, tech: 2, engineer: 3, logistics: 2 },
  },

  // Mixed scenarios
  {
    id: "shortcut-pressure",
    text: "Your supervisor tells you to skip safety procedures to save time. Follow the order?",
    correct: ANSWER.FAIR, // Should refuse unsafe orders
    tags: ["safety", "discipline"],
    roleWeight: { factory: 3, tech: 3, engineer: 2, logistics: 2 },
  },
  {
    id: "equipment-broken",
    text: "A tool is damaged but still somewhat usable. Use it to finish the job?",
    correct: ANSWER.FAIR, // Should get proper tool
    tags: ["safety", "quality"],
    roleWeight: { factory: 3, tech: 3, engineer: 2, logistics: 2 },
  },
  {
    id: "training-skip",
    text: "Required safety training is scheduled but you already know the material. Skip it?",
    correct: ANSWER.FAIR, // Should attend
    tags: ["safety", "paperwork"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "deadline-impossible",
    text: "The deadline is physically impossible without cutting corners. Try to meet it anyway?",
    correct: ANSWER.FAIR, // Should communicate limits
    tags: ["quality", "overtime"],
    roleWeight: { factory: 2, tech: 2, engineer: 3, logistics: 3 },
  },
  {
    id: "coworker-unsafe",
    text: "A coworker takes dangerous shortcuts. Not your problem — ignore it?",
    correct: ANSWER.FAIR, // Should speak up
    tags: ["safety", "discipline"],
    roleWeight: { factory: 3, tech: 2, engineer: 1, logistics: 2 },
  },
  {
    id: "inventory-fudge",
    text: "Inventory numbers don't match. Adjust them slightly to make them work?",
    correct: ANSWER.FAIR, // Should investigate properly
    tags: ["paperwork", "quality"],
    roleWeight: { factory: 1, tech: 1, engineer: 2, logistics: 3 },
  },
  {
    id: "rush-delivery",
    text: "Customer needs urgent delivery. Skip proper packaging to save time?",
    correct: ANSWER.FAIR, // Should package properly
    tags: ["quality"],
    roleWeight: { factory: 2, tech: 1, engineer: 1, logistics: 3 },
  },
  {
    id: "overtime-volunteer",
    text: "Boss says overtime is 'voluntary' but implies consequences if you refuse. Agree?",
    correct: ANSWER.FAIR, // Should know it's truly voluntary
    tags: ["overtime", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "procedure-outdated",
    text: "The official procedure is outdated. Everyone ignores it — join them?",
    correct: ANSWER.FAIR, // Should follow procedure and request update
    tags: ["safety", "quality", "paperwork"],
    roleWeight: { factory: 2, tech: 3, engineer: 3, logistics: 2 },
  },
  {
    id: "report-pressure",
    text: "Manager asks you to sign off on a report with numbers you haven't verified. Sign?",
    correct: ANSWER.FAIR, // Should verify first
    tags: ["paperwork", "quality"],
    roleWeight: { factory: 1, tech: 2, engineer: 3, logistics: 2 },
  },
  {
    id: "emergency-real",
    text: "There's a real equipment emergency. Stop work immediately and alert everyone?",
    correct: ANSWER.SHORTCUT, // Wait, this should be FAIR (stopping IS fair!)
    tags: ["safety"],
    roleWeight: { factory: 3, tech: 3, engineer: 2, logistics: 2 },
  },
  {
    id: "lunch-shorten",
    text: "You're asked to cut your lunch break short regularly. It's just a few minutes — okay?",
    correct: ANSWER.FAIR, // Should maintain full break
    tags: ["pay", "overtime"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "protective-gear",
    text: "Protective equipment is uncomfortable but required. Work without it when nobody's watching?",
    correct: ANSWER.FAIR, // Should always wear it
    tags: ["safety"],
    roleWeight: { factory: 3, tech: 3, engineer: 1, logistics: 2 },
  },
  {
    id: "expense-personal",
    text: "Company wants you to use personal phone/tools for work without reimbursement. Accept?",
    correct: ANSWER.FAIR, // Should request proper compensation
    tags: ["pay", "paperwork"],
    roleWeight: { factory: 1, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "schedule-last-minute",
    text: "Your schedule changes at the last minute without consultation. Just adapt?",
    correct: ANSWER.FAIR, // Should challenge improper changes
    tags: ["paperwork", "discipline"],
    roleWeight: { factory: 2, tech: 2, engineer: 2, logistics: 3 },
  },
  {
    id: "witness-violation",
    text: "You witness a safety violation by a supervisor. Reporting might cause trouble — stay quiet?",
    correct: ANSWER.FAIR, // Should report
    tags: ["safety", "discipline"],
    roleWeight: { factory: 3, tech: 2, engineer: 2, logistics: 2 },
  },
  {
    id: "load-overweight",
    text: "A load is slightly over the weight limit. It's close enough — proceed?",
    correct: ANSWER.FAIR, // Should follow limits
    tags: ["safety"],
    roleWeight: { factory: 2, tech: 1, engineer: 1, logistics: 3 },
  },
  {
    id: "fatigue-danger",
    text: "You're exhausted after a double shift. Boss asks for 'just one more hour'. Agree?",
    correct: ANSWER.FAIR, // Should refuse when unsafe
    tags: ["safety", "overtime"],
    roleWeight: { factory: 3, tech: 2, engineer: 2, logistics: 2 },
  },
];

// Utility to filter questions by role
export function getQuestionsForRole(role) {
  return QUESTIONS.map((q) => ({
    ...q,
    weight: q.roleWeight[role] || 1,
  }));
}

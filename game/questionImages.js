// Image mappings for each question
// Images should be placed in /public/images/

export const QUESTION_IMAGES = {
  "tariff-rights-know": "/images/q1.png",
  "azubi-pay-fairness": "/images/q2.png",
  //"time-off-trade": "/images/q3.png",
  "four-day-week-pressure": "/images/q4.png",
  "ai-performance-rating": "/images/q5.png",
  "ai-human-final-say": "/images/q6.png",
  "ai-data-transparency": "/images/q7.png",
  "ai-safety-risk-check": "/images/q8.png",
  "dismissal-deadline": "/images/q9.png",
  "warning-sign-fast": "/images/q10.png",
  "warnstreik-support": "/images/q11.png",
  "strike-pay-info": "/images/q12.png",
  "lockout-threat": "/images/q13.png",
  "heat-stress-breaks": "/images/q14.png",
  "near-miss-report": "/images/q15.png",
  "training-for-new-tech": "/images/q16.png",
  "upskilling-right": "/images/q17.png",
  "off-duty-accident": "/images/q18.png",
  "weekend-calls": "/images/q19.png",
  "flood-emergency-help": "/images/q20.png",
  "bereaved-support": "/images/q21.png",
  "emergency-real-fixed": "/images/q22.png",
  "argument-on-floor": "/images/q23.png",
  "report-anonymously": "/images/q24.png",
  "dont-sign-now": "/images/q25.png",
  "pause-when-angry": "/images/q26.png",
  "unsafe-task-stop": "/images/q27.png",
};

export const DEFAULT_IMAGE = "/images/q1.jpg";

export function getQuestionImage(questionId) {
  return QUESTION_IMAGES[questionId] || DEFAULT_IMAGE;
}

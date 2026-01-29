// Quiz game logic for FAIR SHIFT

import { QUESTIONS, ANSWER, getQuestionsForRole } from "./questions";

export { ANSWER };

export const DEFAULT_SESSION_SECONDS = 60;
export const QUESTION_TIME_LIMIT_MS = 3000; // 3 seconds per question
export const SPEED_BONUS_THRESHOLD_MS = 1000; // 1 second for speed bonus

// Scoring constants
export const SCORE_CORRECT = 100;
export const SCORE_WRONG = -50;
export const STREAK_BONUS_MULTIPLIER = 15;
export const SPEED_BONUS = 25;

// Module-level state for question selection
let questionBag = [];
let questionBagIndex = 0;
let lastQuestionId = null;
let lastAnswers = []; // Track last few correct answers for balance

// Utility functions
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

// Fisher-Yates shuffle
function shuffle(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Create a balanced bag of questions
function createQuestionBag(rng, role, bagSize = 30) {
  const questionsForRole = getQuestionsForRole(role);

  // Create weighted pool
  const weightedPool = [];
  questionsForRole.forEach((q) => {
    const count = Math.max(1, Math.round(q.weight));
    for (let i = 0; i < count; i++) {
      weightedPool.push(q);
    }
  });

  // Shuffle and take bagSize questions
  const shuffled = shuffle(weightedPool, rng);
  const bag = shuffled.slice(0, bagSize);

  // Ensure we have both FAIR and SHORTCUT answers
  const fairCount = bag.filter(q => q.correct === ANSWER.FAIR).length;
  const shortcutCount = bag.filter(q => q.correct === ANSWER.SHORTCUT).length;

  // If too imbalanced, adjust
  if (fairCount === 0 || shortcutCount === 0) {
    const fairQuestions = questionsForRole.filter(q => q.correct === ANSWER.FAIR);
    const shortcutQuestions = questionsForRole.filter(q => q.correct === ANSWER.SHORTCUT);

    if (fairCount === 0 && fairQuestions.length > 0) {
      const idx = Math.floor(rng() * bag.length);
      bag[idx] = fairQuestions[Math.floor(rng() * fairQuestions.length)];
    }
    if (shortcutCount === 0 && shortcutQuestions.length > 0) {
      const idx = Math.floor(rng() * bag.length);
      bag[idx] = shortcutQuestions[Math.floor(rng() * shortcutQuestions.length)];
    }
  }

  return shuffle(bag, rng);
}

// Reset question picker state
export function resetQuestionPicker() {
  questionBag = [];
  questionBagIndex = 0;
  lastQuestionId = null;
  lastAnswers = [];
}

// Pick next question with constraints
export function pickQuestion(rng, role) {
  // Refill bag if needed
  if (questionBagIndex >= questionBag.length - 2 || questionBag.length === 0) {
    questionBag = createQuestionBag(rng, role, 30);
    questionBagIndex = 0;
  }

  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    const candidate = questionBag[questionBagIndex];

    // Check constraints
    const sameQuestion = candidate.id === lastQuestionId;

    // Check answer balance: avoid too many of same answer in a row
    const recentAnswers = lastAnswers.slice(-3);
    const allSameAnswer = recentAnswers.length >= 3 &&
      recentAnswers.every(a => a === candidate.correct);

    if (!sameQuestion && !allSameAnswer) {
      // Valid question found
      lastQuestionId = candidate.id;
      lastAnswers.push(candidate.correct);
      if (lastAnswers.length > 5) lastAnswers.shift();

      questionBagIndex++;
      return candidate;
    }

    // Try swapping with next question in bag
    if (questionBagIndex + 1 < questionBag.length) {
      [questionBag[questionBagIndex], questionBag[questionBagIndex + 1]] =
        [questionBag[questionBagIndex + 1], questionBag[questionBagIndex]];
    } else {
      // At end of bag, just take it
      questionBagIndex++;
      lastQuestionId = candidate.id;
      lastAnswers.push(candidate.correct);
      if (lastAnswers.length > 5) lastAnswers.shift();
      return candidate;
    }

    attempts++;
  }

  // Fallback: return current question
  const fallback = questionBag[questionBagIndex] || questionBag[0];
  questionBagIndex++;
  lastQuestionId = fallback.id;
  lastAnswers.push(fallback.correct);
  if (lastAnswers.length > 5) lastAnswers.shift();
  return fallback;
}

// Resolve player's answer
export function resolveAnswer({ question, answer, streak, score, responseTimeMs }) {
  const correct = question.correct === answer;

  let scoreChange = 0;
  let nextStreak = streak;

  if (correct) {
    // Base score
    scoreChange += SCORE_CORRECT;

    // Streak bonus
    nextStreak = streak + 1;
    scoreChange += nextStreak * STREAK_BONUS_MULTIPLIER;

    // Speed bonus
    if (responseTimeMs <= SPEED_BONUS_THRESHOLD_MS) {
      scoreChange += SPEED_BONUS;
    }
  } else {
    // Wrong answer
    scoreChange += SCORE_WRONG;
    nextStreak = 0;
  }

  const nextScore = Math.max(0, score + scoreChange);

  return {
    correct,
    scoreChange,
    nextScore,
    nextStreak,
    speedBonus: correct && responseTimeMs <= SPEED_BONUS_THRESHOLD_MS,
  };
}

// Resolve timeout (no answer)
export function resolveTimeout({ streak, score }) {
  const scoreChange = SCORE_WRONG;
  const nextScore = Math.max(0, score + scoreChange);
  const nextStreak = 0;

  return {
    correct: false,
    scoreChange,
    nextScore,
    nextStreak,
    speedBonus: false,
  };
}

// Check if game should end
export function shouldEnd(secondsLeft) {
  return secondsLeft <= 0;
}

// Track stats for benefit unlocking
export function updateStats(stats, question, correct) {
  if (!stats.tagCounts) stats.tagCounts = {};
  if (!stats.correctByTag) stats.correctByTag = {};

  question.tags.forEach(tag => {
    stats.tagCounts[tag] = (stats.tagCounts[tag] || 0) + 1;
    if (correct) {
      stats.correctByTag[tag] = (stats.correctByTag[tag] || 0) + 1;
    }
  });

  return stats;
}

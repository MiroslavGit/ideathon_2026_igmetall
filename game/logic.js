// Quiz game logic for FAIR SHIFT

import { QUESTIONS, ANSWER, getQuestionsForRole } from "./questions";

export { ANSWER };

export const DEFAULT_SESSION_SECONDS = 60;
export const QUESTION_TIME_LIMIT_MS = 8000; // 8 seconds per question
export const SPEED_BONUS_THRESHOLD_MS = 1000; // 1 second for speed bonus

// Scoring constants
export const SCORE_CORRECT = 100;
export const SCORE_WRONG = -50;
export const STREAK_BONUS_MULTIPLIER = 15;
export const SPEED_BONUS = 25;

// Module-level state for question selection - no-repeat pool system
let questionPool = []; // Shuffled pool of question IDs
let currentRng = null;
let currentRole = null;

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

// Build weighted pool of question IDs (with role weights)
function buildQuestionPool(rng, role) {
  const questionsForRole = getQuestionsForRole(role);
  const pool = [];

  // Expand each question ID by its weight
  questionsForRole.forEach((q) => {
    const count = Math.max(1, Math.round(q.weight));
    for (let i = 0; i < count; i++) {
      pool.push(q.id);
    }
  });

  // Shuffle the pool
  return shuffle(pool, rng);
}

// Reset question picker state and build initial pool
export function resetQuestionPicker() {
  questionPool = [];
  currentRng = null;
  currentRole = null;
}

// Pick next question - no repeats until pool is exhausted
export function pickQuestion(rng, role) {
  // Store rng and role for refills
  if (!currentRng) currentRng = rng;
  if (!currentRole) currentRole = role;

  // If pool is empty, rebuild and reshuffle
  if (questionPool.length === 0) {
    questionPool = buildQuestionPool(rng, role);
  }

  // Pop the next question ID from the pool
  const questionId = questionPool.shift();

  // Find and return the full question object
  const questionsForRole = getQuestionsForRole(role);
  const question = questionsForRole.find(q => q.id === questionId);

  // Fallback to first question if not found
  return question || questionsForRole[0];
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

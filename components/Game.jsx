"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ANSWER,
  DEFAULT_SESSION_SECONDS,
  QUESTION_TIME_LIMIT_MS,
  SPEED_BONUS_THRESHOLD_MS,
  pickQuestion,
  resetQuestionPicker,
  resolveAnswer,
  resolveTimeout,
  shouldEnd,
  updateStats,
} from "../game/logic";
import { BENEFITS, evaluateUnlocks } from "../game/benefits";

function vibrate(ms) {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms);
  } catch {
    // ignore
  }
}

export default function Game({
  seed,
  sessionSeconds = DEFAULT_SESSION_SECONDS,
  character,
  onFinish,
}) {
  const rng = useMemo(() => {
    const { mulberry32 } = require("../game/logic");
    return mulberry32(seed);
  }, [seed]);

  const startedAtRef = useRef(0);
  const finishedRef = useRef(false);
  const questionStartRef = useRef(0);

  const [secondsLeft, setSecondsLeft] = useState(sessionSeconds);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Track wrong streak for recovery detection
  const [wrongStreak, setWrongStreak] = useState(0);
  const [recoveredFromDip, setRecoveredFromDip] = useState(false);

  // Stats for benefit unlocking
  const [stats, setStats] = useState({ tagCounts: {}, correctByTag: {} });

  const [question, setQuestion] = useState(() => {
    resetQuestionPicker();
    return pickQuestion(rng, character?.role);
  });
  const [questionKey, setQuestionKey] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [questionProgress, setQuestionProgress] = useState(0);
  const [waitingForNext, setWaitingForNext] = useState(false);

  const [benefitsUnlocked, setBenefitsUnlocked] = useState({});
  const [benefitPopup, setBenefitPopup] = useState(null);

  const finishRef = useRef(onFinish);
  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  // Initialize game timer once
  useEffect(() => {
    startedAtRef.current = performance.now();
    questionStartRef.current = startedAtRef.current;
  }, []);

  // Timer tick loop
  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      const elapsedSec = (now - startedAtRef.current) / 1000;
      const left = Math.max(0, sessionSeconds - elapsedSec);
      setSecondsLeft(left);

      if (waitingForNext) return;

      const questionElapsed = now - questionStartRef.current;
      const prog = Math.min(1, questionElapsed / QUESTION_TIME_LIMIT_MS);
      setQuestionProgress(prog);

      if (prog >= 1) {
        handleTimeout();
      }
    };

    const id = window.setInterval(tick, 50);
    return () => window.clearInterval(id);
  }, [waitingForNext, sessionSeconds]);

  const handleTimeout = () => {
    if (waitingForNext) return;

    const res = resolveTimeout({ streak, score });
    setScore(res.nextScore);
    setStreak(0);
    setAnswered((n) => n + 1);
    setWrongCount((n) => n + 1);
    setWrongStreak((n) => n + 1);

    // Update stats for benefit tracking
    setStats((prev) => updateStats(prev, question, false));

    setFeedback({ kind: "bad", text: "Time out!" });
    vibrate(30);
    advanceToNext();
  };

  const advanceToNext = () => {
    setWaitingForNext(true);
    setQuestionProgress(0);
    setTimeout(() => {
      setQuestion(pickQuestion(rng, character?.role));
      setQuestionKey((k) => k + 1);
      questionStartRef.current = performance.now();
      setWaitingForNext(false);
      setFeedback(null);
    }, 1200);
  };

  // Check unlock milestones
  useEffect(() => {
    const runState = {
      stats,
      maxStreak,
      streak,
      wrongStreak,
      correctCount,
      wrongCount,
      secondsLeft,
      recoveredFromDip,
    };
    const unlocks = evaluateUnlocks(runState);
    Object.keys(unlocks).forEach((k) => {
      if (unlocks[k] && !benefitsUnlocked[k]) {
        setBenefitsUnlocked((prev) => ({ ...prev, [k]: true }));
        const ben = BENEFITS.find((b) => b.id === k);
        // Don't show flashy toast for death benefit (respectful)
        if (ben && k !== 'death') {
          setBenefitPopup({ icon: ben.icon, hook: ben.micro });
          setTimeout(() => setBenefitPopup(null), 1000);
        }
      }
    });
  }, [stats, maxStreak, streak, wrongStreak, correctCount, wrongCount, secondsLeft, recoveredFromDip, benefitsUnlocked]);

  // Track recovery from wrong streak
  useEffect(() => {
    if (wrongStreak >= 2 && streak >= 3) {
      setRecoveredFromDip(true);
    }
  }, [wrongStreak, streak]);

  // End condition check
  useEffect(() => {
    if (finishedRef.current) return;
    if (shouldEnd(secondsLeft)) {
      finishedRef.current = true;
      finishRef.current({
        score,
        answered,
        correctCount,
        wrongCount,
        maxStreak,
        benefitsUnlocked,
        character,
      });
    }
  }, [secondsLeft, score, answered, correctCount, wrongCount, maxStreak, benefitsUnlocked, character]);

  // commitAnswer - handles FAIR/SHORTCUT actions
  const commitAnswer = (answer) => {
    if (waitingForNext) return;

    const now = performance.now();
    const responseTimeMs = now - questionStartRef.current;

    const res = resolveAnswer({ question, answer, streak, score, responseTimeMs });

    setScore(res.nextScore);
    setStreak(res.nextStreak);
    setMaxStreak((m) => Math.max(m, res.nextStreak));
    setAnswered((n) => n + 1);

    if (res.correct) {
      setCorrectCount((n) => n + 1);
      setWrongStreak(0);
      vibrate(14);

      // Show feedback on streak milestones or speed bonus
      const showMilestone = res.nextStreak >= 3 && (res.nextStreak === 3 || res.nextStreak === 5 || res.nextStreak === 8);
      const feedbackText = showMilestone
        ? `Nice! x${res.nextStreak}`
        : res.speedBonus
          ? `⚡ +${res.scoreChange}`
          : null;

      if (feedbackText) {
        setFeedback({ kind: "good", text: feedbackText });
      } else {
        setFeedback({ kind: "good", text: "✓" });
      }
    } else {
      setWrongCount((n) => n + 1);
      setWrongStreak((n) => n + 1);
      vibrate(28);
      setFeedback({ kind: "bad", text: "Oops" });
    }

    // Update stats for benefit tracking
    setStats((prev) => updateStats(prev, question, res.correct));

    advanceToNext();
  };

  const isFactoryRole = character?.role === "factory" || character?.role === "technician";
  const isOfficeRole = character?.role === "engineer" || character?.role === "logistics";

  const envTheme = useMemo(() => {
    if (character?.role === "engineer")
      return { base: "rgba(30,58,138,0.5)", accent: "rgba(56,189,248,0.2)", secondary: "rgba(147,197,253,0.15)" };
    if (character?.role === "logistics")
      return { base: "rgba(120,53,15,0.5)", accent: "rgba(251,191,36,0.25)", secondary: "rgba(252,211,77,0.15)" };
    return { base: "rgba(20,83,45,0.55)", accent: "rgba(163,230,53,0.22)", secondary: "rgba(132,204,22,0.16)" };
  }, [character?.role]);

  return (
    <div className="relative min-h-svh overflow-hidden bg-zinc-950 text-white">
      {/* Factory/Technician: Conveyor belt environment */}
      {isFactoryRole && (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 20px, transparent 20px, transparent 40px)",
              backgroundColor: envTheme.base,
              animation: "fairshift-conveyor-move 8s linear infinite",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at 0% 50%, rgba(255,255,255,0.08) 0px, transparent 12px, transparent 30px)",
              animation: "fairshift-roller-spin 3s linear infinite",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle 8px at 20% 30%, rgba(255,255,255,0.15), transparent)," +
                "radial-gradient(circle 6px at 70% 60%, rgba(255,255,255,0.12), transparent)," +
                "radial-gradient(circle 10px at 45% 80%, rgba(255,255,255,0.1), transparent)",
              animation: "fairshift-parts-drift 12s linear infinite",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${envTheme.accent} 50%, transparent 100%)`,
              animation: "fairshift-sheen-sweep 5s ease-in-out infinite",
            }}
          />
        </>
      )}

      {/* Engineer/Logistics: Office desk environment */}
      {isOfficeRole && (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 30px)," +
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 30px)",
              backgroundColor: envTheme.base,
              animation: "fairshift-desk-scroll 10s linear infinite",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 8px, transparent 8px, transparent 60px)," +
                "linear-gradient(180deg, transparent 0px, transparent 30px, rgba(255,255,255,0.06) 30px, rgba(255,255,255,0.06) 42px, transparent 42px)",
              backgroundSize: "100% 100px",
              animation: "fairshift-papers-drift 6s linear infinite",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse 500px 300px at 50% 20%, ${envTheme.accent}, transparent 70%)`,
              animation: "fairshift-ambient-pulse 8s ease-in-out infinite",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${envTheme.secondary} 50%, transparent 100%)`,
              animation: "fairshift-light-sweep-slow 7s ease-in-out infinite",
            }}
          />
        </>
      )}

      {/* Dark overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      <div className="relative mx-auto w-full max-w-xl px-4 pb-6 pt-[calc(env(safe-area-inset-top)+10px)]">
        {/* Compact HUD */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold tabular-nums">{Math.ceil(secondsLeft)}s</div>
            <div className="text-[10px] text-white/60">Time left</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-extrabold tabular-nums">{score}</div>
            <div className="text-[10px] text-white/60">
              Streak: <span className="font-semibold">{streak}</span> • Answered: {answered}
            </div>
          </div>
        </div>

        {/* Benefits row */}
        <div className="mt-3 flex items-center gap-1.5">
          {BENEFITS.map((b) => {
            const unlocked = benefitsUnlocked[b.id];
            return (
              <div
                key={b.id}
                className={
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs ring-1 " +
                  (unlocked
                    ? "bg-lime-400/20 ring-lime-400/40 shadow-lg"
                    : "bg-white/5 ring-white/10")
                }
                title={b.title}
              >
                <span className={unlocked ? "opacity-100" : "opacity-30"}>{b.icon}</span>
              </div>
            );
          })}
        </div>

        {/* Benefit popup */}
        {benefitPopup && (
          <div className="mt-2 animate-pulse rounded-xl bg-lime-400/15 px-3 py-2 text-xs font-semibold text-lime-200 ring-1 ring-lime-300/25">
            {benefitPopup.icon} {benefitPopup.hook}
          </div>
        )}

        {/* Question Card */}
        {!waitingForNext && (
          <div
            key={questionKey}
            className="mt-5 rounded-2xl bg-zinc-900/80 p-5 shadow-2xl ring-1 ring-white/20 backdrop-blur-md"
            style={{ animation: "fairshift-card-in 0.3s ease-out" }}
          >
            <div className="text-base font-semibold leading-relaxed">
              {question.text}
            </div>
            {question.context && (
              <div className="mt-2 text-xs text-white/60">{question.context}</div>
            )}

            {/* Question timer bar */}
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-lime-400 via-amber-400 to-rose-500 transition-all"
                style={{ width: `${(1 - questionProgress) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Feedback overlay */}
        {feedback && (
          <div
            className={
              "mt-4 rounded-2xl px-5 py-3 text-center text-lg font-extrabold shadow-2xl ring-1 " +
              (feedback.kind === "good"
                ? "bg-lime-400/20 text-lime-200 ring-lime-300/30"
                : "bg-rose-500/20 text-rose-200 ring-rose-300/30")
            }
            style={{ animation: feedback.kind === "bad" ? "fairshift-shake 0.4s" : "fairshift-sparkle 0.5s" }}
          >
            {feedback.text}
          </div>
        )}

        {/* Answer buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-lime-500 to-lime-600 px-6 py-6 font-extrabold text-white shadow-2xl shadow-lime-500/40 ring-2 ring-lime-400/30 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            onClick={() => commitAnswer(ANSWER.FAIR)}
            disabled={waitingForNext}
          >
            <div className="relative z-10 flex flex-col items-center justify-center gap-2">
              <span className="text-2xl">✅</span>
              <span className="text-sm">FAIR</span>
            </div>
            <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </button>

          <button
            className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-rose-500 to-rose-600 px-6 py-6 font-extrabold text-white shadow-2xl shadow-rose-500/40 ring-2 ring-rose-400/30 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            onClick={() => commitAnswer(ANSWER.SHORTCUT)}
            disabled={waitingForNext}
          >
            <div className="relative z-10 flex flex-col items-center justify-center gap-2">
              <span className="text-2xl">❌</span>
              <span className="text-sm">SHORTCUT</span>
            </div>
            <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
}

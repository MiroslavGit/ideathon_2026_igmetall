"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSwipe } from "../hooks/useSwipe";
import {
  ACTION,
  DEFAULT_SESSION_SECONDS,
  decisionWindowMsAt,
  pickTaskBalanced,
  resetTaskPicker,
  resolveDecision,
  resolveNoDecision,
  shouldEnd,
} from "../game/logic";
import { BENEFITS, evaluateUnlocks } from "../game/benefits";

function SlimMeter({ label, value, color }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] text-white/70">
        <span>{label}</span>
        <span className="tabular-nums">{pct}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={"h-full rounded-full " + color}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

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
  const decisionStartRef = useRef(0);

  const [secondsLeft, setSecondsLeft] = useState(sessionSeconds);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [leftCount, setLeftCount] = useState(0);
  const [correctStopCount, setCorrectStopCount] = useState(0);
  const [legalTaskHandled, setLegalTaskHandled] = useState(false);
  const [meters, setMeters] = useState({
    performance: 60,
    quality: 60,
    safety: 60,
    energy: 60,
  });
  const [hadDip, setHadDip] = useState(false);
  const [recoveredFromDip, setRecoveredFromDip] = useState(false);

  const [task, setTask] = useState(() => {
    resetTaskPicker(); // Reset state for new game
    return pickTaskBalanced(rng, 0, character?.role, 0);
  });
  const [taskKey, setTaskKey] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [decisionProgress, setDecisionProgress] = useState(0);
  const [avatarLane, setAvatarLane] = useState(1); // 0=left, 1=center, 2=right
  const [gateFlash, setGateFlash] = useState(null);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [consecutiveHazards, setConsecutiveHazards] = useState(0);

  const [benefitsUnlocked, setBenefitsUnlocked] = useState({});
  const [benefitPopup, setBenefitPopup] = useState(null);

  // Dev tracking for action distribution (set to false for production)
  const DEV_TRACK_ACTIONS = false;
  const actionCounts = useRef({ LEFT: 0, RIGHT: 0, STOP: 0 });

  const finishRef = useRef(onFinish);
  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  const progress01 = useMemo(() => {
    const elapsed = Math.max(0, sessionSeconds - secondsLeft);
    return Math.max(0, Math.min(1, elapsed / sessionSeconds));
  }, [secondsLeft, sessionSeconds]);

  const decisionWindowMs = useMemo(
    () => decisionWindowMsAt(progress01),
    [progress01]
  );

  // Check unlock milestones
  useEffect(() => {
    const runState = {
      meters,
      leftCount,
      maxStreak,
      correctStopCount,
      hadDip,
      recoveredFromDip,
      secondsLeft,
      sessionSeconds,
      legalTaskHandled,
    };
    const unlocks = evaluateUnlocks(runState);
    Object.keys(unlocks).forEach((k) => {
      if (unlocks[k] && !benefitsUnlocked[k]) {
        setBenefitsUnlocked((prev) => ({ ...prev, [k]: true }));
        const ben = BENEFITS.find((b) => b.id === k);
        if (ben) {
          setBenefitPopup({ icon: ben.icon, hook: ben.hook });
          setTimeout(() => setBenefitPopup(null), 2500);
        }
      }
    });
  }, [meters, leftCount, maxStreak, correctStopCount, hadDip, recoveredFromDip, secondsLeft, sessionSeconds, legalTaskHandled, benefitsUnlocked]);

  // Track dips
  useEffect(() => {
    if (meters.safety < 30 || meters.energy < 30) setHadDip(true);
    if (hadDip && meters.safety >= 40 && meters.energy >= 40) setRecoveredFromDip(true);
  }, [meters, hadDip]);

  // Main clock - Initialize game timer once
  useEffect(() => {
    startedAtRef.current = performance.now();
    decisionStartRef.current = startedAtRef.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Timer tick loop
  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      const elapsedSec = (now - startedAtRef.current) / 1000;
      const left = Math.max(0, sessionSeconds - elapsedSec);
      setSecondsLeft(left);

      if (waitingForNext) return;

      const decisionElapsed = now - decisionStartRef.current;
      const prog = Math.min(1, decisionElapsed / decisionWindowMs);
      setDecisionProgress(prog);

      if (prog >= 1) {
        handleTimeout();
      }
    };

    const id = window.setInterval(tick, 50);
    return () => window.clearInterval(id);
  }, [waitingForNext, decisionWindowMs, sessionSeconds]); // Keep reactive deps but don't reset startedAtRef

  const handleTimeout = () => {
    if (waitingForNext) return;
    const res = resolveNoDecision({ meters, streak, score });
    setMeters(res.nextMeters);
    setScore(res.nextScore);
    setStreak(0);
    setProcessed((n) => n + 1);
    setFeedback({ kind: "bad", text: "Time out!" });
    vibrate(30);
    advanceToNext();
  };

  const advanceToNext = () => {
    setWaitingForNext(true);
    setDecisionProgress(0);
    setTimeout(() => {
      const isCurrentHazard = task.correct === ACTION.STOP;
      const nextHazardCount = isCurrentHazard ? consecutiveHazards + 1 : 0;
      setConsecutiveHazards(nextHazardCount);

      setTask(pickTaskBalanced(rng, progress01, character?.role, nextHazardCount));
      setTaskKey((k) => k + 1);
      decisionStartRef.current = performance.now();
      setAvatarLane(1);
      setWaitingForNext(false);
      setFeedback(null);
    }, 1200);
  };

  // End condition check
  useEffect(() => {
    if (finishedRef.current) return;
    if (shouldEnd(meters, secondsLeft)) {
      finishedRef.current = true;

      // Dev-only: log action distribution
      if (DEV_TRACK_ACTIONS) {
        const total = actionCounts.current.LEFT + actionCounts.current.RIGHT + actionCounts.current.STOP;
        console.log('[Action Distribution]', {
          LEFT: `${actionCounts.current.LEFT} (${((actionCounts.current.LEFT / total) * 100).toFixed(1)}%)`,
          RIGHT: `${actionCounts.current.RIGHT} (${((actionCounts.current.RIGHT / total) * 100).toFixed(1)}%)`,
          STOP: `${actionCounts.current.STOP} (${((actionCounts.current.STOP / total) * 100).toFixed(1)}%)`,
          total
        });
      }

      finishRef.current({
        score,
        processed,
        maxStreak,
        meters,
        benefitsUnlocked,
        character,
      });
    }
  }, [meters, secondsLeft, score, processed, maxStreak, benefitsUnlocked, character, DEV_TRACK_ACTIONS]);

  // commitDecision - handles all LEFT/RIGHT/STOP actions

  const commitDecision = (action) => {
    if (waitingForNext) return;

    // DEBUG: Log action and task to verify routing
    console.log('[Game] Action:', action, 'Task correct:', task.correct, 'Match:', action === task.correct);

    // Dev-only: track action distribution
    if (DEV_TRACK_ACTIONS) {
      if (action === 'LEFT') actionCounts.current.LEFT++;
      else if (action === 'RIGHT') actionCounts.current.RIGHT++;
      else if (action === 'STOP') actionCounts.current.STOP++;
    }

    const res = resolveDecision({ task, action, meters, streak, score });

    setMeters(res.nextMeters);
    setScore(res.nextScore);
    setStreak(res.nextStreak);
    setMaxStreak((m) => Math.max(m, res.nextStreak));
    setProcessed((n) => n + 1);

    if (action === ACTION.LEFT) setLeftCount((c) => c + 1);
    if (res.isCorrect && action === ACTION.STOP) setCorrectStopCount((c) => c + 1);

    // Track legal tasks (payslip, warning, illness paperwork)
    if (res.isCorrect && action === ACTION.LEFT) {
      const legalTaskIds = ["payslip-confusion", "written-warning-threat", "illness-paperwork"];
      if (legalTaskIds.includes(task.id)) {
        setLegalTaskHandled(true);
      }
    }

    const lane = action === ACTION.LEFT ? 0 : action === ACTION.RIGHT ? 2 : 1;
    setAvatarLane(lane);
    setGateFlash(lane);
    setTimeout(() => setGateFlash(null), 320);

    if (res.isCorrect) {
      vibrate(14);
      const streakMilestone = res.nextStreak % 5 === 0 && res.nextStreak > 0;
      setFeedback({
        kind: "good",
        text: streakMilestone ? `Perfect! x${res.nextStreak}` : `+${res.pointsGained}`,
      });
    } else {
      vibrate(28);
      setFeedback({ kind: "bad", text: "Wrong!" });
    }

    if (res.isCorrect && action === ACTION.STOP) {
      startedAtRef.current -= 1000;
    }

    advanceToNext();
  };

  const bind = useSwipe({
    onSwipeLeft: () => commitDecision(ACTION.LEFT),
    onSwipeRight: () => commitDecision(ACTION.RIGHT),
  });

  const envColor =
    character?.role === "engineer"
      ? "rgba(56,189,248,0.15)"
      : character?.role === "logistics"
        ? "rgba(251,191,36,0.15)"
        : "rgba(163,230,53,0.15)";

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
          {/* Conveyor belt segments */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 20px, transparent 20px, transparent 40px)",
              backgroundColor: envTheme.base,
              animation: "fairshift-conveyor-move 8s linear infinite",
            }}
          />
          {/* Roller effect */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at 0% 50%, rgba(255,255,255,0.08) 0px, transparent 12px, transparent 30px)",
              animation: "fairshift-roller-spin 3s linear infinite",
            }}
          />
          {/* Moving parts silhouettes */}
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
          {/* Metallic sheen */}
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
          {/* Desk grid (slower layer) */}
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
          {/* Document/box silhouettes (faster layer) */}
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
          {/* Soft ambient light */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse 500px 300px at 50% 20%, ${envTheme.accent}, transparent 70%)`,
              animation: "fairshift-ambient-pulse 8s ease-in-out infinite",
            }}
          />
          {/* Light sweep */}
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
              Streak: <span className="font-semibold">{streak}</span>
            </div>
          </div>
        </div>

        {/* Slim neon meters */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          <SlimMeter label="Perf" value={meters.performance} color="bg-sky-400" />
          <SlimMeter label="Qual" value={meters.quality} color="bg-violet-400" />
          <SlimMeter label="Safe" value={meters.safety} color="bg-lime-400" />
          <SlimMeter label="Enrg" value={meters.energy} color="bg-amber-300" />
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

        {/* Gate Run Track (3D perspective) */}
        <div className="mt-5" style={{ perspective: "900px" }}>
          <div
            className="relative h-80 overflow-hidden rounded-3xl bg-linear-to-b from-white/5 to-black/40 shadow-2xl ring-1 ring-white/10"
            style={{ transformStyle: "preserve-3d", touchAction: "none" }}
            {...bind}
          >
            {/* Track plane */}
            <div
              className="absolute inset-0"
              style={{
                transform: "rotateX(60deg) translateZ(-40px)",
                transformStyle: "preserve-3d",
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 30px)",
              }}
            />

            {/* Task sign above gates */}
            {!waitingForNext && (
              <div
                key={taskKey}
                className="absolute left-1/2 top-8 w-[85%] -translate-x-1/2 transform rounded-2xl bg-zinc-950/80 p-4 shadow-2xl ring-1 ring-white/20 backdrop-blur-md"
                style={{ animation: "fairshift-card-in 0.3s ease-out" }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{task.icon}</div>
                  <div className="min-w-0">
                    <div className="text-base font-extrabold tracking-tight">
                      {task.title}
                      {task.correct === ACTION.STOP && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                          HAZARD
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm leading-5 text-white/70">
                      {task.description}
                    </div>
                    {task.impact && (
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="text-lime-400">↑ {task.impact.pro}</span>
                        <span className="text-rose-400">↓ {task.impact.con}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decision timer */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-lime-400 transition-all"
                    style={{ width: `${decisionProgress * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* DECORATIVE gate markers (NOT buttons - actual controls are below the game area) */}
            <div
              className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 px-6 pointer-events-none"
              style={{ transform: "translateZ(0)" }}
            >
              {[0, 1, 2].map((idx) => {
                const isFlash = gateFlash === idx;
                const isCorrect = feedback?.kind === "good" && isFlash;
                return (
                  <div
                    key={idx}
                    className={
                      "relative h-16 w-20 rounded-xl shadow-xl ring-1 transition-all " +
                      (isFlash && isCorrect
                        ? "scale-105 bg-lime-400/30 ring-lime-400 shadow-lime-400/50"
                        : isFlash
                          ? "scale-105 bg-rose-500/30 ring-rose-500 shadow-rose-500/50"
                          : "bg-white/5 ring-white/10")
                    }
                    style={{
                      background: isFlash
                        ? undefined
                        : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
                    }}
                  >
                    {/* Lane indicator only, no text */}
                  </div>
                );
              })}
            </div>

            {/* Avatar capsule */}
            <div
              className="absolute bottom-6 left-1/2 h-10 w-10 -translate-x-1/2 transform rounded-full shadow-2xl ring-2 ring-white/30 transition-transform duration-300"
              style={{
                transform: `translate(-50%, 0) translateX(${(avatarLane - 1) * 92}px)`,
                background: `radial-gradient(circle at 30% 30%, ${character?.color || "#a3e635"}, rgba(0,0,0,0.5))`,
              }}
            >
              <div className="flex h-full w-full items-center justify-center text-sm">
                {character?.accessory === "helmet"
                  ? "⛑️"
                  : character?.accessory === "wrench"
                    ? "🔧"
                    : character?.accessory === "clipboard"
                      ? "📋"
                      : "📦"}
              </div>
            </div>

            {/* Feedback overlay */}
            {feedback && (
              <div
                className={
                  "absolute inset-x-4 top-1/2 -translate-y-1/2 transform rounded-2xl px-5 py-3 text-center text-lg font-extrabold shadow-2xl ring-1 " +
                  (feedback.kind === "good"
                    ? "bg-lime-400/20 text-lime-200 ring-lime-300/30"
                    : "bg-rose-500/20 text-rose-200 ring-rose-300/30")
                }
                style={{ animation: feedback.kind === "bad" ? "fairshift-shake 0.4s" : "fairshift-sparkle 0.5s" }}
              >
                {feedback.text}
              </div>
            )}
          </div>
        </div>

        {/* ACTUAL INTERACTIVE CONTROLS - These are the only clickable buttons */}
        {/* The gate markers above are purely decorative for visual feedback */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold active:translate-y-px disabled:opacity-50"
            onClick={() => commitDecision(ACTION.LEFT)}
            disabled={waitingForNext}
          >
            ← LEFT
          </button>
          <button
            className="relative rounded-xl bg-linear-to-b from-rose-500 to-rose-600 font-extrabold text-white shadow-2xl shadow-rose-500/40 ring-2 ring-rose-400/30 active:scale-95 disabled:opacity-50"
            onClick={() => commitDecision(ACTION.STOP)}
            disabled={waitingForNext}
          >
            <div className="flex flex-col items-center justify-center py-3">
              <span className="text-lg">🛑</span>
              <span className="text-xs">STOP</span>
            </div>
          </button>
          <button
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold active:translate-y-px disabled:opacity-50"
            onClick={() => commitDecision(ACTION.RIGHT)}
            disabled={waitingForNext}
          >
            RIGHT →
          </button>
        </div>
      </div>
    </div>
  );
}

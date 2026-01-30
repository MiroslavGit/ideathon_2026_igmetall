"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ANSWER,
  DEFAULT_SESSION_SECONDS,
  SPEED_BONUS_THRESHOLD_MS,
  pickQuestion,
  resetQuestionPicker,
  resolveAnswer,
  shouldEnd,
} from "../game/logic";
import { BENEFITS } from "../game/benefits";
import { useI18n } from "../i18n/I18nProvider";
import LanguageToggle from "./LanguageToggle";
import { getQuestionImage } from "../game/questionImages";

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
  const { t } = useI18n();

  const rng = useMemo(() => {
    const { mulberry32 } = require("../game/logic");
    return mulberry32(seed);
  }, [seed]);

  const startedAtRef = useRef(0);
  const finishedRef = useRef(false);
  const questionStartRef = useRef(0);
  const posAudioRef = useRef(null);
  const negAudioRef = useRef(null);
  const audioReadyRef = useRef(false);

  const [secondsLeft, setSecondsLeft] = useState(sessionSeconds);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Track wrong streak for recovery detection
  const [wrongStreak, setWrongStreak] = useState(0);

  const [unlockedCount, setUnlockedCount] = useState(0); // Track number of benefits unlocked

  const [question, setQuestion] = useState(() => {
    resetQuestionPicker();
    return pickQuestion(rng, character?.role);
  });
  const [questionKey, setQuestionKey] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [waitingForNext, setWaitingForNext] = useState(false);

  const [benefitsUnlocked, setBenefitsUnlocked] = useState({});
  const [benefitPopup, setBenefitPopup] = useState(null);

  // Swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragCurrent, setDragCurrent] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [showPreSwipeHelper, setShowPreSwipeHelper] = useState(true);
  const cardRef = useRef(null);

  const finishRef = useRef(onFinish);
  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  // Initialize game timer once
  useEffect(() => {
    startedAtRef.current = performance.now();
    questionStartRef.current = startedAtRef.current;
  }, []);

  // DEV-only: Verify audio files exist
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      fetch("/sounds/positive.wav", { method: "HEAD" })
        .then(res => { if (!res.ok) console.warn("Missing /sounds/positive.wav"); })
        .catch(() => console.warn("Failed to verify /sounds/positive.wav"));
      fetch("/sounds/negative.wav", { method: "HEAD" })
        .then(res => { if (!res.ok) console.warn("Missing /sounds/negative.wav"); })
        .catch(() => console.warn("Failed to verify /sounds/negative.wav"));
    }
  }, []);

  // Timer tick loop
  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      const elapsedSec = (now - startedAtRef.current) / 1000;
      const left = Math.max(0, sessionSeconds - elapsedSec);
      setSecondsLeft(left);
    };

    const id = window.setInterval(tick, 50);
    return () => window.clearInterval(id);
  }, [sessionSeconds]);

  const advanceToNext = () => {
    setWaitingForNext(true);
    setTimeout(() => {
      setQuestion(pickQuestion(rng, character?.role));
      setQuestionKey((k) => k + 1);
      questionStartRef.current = performance.now();
      setWaitingForNext(false);
      setFeedback(null);
    }, 1200);
  };

  // Simple benefit unlock: 1 benefit per 2 correct answers
  useEffect(() => {
    const nextUnlockedCount = Math.min(BENEFITS.length, Math.floor(correctCount / 2));
    if (nextUnlockedCount > unlockedCount) {
      // Unlock exactly one new benefit (the next one in order)
      const benefit = BENEFITS[unlockedCount];
      setBenefitsUnlocked((prev) => ({ ...prev, [benefit.id]: true }));
      setUnlockedCount(nextUnlockedCount);

      // Don't show flashy toast for death benefit (respectful)
      if (benefit.id !== 'death') {
        setBenefitPopup({ icon: benefit.icon, hook: benefit.micro });
        setTimeout(() => setBenefitPopup(null), 1000);
      }
    }
  }, [correctCount, unlockedCount]);

  // End condition check
  useEffect(() => {
    if (finishedRef.current) return;
    if (shouldEnd(secondsLeft)) {
      finishedRef.current = true;
      finishRef.current({
        answered,
        correctCount,
        wrongCount,
        maxStreak,
        benefitsUnlocked,
        character,
      });
    }
  }, [secondsLeft, answered, correctCount, wrongCount, maxStreak, benefitsUnlocked, character]);

  // Initialize audio on first user gesture (mobile autoplay requirement)
  const initAudio = async () => {
    if (audioReadyRef.current) return;
    try {
      posAudioRef.current = new Audio("/sounds/positive.wav");
      negAudioRef.current = new Audio("/sounds/negative.wav");
      posAudioRef.current.volume = 0.6;
      negAudioRef.current.volume = 0.6;
      posAudioRef.current.preload = "auto";
      negAudioRef.current.preload = "auto";
      // Unlock audio on mobile by playing muted
      for (const audio of [posAudioRef.current, negAudioRef.current]) {
        audio.muted = true;
        await audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        }).catch(err => {
          if (process.env.NODE_ENV === 'development') {
            console.warn("Audio blocked:", err);
          }
        });
      }
      audioReadyRef.current = true;
    } catch { }
  };

  // Helper to play sound
  const playSound = (ref) => {
    const a = ref?.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      a.play().catch(() => { });
    } catch { }
  };

  // Swipe handlers
  const handlePointerDown = (e) => {
    if (waitingForNext || isAnimatingOut) return;
    initAudio(); // Initialize audio on first interaction
    setShowSwipeHint(false); // Cancel hint once user interacts
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragCurrent(e.clientX);
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setDragCurrent(e.clientX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaX = dragCurrent - dragStart;
    const threshold = 90;

    if (Math.abs(deltaX) > threshold) {
      // Swipe detected - compute answer and play sound immediately (in gesture context)
      const answer = deltaX < 0 ? ANSWER.SHORTCUT : ANSWER.FAIR;
      const isCorrect = question.correct === answer;

      // Play sound immediately while still in user gesture
      initAudio();
      playSound(isCorrect ? posAudioRef : negAudioRef);

      setIsAnimatingOut(true);

      if (cardRef.current) {
        const finalX = deltaX < 0 ? -400 : 400;
        cardRef.current.style.transition = 'transform 0.3s ease-out';
        cardRef.current.style.transform = `translateX(${finalX}px) rotate(${finalX * 0.1}deg)`;
      }

      setTimeout(() => {
        commitAnswer(answer);
        setIsAnimatingOut(false);
        setDragStart(0);
        setDragCurrent(0);
      }, 300);
    } else {
      // Spring back
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
      }
      setDragStart(0);
      setDragCurrent(0);
    }
  };

  // Reset card position when new question appears
  useEffect(() => {
    if (!waitingForNext && cardRef.current) {
      cardRef.current.style.transition = 'none';
      cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
    }
  }, [questionKey, waitingForNext]);

  // commitAnswer - handles FAIR/SHORTCUT actions
  const commitAnswer = (answer) => {
    if (waitingForNext) return;

    setShowPreSwipeHelper(false); // Hide helper after first answer

    const now = performance.now();
    const responseTimeMs = now - questionStartRef.current;

    const res = resolveAnswer({ question, answer, streak, score: 0, responseTimeMs });

    setStreak(res.nextStreak);
    setMaxStreak((m) => Math.max(m, res.nextStreak));
    setAnswered((n) => n + 1);

    if (res.correct) {
      setCorrectCount((n) => {
        const newCount = n + 1;
        // Trigger unlock check via state update
        return newCount;
      });
      setWrongStreak(0);
      vibrate(14);

      // Show feedback on streak milestones
      const showMilestone = res.nextStreak >= 3 && (res.nextStreak === 3 || res.nextStreak === 5 || res.nextStreak === 8);
      const feedbackText = showMilestone ? `Nice! x${res.nextStreak}` : null;

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
        {/* Language toggle */}
        <div className="mb-2 flex justify-end">
          <LanguageToggle />
        </div>

        {/* Compact HUD */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold tabular-nums">{Math.ceil(secondsLeft)}s</div>
            <div className="text-[10px] text-white/60">{t("game.timeLeft")}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/60">
              {t("game.streak")}: <span className="font-semibold">{streak}</span> • {t("game.answered")}: {answered}
            </div>
          </div>
        </div>

        {/* Benefits row with label */}
        <div className="mt-4">
          <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white/50">{t("game.protections")}</div>
          <div className="flex items-center justify-center gap-2">
            {BENEFITS.map((b) => {
              const unlocked = benefitsUnlocked[b.id];
              const justUnlocked = benefitPopup?.icon === b.icon;
              return (
                <div
                  key={b.id}
                  className={
                    "flex h-9 w-9 items-center justify-center rounded-full text-base ring-1 transition-all duration-300 " +
                    (unlocked
                      ? "bg-lime-400/15 ring-lime-400/30 shadow-lg shadow-lime-400/20"
                      : "bg-white/5 ring-white/10 opacity-40")
                  }
                  style={{
                    animation: justUnlocked ? "fairshift-benefit-pulse 0.6s ease-out" : undefined,
                  }}
                  title={b.title}
                >
                  <span className={unlocked ? "opacity-100" : "opacity-60"}>{b.icon}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons - always visible */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            className="flex items-center gap-1.5 rounded-full bg-rose-500/20 px-2.5 py-1 ring-1 ring-rose-500/30 transition-all active:scale-95 active:bg-rose-500/30 disabled:opacity-50 cursor-pointer"
            onClick={() => {
              const isCorrect = question.correct === ANSWER.SHORTCUT;
              initAudio();
              playSound(isCorrect ? posAudioRef : negAudioRef);
              commitAnswer(ANSWER.SHORTCUT);
            }}
            disabled={waitingForNext}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
            <span className="text-[10px] font-semibold text-rose-200">{t("game.leftShortcut")}</span>
          </button>
          <button
            className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 ring-1 ring-emerald-500/30 transition-all active:scale-95 active:bg-emerald-500/30 disabled:opacity-50 cursor-pointer"
            onClick={() => {
              const isCorrect = question.correct === ANSWER.FAIR;
              initAudio();
              playSound(isCorrect ? posAudioRef : negAudioRef);
              commitAnswer(ANSWER.FAIR);
            }}
            disabled={waitingForNext}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-[10px] font-semibold text-emerald-200">{t("game.rightFair")}</span>
          </button>
        </div>

        {/* Swipeable Question Card */}
        {!waitingForNext && (
          <div className="mt-2 flex flex-1 items-center justify-center pb-4" style={{ touchAction: 'pan-y' }}>
            <div
              ref={cardRef}
              key={questionKey}
              className="relative flex h-[55vh] w-full max-w-md flex-col rounded-3xl bg-zinc-900/90 shadow-2xl ring-1 ring-white/20 backdrop-blur-md cursor-grab active:cursor-grabbing overflow-hidden"
              style={{
                animation: isAnimatingOut ? 'none' : (showSwipeHint && answered === 0 ? 'fairshift-card-in 0.4s ease-out, fairshift-swipe-hint 1.1s ease-in-out 0.6s' : 'fairshift-card-in 0.4s ease-out'),
                touchAction: 'none',
                transform: isDragging ? `translateX(${dragCurrent - dragStart}px) rotate(${(dragCurrent - dragStart) * 0.05}deg)` : 'translateX(0) rotate(0deg)'
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Centered swipe overlay */}
              {isDragging && Math.abs(dragCurrent - dragStart) > 12 && (
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                  {(dragCurrent - dragStart) < -12 && (
                    <div
                      className="rounded-xl bg-rose-500/95 px-4 py-3 shadow-2xl ring-2 ring-white/40 backdrop-blur-sm text-center"
                      style={{
                        animation: 'fairshift-overlay-pop 0.2s ease-out',
                        opacity: Math.min(1, Math.abs(dragCurrent - dragStart) / 80)
                      }}
                    >
                      <div className="text-xl font-extrabold text-white">✕ {t("game.leftShortcut")}</div>
                      <div className="mt-0.5 text-xs font-medium text-white/90">Wrong choice</div>
                    </div>
                  )}
                  {(dragCurrent - dragStart) > 12 && (
                    <div
                      className="rounded-xl bg-emerald-500/95 px-4 py-3 shadow-2xl ring-2 ring-white/40 backdrop-blur-sm text-center"
                      style={{
                        animation: 'fairshift-overlay-pop 0.2s ease-out',
                        opacity: Math.min(1, (dragCurrent - dragStart) / 80)
                      }}
                    >
                      <div className="text-xl font-extrabold text-white">✓ {t("game.rightFair")}</div>
                      <div className="mt-0.5 text-xs font-medium text-white/90">Right choice</div>
                    </div>
                  )}
                </div>
              )}

              {/* Question image - landscape format */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-800/50 rounded-t-3xl">
                <Image
                  src={getQuestionImage(question.id)}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover"
                />
              </div>

              {/* Question text - compact (25% of card) */}
              <div className="flex flex-col justify-center p-3 h-[14vh] min-h-[100px]">
                <div className="text-base font-semibold leading-snug line-clamp-2">
                  {t(`question.${question.id}`)}
                </div>
                {question.context && (
                  <div className="mt-1.5 text-xs text-white/60 italic line-clamp-1">{question.context}</div>
                )}
              </div>
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

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}

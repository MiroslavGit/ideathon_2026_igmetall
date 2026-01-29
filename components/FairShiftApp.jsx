"use client";

import { useEffect, useMemo, useState } from "react";
import Landing from "./Landing";
import CharacterSelect from "./CharacterSelect";
import Game from "./Game";
import Results from "./Results";
import BoostModal from "./BoostModal";
import { seedFromDate } from "../game/logic";

const BEST_SCORE_KEY = "fairshift.bestScore.v1";
const CHARACTER_KEY = "fairshift.character.v1";

function safeLoadBestScore() {
  try {
    if (typeof window === "undefined") return 0;
    const v = window.localStorage.getItem(BEST_SCORE_KEY);
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function safeSaveBestScore(score) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // ignore
  }
}

export default function FairShiftApp() {
  const [screen, setScreen] = useState("landing");
  const [seedNonce, setSeedNonce] = useState(1);

  const [bestScore, setBestScore] = useState(0);
  const [character, setCharacter] = useState(null);
  const [summary, setSummary] = useState(null);
  const [boostOpen, setBoostOpen] = useState(false);

  useEffect(() => {
    setBestScore(safeLoadBestScore());
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(CHARACTER_KEY);
        if (raw) setCharacter(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  const start = () => {
    setSummary(null);
    setBoostOpen(false);
    setScreen("character");
  };

  const confirmCharacter = (nextCharacter) => {
    setCharacter(nextCharacter);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(CHARACTER_KEY, JSON.stringify(nextCharacter));
      }
    } catch {
      // ignore
    }
    setScreen("game");
  };

  const finish = (runSummary) => {
    setSummary(runSummary);

    setBestScore((prev) => {
      const next = Math.max(prev, runSummary.score);
      safeSaveBestScore(next);
      return next;
    });

    setScreen("results");
  };

  const playAgain = () => {
    setSeedNonce((n) => n + 1);
    setSummary(null);
    setBoostOpen(false);
    setScreen("game");
  };

  const seed = useMemo(() => {
    return seedFromDate(new Date()) + seedNonce;
  }, [seedNonce]);

  if (screen === "landing") {
    return (
      <Landing
        onStart={start}
      />
    );
  }

  if (screen === "character") {
    return (
      <CharacterSelect
        initial={character}
        onBack={() => setScreen("landing")}
        onConfirm={confirmCharacter}
      />
    );
  }

  if (screen === "game") {
    return (
      <Game
        seed={seed}
        sessionSeconds={60}
        character={character || { role: "factory", color: "lime", nickname: "" }}
        onFinish={finish}
      />
    );
  }

  return (
    <>
      <Results
        summary={summary || {
          score: 0,
          processed: 0,
          maxStreak: 0,
          meters: { performance: 0, quality: 0, safety: 0, energy: 0 },
          benefitsUnlocked: {},
          character: character || { role: "factory", color: "lime", nickname: "" },
        }}
        bestScore={bestScore}
        onPlayAgain={playAgain}
        onBoost={() => setBoostOpen(true)}
      />
      <BoostModal
        open={boostOpen}
        onClose={() => setBoostOpen(false)}
        character={character || { role: "factory", color: "lime", nickname: "" }}
        benefitsUnlocked={summary?.benefitsUnlocked || {}}
      />
    </>
  );
}

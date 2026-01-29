"use client";

import { useState } from "react";

export default function Landing({ onStart }) {
  const [accordionOpen, setAccordionOpen] = useState(false);

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-zinc-950 text-white">
      {/* Modern 3D background with animated light sweep */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(1200px 600px at 50% -10%, rgba(163,230,53,0.20), transparent 70%), radial-gradient(900px 500px at 10% 50%, rgba(56,189,248,0.15), transparent 65%), radial-gradient(800px 450px at 90% 80%, rgba(167,139,250,0.12), transparent 60%), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
          animation: "fairshift-light-sweep 8s ease-in-out infinite",
        }}
      />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-xl flex-col justify-center px-4 pb-10 pt-[calc(env(safe-area-inset-top)+40px)]">
        {/* Above the fold: minimal hero */}
        <div className="text-center">
          <h1 className="text-6xl font-extrabold tracking-tight drop-shadow-2xl">
            FAIR SHIFT
          </h1>
          <p className="mt-3 text-base leading-7 text-white/80">
            60 seconds. Fair choice or shortcut?
          </p>

          {/* Glass card with 3D shadow */}
          <div className="mt-8 rounded-3xl bg-white/5 p-1 shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
            <button
              className="inline-flex w-full items-center justify-center rounded-[22px] bg-gradient-to-b from-lime-400 to-lime-500 px-8 py-5 text-lg font-extrabold text-zinc-950 shadow-xl shadow-lime-500/30 active:translate-y-0.5 active:shadow-lg"
              onClick={onStart}
            >
              Start
            </button>
          </div>
        </div>

        {/* Collapsible "How it works" accordion */}
        <div className="mt-8">
          <button
            className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10 backdrop-blur-sm active:translate-y-px"
            onClick={() => setAccordionOpen(!accordionOpen)}
          >
            <span className="text-sm font-semibold">How it works</span>
            <span
              className={
                "text-lg font-bold transition-transform " +
                (accordionOpen ? "rotate-180" : "rotate-0")
              }
            >
              ▼
            </span>
          </button>

          {accordionOpen && (
            <div className="mt-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-sm">
              <ul className="space-y-3 text-sm leading-6 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5">⬅️</span>
                  <span>
                    Swipe <span className="font-semibold text-rose-300">LEFT</span> = SHORTCUT (wrong)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5">➡️</span>
                  <span>
                    Swipe <span className="font-semibold text-lime-300">RIGHT</span> = FAIR (right)
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <footer className="mt-6 text-center text-xs text-white/50">
          No login. No tracking. Just a fair shift.
        </footer>
      </div>
    </div>
  );
}

"use client";

import { BENEFITS } from "../game/benefits";
import { useI18n } from "../i18n/I18nProvider";
import LanguageToggle from "./LanguageToggle";

export default function Results({
  summary,
  onPlayAgain,
  onBoost,
}) {
  const { t } = useI18n();
  return (
    <div className="min-h-svh bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-xl px-4 pb-10 pt-[calc(env(safe-area-inset-top)+20px)]">
        <div className="mb-3 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight">{t("results.title")}</h1>
          <LanguageToggle />
        </div>

        {/* Benefits sections */}
        <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-lime-400">{t("results.unlockedProtections")}</div>
          <div className="mt-3 grid gap-2">
            {BENEFITS.map((b) => {
              const benefitTitle = t(`benefit.${b.id}.title`);
              const benefitMicro = t(`benefit.${b.id}.micro`);
              return summary.benefitsUnlocked?.[b.id] ? (
                <div key={b.id} className="flex items-center gap-3 rounded-xl bg-lime-400/10 px-3 py-2 ring-1 ring-lime-400/20">
                  <span className="text-xl">{b.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white">{benefitTitle}</div>
                    <div className="text-[10px] text-white/60">{benefitMicro}</div>
                  </div>
                  <span className="rounded-full bg-lime-400/20 px-2 py-0.5 text-[9px] font-bold text-lime-300">{t("results.unlocked")}</span>
                </div>
              ) : null;
            })}
            {BENEFITS.filter(b => summary.benefitsUnlocked?.[b.id]).length === 0 && (
              <div className="text-xs text-white/50">{t("results.noneUnlocked")}</div>
            )}
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white/60">{t("results.stillLocked")}</div>
          <div className="mt-3 grid gap-2">
            {BENEFITS.map((b) => {
              const benefitTitle = t(`benefit.${b.id}.title`);
              const benefitMicro = t(`benefit.${b.id}.micro`);
              return !summary.benefitsUnlocked?.[b.id] ? (
                <div key={b.id} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 opacity-60">
                  <span className="text-xl grayscale">{b.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white/70">{benefitTitle}</div>
                    <div className="text-[10px] text-white/50">{benefitMicro}</div>
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white/40">{t("results.locked")}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            className="inline-flex w-full items-center justify-center rounded-2xl bg-lime-400 px-6 py-4 text-base font-extrabold text-zinc-950 shadow-lg shadow-lime-500/20 active:translate-y-px"
            onClick={onPlayAgain}
          >
            {t("results.playAgain")}
          </button>
          <button
            className="inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base font-bold text-white active:translate-y-px"
            onClick={onBoost}
          >
            {t("results.getFairBoost")}
          </button>
        </div>
      </div>
    </div>
  );
}

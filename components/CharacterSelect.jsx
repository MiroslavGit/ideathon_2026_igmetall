"use client";

import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import LanguageToggle from "./LanguageToggle";

export default function CharacterSelect({
  initial,
  onBack,
  onConfirm,
}) {
  const [role, setRole] = useState(initial?.role || "factory");
  const [nickname, setNickname] = useState(initial?.nickname || "");
  const [accessory, setAccessory] = useState(initial?.accessory || "");
  const { t } = useI18n();

  const ROLES = [
    {
      id: "factory",
      title: t("character.role.factory"),
      subtitle: t("character.role.factorySub"),
      icon: "🦺",
    },
    {
      id: "technician",
      title: t("character.role.technician"),
      subtitle: t("character.role.technicianSub"),
      icon: "🛠️",
    },
    {
      id: "engineer",
      title: t("character.role.engineer"),
      subtitle: t("character.role.engineerSub"),
      icon: "📐",
    },
    {
      id: "logistics",
      title: t("character.role.logistics"),
      subtitle: t("character.role.logisticsSub"),
      icon: "📦",
    },
  ];

  const defaultColor = role === "engineer" ? "#38BDF8" : role === "logistics" ? "#FBBF24" : "#A3E635";

  const roleAccessory = useMemo(() => {
    if (role === "factory") return "helmet";
    if (role === "technician") return "wrench";
    if (role === "engineer") return "clipboard";
    if (role === "logistics") return "box";
    return "";
  }, [role]);

  const resolvedAccessory = accessory || roleAccessory;

  return (
    <div className="min-h-[100svh] bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-xl px-4 pb-[calc(env(safe-area-inset-bottom)+100px)] pt-[calc(env(safe-area-inset-top)+16px)]">
        <div className="flex items-center justify-between">
          <button
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold active:translate-y-px"
            onClick={onBack}
          >
            {t("character.back")}
          </button>
          <LanguageToggle />
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-center">{t("character.title")}</h1>

        <section className="mt-4 rounded-2xl bg-white/5 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
          <label className="block text-xs font-semibold text-white/70">
            {t("character.nickname")}
          </label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 16))}
            placeholder={t("character.nicknamePlaceholder")}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none ring-0 focus:border-white/20"
            autoComplete="off"
          />
        </section>

        <section className="mt-4 rounded-2xl bg-white/5 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
          <label className="block text-xs font-semibold text-white/70 mb-3">
            {t("character.role")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => {
              const active = r.id === role;
              return (
                <button
                  key={r.id}
                  className={
                    "flex flex-col items-center justify-center rounded-2xl px-3 py-4 text-center ring-1 active:translate-y-px " +
                    (active
                      ? "bg-white text-zinc-950 ring-white"
                      : "bg-white/5 text-white ring-white/10")
                  }
                  onClick={() => {
                    setRole(r.id);
                    setAccessory(
                      r.id === "factory"
                        ? "helmet"
                        : r.id === "technician"
                          ? "wrench"
                          : r.id === "engineer"
                            ? "clipboard"
                            : "box"
                    );
                  }}
                >
                  <div className="text-3xl">{r.icon}</div>
                  <div className="mt-2 text-sm font-extrabold">
                    {r.title}
                  </div>
                  <div className={"mt-0.5 text-[10px] leading-tight " + (active ? "text-zinc-600" : "text-white/60")}>
                    {r.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+12px)] left-0 right-0 px-4">
          <div className="mx-auto w-full max-w-xl rounded-2xl bg-white/5 p-1 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
            <button
              className="inline-flex w-full items-center justify-center rounded-[14px] bg-gradient-to-b from-lime-400 to-lime-500 px-6 py-4 text-base font-extrabold text-zinc-950 shadow-lg shadow-lime-500/25 active:translate-y-0.5"
              onClick={() =>
                onConfirm({
                  role,
                  nickname: nickname.trim(),
                  accessory: resolvedAccessory,
                })
              }
            >
              {t("character.startShift")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export ROLES for backward compatibility, but it won't be translated outside the component
export { };

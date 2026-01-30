"use client";

import { useI18n } from "../i18n/I18nProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  const toggleLang = () => {
    setLang(lang === "en" ? "de" : "en");
  };

  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur-sm active:translate-y-px hover:bg-white/15 transition-colors"
      onClick={toggleLang}
      aria-label="Toggle language"
    >
      <span className={lang === "de" ? "opacity-100" : "opacity-40"}>DE</span>
      <span className="opacity-60">/</span>
      <span className={lang === "en" ? "opacity-100" : "opacity-40"}>EN</span>
    </button>
  );
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { STRINGS } from "./strings";

const I18nContext = createContext(null);

const STORAGE_KEY = "fairshift.lang.v1";
const DEFAULT_LANG = "de"; // German default for IG Metall audience

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === "en" || saved === "de") {
          setLangState(saved);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage when changed
  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, newLang);
      }
    } catch {
      // ignore
    }
  };

  // Translation function with fallback
  const t = (key) => {
    return STRINGS[lang]?.[key] || STRINGS.en?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

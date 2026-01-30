"use client";

import { useI18n } from "../i18n/I18nProvider";

export default function BoostModal({ open, onClose }) {
  const { t } = useI18n();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="FAIR BOOST"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              {t("boost.title")}
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              {t("boost.description")}
            </p>
          </div>
          <button
            className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            onClick={onClose}
            aria-label={t("boost.close")}
          >
            ✕
          </button>
        </div>

        <a
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm active:translate-y-px"
          href="https://www.igmetall.de/mitglieder/mitglied-werden?fr-wizard-page=personal-data"
          target="_blank"
          rel="noreferrer"
        >
          {t("boost.register")}
        </a>

        <button
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 active:translate-y-px"
          onClick={onClose}
        >
          {t("boost.notNow")}
        </button>
      </div>
    </div>
  );
}

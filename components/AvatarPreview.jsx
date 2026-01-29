"use client";

import { useMemo } from "react";

function initialsFromName(name) {
  const s = (name || "").trim();
  if (!s) return "FS";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function roleIcon(role) {
  if (role === "factory") return "🦺";
  if (role === "technician") return "🛠️";
  if (role === "engineer") return "💻";
  if (role === "logistics") return "📦";
  return "🏭";
}

function accessoryIcon(accessory) {
  if (accessory === "helmet") return "⛑️";
  if (accessory === "headset") return "🎧";
  if (accessory === "wrench") return "🔧";
  if (accessory === "clipboard") return "📋";
  if (accessory === "box") return "📦";
  return "";
}

export default function AvatarPreview({
  colorHex,
  nickname,
  role,
  accessory,
}) {
  const badgeText = useMemo(() => initialsFromName(nickname), [nickname]);
  const skinColor = "#f4d7c2";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/5 p-3 shadow-xl ring-1 ring-white/10 backdrop-blur-md">
      {/* Depth background blobs */}
      <div className="absolute inset-0 opacity-60" aria-hidden="true">
        <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-[200px] items-center justify-center">
        <svg
          viewBox="0 0 240 160"
          className="w-full"
          aria-label="Avatar preview"
          role="img"
          style={{ animation: "fairshift-avatar-idle 4s ease-in-out infinite" }}
        >
          <defs>
            <linearGradient id="outfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={colorHex} stopOpacity="1" />
              <stop offset="1" stopColor={colorHex} stopOpacity="0.7" />
            </linearGradient>
            <radialGradient id="head3d" cx="0.4" cy="0.3">
              <stop offset="0" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="1" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <filter id="shadow3d">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="6" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.4" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ground shadow (3D feel) */}
          <ellipse cx="120" cy="146" rx="68" ry="12" fill="rgba(0,0,0,0.45)" />

          {/* body with gradient depth */}
          <rect
            x="70"
            y="70"
            width="100"
            height="74"
            rx="24"
            fill="url(#outfit)"
            filter="url(#shadow3d)"
          />
          <rect
            x="72"
            y="70"
            width="48"
            height="40"
            rx="20"
            fill="rgba(255,255,255,0.18)"
          />

          {/* head with 3D lighting */}
          <circle cx="120" cy="52" r="28" fill={skinColor} filter="url(#shadow3d)" />
          <circle cx="120" cy="52" r="28" fill="url(#head3d)" />

          {/* badge */}
          <rect
            x="98"
            y="98"
            width="44"
            height="28"
            rx="10"
            fill="rgba(0,0,0,0.65)"
            filter="url(#shadow3d)"
          />
          <text
            x="120"
            y="117"
            textAnchor="middle"
            fontSize="14"
            fontWeight="800"
            fill="white"
            fontFamily="ui-sans-serif, system-ui, -apple-system"
          >
            {badgeText}
          </text>

          {/* role + accessory with shadow */}
          <text
            x="40"
            y="34"
            textAnchor="start"
            fontSize="20"
            fontWeight="700"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}
          >
            {roleIcon(role)}
          </text>
          <text
            x="200"
            y="34"
            textAnchor="end"
            fontSize="20"
            fontWeight="700"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}
          >
            {accessoryIcon(accessory)}
          </text>
        </svg>
      </div>

      <div className="relative mt-3 flex items-center justify-between text-xs text-white/60">
        <span>{nickname?.trim() ? nickname.trim() : "Your avatar"}</span>
        <span className="font-semibold text-lime-400">Ready</span>
      </div>
    </div>
  );
}

import { useMemo, useRef } from "react";

const DEFAULTS = {
  thresholdPx: 60,
  tapMaxMs: 200,
  tapMovePx: 12,
};

function getTouchPoint(event) {
  const touch = event.changedTouches?.[0] || event.touches?.[0];
  if (!touch) return null;
  return { x: touch.clientX, y: touch.clientY };
}

/**
 * Minimal swipe/tap recognizer for mobile.
 * - Swipe: dx >= thresholdPx
 * - Tap: < tapMaxMs and movement <= tapMovePx
 */
export function useSwipe(options = {}) {
  const config = { ...DEFAULTS, ...options };
  const stateRef = useRef({
    startX: 0,
    startY: 0,
    startT: 0,
    active: false,
  });

  const bind = useMemo(() => {
    const onTouchStart = (event) => {
      const p = getTouchPoint(event);
      if (!p) return;
      stateRef.current = {
        startX: p.x,
        startY: p.y,
        startT: performance.now(),
        active: true,
      };
    };

    const onTouchEnd = (event) => {
      const p = getTouchPoint(event);
      if (!p) return;
      const s = stateRef.current;
      if (!s.active) return;

      stateRef.current.active = false;

      const dx = p.x - s.startX;
      const dy = p.y - s.startY;
      const dt = performance.now() - s.startT;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX >= config.thresholdPx && absX > absY) {
        if (dx > 0) config.onSwipeRight?.();
        else config.onSwipeLeft?.();
        return;
      }

      const dist = Math.hypot(dx, dy);
      if (dt <= config.tapMaxMs && dist <= config.tapMovePx) {
        config.onTap?.();
      }
    };

    return {
      onTouchStart,
      onTouchEnd,
    };
  }, [
    config.thresholdPx,
    config.tapMaxMs,
    config.tapMovePx,
    config.onSwipeLeft,
    config.onSwipeRight,
    config.onTap,
  ]);

  return bind;
}

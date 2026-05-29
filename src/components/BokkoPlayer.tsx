"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Goshuin, SvgStroke } from "@/data/mockGoshuin";

export type BackgroundMode = "washi" | "gold" | "night";
export type Speed = 0.5 | 1 | 2;

interface BokkoPlayerProps {
  goshuin: Goshuin;
  bgMode?: BackgroundMode;
  muted?: boolean;
  onComplete?: () => void;
  onProgressChange?: (progress: number) => void;
}

const BG_STYLES: Record<BackgroundMode, { bg: string; strokeFilter: string }> = {
  washi: { bg: "#F7F5F0", strokeFilter: "none" },
  gold:  { bg: "#1C1C1C", strokeFilter: "drop-shadow(0 0 6px rgba(212,175,55,0.6))" },
  night: { bg: "#0D0D0D", strokeFilter: "drop-shadow(0 0 4px rgba(255,255,255,0.15))" },
};

/** pathLength ごとに管理するシンプルな内部状態 */
interface StrokeAnim {
  pathLength: number;
  opacity: number;
}

export default function BokkoPlayer({
  goshuin,
  bgMode = "washi",
  muted: _muted = false,
  onComplete,
  onProgressChange,
}: BokkoPlayerProps) {
  const [speed, setSpeed] = useState<Speed>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [strokeAnims, setStrokeAnims] = useState<StrokeAnim[]>(
    () => goshuin.strokes.map(() => ({ pathLength: 0, opacity: 0 }))
  );
  const [isComplete, setIsComplete] = useState(false);

  const isPlayingRef = useRef(false);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const totalDuration = goshuin.strokes.reduce((s, p) => s + p.duration, 0);

  // ── Reset ───────────────────────────────────────────────────
  const reset = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentIndex(-1);
    setIsComplete(false);
    setStrokeAnims(goshuin.strokes.map(() => ({ pathLength: 0, opacity: 0 })));
    onProgressChange?.(0);
  }, [goshuin.strokes, onProgressChange]);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goshuin.id]);

  // ── Animate current stroke via timed state updates ──────────
  useEffect(() => {
    if (!isPlayingRef.current || currentIndex < 0 || currentIndex >= goshuin.strokes.length) return;

    const stroke: SvgStroke = goshuin.strokes[currentIndex];
    const durationMs = (stroke.duration / speedRef.current) * 1000;
    const startTime = performance.now();
    let raf: number;

    const tick = (now: number) => {
      if (!isPlayingRef.current) return;
      const t = Math.min((now - startTime) / durationMs, 1);
      // easeInOut
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      setStrokeAnims((prev) => {
        const next = [...prev];
        next[currentIndex] = { pathLength: eased, opacity: Math.min(eased * 3, 1) };
        return next;
      });

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // stroke done
        setStrokeAnims((prev) => {
          const next = [...prev];
          next[currentIndex] = { pathLength: 1, opacity: 1 };
          return next;
        });

        const nextIdx = currentIndex + 1;
        const done = goshuin.strokes.slice(0, currentIndex + 1).reduce((s, p) => s + p.duration, 0);
        onProgressChange?.(done / totalDuration);

        if (nextIdx >= goshuin.strokes.length) {
          isPlayingRef.current = false;
          setIsPlaying(false);
          setIsComplete(true);
          onComplete?.();
          onProgressChange?.(1);
        } else {
          setCurrentIndex(nextIdx);
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentIndex]);

  // ── Seek to stroke index ─────────────────────────────────────
  const seekToIndex = useCallback(
    (targetIdx: number) => {
      isPlayingRef.current = false;
      setIsPlaying(false);
      setIsComplete(false);
      setStrokeAnims(
        goshuin.strokes.map((_, i) =>
          i < targetIdx
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        )
      );
      setCurrentIndex(targetIdx);
      const elapsed = goshuin.strokes.slice(0, targetIdx).reduce((s, p) => s + p.duration, 0);
      onProgressChange?.(elapsed / totalDuration);
    },
    [goshuin.strokes, totalDuration, onProgressChange]
  );

  // ── Play / Pause ─────────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    if (isComplete) {
      reset();
      return;
    }
    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      setIsPlaying(false);
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
      if (currentIndex === -1) setCurrentIndex(0);
    }
  }, [isComplete, currentIndex, reset]);

  const completedCount = strokeAnims.filter((s) => s.pathLength >= 1).length;
  const progress = isComplete ? 1 : completedCount / goshuin.strokes.length;

  const bg = BG_STYLES[bgMode];
  const strokeColor =
    bgMode === "gold" ? "#D4AF37" : bgMode === "night" ? "#E8E4DC" : goshuin.accentColor;

  return (
    <div className="flex flex-col items-center gap-4 w-full select-none">
      {/* ── SVG キャンバス ── */}
      <div className="relative w-full max-w-sm mx-auto rounded-sm shadow-2xl overflow-hidden">
        <div
          className="p-4 aspect-square transition-colors duration-500"
          style={{ backgroundColor: bg.bg }}
        >
          <svg
            viewBox={goshuin.viewBox}
            className="w-full h-full"
            style={{ filter: bg.strokeFilter === "none" ? undefined : bg.strokeFilter }}
          >
            {goshuin.strokes.map((stroke: SvgStroke, i: number) => {
              const anim = strokeAnims[i] ?? { pathLength: 0, opacity: 0 };
              const pathLen = anim.pathLength;
              // 大まかな pathLength → stroke-dasharray 変換（SVG には getTotalLength がないため 10000 で近似）
              const approxLen = 10000;
              const dashArray = `${pathLen * approxLen} ${approxLen}`;
              return (
                <g key={stroke.id}>
                  {stroke.shadowWidth && (
                    <path
                      d={stroke.d}
                      stroke={strokeColor}
                      strokeWidth={stroke.shadowWidth}
                      strokeLinecap={stroke.linecap ?? "round"}
                      strokeLinejoin="round"
                      fill="none"
                      opacity={anim.opacity * 0.18}
                      strokeDasharray={dashArray}
                      strokeDashoffset={0}
                    />
                  )}
                  <path
                    d={stroke.d}
                    stroke={strokeColor}
                    strokeWidth={stroke.strokeWidth}
                    strokeLinecap={stroke.linecap ?? "round"}
                    strokeLinejoin="round"
                    fill="none"
                    opacity={anim.opacity}
                    strokeDasharray={dashArray}
                    strokeDashoffset={0}
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ── シークバー ── */}
      <div className="w-full max-w-sm px-1">
        <input
          type="range"
          min={0}
          max={goshuin.strokes.length}
          step={1}
          value={Math.round(progress * goshuin.strokes.length)}
          onChange={(e) => seekToIndex(Number(e.target.value))}
          className="w-full h-1 cursor-pointer"
          style={{ accentColor: goshuin.accentColor }}
        />
        <div className="flex justify-between text-xs mt-1 opacity-40 text-kinari">
          <span>0:00</span>
          <span>{(totalDuration / speed).toFixed(1)}s</span>
        </div>
      </div>

      {/* ── コントロールバー ── */}
      <div className="flex items-center gap-5">
        <button
          onClick={reset}
          className="w-10 h-10 rounded-full border border-kinari/25 text-kinari/50 hover:text-kinari hover:border-kinari/50 transition-all text-lg"
          aria-label="リセット"
        >
          ↺
        </button>

        <button
          onClick={handlePlayPause}
          className="w-16 h-16 rounded-full flex items-center justify-center text-kinari text-2xl transition-all shadow-lg active:scale-95"
          style={{
            backgroundColor: isComplete ? "#D4AF37" : goshuin.accentColor,
            boxShadow: `0 0 24px ${isComplete ? "rgba(212,175,55,0.45)" : "rgba(209,52,52,0.45)"}`,
          }}
          aria-label={isPlayingRef.current ? "一時停止" : "再生"}
        >
          {isComplete ? "✓" : isPlayingRef.current ? "⏸" : "▶"}
        </button>

        <div className="flex flex-col items-center gap-1">
          <span className="text-kinari/40 text-xs">速度</span>
          <div className="flex gap-1">
            {([0.5, 1, 2] as Speed[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  if (isPlayingRef.current) {
                    isPlayingRef.current = false;
                    setIsPlaying(false);
                  }
                  setSpeed(s);
                  speedRef.current = s;
                }}
                className={`px-2 py-0.5 text-xs rounded border transition-all ${
                  speed === s
                    ? "border-gold text-gold"
                    : "border-kinari/20 text-kinari/40 hover:border-kinari/40"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-kinari/35 text-xs">
        {isComplete
          ? "書了 — 御朱印帳に保存できます"
          : `全 ${goshuin.strokes.length} 画  ·  約 ${(totalDuration / speed).toFixed(1)} 秒`}
      </p>
    </div>
  );
}

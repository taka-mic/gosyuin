"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import BokkoPlayer, { type BackgroundMode } from "@/components/BokkoPlayer";
import { useAudioController } from "@/components/AudioController";
import { mockGoshuinData } from "@/data/mockGoshuin";

const BG_LABELS: { mode: BackgroundMode; label: string; preview: string }[] = [
  { mode: "washi", label: "和紙", preview: "#F7F5F0" },
  { mode: "gold",  label: "金箔", preview: "#D4AF37" },
  { mode: "night", label: "夜間", preview: "#0D0D0D" },
];

function PlayerContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? mockGoshuinData[0].id;
  const goshuin = mockGoshuinData.find((g) => g.id === id) ?? mockGoshuinData[0];

  const [bgMode, setBgMode] = useState<BackgroundMode>("washi");
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const { playBrushStroke } = useAudioController();

  const handleProgressChange = useCallback(
    (p: number) => {
      setProgress(p);
      if (!muted) playBrushStroke(0.2);
    },
    [muted, playBrushStroke]
  );

  const handleSave = () => setSaved(true);

  return (
    <main className="min-h-screen bg-sumi flex flex-col items-center px-4 pt-6 pb-10">
      {/* ── ナビゲーション ── */}
      <nav className="w-full max-w-sm flex items-center justify-between mb-4">
        <Link href="/" className="text-kinari/40 hover:text-kinari/80 text-sm transition-colors">
          ← 御朱印帳
        </Link>
        <Link
          href="/scan"
          className="text-xs tracking-widest text-kinari/40 hover:text-kinari/70 transition-colors"
        >
          ＋ スキャン
        </Link>
      </nav>

      {/* ── 神社情報 ── */}
      <div className="w-full max-w-sm mb-5 text-center">
        <h1 className="text-xl font-bold tracking-[0.35rem] text-kinari">{goshuin.name}</h1>
        <p className="text-kinari/50 text-xs tracking-wider mt-1">{goshuin.location}</p>
        <p className="text-gold/70 text-xs tracking-[0.3rem] mt-0.5">{goshuin.date}</p>
      </div>

      {/* ── プレイヤー ── */}
      <div className="w-full max-w-sm">
        <BokkoPlayer
          goshuin={goshuin}
          bgMode={bgMode}
          muted={muted}
          onComplete={() => {}}
          onProgressChange={handleProgressChange}
        />
      </div>

      {/* ── 背景モード切り替え ── */}
      <div className="w-full max-w-sm mt-6">
        <p className="text-kinari/30 text-xs tracking-[0.4rem] mb-2 text-center">背景モード</p>
        <div className="flex gap-2 justify-center">
          {BG_LABELS.map(({ mode, label, preview }) => (
            <button
              key={mode}
              onClick={() => setBgMode(mode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-xs tracking-wider transition-all ${
                bgMode === mode
                  ? "border-gold text-gold"
                  : "border-kinari/15 text-kinari/40 hover:border-kinari/30"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border"
                style={{
                  backgroundColor: preview,
                  borderColor: bgMode === mode ? "#D4AF37" : "#555",
                }}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── ミュート ── */}
      <div className="mt-4">
        <button
          onClick={() => setMuted((v) => !v)}
          className={`flex items-center gap-2 text-xs tracking-widest px-3 py-1.5 rounded-sm border transition-all ${
            muted
              ? "border-kinari/20 text-kinari/30"
              : "border-vermilion/40 text-vermilion/80"
          }`}
        >
          <span>{muted ? "🔇" : "🔊"}</span>
          <span>{muted ? "ミュート中" : "筆音 ON"}</span>
        </button>
      </div>

      {/* ── 神社詳細 ── */}
      <div
        className="w-full max-w-sm mt-6 p-4 rounded-sm border"
        style={{ borderColor: "rgba(212,175,55,0.2)", backgroundColor: "rgba(255,255,255,0.03)" }}
      >
        <p className="text-kinari/30 text-xs tracking-widest mb-1">御祭神</p>
        <p className="text-kinari/70 text-sm tracking-wider">{goshuin.deity}</p>
        <p className="text-kinari/40 text-xs mt-2 leading-relaxed">{goshuin.description}</p>
      </div>

      {/* ── 保存ボタン ── */}
      <motion.button
        onClick={handleSave}
        disabled={saved}
        className="mt-6 w-full max-w-sm py-4 rounded-sm text-sm tracking-[0.4rem] transition-all active:scale-95 disabled:opacity-60"
        style={{
          backgroundColor: saved ? "#2E2E2E" : "#D4AF37",
          color: saved ? "#888" : "#1C1C1C",
        }}
        whileTap={{ scale: 0.97 }}
      >
        {saved ? "✓ 御朱印帳に保存しました" : "御朱印帳に保存する"}
      </motion.button>

      {/* ── 他の御朱印 ── */}
      <div className="w-full max-w-sm mt-8">
        <p className="text-kinari/25 text-xs tracking-[0.4rem] mb-3">他の御朱印</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mockGoshuinData
            .filter((g) => g.id !== goshuin.id)
            .map((g) => (
              <Link
                key={g.id}
                href={`/player?id=${g.id}`}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-sm border transition-all"
                style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <span
                  className="w-10 h-10 flex items-center justify-center text-sm font-bold rounded-sm"
                  style={{ color: g.accentColor, backgroundColor: g.accentColor + "20" }}
                >
                  印
                </span>
                <span className="text-kinari/50 text-xs tracking-wide whitespace-nowrap">
                  {g.name.length > 5 ? g.name.slice(0, 5) + "…" : g.name}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}

export default function PlayerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sumi flex items-center justify-center">
        <p className="text-gold/60 text-xs tracking-widest">読み込み中…</p>
      </div>
    }>
      <PlayerContent />
    </Suspense>
  );
}

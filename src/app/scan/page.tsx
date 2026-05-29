"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { mockGoshuinData } from "@/data/mockGoshuin";

type Phase = "viewfinder" | "loading" | "done";

export default function ScanPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("viewfinder");
  const [selectedId, setSelectedId] = useState<string>(mockGoshuinData[0].id);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // ローディング進行 → /player へ遷移
  useEffect(() => {
    if (phase !== "loading") return;

    const total = 4000; // 4秒
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setLoadingProgress(elapsed / total);
      if (elapsed >= total) {
        clearInterval(timer);
        setPhase("done");
        router.push(`/player?id=${selectedId}`);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [phase, selectedId, router]);

  const startScan = (id: string) => {
    setSelectedId(id);
    setPhase("loading");
  };

  return (
    <main className="min-h-screen bg-sumi flex flex-col items-center justify-center px-5">
      <AnimatePresence mode="wait">
        {phase === "viewfinder" && (
          <motion.div
            key="viewfinder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm flex flex-col items-center gap-6"
          >
            <h1 className="text-gold text-sm tracking-[0.5rem] font-light">SCAN</h1>
            <p className="text-kinari/60 text-xs tracking-widest">御朱印を選択してください</p>

            {/* カメラビューファインダー風 */}
            <div className="relative w-full aspect-square">
              {/* 角のブラケット */}
              {[
                "top-0 left-0 border-t-2 border-l-2",
                "top-0 right-0 border-t-2 border-r-2",
                "bottom-0 left-0 border-b-2 border-l-2",
                "bottom-0 right-0 border-b-2 border-r-2",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute w-8 h-8 ${cls}`}
                  style={{ borderColor: "#D4AF37" }}
                />
              ))}

              {/* スキャンライン */}
              <motion.div
                className="absolute left-4 right-4 h-px"
                style={{ backgroundColor: "#D13434", opacity: 0.7 }}
                animate={{ top: ["10%", "90%", "10%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* サンプル一覧 */}
              <div className="absolute inset-4 flex flex-col gap-2 overflow-y-auto">
                {mockGoshuinData.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => startScan(g.id)}
                    className="flex items-center gap-3 p-3 rounded-sm border text-left transition-all active:scale-95"
                    style={{
                      backgroundColor: "rgba(247,245,240,0.06)",
                      borderColor: "rgba(212,175,55,0.3)",
                    }}
                  >
                    <span
                      className="text-2xl w-10 h-10 flex items-center justify-center rounded-sm font-bold"
                      style={{ color: g.accentColor, backgroundColor: g.accentColor + "20" }}
                    >
                      印
                    </span>
                    <div>
                      <p className="text-kinari text-sm tracking-wide">{g.name}</p>
                      <p className="text-kinari/40 text-xs">{g.date}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ボタン群 */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => startScan(mockGoshuinData[0].id)}
                className="flex-1 py-3 text-sm tracking-[0.3rem] rounded-sm border border-kinari/20 text-kinari/60 hover:text-kinari hover:border-kinari/40 transition-all"
              >
                サンプルを読み込む
              </button>
            </div>

            <a href="/" className="text-kinari/30 text-xs tracking-widest hover:text-kinari/60">
              ← 戻る
            </a>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8"
          >
            {/* 水墨ローディングサークル */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                {/* 背景円 */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="rgba(212,175,55,0.12)"
                  strokeWidth="6"
                />
                {/* プログレス円 */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 85}`}
                  strokeDashoffset={`${2 * Math.PI * 85 * (1 - loadingProgress)}`}
                />
                {/* 内側の筆圧を表す波紋 */}
                {[60, 70, 80].map((r, i) => (
                  <motion.circle
                    key={r}
                    cx="100"
                    cy="100"
                    r={r}
                    fill="none"
                    stroke="#D13434"
                    strokeWidth={1.5 - i * 0.3}
                    opacity={0.3 - i * 0.08}
                    animate={{ r: [r, r + 8, r] }}
                    transition={{
                      duration: 2,
                      delay: i * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </svg>

              {/* 中央テキスト */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.p
                  className="text-gold text-2xl font-bold"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                >
                  {Math.round(loadingProgress * 100)}
                  <span className="text-xs">%</span>
                </motion.p>
              </div>
            </div>

            {/* テキスト */}
            <div className="text-center">
              <motion.p
                className="text-kinari/80 text-sm tracking-[0.4rem]"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                筆跡を解析中…
              </motion.p>
              <p className="text-kinari/30 text-xs mt-2 tracking-widest">
                {mockGoshuinData.find((g) => g.id === selectedId)?.name}
              </p>
            </div>

            {/* 水墨が溶ける演出 */}
            <div className="flex gap-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#D13434" }}
                  animate={{
                    scale: [0.8, 1.4, 0.8],
                    opacity: [0.3, 0.9, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.18,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

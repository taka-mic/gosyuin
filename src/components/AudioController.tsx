"use client";

import { useRef, useCallback } from "react";

/**
 * Web Audio API を使って筆擦れ音・環境音を生成するコントローラ。
 * Phase 1 はホワイトノイズフィルタリングによる「筆音」プレースホルダーを実装。
 * Phase 2 で実音源ファイル(/public/audio/)に差し替え予定。
 */
export function useAudioController() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  /** 筆擦れ音（フィルタードホワイトノイズ、短め）*/
  const playBrushStroke = useCallback(
    (durationSec: number = 0.3) => {
      try {
        const ctx = getCtx();
        const bufferSize = Math.ceil(ctx.sampleRate * Math.min(durationSec, 1.5));
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1800;
        filter.Q.value = 0.6;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();
      } catch {
        // AudioContext が使えない環境では無音で継続
      }
    },
    [getCtx]
  );

  /** 環境音（境内の静寂 — 低周波ドローン）*/
  const startAmbience = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 55;
      const gain = ctx.createGain();
      gain.gain.value = 0.03;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      return () => {
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        setTimeout(() => osc.stop(), 1500);
      };
    } catch {
      return () => {};
    }
  }, [getCtx]);

  const stop = useCallback(() => {
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
  }, []);

  return { playBrushStroke, startAmbience, stop };
}

// デフォルトエクスポート（コンポーネントとして使いたい場合のラッパー）
export default function AudioController() {
  return null;
}

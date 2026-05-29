export interface SvgStroke {
  id: string;
  /** SVGパスの d 属性。複合パス（M...M...）も可 */
  d: string;
  /** 通常の線幅 */
  strokeWidth: number;
  /** 太さの変化を演出する影レイヤー用の幅（省略時は strokeWidth の2倍） */
  shadowWidth?: number;
  duration: number; // seconds for this stroke to complete
  linecap?: "round" | "square" | "butt";
}

export interface Goshuin {
  id: string;
  name: string;
  location: string;
  date: string;
  deity: string;
  description: string;
  strokes: SvgStroke[];
  accentColor: string;
  viewBox: string;
}

/**
 * 400×400 viewBox で設計した筆跡パスデータ。
 * 各ストロークは「トメ・ハネ・ハライ」を bezier 曲線で表現。
 * shadowWidth を持つストロークは 2 層描画することで太さの変化を演出する。
 */
export const mockGoshuinData: Goshuin[] = [
  /* ──────────────────────────────────────────────────────────────
   * 1. 伏見稲荷大社  ─  「奉 拝」（ほうはい）
   * ────────────────────────────────────────────────────────────── */
  {
    id: "fushimi-inari",
    name: "伏見稲荷大社",
    location: "京都府京都市伏見区",
    date: "令和六年 睦月",
    deity: "宇迦之御魂大神",
    description: "全国に約三万社ある稲荷神社の総本社。千本鳥居で知られる。",
    accentColor: "#D13434",
    viewBox: "0 0 400 400",
    strokes: [
      // ── 外円（印鑑枠） ──
      {
        id: "outer-ring",
        d: "M 200 22 C 300 22 378 100 378 200 C 378 300 300 378 200 378 C 100 378 22 300 22 200 C 22 100 100 22 200 22",
        strokeWidth: 7,
        shadowWidth: 13,
        duration: 2.2,
        linecap: "round",
      },
      // ── 鳥居：上笠木（反り上がりカーブ） ──
      {
        id: "torii-kasagi",
        d: "M 105 145 C 140 125 170 118 200 116 C 230 118 260 125 295 145",
        strokeWidth: 12,
        shadowWidth: 20,
        duration: 1.0,
        linecap: "round",
      },
      // ── 鳥居：島木（下横棒） ──
      {
        id: "torii-shimagi",
        d: "M 118 168 L 282 168",
        strokeWidth: 7,
        duration: 0.7,
        linecap: "round",
      },
      // ── 鳥居：左柱（下端でわずかに太くなるイメージ） ──
      {
        id: "torii-left",
        d: "M 151 168 C 151 190 150 220 149 252",
        strokeWidth: 9,
        shadowWidth: 15,
        duration: 0.6,
        linecap: "round",
      },
      // ── 鳥居：右柱 ──
      {
        id: "torii-right",
        d: "M 249 168 C 249 190 250 220 251 252",
        strokeWidth: 9,
        shadowWidth: 15,
        duration: 0.6,
        linecap: "round",
      },
      // ── 「奉」一画目：長い横画（入筆・止め） ──
      {
        id: "hou-yoko1",
        d: "M 148 278 C 160 276 190 275 200 275 C 210 275 240 276 252 278",
        strokeWidth: 6,
        shadowWidth: 11,
        duration: 0.55,
        linecap: "round",
      },
      // ── 「奉」縦画（中心を貫く） ──
      {
        id: "hou-tate",
        d: "M 200 272 C 200 285 200 305 200 328",
        strokeWidth: 6,
        shadowWidth: 10,
        duration: 0.5,
        linecap: "round",
      },
      // ── 「奉」二画目：短い横画 ──
      {
        id: "hou-yoko2",
        d: "M 164 293 C 178 292 200 291 236 293",
        strokeWidth: 5,
        duration: 0.38,
        linecap: "round",
      },
      // ── 「奉」下部：左払い ──
      {
        id: "hou-harai-left",
        d: "M 200 328 C 192 335 178 344 162 350",
        strokeWidth: 5,
        shadowWidth: 9,
        duration: 0.4,
        linecap: "round",
      },
      // ── 「奉」下部：右払い ──
      {
        id: "hou-harai-right",
        d: "M 200 328 C 208 335 222 344 238 350",
        strokeWidth: 5,
        shadowWidth: 9,
        duration: 0.4,
        linecap: "round",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────────
   * 2. 出雲大社  ─  「縁 結」（えんむすび）
   * ────────────────────────────────────────────────────────────── */
  {
    id: "izumo-taisha",
    name: "出雲大社",
    location: "島根県出雲市大社町",
    date: "令和六年 如月",
    deity: "大国主大神",
    description: "縁結びの神として名高い。日本最古の神社のひとつ。",
    accentColor: "#D4AF37",
    viewBox: "0 0 400 400",
    strokes: [
      // ── 外円 ──
      {
        id: "outer-ring",
        d: "M 200 22 C 300 22 378 100 378 200 C 378 300 300 378 200 378 C 100 378 22 300 22 200 C 22 100 100 22 200 22",
        strokeWidth: 7,
        shadowWidth: 13,
        duration: 2.2,
        linecap: "round",
      },
      // ── 菱形大（八方向）──
      {
        id: "diamond-outer",
        d: "M 200 68 L 330 200 L 200 332 L 70 200 Z",
        strokeWidth: 4,
        duration: 2.0,
        linecap: "round",
      },
      // ── 菱形内 ──
      {
        id: "diamond-inner",
        d: "M 200 118 L 282 200 L 200 282 L 118 200 Z",
        strokeWidth: 2.5,
        duration: 1.5,
        linecap: "round",
      },
      // ── 八方放射（縦横斜め） ──
      { id: "ray-n",  d: "M 200 68 L 200 113",  strokeWidth: 3.5, duration: 0.25, linecap: "round" },
      { id: "ray-ne", d: "M 330 200 L 287 200", strokeWidth: 3.5, duration: 0.25, linecap: "round" },
      { id: "ray-s",  d: "M 200 332 L 200 287", strokeWidth: 3.5, duration: 0.25, linecap: "round" },
      { id: "ray-w",  d: "M 70 200 L 113 200",  strokeWidth: 3.5, duration: 0.25, linecap: "round" },
      // ── 中心：縁（えん）の象形 ──
      {
        id: "en-top-arc",
        d: "M 163 172 C 175 158 198 155 200 165 C 202 155 225 158 237 172",
        strokeWidth: 6,
        shadowWidth: 10,
        duration: 0.7,
        linecap: "round",
      },
      {
        id: "en-horiz",
        d: "M 158 188 L 242 188",
        strokeWidth: 5,
        duration: 0.45,
        linecap: "round",
      },
      {
        id: "en-box",
        d: "M 172 202 L 172 235 C 172 242 200 248 228 235 L 228 202 Z",
        strokeWidth: 5,
        shadowWidth: 9,
        duration: 0.9,
        linecap: "round",
      },
      // ── 下部：結（むすび）の象形 ──
      {
        id: "musu-horiz",
        d: "M 165 262 C 180 260 200 259 235 262",
        strokeWidth: 5,
        duration: 0.4,
        linecap: "round",
      },
      {
        id: "musu-tate",
        d: "M 200 258 L 200 298",
        strokeWidth: 5,
        duration: 0.35,
        linecap: "round",
      },
      {
        id: "musu-arc",
        d: "M 168 282 C 185 298 215 298 232 282",
        strokeWidth: 4,
        shadowWidth: 8,
        duration: 0.5,
        linecap: "round",
      },
      {
        id: "musu-harai",
        d: "M 200 298 C 195 308 182 318 168 322",
        strokeWidth: 4,
        duration: 0.38,
        linecap: "round",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────────
   * 3. 明治神宮  ─  「参 拝」（さんぱい）
   * ────────────────────────────────────────────────────────────── */
  {
    id: "meiji-jingu",
    name: "明治神宮",
    location: "東京都渋谷区代々木神園町",
    date: "令和六年 弥生",
    deity: "明治天皇・昭憲皇太后",
    description: "明治天皇と昭憲皇太后を御祭神とする。初詣参拝者数日本一。",
    accentColor: "#7C5C3A",
    viewBox: "0 0 400 400",
    strokes: [
      // ── 外円 ──
      {
        id: "outer-ring",
        d: "M 200 22 C 300 22 378 100 378 200 C 378 300 300 378 200 378 C 100 378 22 300 22 200 C 22 100 100 22 200 22",
        strokeWidth: 7,
        shadowWidth: 13,
        duration: 2.2,
        linecap: "round",
      },
      // ── 菊花弁（16枚） ──
      ...[...Array(16)].map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        const x1 = 200 + 145 * Math.cos(angle - Math.PI / 2);
        const y1 = 200 + 145 * Math.sin(angle - Math.PI / 2);
        const x2 = 200 + 100 * Math.cos(angle - Math.PI / 2);
        const y2 = 200 + 100 * Math.sin(angle - Math.PI / 2);
        return {
          id: `petal-${i}`,
          d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`,
          strokeWidth: 4,
          duration: 0.18,
          linecap: "round" as const,
        };
      }),
      // ── 菊中心円 ──
      {
        id: "kiku-center",
        d: "M 200 150 C 250 150 250 250 200 250 C 150 250 150 150 200 150",
        strokeWidth: 4,
        shadowWidth: 8,
        duration: 1.1,
        linecap: "round",
      },
      // ── 「参」三点の縦画 ──
      {
        id: "san-ten1",
        d: "M 172 178 C 170 183 168 188 170 192",
        strokeWidth: 6,
        shadowWidth: 11,
        duration: 0.32,
        linecap: "round",
      },
      {
        id: "san-ten2",
        d: "M 200 175 C 200 182 200 188 200 195",
        strokeWidth: 6,
        shadowWidth: 11,
        duration: 0.28,
        linecap: "round",
      },
      {
        id: "san-ten3",
        d: "M 228 178 C 230 183 232 188 230 192",
        strokeWidth: 6,
        shadowWidth: 11,
        duration: 0.32,
        linecap: "round",
      },
      // ── 「参」大きな払い ──
      {
        id: "san-harai",
        d: "M 160 210 C 175 208 200 206 240 210",
        strokeWidth: 7,
        shadowWidth: 13,
        duration: 0.55,
        linecap: "round",
      },
      // ── 「拝」左部（扌手偏） ──
      {
        id: "hai-left-tate",
        d: "M 162 228 C 162 242 162 260 162 278",
        strokeWidth: 5,
        shadowWidth: 9,
        duration: 0.45,
        linecap: "round",
      },
      {
        id: "hai-left-yoko1",
        d: "M 146 238 L 178 238",
        strokeWidth: 4,
        duration: 0.3,
        linecap: "round",
      },
      {
        id: "hai-left-yoko2",
        d: "M 148 256 L 176 256",
        strokeWidth: 4,
        duration: 0.3,
        linecap: "round",
      },
      // ── 「拝」右部（横画4本＋縦画） ──
      {
        id: "hai-right-tate",
        d: "M 222 225 C 222 240 222 260 222 280",
        strokeWidth: 5,
        duration: 0.45,
        linecap: "round",
      },
      {
        id: "hai-right-yoko",
        d: "M 200 232 L 248 232 M 200 248 L 248 248 M 200 264 L 248 264 M 200 278 L 248 278",
        strokeWidth: 4,
        duration: 0.8,
        linecap: "round",
      },
    ],
  },
];

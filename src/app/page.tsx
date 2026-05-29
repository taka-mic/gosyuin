import Link from "next/link";
import { mockGoshuinData } from "@/data/mockGoshuin";

export default function HomePage() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F7F5F0", color: "#1C1C1C" }}
    >
      {/* ── ヘッダー ── */}
      <header className="pt-12 pb-6 text-center">
        <p
          className="text-xs tracking-[0.5rem] mb-3 font-light"
          style={{ color: "#8B7355" }}
        >
          DIGITAL BOKKO
        </p>
        <h1
          className="text-6xl font-bold tracking-[1.2rem]"
          style={{ color: "#1C1C1C", textShadow: "1px 1px 0 rgba(0,0,0,0.08)" }}
        >
          墨 香
        </h1>
        <p
          className="mt-3 text-sm tracking-[0.35rem] font-light"
          style={{ color: "#7C5C3A" }}
        >
          御朱印の筆跡を、手元で。
        </p>
        <div
          className="mx-auto mt-5 w-16 h-px"
          style={{ backgroundColor: "#D4AF37", opacity: 0.6 }}
        />
      </header>

      {/* ── プライマリ CTA ── */}
      <section className="flex flex-col items-center px-6 mt-4">
        <Link
          href="/scan"
          className="w-full max-w-sm py-4 rounded-sm text-center text-base tracking-[0.4rem] font-medium transition-all active:scale-95 shadow-lg"
          style={{
            backgroundColor: "#D13434",
            color: "#F7F5F0",
            boxShadow: "0 4px 20px rgba(209,52,52,0.35)",
          }}
        >
          ⛩ 新しい御朱印をスキャンする
        </Link>

        <p
          className="mt-3 text-xs tracking-widest"
          style={{ color: "#A08060" }}
        >
          写真を読み込んで筆跡を再生
        </p>
      </section>

      {/* ── マイ御朱印帳 ── */}
      <section className="flex-1 px-5 mt-10 pb-10">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-0.5 h-5 rounded-full"
            style={{ backgroundColor: "#D13434" }}
          />
          <h2
            className="text-sm tracking-[0.35rem] font-medium"
            style={{ color: "#1C1C1C" }}
          >
            マイ御朱印帳
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {mockGoshuinData.map((g) => (
            <Link
              key={g.id}
              href={`/player?id=${g.id}`}
              className="flex items-center gap-4 p-4 rounded-sm border transition-all active:scale-98 hover:shadow-md"
              style={{
                backgroundColor: "#FDFAF5",
                borderColor: "#E0D8C8",
              }}
            >
              {/* 印鑑アイコン */}
              <div
                className="w-14 h-14 rounded-sm flex items-center justify-center text-xl flex-shrink-0 font-bold tracking-widest"
                style={{
                  backgroundColor: g.accentColor + "18",
                  color: g.accentColor,
                  border: `1.5px solid ${g.accentColor}40`,
                }}
              >
                印
              </div>

              {/* テキスト情報 */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-medium text-base tracking-wide truncate"
                  style={{ color: "#1C1C1C" }}
                >
                  {g.name}
                </p>
                <p
                  className="text-xs mt-0.5 tracking-wider truncate"
                  style={{ color: "#8B7355" }}
                >
                  {g.location}
                </p>
                <p
                  className="text-xs mt-1 tracking-widest"
                  style={{ color: "#A08878" }}
                >
                  {g.date}
                </p>
              </div>

              {/* 矢印 */}
              <span style={{ color: "#C8A97E" }}>›</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── フッター ── */}
      <footer
        className="text-center py-6 text-xs tracking-[0.3rem]"
        style={{
          color: "#A08060",
          borderTop: "1px solid #D8D0C0",
        }}
      >
        墨香 ─ AI × 筆跡アニメーション
      </footer>
    </main>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sumi flex flex-col items-center justify-center gap-4">
      <p className="text-gold/60 text-5xl">⛩</p>
      <p className="text-kinari/60 text-sm tracking-widest">ページが見つかりません</p>
      <Link href="/" className="text-xs text-kinari/30 hover:text-kinari/60 tracking-widest">
        ← 御朱印帳に戻る
      </Link>
    </div>
  );
}

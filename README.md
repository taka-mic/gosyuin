# 墨香 — デジタル御朱印アニメーション

御朱印の筆跡が画面上で滑らかに再現されるプロトタイプアプリ。

## 技術スタック

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + カスタム和風テーマ
- **Framer Motion** — SVG stroke-dasharray アニメーション
- **Web Audio API** — 筆音プレースホルダー

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開く。

## 画面構成

| パス | 説明 |
|---|---|
| `/` | ホーム・マイ御朱印帳 |
| `/scan` | 擬似スキャン画面 |
| `/player?id=<id>` | 筆跡再生プレイヤー |

## 開発コマンド

```bash
npm run dev        # 開発サーバー
npm run build      # プロダクションビルド
npm run typecheck  # 型チェック
npm run lint       # ESLint
```

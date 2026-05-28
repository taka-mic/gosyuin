# 御朱印奇譚 ⛩

AI コンシェルジュ × 巡礼ストーリー生成アプリ

参拝写真をアップロードすると、Claude が寺社の雰囲気を読み取り、あなたの気分や想いと融合させた叙情的な「巡礼ストーリー」を生成します。

## 機能

- 参拝写真（JPEG / PNG / WebP）から寺社名・天気・時間帯を解析
- 気分・願い事（8種類）と自由記述を組み合わせてストーリーを生成
- 画像生成 AI 向けの英語プロンプトも自動生成
- 和風モダンな UI デザイン

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/taka-mic/gosyuin.git
cd gosyuin
```

### 2. 仮想環境を作成・有効化（推奨）

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
```

### 3. 依存ライブラリをインストール

```bash
pip install -r requirements.txt
```

### 4. API キーを設定

`.env.example` をコピーして `.env` を作成し、Anthropic API キーを設定します。

```bash
cp .env.example .env
# .env を編集して ANTHROPIC_API_KEY を設定
```

> **注意**: `.env` はコミットしないでください（`.gitignore` で除外済み）。

## 起動方法

```bash
streamlit run app.py
```

ブラウザで `http://localhost:8501` が自動的に開きます。

サイドバーに Anthropic API キーを入力してからご利用ください。

## 使い方

1. サイドバーに Anthropic API キーを入力
2. 参拝写真をアップロード
3. 気分・願い事を選択
4. その日の想いを自由に記述（任意）
5. 「縁（えにし）を解析する」ボタンを押す

## 必要環境

- Python 3.10 以上
- Anthropic API キー（[取得はこちら](https://console.anthropic.com/)）

"""
御朱印奇譚 ─ AI コンシェルジュ × 巡礼ストーリー生成アプリ

依存ライブラリのインストール:
    pip install streamlit anthropic Pillow streamlit-folium folium geopy

起動方法:
    streamlit run app.py
"""

import base64
import io

import anthropic
import streamlit as st
from PIL import Image

# ─────────────────────────────────────────────────────────────────────────────
# PAGE CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="御朱印奇譚 ─ AI巡礼ストーリー生成",
    page_icon="⛩️",
    layout="wide",
)

# ─────────────────────────────────────────────────────────────────────────────
# CUSTOM CSS  ─  和風モダン（ベージュ・朱色調）
# ─────────────────────────────────────────────────────────────────────────────
st.markdown(
    """
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700&display=swap');

/* ── グローバル ── */
html, body, [class*="css"], .stApp {
    background-color: #F4EDE0 !important;
    color: #1A1208 !important;
    font-family: 'Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho Pro', serif;
}

/* ── ウィジェット文字色 ── */
.stSelectbox label, .stTextArea label, .stFileUploader label,
.stTextInput label, .stCaption, p, span, div {
    color: #1A1208 !important;
}
.stSelectbox > div > div,
.stTextArea textarea,
.stTextInput input {
    color: #1A1208 !important;
    background-color: #FDF6EC !important;
    border-color: #C8A97E !important;
}
/* セレクトボックスのドロップダウン */
[data-baseweb="select"] span,
[data-baseweb="select"] div {
    color: #1A1208 !important;
}
/* expander */
.streamlit-expanderHeader {
    color: #1A1208 !important;
}
/* caption */
.stCaption p {
    color: #4A2800 !important;
}

/* ── サイドバー：墨色 ── */
section[data-testid="stSidebar"] {
    background-color: #1A1208 !important;
}
section[data-testid="stSidebar"] .stMarkdown,
section[data-testid="stSidebar"] .stMarkdown p,
section[data-testid="stSidebar"] label,
section[data-testid="stSidebar"] small,
section[data-testid="stSidebar"] .stCaption p {
    color: #C8A97E !important;
}
section[data-testid="stSidebar"] hr {
    border-color: #4A3015;
}

/* ── ヒーローヘッダー ── */
.goshuin-hero {
    text-align: center;
    padding: 1.5rem 1rem 1rem;
    border-bottom: 1px solid #B8860B44;
    margin-bottom: 2rem;
}
.goshuin-title-jp {
    font-size: 2.8rem;
    color: #1A1208;
    letter-spacing: 0.8rem;
    font-weight: 700;
}
.goshuin-subtitle {
    font-size: 0.88rem;
    color: #4A2800;
    letter-spacing: 0.35rem;
    margin-top: 0.5rem;
}
.goshuin-torii {
    font-size: 1.3rem;
    color: #8B1A1A;
    letter-spacing: 0.6rem;
    margin-top: 0.8rem;
}

/* ── セクション見出し ── */
.section-label {
    font-size: 0.80rem;
    color: #8B1A1A;
    letter-spacing: 0.3rem;
    font-weight: 700;
    border-left: 3px solid #8B1A1A;
    padding-left: 0.6rem;
    margin: 0.8rem 0 0.4rem;
}

/* ── ストーリー表示カード ── */
.story-card {
    background: linear-gradient(160deg, #FFFBF0 0%, #F5E8CC 100%);
    border: 1px solid #C8A97E;
    border-top: 3px solid #8B1A1A;
    border-radius: 2px;
    padding: 1.2rem 1.5rem;
    line-height: 1.8;
    font-size: 1.0rem;
    color: #1A1208;
    box-shadow: 0 4px 20px rgba(26,18,8,0.09);
    min-height: 180px;
    white-space: pre-wrap;
}
.story-placeholder {
    opacity: 0.45;
    text-align: center;
    padding-top: 2.5rem;
    color: #7A5C3A;
    letter-spacing: 0.2rem;
    line-height: 2.2;
}

/* ── 画像プロンプトカード ── */
.img-prompt-card {
    background-color: #1A1208;
    border: 1px solid #4A3015;
    border-radius: 2px;
    padding: 1.4rem 1.8rem;
    margin-top: 1.2rem;
    font-family: 'Courier New', 'Lucida Console', monospace;
    font-size: 0.83rem;
    color: #C8A97E;
    line-height: 1.9;
}
.img-prompt-label {
    font-size: 0.72rem;
    color: #8B6020;
    letter-spacing: 0.25rem;
    margin-bottom: 0.4rem;
    font-family: 'Noto Serif JP', serif;
}

/* ── 朱色ボタン ── */
.stButton > button {
    background-color: #8B1A1A !important;
    color: #FFF8E7 !important;
    border: none !important;
    border-radius: 1px !important;
    padding: 0.65rem 1.5rem !important;
    font-family: 'Noto Serif JP', serif !important;
    letter-spacing: 0.45rem !important;
    font-size: 0.95rem !important;
    width: 100% !important;
}
.stButton > button:hover {
    background-color: #6B1010 !important;
}

/* ── 区切り文様 ── */
.mon-divider {
    text-align: center;
    color: #8B1A1A;
    letter-spacing: 0.8rem;
    margin: 1rem 0;
    font-size: 1.0rem;
}

/* ── フッター ── */
.goshuin-footer {
    text-align: center;
    color: #4A2800;
    letter-spacing: 0.25rem;
    font-size: 0.73rem;
    padding: 1.5rem 0;
    border-top: 1px solid #C8A97E44;
    margin-top: 2.5rem;
}
</style>
""",
    unsafe_allow_html=True,
)

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTS
# ─────────────────────────────────────────────────────────────────────────────
MODEL_ID = "claude-sonnet-4-6"

SYSTEM_PROMPT = """あなたは日本の伝統文化・寺社仏閣に極めて造詣が深いAIコンシェルジュです。
ユーザーから送られた写真を詳細に解析し、以下の形式で必ず出力してください。

【解析結果】
寺社名：（できる限り正確な名称。建物・扁額・石碑・特徴的な建築様式・雰囲気から推定。不明な場合は「不明」）
所在地：（都道府県・市区町村レベルまで。例：京都府京都市東山区）
天気：（晴れ/曇り/雨/雪 など）
時間帯：（朝/昼/夕/夜）

【巡礼ストーリー】
（上記解析結果とユーザーの気分・フリーテキストを融合させた、200〜300文字の叙情的な短編ストーリー）

**Image Prompt**
（この情景を表す画像生成AI用の英語プロンプト）"""

MOOD_OPTIONS = [
    "🌿 心を落ち着かせたい（静寂・平和）",
    "🔥 新たな挑戦・決意（前進・希望）",
    "🌸 感謝を伝えたい（祈り・縁）",
    "🎋 縁結び・繋がり（絆・愛）",
    "⚡ 厄除け・守護（力・加護）",
    "🌊 無病息災・健康祈願（生命力）",
    "🗺️ 旅の安全・道中加護（旅立ち）",
    "📚 学業成就・知恵（向学心）",
]

MIME_MAP = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "webp": "image/webp",
}

# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def encode_image(file) -> tuple[str, str]:
    """Return (base64_data, media_type) from a Streamlit UploadedFile.
    Resizes/compresses the image to stay within Claude's 5 MB limit."""
    MAX_BYTES = 4 * 1024 * 1024  # 4 MB で余裕を持たせる

    img = Image.open(file)
    # RGBA → RGB 変換（JPEG 保存のため）
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    quality = 85
    while True:
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=quality)
        if buf.tell() <= MAX_BYTES or quality <= 30:
            break
        quality -= 10

    buf.seek(0)
    data = base64.standard_b64encode(buf.read()).decode("utf-8")
    return data, "image/jpeg"


def call_claude(
    api_key: str,
    image_b64: str,
    media_type: str,
    mood: str,
    note: str,
) -> str:
    """Send image + user context to Claude and return the generated text."""
    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model=MODEL_ID,
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": (
                            f"【気分・願い事】{mood}\n\n"
                            f"【フリーテキスト】{note.strip() or '（特になし）'}"
                        ),
                    },
                ],
            }
        ],
    )
    return response.content[0].text


def split_story_and_prompt(text: str) -> tuple[str, str]:
    """Split Claude output into story body and image prompt section."""
    lower = text.lower()
    markers = [
        "image prompt",
        "**image prompt**",
        "【image prompt】",
        "＊image prompt",
        "▼image prompt",
    ]
    for marker in markers:
        idx = lower.find(marker)
        if idx != -1:
            story_part = text[:idx].strip()
            prompt_lines = text[idx:].splitlines()
            # Drop the marker line itself and return the rest
            prompt_body = "\n".join(prompt_lines[1:]).strip()
            return story_part, prompt_body
    return text, ""


def parse_location(text: str) -> tuple[str, str]:
    """Extract shrine name and location from Claude output."""
    shrine = ""
    location = ""
    for line in text.splitlines():
        if line.startswith("寺社名：") or line.startswith("寺社名:"):
            shrine = line.split("：", 1)[-1].split(":", 1)[-1].strip()
        elif line.startswith("所在地：") or line.startswith("所在地:"):
            location = line.split("：", 1)[-1].split(":", 1)[-1].strip()
    return shrine, location


def show_map(shrine: str, location: str):
    from geopy.geocoders import Nominatim
    import folium
    from streamlit_folium import st_folium

    query = f"{shrine} {location}".strip()
    if not query or query == "不明":
        return

    geolocator = Nominatim(user_agent="gosyuin_app")
    try:
        geo = geolocator.geocode(query + " 日本", language="ja", timeout=5)
        if geo is None:
            geo = geolocator.geocode(location + " 日本", language="ja", timeout=5)
        if geo:
            m = folium.Map(location=[geo.latitude, geo.longitude], zoom_start=15)
            folium.Marker(
                [geo.latitude, geo.longitude],
                popup=shrine or location,
                icon=folium.Icon(color="red", icon="info-sign"),
            ).add_to(m)
            st_folium(m, width=None, height=300)
    except Exception:
        pass


# ─────────────────────────────────────────────────────────────────────────────
# SIDEBAR
# ─────────────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### ⛩️ 御朱印奇譚")
    st.markdown("---")

    api_key: str = st.text_input(
        "Anthropic API Key",
        type="password",
        placeholder="sk-ant-...",
        help="Anthropic の API キーを入力してください。",
    )

    st.markdown("---")
    st.markdown(
        """
**使い方**

① API キーを入力する
② 参拝写真をアップロードする
③ 気分・願い事を選択する
④ その日の想いを自由に記す
⑤「縁を解析する」を押す
"""
    )
    st.markdown("---")
    st.caption(f"Model: `{MODEL_ID}`")
    st.caption("Powered by Anthropic Claude")

    if st.session_state.get("history"):
        st.markdown("---")
        st.markdown("**📜 履歴**")
        for i, h in enumerate(st.session_state.history):
            label = h["shrine"] or "（不明）"
            with st.expander(f"{i+1}. {label}"):
                st.caption(h["mood"])
                st.write(h["story"])

# ─────────────────────────────────────────────────────────────────────────────
# HERO HEADER
# ─────────────────────────────────────────────────────────────────────────────
st.markdown(
    """
<div class="goshuin-hero">
    <div class="goshuin-title-jp">御 朱 印 奇 譚</div>
    <div class="goshuin-subtitle">AI コンシェルジュ × 巡礼ストーリー生成</div>
    <div class="goshuin-torii">⛩ &nbsp;⛩ &nbsp;⛩</div>
</div>
""",
    unsafe_allow_html=True,
)

# ─────────────────────────────────────────────────────────────────────────────
# MAIN LAYOUT  ─  左：入力 ／ 右：出力
# ─────────────────────────────────────────────────────────────────────────────
left_col, right_col = st.columns([1, 1], gap="large")

# ── 左カラム：入力パネル ──────────────────────────────────────────────────────
with left_col:

    st.markdown('<div class="section-label">参拝写真をアップロード</div>', unsafe_allow_html=True)
    uploaded = st.file_uploader(
        "写真を選択",
        type=["jpg", "jpeg", "png", "webp"],
        label_visibility="collapsed",
        help="JPEG / PNG / WebP に対応しています。",
    )
    if uploaded is not None:
        st.image(uploaded, use_container_width=True)

    st.markdown('<div class="section-label">気分・願い事を選択</div>', unsafe_allow_html=True)
    mood: str = st.selectbox(
        "気分",
        options=MOOD_OPTIONS,
        label_visibility="collapsed",
    )

    st.markdown('<div class="section-label">その日の想いを綴る</div>', unsafe_allow_html=True)
    note: str = st.text_area(
        "自由記述",
        placeholder="例：風が気持ちよかった　／　石段が長く少し疲れた　／　静かで心が洗われた…",
        height=110,
        label_visibility="collapsed",
    )

    st.markdown("<br>", unsafe_allow_html=True)
    run_btn: bool = st.button("✦ 縁（えにし）を解析する ✦", use_container_width=True)

# ── 右カラム：出力パネル ──────────────────────────────────────────────────────
with right_col:

    st.markdown('<div class="section-label">生成された巡礼ストーリー</div>', unsafe_allow_html=True)

    if run_btn:
        if not api_key:
            st.error("⚠️ サイドバーに Anthropic API キーを入力してください。")
        elif uploaded is None:
            st.error("⚠️ 参拝写真をアップロードしてください。")
        else:
            with st.spinner("✦ 写真を紐解き、神仏との縁（えにし）を解析中… ✦"):
                try:
                    uploaded.seek(0)
                    b64, mime = encode_image(uploaded)
                    raw_text = call_claude(api_key, b64, mime, mood, note)
                    story, img_prompt = split_story_and_prompt(raw_text)

                    # ── ストーリー表示 ──
                    st.markdown(
                        f'<div class="story-card">{story}</div>',
                        unsafe_allow_html=True,
                    )

                    # ── 画像プロンプト表示 ──
                    if img_prompt:
                        st.markdown(
                            '<div class="mon-divider">✦ &nbsp; ✦ &nbsp; ✦</div>',
                            unsafe_allow_html=True,
                        )
                        st.markdown(
                            f"""<div class="img-prompt-card">
                            <div class="img-prompt-label">
                                ✦ IMAGE PROMPT FOR AI ART GENERATION ✦
                            </div>
                            {img_prompt}
                            </div>""",
                            unsafe_allow_html=True,
                        )

                    # ── 地図表示 ──
                    shrine_name, shrine_loc = parse_location(raw_text)
                    if shrine_name or shrine_loc:
                        st.markdown('<div class="section-label">場所</div>', unsafe_allow_html=True)
                        st.caption(f"⛩ {shrine_name}　📍 {shrine_loc}")
                        show_map(shrine_name, shrine_loc)

                    # ── 履歴保存 ──
                    if "history" not in st.session_state:
                        st.session_state.history = []
                    st.session_state.history.insert(0, {
                        "shrine": shrine_name,
                        "location": shrine_loc,
                        "story": story,
                        "mood": mood,
                    })
                    if len(st.session_state.history) > 10:
                        st.session_state.history = st.session_state.history[:10]

                    # ── 全文表示（折りたたみ） ──
                    with st.expander("📜 生成テキスト全文を表示"):
                        st.code(raw_text, language=None)

                except anthropic.AuthenticationError:
                    st.error(
                        "❌ API キーが無効です。正しい Anthropic API キーを入力してください。"
                    )
                except anthropic.RateLimitError:
                    st.error(
                        "❌ リクエスト制限に達しました。しばらく時間をおいてからお試しください。"
                    )
                except anthropic.BadRequestError as exc:
                    st.error(f"❌ リクエストエラー：{exc}")
                except Exception as exc:
                    st.error(f"❌ エラーが発生しました：{exc}")

    else:
        # プレースホルダー
        st.markdown(
            """<div class="story-card">
            <div class="story-placeholder">
                ⛩<br><br>
                写真をアップロードし、<br>
                気分・願い事を選択して<br>
                「縁を解析する」を押してください。<br><br>
                あなただけの巡礼ストーリーが紡がれます。
            </div>
            </div>""",
            unsafe_allow_html=True,
        )

# ─────────────────────────────────────────────────────────────────────────────
# FOOTER
# ─────────────────────────────────────────────────────────────────────────────
st.markdown(
    '<div class="goshuin-footer">'
    "御朱印奇譚 ─ AI と紡ぐ巡礼の記憶 ─ Powered by Anthropic Claude"
    "</div>",
    unsafe_allow_html=True,
)

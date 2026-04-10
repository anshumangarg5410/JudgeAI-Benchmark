import streamlit as st
import pandas as pd
import numpy as np
import time
import random
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime

# ── Page Config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="AI Regression Testing",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Global CSS ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

/* ── Reset & Base ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, [data-testid="stAppViewContainer"] {
    font-family: 'DM Sans', sans-serif;
    background: #0a0d14;
    color: #e2e8f0;
}

[data-testid="stAppViewContainer"] { background: #0a0d14; }
[data-testid="stSidebar"] { background: #0d1117 !important; border-right: 1px solid #1e2433; }
[data-testid="stSidebar"] > div:first-child { padding-top: 1.5rem; }

.block-container { padding: 2rem 2.5rem 4rem; max-width: 1400px; margin: 0 auto; }

/* ── Hide Streamlit chrome ── */
#MainMenu, footer, header { visibility: hidden; }
[data-testid="stDecoration"] { display: none; }

/* ── Animated header gradient ── */
@keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* ── Hero banner ── */
.hero-banner {
    background: linear-gradient(135deg, #0f1923 0%, #111827 40%, #0e1c2e 100%);
    border: 1px solid #1e2d42;
    border-radius: 16px;
    padding: 2.8rem 3rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
}
.hero-banner::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%);
    border-radius: 50%;
}
.hero-banner::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 40%;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
    border-radius: 50%;
}
.hero-title {
    font-size: 2.15rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #f0f6ff 30%, #38bdf8 70%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
    margin-bottom: 0.6rem;
}
.hero-sub {
    font-size: 0.97rem;
    color: #64748b;
    font-weight: 400;
    letter-spacing: 0.01em;
}
.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(56,189,248,0.1);
    border: 1px solid rgba(56,189,248,0.25);
    color: #38bdf8;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    margin-bottom: 1.2rem;
}

/* ── Card ── */
.card {
    background: #0d1117;
    border: 1px solid #1e2433;
    border-radius: 12px;
    padding: 1.6rem 1.8rem;
    margin-bottom: 1.25rem;
    transition: border-color 0.2s ease;
}
.card:hover { border-color: #2a3549; }
.card-title {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #475569;
    margin-bottom: 1.1rem;
    display: flex;
    align-items: center;
    gap: 8px;
}
.card-title .dot {
    width: 6px; height: 6px;
    background: #38bdf8;
    border-radius: 50%;
    display: inline-block;
}

/* ── Metric cards ── */
.metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.metric-card {
    background: #0d1117;
    border: 1px solid #1e2433;
    border-radius: 12px;
    padding: 1.4rem 1.6rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease, border-color 0.2s ease;
}
.metric-card:hover { transform: translateY(-2px); border-color: #2a3549; }
.metric-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent, #38bdf8);
    border-radius: 12px 12px 0 0;
}
.metric-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #475569;
    margin-bottom: 0.65rem;
}
.metric-value {
    font-size: 2.1rem;
    font-weight: 700;
    letter-spacing: -0.04em;
    color: #f0f6ff;
    font-family: 'DM Mono', monospace;
    line-height: 1;
    margin-bottom: 0.5rem;
}
.metric-delta {
    font-size: 0.78rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
}
.delta-up   { color: #34d399; }
.delta-down { color: #f87171; }
.delta-neutral { color: #64748b; }

/* ── Regression warning pill ── */
.regression-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 100px;
    letter-spacing: 0.04em;
}
.tag-red    { background: rgba(248,113,113,0.12); border: 1px solid rgba(248,113,113,0.3); color: #f87171; }
.tag-yellow { background: rgba(251,191,36,0.12);  border: 1px solid rgba(251,191,36,0.3);  color: #fbbf24; }
.tag-green  { background: rgba(52,211,153,0.12);  border: 1px solid rgba(52,211,153,0.3);  color: #34d399; }
.tag-blue   { background: rgba(56,189,248,0.12);  border: 1px solid rgba(56,189,248,0.25); color: #38bdf8; }

/* ── Run button ── */
.stButton > button {
    background: linear-gradient(135deg, #1d6fa4 0%, #2563eb 100%) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 0.65rem 2rem !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.02em !important;
    cursor: pointer !important;
    transition: opacity 0.2s ease, transform 0.15s ease !important;
    box-shadow: 0 4px 16px rgba(37,99,235,0.35) !important;
}
.stButton > button:hover {
    opacity: 0.9 !important;
    transform: translateY(-1px) !important;
}

/* ── Inputs ── */
[data-testid="stSelectbox"] > div > div,
[data-testid="stMultiSelect"] > div > div,
[data-testid="stTextArea"] textarea,
[data-testid="stFileUploader"] > div {
    background: #111827 !important;
    border: 1px solid #1e2d3d !important;
    border-radius: 8px !important;
    color: #e2e8f0 !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.88rem !important;
}
label, [data-testid="stWidgetLabel"] p {
    font-size: 0.78rem !important;
    font-weight: 500 !important;
    letter-spacing: 0.04em !important;
    color: #64748b !important;
    text-transform: uppercase !important;
}

/* ── Tabs ── */
[data-testid="stTabs"] > div:first-child {
    border-bottom: 1px solid #1e2433 !important;
    gap: 0.25rem !important;
}
button[data-baseweb="tab"] {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.83rem !important;
    font-weight: 500 !important;
    color: #475569 !important;
    padding: 0.6rem 1.1rem !important;
    border-radius: 6px 6px 0 0 !important;
    background: transparent !important;
}
button[data-baseweb="tab"][aria-selected="true"] {
    color: #38bdf8 !important;
    background: rgba(56,189,248,0.07) !important;
    border-bottom: 2px solid #38bdf8 !important;
}

/* ── Expander ── */
[data-testid="stExpander"] > details > summary {
    background: #0d1117 !important;
    border: 1px solid #1e2433 !important;
    border-radius: 8px !important;
    padding: 0.7rem 1rem !important;
    font-size: 0.83rem !important;
    font-weight: 500 !important;
    color: #94a3b8 !important;
}
[data-testid="stExpander"] > details[open] > summary { border-radius: 8px 8px 0 0 !important; }
[data-testid="stExpander"] > details > div {
    background: #0d1117 !important;
    border: 1px solid #1e2433 !important;
    border-top: none !important;
    border-radius: 0 0 8px 8px !important;
    padding: 1rem !important;
}

/* ── Dataframe ── */
[data-testid="stDataFrame"] > div { border-radius: 10px !important; overflow: hidden !important; }

/* ── Sidebar items ── */
[data-testid="stSidebar"] label,
[data-testid="stSidebar"] [data-testid="stWidgetLabel"] p {
    color: #475569 !important;
}
.sidebar-logo {
    font-size: 1.05rem;
    font-weight: 700;
    color: #f0f6ff;
    letter-spacing: -0.02em;
    padding: 0.5rem 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #1e2433;
    margin-bottom: 1.5rem;
}
.sidebar-section {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #334155;
    padding: 0 1rem;
    margin: 1.2rem 0 0.5rem;
}

/* ── Divider ── */
.divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #1e2433, transparent);
    margin: 1.5rem 0;
}

/* ── Status bar ── */
.status-bar {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: #0d1117;
    border: 1px solid #1e2433;
    border-radius: 8px;
    padding: 0.75rem 1.25rem;
    margin-bottom: 1.5rem;
    font-size: 0.78rem;
    color: #475569;
}
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; display: inline-block; margin-right: 5px;
    box-shadow: 0 0 6px #34d399; }

/* ── Insight cards ── */
.insight-card {
    border-radius: 10px;
    padding: 1rem 1.25rem;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    font-size: 0.85rem;
    font-weight: 400;
    line-height: 1.5;
}
.insight-warn  { background: rgba(251,191,36,0.07);  border: 1px solid rgba(251,191,36,0.22);  color: #fde68a; }
.insight-error { background: rgba(248,113,113,0.07); border: 1px solid rgba(248,113,113,0.22); color: #fca5a5; }
.insight-ok    { background: rgba(52,211,153,0.07);  border: 1px solid rgba(52,211,153,0.22);  color: #6ee7b7; }
.insight-info  { background: rgba(56,189,248,0.07);  border: 1px solid rgba(56,189,248,0.22);  color: #7dd3fc; }
.insight-icon  { font-size: 1.05rem; margin-top: 1px; flex-shrink: 0; }
</style>
""", unsafe_allow_html=True)


# ── Data helpers ──────────────────────────────────────────────────────────────
MODELS_BASE = ["GPT-4o", "Claude 3.5 Sonnet", "Llama 3.1 70B", "Mistral Large", "Gemini 1.5 Pro"]
MODELS_FT   = ["GPT-4o-ft-v2.1", "Claude-3.5-ft-math", "Llama-3-ft-code", "Mistral-ft-reason", "Gemini-ft-general"]
CATEGORIES  = ["Math", "Coding", "Reasoning", "General"]

SAMPLE_PROMPTS = {
    "Math":      "Solve: If a train travels at 120 km/h and the journey is 450 km, how long does it take?",
    "Coding":    "Write a Python function to detect cycles in a linked list using Floyd's algorithm.",
    "Reasoning": "All roses are flowers. Some flowers fade quickly. Can we conclude some roses fade quickly?",
    "General":   "Explain the concept of entropy in thermodynamics in simple terms.",
}

def make_results(base_model: str, ft_model: str, categories: list) -> pd.DataFrame:
    rng = np.random.default_rng(42)
    rows = []
    for cat in categories:
        n = rng.integers(8, 16)
        for i in range(n):
            base_acc  = round(rng.uniform(0.72, 0.96), 4)
            delta     = rng.uniform(-0.18, 0.12)
            ft_acc    = round(max(0, min(1, base_acc + delta)), 4)
            base_lat  = round(rng.uniform(0.8, 3.2), 2)
            ft_lat    = round(rng.uniform(0.7, 3.0), 2)
            base_err  = rng.integers(0, 3)
            ft_err    = rng.integers(0, 3)
            rows.append({
                "Category":    cat,
                "Test #":      f"{cat[:3].upper()}-{i+1:03d}",
                "Prompt":      SAMPLE_PROMPTS.get(cat, "Sample prompt")[:55] + "…",
                f"{base_model} Acc":  base_acc,
                f"{ft_model} Acc":    ft_acc,
                "Δ Accuracy":  round(ft_acc - base_acc, 4),
                f"{base_model} Lat (s)": base_lat,
                f"{ft_model} Lat (s)":   ft_lat,
                f"{base_model} Errors": base_err,
                f"{ft_model} Errors":   ft_err,
            })
    return pd.DataFrame(rows)

def category_summary(df: pd.DataFrame, base: str, ft: str) -> pd.DataFrame:
    return (
        df.groupby("Category")
        .agg(
            Base_Acc    = (f"{base} Acc", "mean"),
            FT_Acc      = (f"{ft} Acc",   "mean"),
            Base_Lat    = (f"{base} Lat (s)", "mean"),
            FT_Lat      = (f"{ft} Lat (s)",   "mean"),
            Base_Errors = (f"{base} Errors",  "sum"),
            FT_Errors   = (f"{ft} Errors",    "sum"),
            Tests       = ("Test #", "count"),
        )
        .round(4)
        .reset_index()
    )

def make_bar_chart(summary: pd.DataFrame, base: str, ft: str) -> go.Figure:
    cats   = summary["Category"].tolist()
    b_vals = summary["Base_Acc"].tolist()
    f_vals = summary["FT_Acc"].tolist()
    colors = []
    for b, f in zip(b_vals, f_vals):
        colors.append("#f87171" if (f - b) < -0.03 else "#fbbf24" if (f - b) < 0 else "#34d399")

    fig = go.Figure()
    fig.add_trace(go.Bar(
        name=base, x=cats, y=b_vals,
        marker_color="#38bdf8",
        marker_line_width=0,
        opacity=0.85,
    ))
    fig.add_trace(go.Bar(
        name=ft, x=cats, y=f_vals,
        marker_color=colors,
        marker_line_width=0,
        opacity=0.9,
    ))
    fig.update_layout(
        barmode="group",
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        font=dict(family="DM Sans", color="#94a3b8", size=12),
        legend=dict(
            orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1,
            bgcolor="rgba(0,0,0,0)", borderwidth=0,
        ),
        margin=dict(l=0, r=0, t=40, b=0),
        xaxis=dict(showgrid=False, zeroline=False, tickfont=dict(size=11)),
        yaxis=dict(
            showgrid=True, gridcolor="#1e2433", zeroline=False,
            tickformat=".0%", range=[0, 1.05],
        ),
        bargap=0.25, bargroupgap=0.08,
        height=320,
    )
    return fig

def make_latency_chart(summary: pd.DataFrame, base: str, ft: str) -> go.Figure:
    fig = go.Figure()
    fig.add_trace(go.Bar(
        name=base, x=summary["Category"], y=summary["Base_Lat"],
        marker_color="#818cf8", marker_line_width=0, opacity=0.85,
    ))
    fig.add_trace(go.Bar(
        name=ft,   x=summary["Category"], y=summary["FT_Lat"],
        marker_color="#c084fc", marker_line_width=0, opacity=0.9,
    ))
    fig.update_layout(
        barmode="group",
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        font=dict(family="DM Sans", color="#94a3b8", size=12),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1,
                    bgcolor="rgba(0,0,0,0)", borderwidth=0),
        margin=dict(l=0, r=0, t=40, b=0),
        xaxis=dict(showgrid=False, zeroline=False, tickfont=dict(size=11)),
        yaxis=dict(showgrid=True, gridcolor="#1e2433", zeroline=False,
                   ticksuffix=" s"),
        bargap=0.25, bargroupgap=0.08,
        height=300,
    )
    return fig

def make_radar(summary: pd.DataFrame, base: str, ft: str) -> go.Figure:
    cats = summary["Category"].tolist() + [summary["Category"].iloc[0]]
    b    = summary["Base_Acc"].tolist() + [summary["Base_Acc"].iloc[0]]
    f    = summary["FT_Acc"].tolist()   + [summary["FT_Acc"].iloc[0]]
    fig  = go.Figure()
    fig.add_trace(go.Scatterpolar(r=b, theta=cats, fill="toself", name=base,
                                  line_color="#38bdf8", fillcolor="rgba(56,189,248,0.12)"))
    fig.add_trace(go.Scatterpolar(r=f, theta=cats, fill="toself", name=ft,
                                  line_color="#a78bfa", fillcolor="rgba(167,139,250,0.12)"))
    fig.update_layout(
        polar=dict(
            bgcolor="rgba(0,0,0,0)",
            radialaxis=dict(visible=True, range=[0, 1], gridcolor="#1e2433",
                            tickformat=".0%", tickfont=dict(size=10, color="#475569")),
            angularaxis=dict(gridcolor="#1e2433", tickfont=dict(size=11, color="#94a3b8")),
        ),
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        font=dict(family="DM Sans", color="#94a3b8", size=12),
        legend=dict(orientation="h", yanchor="bottom", y=-0.15, xanchor="center", x=0.5,
                    bgcolor="rgba(0,0,0,0)", borderwidth=0),
        margin=dict(l=30, r=30, t=30, b=30),
        height=310,
    )
    return fig

def color_delta(val: float) -> str:
    if val < -0.03: return "color: #f87171; font-weight:600;"
    if val < 0:     return "color: #fbbf24; font-weight:600;"
    return "color: #34d399; font-weight:600;"

def fmt_acc(val: float) -> str: return f"{val:.1%}"
def fmt_delta(val: float) -> str: return f"{'▲' if val>=0 else '▼'} {abs(val):.1%}"


# ── Sidebar ───────────────────────────────────────────────────────────────────
def render_sidebar() -> dict:
    with st.sidebar:
        st.markdown("""
        <div class='sidebar-logo'>
            <span>⚡</span> ModelProbe
        </div>""", unsafe_allow_html=True)

        st.markdown("<div class='sidebar-section'>Navigation</div>", unsafe_allow_html=True)
        page = st.radio("", ["🏠  Dashboard", "📋  Run Tests", "📊  History", "⚙️  Settings"],
                        label_visibility="collapsed")

        st.markdown("<div class='sidebar-section'>Quick Stats</div>", unsafe_allow_html=True)
        s1, s2 = st.columns(2)
        s1.metric("Runs Today", "12", "+3")
        s2.metric("Avg Score", "87.4%", "-1.2%")

        st.markdown("<div class='sidebar-section'>Environment</div>", unsafe_allow_html=True)
        env = st.selectbox("", ["Production", "Staging", "Development"], label_visibility="collapsed")

        st.markdown("""<div style='padding: 1rem; margin-top: 2rem;
            background: rgba(56,189,248,0.06); border: 1px solid rgba(56,189,248,0.15);
            border-radius: 8px; font-size: 0.78rem; color: #64748b; line-height: 1.6;'>
            <strong style='color:#38bdf8;'>Tip</strong><br>
            Upload a CSV with <code style='color:#94a3b8'>prompt,category</code> columns
            for bulk evaluation across both models.
        </div>""", unsafe_allow_html=True)

    return {"page": page, "env": env}


# ── Hero ──────────────────────────────────────────────────────────────────────
def render_hero():
    now = datetime.now().strftime("%b %d, %Y  %H:%M")
    st.markdown(f"""
    <div class='hero-banner'>
        <div class='hero-badge'>⚡ Regression Suite v2.4</div>
        <div class='hero-title'>AI Model Regression Testing</div>
        <div class='hero-sub'>
            Compare performance across base and fine-tuned models — track accuracy,
            latency, and regression signals in real time.
            &nbsp;&nbsp;·&nbsp;&nbsp;
            <span style='color:#334155; font-size:0.82rem; font-family: DM Mono, monospace;'>
                {now}
            </span>
        </div>
    </div>
    """, unsafe_allow_html=True)


# ── Config panel ──────────────────────────────────────────────────────────────
def render_config() -> dict:
    st.markdown("""<div class='card'>
        <div class='card-title'><span class='dot'></span> Test Configuration</div>
    </div>""", unsafe_allow_html=True)

    c1, c2, c3 = st.columns([1, 1, 1.4])
    with c1:
        base = st.selectbox("Base Model", MODELS_BASE, key="base_model")
    with c2:
        ft   = st.selectbox("Fine-tuned Model", MODELS_FT, key="ft_model")
    with c3:
        cats = st.multiselect("Test Categories", CATEGORIES, default=CATEGORIES, key="categories")

    st.markdown("<div class='divider'></div>", unsafe_allow_html=True)

    ca, cb, cc = st.columns([2, 1, 1])
    with ca:
        prompt = st.text_area("Custom Prompt (optional)",
                              placeholder="Enter a prompt to evaluate, or leave blank to use the built-in test suite…",
                              height=100, key="custom_prompt")
    with cb:
        uploaded = st.file_uploader("Bulk CSV Upload", type=["csv"], key="csv_upload",
                                    help="CSV with columns: prompt, category")
    with cc:
        st.markdown("<div style='height:28px'></div>", unsafe_allow_html=True)
        mode     = st.selectbox("Run Mode", ["Standard", "Fast", "Deep Eval"], key="run_mode")
        n_runs   = st.slider("Repetitions", 1, 5, 1, key="n_runs")

    return dict(base=base, ft=ft, cats=cats, prompt=prompt, uploaded=uploaded,
                mode=mode, n_runs=n_runs)


# ── Action bar ────────────────────────────────────────────────────────────────
def render_action_bar(cfg: dict) -> bool:
    col_btn, col_info, col_spacer = st.columns([1, 3, 2])
    with col_btn:
        run = st.button("⚡  Run Tests", use_container_width=True, key="run_btn")
    with col_info:
        cats_str = ", ".join(cfg["cats"]) if cfg["cats"] else "—"
        st.markdown(f"""
        <div style='display:flex; align-items:center; gap:1.5rem; padding-top:0.55rem;
                    font-size:0.8rem; color:#475569;'>
            <span><span style='color:#94a3b8; font-weight:600;'>Base</span>&nbsp; {cfg["base"]}</span>
            <span style='color:#1e2433'>│</span>
            <span><span style='color:#94a3b8; font-weight:600;'>FT</span>&nbsp; {cfg["ft"]}</span>
            <span style='color:#1e2433'>│</span>
            <span><span style='color:#94a3b8; font-weight:600;'>Categories</span>&nbsp; {cats_str}</span>
            <span style='color:#1e2433'>│</span>
            <span><span style='color:#94a3b8; font-weight:600;'>Mode</span>&nbsp; {cfg["mode"]}</span>
        </div>""", unsafe_allow_html=True)
    return run


# ── Metrics row ───────────────────────────────────────────────────────────────
def render_metrics(df: pd.DataFrame, base: str, ft: str):
    b_acc  = df[f"{base} Acc"].mean()
    f_acc  = df[f"{ft} Acc"].mean()
    d_acc  = f_acc - b_acc

    b_lat  = df[f"{base} Lat (s)"].mean()
    f_lat  = df[f"{ft} Lat (s)"].mean()
    d_lat  = f_lat - b_lat

    b_err  = df[f"{base} Errors"].sum()
    f_err  = df[f"{ft} Errors"].sum()

    regressions = int((df["Δ Accuracy"] < -0.03).sum())
    total       = len(df)

    def card(label, value, delta_val, delta_label, accent, fmt_v=lambda x: x):
        d_cls = "delta-down" if delta_val < 0 else "delta-up"
        arrow = "▼" if delta_val < 0 else "▲"
        return f"""
        <div class='metric-card' style='--accent:{accent};'>
            <div class='metric-label'>{label}</div>
            <div class='metric-value'>{fmt_v(value)}</div>
            <div class='metric-delta {d_cls}'>{arrow} {delta_label}</div>
        </div>"""

    acc_dl  = f"{abs(d_acc):.1%} {'regression' if d_acc<0 else 'improvement'}"
    lat_dl  = f"{abs(d_lat):.2f}s {'slower' if d_lat>0 else 'faster'}"
    err_dl  = f"{abs(f_err-b_err)} {'more' if f_err>b_err else 'fewer'} errors"

    html = f"""
    <div class='metric-grid'>
        {card("Fine-tuned Accuracy", f_acc, d_acc, acc_dl, '#38bdf8', lambda x: f'{x:.1%}')}
        {card("Avg Latency (FT)", f_lat, -d_lat, lat_dl, '#a78bfa', lambda x: f'{x:.2f}s')}
        <div class='metric-card' style='--accent:#f87171;'>
            <div class='metric-label'>Regressions Detected</div>
            <div class='metric-value' style='color:#f87171;'>{regressions}</div>
            <div class='metric-delta delta-down'>out of {total} tests</div>
        </div>
        <div class='metric-card' style='--accent:#34d399;'>
            <div class='metric-label'>Error Delta</div>
            <div class='metric-value' style='color:{"#f87171" if f_err>b_err else "#34d399"};'>{f_err - b_err:+d}</div>
            <div class='metric-delta {"delta-down" if f_err>b_err else "delta-up"}'>{err_dl}</div>
        </div>
    </div>"""
    st.markdown(html, unsafe_allow_html=True)


# ── Results tabs ──────────────────────────────────────────────────────────────
def render_results(df: pd.DataFrame, summary: pd.DataFrame, base: str, ft: str):
    t1, t2, t3 = st.tabs(["📊  Accuracy", "⏱  Latency", "🎯  Radar"])

    with t1:
        st.plotly_chart(make_bar_chart(summary, base, ft),
                        use_container_width=True, config={"displayModeBar": False})

    with t2:
        st.plotly_chart(make_latency_chart(summary, base, ft),
                        use_container_width=True, config={"displayModeBar": False})

    with t3:
        st.plotly_chart(make_radar(summary, base, ft),
                        use_container_width=True, config={"displayModeBar": False})


# ── Detailed table ────────────────────────────────────────────────────────────
def render_table(df: pd.DataFrame, base: str, ft: str):
    with st.expander("🔍  Full Test Results", expanded=False):
        display = df[["Category", "Test #", "Prompt",
                       f"{base} Acc", f"{ft} Acc", "Δ Accuracy",
                       f"{base} Lat (s)", f"{ft} Lat (s)"]].copy()
        styled = (
            display.style
            .format({
                f"{base} Acc": fmt_acc,
                f"{ft} Acc":   fmt_acc,
                "Δ Accuracy":  fmt_delta,
                f"{base} Lat (s)": "{:.2f}s",
                f"{ft} Lat (s)":   "{:.2f}s",
            })
            .applymap(lambda v: color_delta(v), subset=["Δ Accuracy"])
            .set_properties(**{
                "background-color": "#0d1117",
                "color":            "#e2e8f0",
                "border":           "1px solid #1e2433",
                "font-size":        "0.82rem",
                "font-family":      "DM Sans, sans-serif",
            })
            .set_table_styles([{
                "selector": "thead th",
                "props": [("background-color","#111827"),("color","#475569"),
                          ("font-size","0.7rem"),("letter-spacing","0.06em"),
                          ("text-transform","uppercase"),("border-bottom","2px solid #1e2433")],
            }])
        )
        st.dataframe(styled, use_container_width=True, height=360)


# ── Category summary table ────────────────────────────────────────────────────
def render_summary_table(summary: pd.DataFrame, base: str, ft: str):
    with st.expander("📋  Category Summary", expanded=True):
        disp = summary.copy()
        disp["Δ Acc"] = disp["FT_Acc"] - disp["Base_Acc"]
        disp["Δ Lat"] = disp["FT_Lat"] - disp["Base_Lat"]
        disp = disp.rename(columns={
            "Base_Acc": f"{base[:12]} Acc", "FT_Acc": f"{ft[:12]} Acc",
            "Base_Lat": f"{base[:12]} Lat", "FT_Lat": f"{ft[:12]} Lat",
            "Base_Errors": f"{base[:8]} Err", "FT_Errors": f"{ft[:8]} Err",
        })
        cols = ["Category", f"{base[:12]} Acc", f"{ft[:12]} Acc", "Δ Acc",
                f"{base[:12]} Lat", f"{ft[:12]} Lat", "Δ Lat",
                f"{base[:8]} Err", f"{ft[:8]} Err", "Tests"]
        styled = (
            disp[cols].style
            .format({
                f"{base[:12]} Acc": fmt_acc, f"{ft[:12]} Acc": fmt_acc, "Δ Acc": fmt_delta,
                f"{base[:12]} Lat": "{:.2f}s", f"{ft[:12]} Lat": "{:.2f}s", "Δ Lat": "{:+.2f}s",
            })
            .applymap(lambda v: color_delta(v), subset=["Δ Acc"])
            .set_properties(**{
                "background-color": "#0d1117", "color": "#e2e8f0",
                "border": "1px solid #1e2433", "font-size": "0.83rem",
            })
            .set_table_styles([{
                "selector": "thead th",
                "props": [("background-color","#111827"),("color","#475569"),
                          ("font-size","0.7rem"),("letter-spacing","0.06em"),
                          ("text-transform","uppercase")],
            }])
        )
        st.dataframe(styled, use_container_width=True)


# ── Insights ──────────────────────────────────────────────────────────────────
def render_insights(summary: pd.DataFrame, base: str, ft: str):
    st.markdown("""<div class='card'>
        <div class='card-title'><span class='dot'></span> Automated Insights</div>
    </div>""", unsafe_allow_html=True)

    insights = []
    for _, row in summary.iterrows():
        cat   = row["Category"]
        delta = row["FT_Acc"] - row["Base_Acc"]
        d_lat = row["FT_Lat"] - row["Base_Lat"]
        d_err = row["FT_Errors"] - row["Base_Errors"]

        if delta < -0.05:
            insights.append(("error", "🔴",
                f"<strong>{cat}</strong>: Significant accuracy regression detected "
                f"({delta:.1%}). Fine-tuned model underperforms significantly — review training data."))
        elif delta < -0.01:
            insights.append(("warn", "🟡",
                f"<strong>{cat}</strong>: Minor accuracy drop after fine-tuning "
                f"({delta:.1%}). Monitor closely across further evaluations."))
        elif delta > 0.03:
            insights.append(("ok", "🟢",
                f"<strong>{cat}</strong>: Meaningful accuracy improvement "
                f"({delta:+.1%}) post fine-tuning. Model is learning effectively."))

        if d_lat > 0.4:
            insights.append(("warn", "⏱",
                f"<strong>{cat}</strong>: Latency increased by {d_lat:.2f}s — consider model "
                f"optimization or quantization to maintain SLAs."))
        elif d_lat < -0.3:
            insights.append(("ok", "⚡",
                f"<strong>{cat}</strong>: Latency improved by {abs(d_lat):.2f}s — "
                f"fine-tuning yielded faster inference."))

        if d_err > 2:
            insights.append(("error", "⚠️",
                f"<strong>{cat}</strong>: {d_err} additional errors in fine-tuned model. "
                f"Investigate output format and edge-case handling."))

    if not insights:
        insights.append(("ok", "✅",
            "No regressions detected. Fine-tuned model performance is on par with or "
            "exceeds the base model across all evaluated categories."))

    cls_map = {"error": "insight-error", "warn": "insight-warn",
               "ok": "insight-ok", "info": "insight-info"}
    for kind, icon, text in insights:
        st.markdown(f"""
        <div class='insight-card {cls_map.get(kind, "insight-info")}'>
            <span class='insight-icon'>{icon}</span>
            <span>{text}</span>
        </div>""", unsafe_allow_html=True)

    st.markdown("<div style='height:0.5rem'></div>", unsafe_allow_html=True)


# ── Status bar ────────────────────────────────────────────────────────────────
def render_status(df: pd.DataFrame, base: str, ft: str):
    total  = len(df)
    passed = int((df["Δ Accuracy"] >= -0.01).sum())
    failed = total - passed
    st.markdown(f"""
    <div class='status-bar'>
        <span><span class='status-dot'></span>Suite Complete</span>
        <span>Total Tests: <strong style='color:#e2e8f0'>{total}</strong></span>
        <span style='color:#34d399'>✓ Passed: <strong>{passed}</strong></span>
        <span style='color:#f87171'>✗ Regressed: <strong>{failed}</strong></span>
        <span style='margin-left:auto; font-family: DM Mono, monospace; font-size:0.73rem;'>
            {base}  vs  {ft}
        </span>
    </div>""", unsafe_allow_html=True)


# ── Loading simulation ────────────────────────────────────────────────────────
def simulate_loading(mode: str):
    steps = {
        "Fast":      [("Initialising runners…", 0.3), ("Running evaluations…", 0.5), ("Scoring…", 0.3)],
        "Standard":  [("Initialising runners…", 0.3), ("Querying base model…", 0.6),
                      ("Querying fine-tuned model…", 0.6), ("Computing metrics…", 0.4), ("Generating insights…", 0.3)],
        "Deep Eval": [("Initialising runners…", 0.3), ("Querying base model (multi-pass)…", 0.8),
                      ("Querying fine-tuned model (multi-pass)…", 0.8), ("Cross-validating…", 0.5),
                      ("Calibrating scores…", 0.4), ("Generating insights…", 0.3)],
    }
    bar = st.progress(0, text="Starting evaluation…")
    total_steps = len(steps.get(mode, steps["Standard"]))
    for i, (msg, dur) in enumerate(steps.get(mode, steps["Standard"]), 1):
        bar.progress(int(i / total_steps * 100), text=msg)
        time.sleep(dur)
    bar.empty()


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    cfg = render_sidebar()
    render_hero()

    st.markdown("""<div class='card'>
        <div class='card-title'><span class='dot'></span> Model Selection & Test Setup</div>
    </div>""", unsafe_allow_html=True)

    params = render_config()
    st.markdown("<div style='height:0.5rem'></div>", unsafe_allow_html=True)
    run = render_action_bar(params)
    st.markdown("<div style='height:1.5rem'></div>", unsafe_allow_html=True)

    if run:
        if not params["cats"]:
            st.error("⚠️  Please select at least one test category.")
            return

        simulate_loading(params["mode"])

        df      = make_results(params["base"], params["ft"], params["cats"])
        summary = category_summary(df, params["base"], params["ft"])

        render_status(df, params["base"], params["ft"])
        render_metrics(df, params["base"], params["ft"])

        st.markdown("<div style='height:0.5rem'></div>", unsafe_allow_html=True)
        st.markdown("""<div class='card'>
            <div class='card-title'><span class='dot'></span> Performance Visualisation</div>
        </div>""", unsafe_allow_html=True)
        render_results(df, summary, params["base"], params["ft"])

        st.markdown("<div style='height:0.5rem'></div>", unsafe_allow_html=True)
        col_l, col_r = st.columns([1.2, 1])
        with col_l:
            render_summary_table(summary, params["base"], params["ft"])
        with col_r:
            render_table(df, params["base"], params["ft"])

        st.markdown("<div style='height:0.5rem'></div>", unsafe_allow_html=True)
        render_insights(summary, params["base"], params["ft"])

    else:
        st.markdown("""
        <div style='text-align:center; padding: 5rem 2rem;
                    background: #0d1117; border: 1px dashed #1e2433;
                    border-radius: 12px; color: #334155;'>
            <div style='font-size:2.5rem; margin-bottom:1rem; opacity:0.4;'>⚡</div>
            <div style='font-size:1rem; font-weight:500; color:#475569; margin-bottom:0.4rem;'>
                Configure your test suite and click <strong style='color:#38bdf8'>Run Tests</strong>
            </div>
            <div style='font-size:0.82rem; color:#334155;'>
                Select models, categories, and an optional prompt above to get started.
            </div>
        </div>""", unsafe_allow_html=True)


if __name__ == "__main__":
    main()
from __future__ import annotations
import json, os
from datetime import date
import streamlit as st
import db
from ocr import extract_image
from reports import game_report, season_report

st.set_page_config(page_title="CourtIQ", page_icon="🏀", layout="wide")
db.init_db()

st.markdown("""
<style>
.block-container{max-width:1250px;padding-top:2rem;padding-bottom:5rem}
.hero{padding:1rem 0 1.5rem}.eyebrow{font-size:.72rem;font-weight:800;letter-spacing:.15em;opacity:.5}.hero h1{font-size:2.8rem;letter-spacing:-.05em;margin:.2rem 0}.muted{opacity:.58}.card{border:1px solid rgba(128,128,128,.22);border-radius:16px;padding:1rem 1.1rem}.fixture-title{font-size:1.05rem;font-weight:750}.fixture-meta{font-size:.82rem;opacity:.55;margin-top:.2rem}.score{font-size:1.3rem;font-weight:800}.section{font-size:.7rem;font-weight:800;letter-spacing:.13em;text-transform:uppercase;opacity:.48;margin:1.6rem 0 .7rem}
</style>
""", unsafe_allow_html=True)

def ai_ready():
    p=os.getenv("COURTIQ_AI_PROVIDER","openai").lower()
    return bool(os.getenv("ANTHROPIC_API_KEY" if p=="anthropic" else "OPENAI_API_KEY"))

def team_options():
    return db.all_rows("SELECT * FROM teams ORDER BY name")

def season_options():
    return db.all_rows("SELECT * FROM seasons ORDER BY name DESC")

if "page" not in st.session_state: st.session_state.page="Fixtures"
with st.sidebar:
    st.markdown("# 🏀 CourtIQ")
    st.caption("Basketball scouting & fixture intelligence")
    st.session_state.page=st.radio("",["Dashboard","Fixtures","Teams","Settings"],label_visibility="collapsed")
    st.divider()
    seasons=season_options()
    season_names=[s["name"] for s in seasons]
    selected_name=st.selectbox("Season",season_names if season_names else ["No season yet"])
    selected_season=next((s for s in seasons if s["name"]==selected_name),None)
    st.caption("Every game is an independent record. Screenshots, OCR, stats and reports attach to the fixture.")

if st.session_state.page=="Settings":
    st.markdown('<div class="hero"><div class="eyebrow">COURTIQ · SETTINGS</div><h1>Configuration</h1><div class="muted">Infrastructure can be added later without changing the fixture model.</div></div>',unsafe_allow_html=True)
    provider=os.getenv("COURTIQ_AI_PROVIDER","openai").lower()
    st.write(f"AI provider: **{provider.title()}**")
    st.write(f"Vision API: **{'Connected' if ai_ready() else 'Not configured'}**")
    st.info("Set OPENAI_API_KEY or ANTHROPIC_API_KEY in the deployment secrets. The app works without AI for fixture management and manual data entry.")
    st.stop()

if st.session_state.page=="Teams":
    st.markdown('<div class="hero"><div class="eyebrow">COURTIQ · TEAMS</div><h1>Teams</h1><div class="muted">Build the league and your opponent database once; reuse teams across every fixture.</div></div>',unsafe_allow_html=True)
    with st.form("team"):
        name=st.text_input("Team name"); short=st.text_input("Short name")
        if st.form_submit_button("Add team",type="primary"):
            if name.strip():
                try: db.execute("INSERT INTO teams(name,short_name) VALUES (?,?)",(name.strip(),short.strip())); st.success("Team added."); st.rerun()
                except Exception as e: st.error(str(e))
    rows=team_options()
    st.markdown('<div class="section">Team database</div>',unsafe_allow_html=True)
    st.dataframe(rows,use_container_width=True,hide_index=True) if rows else st.info("No teams yet.")
    st.stop()

if not seasons:
    st.markdown('<div class="hero"><div class="eyebrow">COURTIQ</div><h1>Build your basketball database.</h1><div class="muted">Start with the season and fixtures. Then attach Swish screenshots to each game.</div></div>',unsafe_allow_html=True)
    with st.form("first_season"):
        name=st.text_input("Season",value="2026/27"); competition=st.text_input("Competition",value="Irish National League")
        if st.form_submit_button("Create season",type="primary"):
            db.get_or_create_season(name,competition); st.rerun()
    st.stop()

season_id=selected_season["id"] if selected_season else None
fixtures=db.fixtures(season_id)

if st.session_state.page=="Dashboard":
    st.markdown(f'<div class="hero"><div class="eyebrow">COURTIQ · {selected_season["name"]}</div><h1>Scouting Dashboard</h1><div class="muted">Your season at a glance.</div></div>',unsafe_allow_html=True)
    summary=db.season_summary(season_id); completed=[f for f in fixtures if f["status"]=="Final"]
    a,b,c,d=st.columns(4)
    a.metric("Fixtures",summary["fixtures"]); b.metric("Completed",summary["completed"]); c.metric("Upcoming",summary["upcoming"]); d.metric("Games with screenshots",sum(bool(db.get_screenshots(f["id"])) for f in fixtures))
    st.markdown('<div class="section">Next fixtures</div>',unsafe_allow_html=True)
    for f in fixtures[:8]:
        with st.container(border=True):
            x,y=st.columns([5,1]); x.markdown(f'<div class="fixture-title">{f["home_team"]} vs {f["away_team"]}</div><div class="fixture-meta">{f["date"]} · {f["venue"] or "Venue TBC"} · {f["status"]}</div>',unsafe_allow_html=True)
            if y.button("Open",key=f"dash_{f['id']}"):st.session_state.fixture_id=f["id"];st.session_state.page="Game";st.rerun()
    st.stop()

if st.session_state.page=="Fixtures":
    st.markdown(f'<div class="hero"><div class="eyebrow">COURTIQ · FIXTURES</div><h1>{selected_season["name"]}</h1><div class="muted">All fixtures live here, whether or not you have scouted the game yet.</div></div>',unsafe_allow_html=True)
    with st.expander("+ Add fixture",expanded=False):
        teams=team_options()
        if len(teams)<2: st.warning("Add at least two teams in Teams first.")
        else:
            names=[t["name"] for t in teams]; lookup={t["name"]:t["id"] for t in teams}
            with st.form("fixture_form"):
                c1,c2,c3=st.columns(3); fdate=c1.date_input("Date",value=date.today()); home=c2.selectbox("Home team",names); away=c3.selectbox("Away team",[n for n in names if n!=home])
                c1,c2=st.columns(2); venue=c1.text_input("Venue"); status=c2.selectbox("Status",["Upcoming","Final","Postponed","Cancelled"])
                if st.form_submit_button("Create fixture",type="primary"):
                    db.create_fixture(season_id,str(fdate),lookup[home],lookup[away],venue,status); st.success("Fixture created."); st.rerun()
    st.markdown('<div class="section">Schedule</div>',unsafe_allow_html=True)
    if not fixtures: st.info("No fixtures yet. Add your season schedule above.")
    for f in fixtures:
        shots=len(db.get_screenshots(f["id"]))
        score=f"{f['home_score']}–{f['away_score']}" if f["home_score"] is not None else "—"
        with st.container(border=True):
            x,y,z=st.columns([4,2,1]); x.markdown(f'<div class="fixture-title">{f["home_team"]} vs {f["away_team"]}</div><div class="fixture-meta">{f["date"]} · {f["venue"] or "Venue TBC"}</div>',unsafe_allow_html=True); y.markdown(f'<div class="score">{score}</div><div class="fixture-meta">{f["status"]} · {shots} screenshots</div>',unsafe_allow_html=True)
            if z.button("Open →",key=f"open_{f['id']}"):st.session_state.fixture_id=f["id"];st.session_state.page="Game";st.rerun()
    st.stop()

# Game page
fid=st.session_state.get("fixture_id")
f=db.fixture(fid) if fid else None
if not f:
    st.session_state.page="Fixtures"; st.rerun()

st.markdown(f'<div class="hero"><div class="eyebrow">COURTIQ · GAME {fid}</div><h1>{f["home_team"]} vs {f["away_team"]}</h1><div class="muted">{f["date"]} · {f["competition"]} · {f["venue"] or "Venue TBC"}</div></div>',unsafe_allow_html=True)
if st.button("← Back to fixtures"):st.session_state.page="Fixtures";st.rerun()

c1,c2,c3,c4=st.columns(4)
new_home=c1.number_input(f"{f['home_team']} score",min_value=0,value=int(f["home_score"] or 0),step=1)
new_away=c2.number_input(f"{f['away_team']} score",min_value=0,value=int(f["away_score"] or 0),step=1)
new_status=c3.selectbox("Status",["Upcoming","Final","Postponed","Cancelled"],index=["Upcoming","Final","Postponed","Cancelled"].index(f["status"]))
if c4.button("Save result",type="primary"):
    db.execute("UPDATE fixtures SET home_score=?,away_score=?,status=? WHERE id=?",(new_home,new_away,new_status,fid)); st.success("Result saved."); st.rerun()

st.markdown('<div class="section">Game data</div>',unsafe_allow_html=True)
gs=db.one("SELECT * FROM game_stats WHERE fixture_id=?",(fid,))
with st.expander("Quarter scores",expanded=True):
    qcols=st.columns(5)
    qdata={}
    for i,label in enumerate(["Q1","Q2","Q3","Q4","OT"]):
        suffix=label.lower() if label!="OT" else "ot"
        qdata[f"{suffix}_home"]=qcols[i].number_input(f"{label} {f['home_team']}",min_value=0,value=int((gs or {}).get(f"{suffix}_home") or 0),key=f"{fid}_{suffix}h")
        qdata[f"{suffix}_away"]=qcols[i].number_input(f"{label} {f['away_team']}",min_value=0,value=int((gs or {}).get(f"{suffix}_away") or 0),key=f"{fid}_{suffix}a")
    if st.button("Save quarter scores"):db.save_game_stats(fid,qdata);st.success("Quarter scores saved.")

with st.expander("Team statistics",expanded=False):
    metric_defs=[("FG","fg_made","fg_attempted"),("3PT","3p_made","3p_attempted"),("FT","ft_made","ft_attempted")]
    stat_data={}
    for label,base_m,base_a in metric_defs:
        a,b=st.columns(2); stat_data[f"home_{base_m}"]=a.number_input(f"{f['home_team']} {label} made",min_value=0,value=int((gs or {}).get(f"home_{base_m}") or 0),key=f"{fid}_hm_{label}"); stat_data[f"home_{base_a}"]=b.number_input(f"{f['home_team']} {label} attempts",min_value=0,value=int((gs or {}).get(f"home_{base_a}") or 0),key=f"{fid}_ha_{label}")
        a,b=st.columns(2); stat_data[f"away_{base_m}"]=a.number_input(f"{f['away_team']} {label} made",min_value=0,value=int((gs or {}).get(f"away_{base_m}") or 0),key=f"{fid}_am_{label}"); stat_data[f"away_{base_a}"]=b.number_input(f"{f['away_team']} {label} attempts",min_value=0,value=int((gs or {}).get(f"away_{base_a}") or 0),key=f"{fid}_aa_{label}")
    for label,field in [("Rebounds","rebounds"),("Assists","assists"),("Steals","steals"),("Blocks","blocks"),("Turnovers","turnovers")]:
        a,b=st.columns(2);stat_data[f"home_{field}"]=a.number_input(f"{f['home_team']} {label}",min_value=0,value=int((gs or {}).get(f"home_{field}") or 0),key=f"{fid}_h_{field}");stat_data[f"away_{field}"]=b.number_input(f"{f['away_team']} {label}",min_value=0,value=int((gs or {}).get(f"away_{field}") or 0),key=f"{fid}_a_{field}")
    if st.button("Save team statistics"):db.save_game_stats(fid,stat_data);st.success("Team statistics saved.")

st.markdown('<div class="section">Screenshots & OCR</div>',unsafe_allow_html=True)
uploads=st.file_uploader("Add Swish screenshots to THIS fixture",type=["png","jpg","jpeg","webp"],accept_multiple_files=True,key=f"upload_{fid}")
if st.button("Save screenshots",disabled=not uploads):
    for u in uploads:db.add_screenshot(fid,u.name,u.getvalue(),u.type or "image/jpeg")
    st.success(f"Saved {len(uploads)} screenshot(s) to this game.");st.rerun()
shots=db.get_screenshots(fid)
if shots:
    st.write(f"**{len(shots)} source screenshot(s)**")
    for s in shots:
        a,b,c=st.columns([4,2,1]);a.write(s["filename"]);b.write(s["ocr_status"])
        if c.button("Process AI",key=f"ocr_{s['id']}"):
            if not ai_ready():st.error("Add an AI API key in deployment secrets first.")
            else:
                blob=db.get_screenshot_blob(s["id"])
                try:
                    payload=extract_image(blob["image"],blob["mime_type"] or "image/jpeg");db.update_screenshot_ocr(s["id"],"processed",payload);st.success("OCR processed.");st.rerun()
                except Exception as e:st.error(f"OCR failed: {e}")
        if s["ocr_json"]:
            with st.expander("OCR result",expanded=False):st.json(json.loads(s["ocr_json"]))

st.markdown('<div class="section">Reports</div>',unsafe_allow_html=True)
a,b=st.columns(2)
a.download_button("Download Game Report PDF",data=game_report(fid),file_name=f"CourtIQ_Game_{fid}.pdf",mime="application/pdf",type="primary")
b.download_button("Download Season Fixture Report PDF",data=season_report(season_id),file_name=f"CourtIQ_{selected_season['name'].replace('/','-')}_Fixtures.pdf",mime="application/pdf")

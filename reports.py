from __future__ import annotations
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from db import fixture, fixtures, season_summary, all_rows

def _pct(made, attempts):
    if made is None or attempts in (None,0): return "—"
    return f"{100*made/attempts:.1f}%"

def game_report(fixture_id):
    f=fixture(fixture_id); gs=all_rows("SELECT * FROM game_stats WHERE fixture_id=?",(fixture_id,)); gs=gs[0] if gs else {}
    shots=all_rows("SELECT * FROM screenshots WHERE fixture_id=? ORDER BY id",(fixture_id,))
    buf=BytesIO(); doc=SimpleDocTemplate(buf,pagesize=A4,rightMargin=18*mm,leftMargin=18*mm,topMargin=16*mm,bottomMargin=16*mm)
    styles=getSampleStyleSheet(); title=ParagraphStyle("title",parent=styles["Title"],fontSize=25,leading=28,alignment=TA_CENTER,spaceAfter=8); h=ParagraphStyle("h",parent=styles["Heading2"],fontSize=15,spaceBefore=12,spaceAfter=7)
    story=[Paragraph("COURTIQ",styles["Caption"]),Paragraph(f["home_team"]+" vs "+f["away_team"],title),Paragraph(f"{f['date']} · {f['competition']} · {f['venue'] or 'Venue not recorded'}",styles["Normal"]),Spacer(1,8)]
    score=f"{f['home_score'] if f['home_score'] is not None else '—'}  —  {f['away_score'] if f['away_score'] is not None else '—'}"
    story += [Paragraph(score,ParagraphStyle("score",parent=title,fontSize=32)),Paragraph(f"{f['status']} · {len(shots)} source screenshots",styles["Normal"]),Spacer(1,10)]
    story += [Paragraph("Quarter Breakdown",h)]
    q=[ ["Period",f["home_team"],f["away_team"]] ]
    for label,a,b in [("Q1","q1_home","q1_away"),("Q2","q2_home","q2_away"),("Q3","q3_home","q3_away"),("Q4","q4_home","q4_away"),("OT","ot_home","ot_away")]:
        if gs.get(a) is not None or gs.get(b) is not None:q.append([label,gs.get(a,"—"),gs.get(b,"—")])
    if len(q)>1: story.append(_table(q))
    story += [Paragraph("Team Statistics",h)]
    rows=[["Metric",f["home_team"],f["away_team"]]]
    metrics=[("FG", "home_fg_made","home_fg_attempted","away_fg_made","away_fg_attempted"),("3PT","home_3p_made","home_3p_attempted","away_3p_made","away_3p_attempted"),("FT","home_ft_made","home_ft_attempted","away_ft_made","away_ft_attempted"),("Rebounds","home_rebounds",None,"away_rebounds",None),("Assists","home_assists",None,"away_assists",None),("Steals","home_steals",None,"away_steals",None),("Blocks","home_blocks",None,"away_blocks",None),("Turnovers","home_turnovers",None,"away_turnovers",None)]
    for name,hm,ha,am,aa in metrics:
        hv=f"{gs.get(hm)} / {gs.get(ha)} ({_pct(gs.get(hm),gs.get(ha))})" if ha else (gs.get(hm) if gs.get(hm) is not None else "—")
        av=f"{gs.get(am)} / {gs.get(aa)} ({_pct(gs.get(am),gs.get(aa))})" if aa else (gs.get(am) if gs.get(am) is not None else "—")
        rows.append([name,hv,av])
    story.append(_table(rows))
    story += [Paragraph("Data Quality",h),Paragraph("This report is generated from verified fixture data. Source screenshots are retained in the game record so OCR results can be audited and corrected.",styles["BodyText"])]
    doc.build(story); return buf.getvalue()

def season_report(season_id):
    fs=fixtures(season_id); summary=season_summary(season_id); name=fs[0]["season_name"] if fs else "Season"
    buf=BytesIO(); doc=SimpleDocTemplate(buf,pagesize=A4,rightMargin=18*mm,leftMargin=18*mm,topMargin=16*mm,bottomMargin=16*mm)
    styles=getSampleStyleSheet(); title=ParagraphStyle("title",parent=styles["Title"],fontSize=26,leading=30,alignment=TA_CENTER,spaceAfter=10); h=ParagraphStyle("h",parent=styles["Heading2"],fontSize=15,spaceBefore=12,spaceAfter=7)
    story=[Paragraph("COURTIQ",styles["Caption"]),Paragraph(name,title),Paragraph("Season Fixture & Scouting Report",styles["Heading2"]),Spacer(1,12)]
    story.append(_table([["Metric","Value"],["Total fixtures",summary["fixtures"]],["Completed",summary["completed"]],["Upcoming",summary["upcoming"]]]))
    story += [Paragraph("Fixture Schedule",h)]
    data=[["Date","Home","Away","Status","Score"]]
    for f in fs:data.append([f["date"],f["home_team"],f["away_team"],f["status"],f"{f['home_score']}-{f['away_score']}" if f["home_score"] is not None else "—"])
    story.append(_table(data))
    story += [Paragraph("Report Scope",h),Paragraph("Every fixture is an independent record. Game statistics, player statistics, source screenshots and scouting analysis can be attached to the relevant fixture without contaminating other games.",styles["BodyText"])]
    doc.build(story); return buf.getvalue()

def _table(data):
    t=Table(data,repeatRows=1,hAlign="LEFT"); t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#111827")),("TEXTCOLOR",(0,0),(-1,0),colors.white),("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("GRID",(0,0),(-1,-1),0.35,colors.HexColor("#D1D5DB")),("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,colors.HexColor("#F7F7F7")]),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)])); return t

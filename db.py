from __future__ import annotations
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).with_name("courtiq.db")

SCHEMA = """
CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    short_name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    competition TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS fixtures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    season_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    home_team_id INTEGER NOT NULL,
    away_team_id INTEGER NOT NULL,
    venue TEXT,
    status TEXT DEFAULT 'Upcoming',
    home_score INTEGER,
    away_score INTEGER,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(season_id) REFERENCES seasons(id),
    FOREIGN KEY(home_team_id) REFERENCES teams(id),
    FOREIGN KEY(away_team_id) REFERENCES teams(id)
);
CREATE TABLE IF NOT EXISTS game_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fixture_id INTEGER NOT NULL UNIQUE,
    q1_home INTEGER, q1_away INTEGER, q2_home INTEGER, q2_away INTEGER,
    q3_home INTEGER, q3_away INTEGER, q4_home INTEGER, q4_away INTEGER,
    ot_home INTEGER, ot_away INTEGER,
    home_fg_made INTEGER, home_fg_attempted INTEGER,
    away_fg_made INTEGER, away_fg_attempted INTEGER,
    home_3p_made INTEGER, home_3p_attempted INTEGER,
    away_3p_made INTEGER, away_3p_attempted INTEGER,
    home_ft_made INTEGER, home_ft_attempted INTEGER,
    away_ft_made INTEGER, away_ft_attempted INTEGER,
    home_rebounds INTEGER, away_rebounds INTEGER,
    home_assists INTEGER, away_assists INTEGER,
    home_steals INTEGER, away_steals INTEGER,
    home_blocks INTEGER, away_blocks INTEGER,
    home_turnovers INTEGER, away_turnovers INTEGER,
    source_status TEXT DEFAULT 'manual',
    FOREIGN KEY(fixture_id) REFERENCES fixtures(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    number TEXT,
    name TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    UNIQUE(team_id, number),
    FOREIGN KEY(team_id) REFERENCES teams(id)
);
CREATE TABLE IF NOT EXISTS player_game_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fixture_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    points REAL, rebounds REAL, assists REAL, steals REAL, blocks REAL,
    minutes REAL, fg_made INTEGER, fg_attempted INTEGER,
    three_made INTEGER, three_attempted INTEGER,
    ft_made INTEGER, ft_attempted INTEGER, turnovers REAL, plus_minus REAL,
    source_status TEXT DEFAULT 'ocr',
    UNIQUE(fixture_id, player_id),
    FOREIGN KEY(fixture_id) REFERENCES fixtures(id) ON DELETE CASCADE,
    FOREIGN KEY(player_id) REFERENCES players(id)
);
CREATE TABLE IF NOT EXISTS screenshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fixture_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    image BLOB NOT NULL,
    mime_type TEXT,
    ocr_status TEXT DEFAULT 'uploaded',
    ocr_json TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(fixture_id) REFERENCES fixtures(id) ON DELETE CASCADE
);
"""

def connect():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys=ON")
    return con

def init_db():
    with connect() as con:
        con.executescript(SCHEMA)

def all_rows(sql, params=()):
    with connect() as con:
        return [dict(r) for r in con.execute(sql, params).fetchall()]

def one(sql, params=()):
    rows = all_rows(sql, params)
    return rows[0] if rows else None

def execute(sql, params=()):
    with connect() as con:
        cur = con.execute(sql, params)
        con.commit()
        return cur.lastrowid

def get_or_create_team(name):
    name = name.strip()
    row = one("SELECT * FROM teams WHERE lower(name)=lower(?)", (name,))
    return row["id"] if row else execute("INSERT INTO teams(name) VALUES (?)", (name,))

def get_or_create_season(name, competition="Irish National League"):
    row = one("SELECT * FROM seasons WHERE name=?", (name,))
    return row["id"] if row else execute("INSERT INTO seasons(name, competition) VALUES (?,?)", (name, competition))

def create_fixture(season_id, date, home_team_id, away_team_id, venue="", status="Upcoming"):
    return execute("INSERT INTO fixtures(season_id,date,home_team_id,away_team_id,venue,status) VALUES (?,?,?,?,?,?)", (season_id,date,home_team_id,away_team_id,venue,status))

def fixtures(season_id=None):
    sql = """SELECT f.*, s.name season_name, s.competition,
    h.name home_team, a.name away_team
    FROM fixtures f JOIN seasons s ON s.id=f.season_id
    JOIN teams h ON h.id=f.home_team_id JOIN teams a ON a.id=f.away_team_id"""
    params=[]
    if season_id: sql += " WHERE f.season_id=?"; params.append(season_id)
    return all_rows(sql+" ORDER BY f.date, f.id", params)

def fixture(fixture_id):
    return one("""SELECT f.*, s.name season_name, s.competition, h.name home_team, a.name away_team
    FROM fixtures f JOIN seasons s ON s.id=f.season_id JOIN teams h ON h.id=f.home_team_id JOIN teams a ON a.id=f.away_team_id WHERE f.id=?""", (fixture_id,))

def save_game_stats(fixture_id, data):
    cols=[k for k in data if k in {c[1] for c in connect().execute("PRAGMA table_info(game_stats)").fetchall()}]
    existing=one("SELECT id FROM game_stats WHERE fixture_id=?",(fixture_id,))
    if existing:
        sets=", ".join(f"{c}=?" for c in cols); execute(f"UPDATE game_stats SET {sets} WHERE fixture_id=?", [data[c] for c in cols]+[fixture_id])
    else:
        execute(f"INSERT INTO game_stats(fixture_id,{','.join(cols)}) VALUES (?,{','.join('?' for _ in cols)})", [fixture_id]+[data[c] for c in cols])

def add_screenshot(fixture_id, filename, image, mime_type):
    return execute("INSERT INTO screenshots(fixture_id,filename,image,mime_type) VALUES (?,?,?,?)", (fixture_id,filename,image,mime_type))

def update_screenshot_ocr(screenshot_id, status, payload):
    import json
    execute("UPDATE screenshots SET ocr_status=?, ocr_json=? WHERE id=?", (status,json.dumps(payload),screenshot_id))

def get_screenshots(fixture_id):
    return all_rows("SELECT id,filename,mime_type,ocr_status,ocr_json,created_at FROM screenshots WHERE fixture_id=? ORDER BY id", (fixture_id,))

def get_screenshot_blob(screenshot_id):
    with connect() as con:
        row=con.execute("SELECT image,mime_type,filename FROM screenshots WHERE id=?",(screenshot_id,)).fetchone()
        return dict(row) if row else None

def season_summary(season_id):
    fs=fixtures(season_id)
    completed=[f for f in fs if f["status"]=="Final" and f["home_score"] is not None and f["away_score"] is not None]
    return {"fixtures":len(fs),"completed":len(completed),"upcoming":len(fs)-len(completed)}

init_db()

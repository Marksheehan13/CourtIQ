from __future__ import annotations
import base64, json, os

PROMPT = '''You are extracting basketball statistics from a Swish-style game screenshot. Return ONLY valid JSON.
Identify the type of screen and extract every statistic that is actually visible. Never invent values.
Schema:
{"screen_type":"team_stats|player_stats|quarter_score|roster|unknown","game":{"home_team":"","away_team":"","home_score":null,"away_score":null,"quarters":[]},"team_stats":{"home":{},"away":{}},"players":[{"number":"","name":"","team":"","points":null,"rebounds":null,"assists":null,"steals":null,"blocks":null,"minutes":null,"fg_made":null,"fg_attempted":null,"three_made":null,"three_attempted":null,"ft_made":null,"ft_attempted":null,"turnovers":null,"plus_minus":null}],"notes":[]}
Use null when a value is not visible. For percentages, preserve the percentage as a number if shown. For quarters use objects like {"quarter":1,"home":20,"away":18}.'''

def _json(text):
    text=text.strip().replace("```json","").replace("```","")
    return json.loads(text)

def extract_image(image_bytes, mime_type, provider=None):
    provider=(provider or os.getenv("COURTIQ_AI_PROVIDER","openai")).lower()
    if provider=="anthropic":
        from anthropic import Anthropic
        client=Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
        msg=client.messages.create(model=os.getenv("COURTIQ_ANTHROPIC_MODEL","claude-sonnet-4-20250514"),max_tokens=4000,messages=[{"role":"user","content":[{"type":"image","source":{"type":"base64","media_type":mime_type,"data":base64.b64encode(image_bytes).decode()}},{"type":"text","text":PROMPT}]}])
        return _json(msg.content[0].text)
    from openai import OpenAI
    client=OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response=client.chat.completions.create(model=os.getenv("COURTIQ_OPENAI_MODEL","gpt-4.1-mini"),temperature=0,messages=[{"role":"user","content":[{"type":"text","text":PROMPT},{"type":"image_url","image_url":{"url":f"data:{mime_type};base64,{base64.b64encode(image_bytes).decode()}","detail":"high"}}]}])
    return _json(response.choices[0].message.content)

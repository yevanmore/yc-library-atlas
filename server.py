#!/usr/bin/env python3

import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
PROGRESS_FILE = ROOT / "progress.json"
HOST = "127.0.0.1"
PORT = 8123

DEFAULT_PROGRESS = {
    "startDate": "",
    "itemsPerDay": 1,
    "orderingMode": "video-first",
    "weekdaysOnly": False,
    "completedIds": [],
    "sampledIds": [],
    "moodId": "surprise",
    "wanderDeckIds": [],
    "wanderDeckMood": "surprise",
    "history": [],
    "captureQuery": "",
    "catalogSearch": "",
    "catalogMedia": "all",
    "catalogPhase": "all",
    "catalogStatus": "all",
}

ALLOWED_ACTIONS = {"sampled", "done"}


def sanitize_id_list(value):
    if not isinstance(value, list):
        return []

    cleaned = []
    seen = set()

    for entry in value:
        try:
            numeric = int(entry)
        except (TypeError, ValueError):
            continue

        if numeric in seen:
            continue

        seen.add(numeric)
        cleaned.append(numeric)

    return cleaned


def sanitize_history(value):
    if not isinstance(value, list):
        return []

    cleaned = []
    for entry in value[:240]:
        if not isinstance(entry, dict):
            continue

        try:
            item_id = int(entry.get("itemId"))
        except (TypeError, ValueError):
            continue

        action = entry.get("action")
        timestamp = entry.get("timestamp")
        if action not in ALLOWED_ACTIONS or not isinstance(timestamp, str) or not timestamp.strip():
            continue

        cleaned.append(
            {
                "itemId": item_id,
                "action": action,
                "timestamp": timestamp.strip()[:48],
            }
        )

    return cleaned


def ensure_progress_file():
    if not PROGRESS_FILE.exists():
        PROGRESS_FILE.write_text(json.dumps(DEFAULT_PROGRESS, indent=2) + "\n", encoding="utf-8")


def sanitize_progress(payload):
    if not isinstance(payload, dict):
        return DEFAULT_PROGRESS.copy()

    cleaned = DEFAULT_PROGRESS.copy()
    cleaned["startDate"] = payload.get("startDate", cleaned["startDate"])
    cleaned["itemsPerDay"] = payload.get("itemsPerDay", cleaned["itemsPerDay"])
    cleaned["orderingMode"] = payload.get("orderingMode", cleaned["orderingMode"])
    cleaned["weekdaysOnly"] = bool(payload.get("weekdaysOnly", cleaned["weekdaysOnly"]))
    cleaned["completedIds"] = sanitize_id_list(payload.get("completedIds"))
    cleaned["sampledIds"] = sanitize_id_list(payload.get("sampledIds"))
    cleaned["moodId"] = payload.get("moodId", cleaned["moodId"])
    cleaned["wanderDeckIds"] = sanitize_id_list(payload.get("wanderDeckIds"))
    cleaned["wanderDeckMood"] = payload.get("wanderDeckMood", cleaned["wanderDeckMood"])
    cleaned["history"] = sanitize_history(payload.get("history"))
    cleaned["captureQuery"] = payload.get("captureQuery", cleaned["captureQuery"])
    cleaned["catalogSearch"] = payload.get("catalogSearch", cleaned["catalogSearch"])
    cleaned["catalogMedia"] = payload.get("catalogMedia", cleaned["catalogMedia"])
    cleaned["catalogPhase"] = payload.get("catalogPhase", cleaned["catalogPhase"])
    cleaned["catalogStatus"] = payload.get("catalogStatus", cleaned["catalogStatus"])
    return cleaned


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if urlparse(self.path).path == "/api/progress":
            ensure_progress_file()
            payload = json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
            return self.respond_json(payload)
        return super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path != "/api/progress":
            self.send_error(405, "Method Not Allowed")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(length)
            payload = sanitize_progress(json.loads(raw_body.decode("utf-8") or "{}"))
            PROGRESS_FILE.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
            self.respond_json(payload)
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")

    def respond_json(self, payload):
        body = json.dumps(payload, indent=2).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    ensure_progress_file()
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Serving {ROOT} at http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

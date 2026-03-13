#!/usr/bin/env python3

import json
import math
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen


APP_ID = "45BWZJ1SGC"
API_KEY = (
    "MDlkNDAyNzM1YjA2YTQwYjBkMGIwNjk2Mzg4NDQ3ZGRkMTdhZWJmODM0MDdiNDVhMTNl"
    "NDRiYzFlOGZiMGI5MmFuYWx5dGljc1RhZ3M9eWNkYyUyQ2xpYnJhcnkmcmVzdHJpY3RJbm"
    "RpY2VzPUxpYnJhcnlfYm9va2ZhY2VfcHJvZHVjdGlvbiZ0YWdGaWx0ZXJzPSU1QiUyMnlj"
    "ZGNfcHVibGljJTIyJTJDJTVCJTIya2Jfcm9vdF8xNzYlMjIlMkMlMjJrYl9yb290XzkxMi"
    "UyMiU1RCU1RA=="
)
INDEX_NAME = "Library_bookface_production"
SOURCE_URL = "https://www.ycombinator.com/library/search"
OUTPUT_FILE = Path(__file__).resolve().parent.parent / "yc-library-data.js"


def post_algolia(requests_payload):
    url = f"https://{APP_ID}-dsn.algolia.net/1/indexes/*/queries"
    request = Request(
        url,
        data=json.dumps({"requests": requests_payload}).encode("utf-8"),
        headers={
            "content-type": "application/json",
            "x-algolia-application-id": APP_ID,
            "x-algolia-api-key": API_KEY,
        },
    )
    with urlopen(request, timeout=30) as response:
        return json.load(response)


def normalize_url(url):
    if not url:
        return None
    return url.replace("https://ycombinator.com", "https://www.ycombinator.com", 1)


def normalize_hit(hit):
    yc_url = normalize_url(hit.get("shared_search_path"))
    return {
        "id": hit["id"],
        "title": hit["title"].strip(),
        "author": (hit.get("author") or "Y Combinator").strip(),
        "mediaType": hit["media_type"],
        "description": (hit.get("description") or "").strip(),
        "categories": hit.get("categories") or [],
        "subcategories": hit.get("subcategories") or [],
        "susCurriculum": bool(hit.get("sus_curriculum")),
        "featureScore": int(hit.get("feature_score") or 0),
        "slug": hit.get("slug"),
        "ycUrl": yc_url,
        "resourceUrl": hit.get("link") or yc_url,
    }


def fetch_all_hits():
    params = urlencode(
        {
            "query": "",
            "hitsPerPage": 100,
            "page": 0,
            "facets": json.dumps(["media_type", "categories"]),
        }
    )
    initial = post_algolia([{"indexName": INDEX_NAME, "params": params}])["results"][0]
    hits = initial["hits"][:]
    total_pages = initial["nbPages"]
    facets = initial.get("facets", {})

    if total_pages > 1:
        payload = []
        for page in range(1, total_pages):
            payload.append(
                {
                    "indexName": INDEX_NAME,
                    "params": urlencode(
                        {
                            "query": "",
                            "hitsPerPage": 100,
                            "page": page,
                        }
                    ),
                }
            )
        results = post_algolia(payload)["results"]
        for result in results:
            hits.extend(result["hits"])

    normalized = [normalize_hit(hit) for hit in hits]
    normalized.sort(
        key=lambda item: (
            item["mediaType"] != "Video",
            not item["susCurriculum"],
            -item["featureScore"],
            item["title"].lower(),
        )
    )

    category_names = sorted(
        {
            category
            for item in normalized
            for category in item["categories"]
            if category and category.strip()
        }
    )

    return {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "sourceUrl": SOURCE_URL,
        "counts": {
            "items": len(normalized),
            "videos": sum(1 for item in normalized if item["mediaType"] == "Video"),
            "blogs": sum(1 for item in normalized if item["mediaType"] == "Blog"),
            "external": sum(1 for item in normalized if item["mediaType"] == "External"),
            "categories": len(category_names),
        },
        "facets": {
            "mediaType": facets.get("media_type", {}),
            "categories": facets.get("categories", {}),
        },
        "categories": category_names,
        "items": normalized,
    }


def main():
    payload = fetch_all_hits()
    js = "window.YC_LIBRARY_DATA = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n"
    OUTPUT_FILE.write_text(js, encoding="utf-8")
    print(f"Wrote {payload['counts']['items']} items to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()

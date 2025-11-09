from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import pytz
import math

from core.firebase import db

router = APIRouter(tags=["Analytics"])

IST = pytz.timezone("Asia/Kolkata")

# --- Utility Functions ---

def _range_to_start(range_key: str) -> datetime:
    now = datetime.now(IST)
    if range_key == "7d": return (now - timedelta(days=6)).replace(hour=0, minute=0, second=0, microsecond=0)
    if range_key == "30d": return (now - timedelta(days=29)).replace(hour=0, minute=0, second=0, microsecond=0)
    if range_key == "6mo": return (now - timedelta(days=182)).replace(hour=0, minute=0, second=0, microsecond=0)
    if range_key in ("1y", "12mo"): return (now - timedelta(days=364)).replace(hour=0, minute=0, second=0, microsecond=0)
    raise ValueError("Invalid date_range parameter")

def _sentiment_score(label: str) -> float:
    return {"positive": 9.0, "neutral": 6.0, "negative": 3.0}.get(label, 6.0)

def _overall(mood: float, prod: float, sentiment: float, sarcasm: str) -> float:
    eff_sentiment = sentiment * (0.9 if sarcasm == "sarcastic" else 1.0)
    score = 0.5 * mood + 0.3 * prod + 0.2 * eff_sentiment
    return round(max(0.0, min(10.0, score)), 2)

def _energy(mood: float, prod: float) -> float:
    return round((mood * prod) / 10.0, 2)

def _correlation(xs, ys):
    if len(xs) != len(ys) or len(xs) < 2: return 0.0
    mean_x, mean_y = sum(xs) / len(xs), sum(ys) / len(ys)
    cov = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
    std_x = math.sqrt(sum((x - mean_x)**2 for x in xs))
    std_y = math.sqrt(sum((y - mean_y)**2 for y in ys))
    return cov / (std_x * std_y) if std_x and std_y else 0.0


# --- Routes ---

@router.get("/trends")
def get_trends(user_uid: str = Query(...), date_range: str = Query("7d")):
    try:
        start_local = _range_to_start(date_range)
        end_local = datetime.now(IST)

        start_utc = start_local.astimezone(pytz.UTC)
        end_utc = end_local.astimezone(pytz.UTC)

        docs = (
            db.collection("journals")
            .where("user_uid", "==", user_uid)
            .where("created_at", ">=", start_utc)
            .where("created_at", "<=", end_utc)
            .stream()
        )

        buckets = defaultdict(list)
        counts = defaultdict(lambda: Counter())

        for doc in docs:
            j = doc.to_dict()
            ts = j.get("created_at")
            if ts is None:
                continue
            dt_local = ts.replace(tzinfo=pytz.UTC).astimezone(IST)
            day_key = dt_local.strftime("%Y-%m-%d")

            mood = float(j.get("mood", 0))
            prod = float(j.get("productivity", 0))
            sentiment_label = str(j.get("sentiment", "neutral")).lower()
            sarcasm = str(j.get("sarcasm", "not sarcastic")).lower()

            sentiment = _sentiment_score(sentiment_label)
            combined = _overall(mood, prod, sentiment, sarcasm)
            energy = _energy(mood, prod)

            buckets[day_key].append({
                "mood": mood,
                "prod": prod,
                "overall": combined,
                "energy": energy,
                "sentiment": sentiment,
            })
            counts[day_key][sentiment_label] += 1

        # Fill gaps and compute daily averages
        series = []
        cur = start_local
        while cur.date() <= end_local.date():
            day_key = cur.strftime("%Y-%m-%d")
            items = buckets.get(day_key, [])
            if items:
                n = len(items)
                mood_avg = sum(i["mood"] for i in items) / n
                prod_avg = sum(i["prod"] for i in items) / n
                combined_avg = sum(i["overall"] for i in items) / n
                energy_avg = sum(i["energy"] for i in items) / n
                sentiment_avg = sum(i["sentiment"] for i in items) / n
                s_counts = counts[day_key]
            else:
                mood_avg = prod_avg = combined_avg = energy_avg = sentiment_avg = 0
                s_counts = {"positive": 0, "neutral": 0, "negative": 0, "total": 0}

            series.append({
                "date": day_key,
                "mood_avg": round(mood_avg, 2),
                "productivity_avg": round(prod_avg, 2),
                "combined_avg": round(combined_avg, 2),
                "energy_score": round(energy_avg, 2),
                "sentiment_score": round(sentiment_avg / 10.0, 2),  # Scaled 0-1
                "sentiment_counts": {
                    "positive": s_counts.get("positive", 0),
                    "neutral": s_counts.get("neutral", 0),
                    "negative": s_counts.get("negative", 0),
                    "total": sum(s_counts.values())
                }
            })
            cur += timedelta(days=1)

        return {"range": date_range, "series": series, "tz": "Asia/Kolkata"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summary")
def get_summary(user_uid: str = Query(...), date_range: str = Query("7d")):
    try:
        tr = get_trends(user_uid=user_uid, date_range=date_range)
        series = tr["series"]

        valid_days = [s for s in series if s["combined_avg"] > 0]
        total_entries = sum(s["sentiment_counts"]["total"] for s in series)

        avg_combined = round(sum(d["combined_avg"] for d in valid_days) / len(valid_days), 2) if valid_days else 0
        avg_mood = round(sum(d["mood_avg"] for d in valid_days) / len(valid_days), 2) if valid_days else 0
        avg_prod = round(sum(d["productivity_avg"] for d in valid_days) / len(valid_days), 2) if valid_days else 0
        avg_energy = round(sum(d["energy_score"] for d in valid_days) / len(valid_days), 2) if valid_days else 0

        pos = sum(d["sentiment_counts"]["positive"] for d in series)
        sentiment_pct = {"positive": round(100 * pos / total_entries) if total_entries else 0}

        moods = [d["mood_avg"] for d in valid_days]
        prods = [d["productivity_avg"] for d in valid_days]
        mp_corr = round(_correlation(moods, prods), 2)

        # Compute streak based on consecutive days with journal entries
        entry_dates = [
            datetime.strptime(d["date"], "%Y-%m-%d").date()
            for d in series if d["sentiment_counts"]["total"] > 0
        ]
        entry_dates.sort(reverse=True)

        today = datetime.now(IST).date()
        current_streak = 0
        for i, entry_date in enumerate(entry_dates):
            if entry_date == today - timedelta(days=i):
                current_streak += 1
            else:
                break

        best_streak = 0
        temp_streak = 0
        for i in range(len(entry_dates)):
            if i == 0 or entry_dates[i] == entry_dates[i - 1] - timedelta(days=1):
                temp_streak += 1
                best_streak = max(best_streak, temp_streak)
            else:
                temp_streak = 1

        best_day = max(series, key=lambda d: d["combined_avg"], default=None)
        tough_day = min(series, key=lambda d: d["combined_avg"], default=None)

        return {
            "range": date_range,
            "averages": {
                "mood": avg_mood,
                "productivity": avg_prod,
                "combined": avg_combined,
                "energy": avg_energy,
            },
            "sentiment_pct": sentiment_pct,
            "correlations": {"mood_vs_productivity": mp_corr},
            "streaks": {"current": current_streak, "best": best_streak},
            "highlights": {"best_day": best_day, "tough_day": tough_day},
            "total_entries": total_entries,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

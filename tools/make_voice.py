"""Tạo giọng đọc MP3 cho từng lời thoại bằng edge-tts.
Chạy: py tools/make_voice.py   (bỏ qua file đã có; xóa file mp3 để tạo lại)
Danh sách lời thoại: audio/voice/lines.json (id = băm FNV-1a của câu, khớp với js/engine.js)."""
import asyncio, html, json, os, sys
import edge_tts

VOICE = "vi-VN-HoaiMyNeural"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "audio", "voice")

async def one(item, sem, stats):
    out = os.path.join(ROOT, item["id"] + ".mp3")
    if os.path.exists(out) and os.path.getsize(out) > 0:
        stats["skip"] += 1; return
    async with sem:
        for attempt in range(4):
            try:
                await edge_tts.Communicate(html.unescape(item["text"]), VOICE).save(out + ".part")
                os.replace(out + ".part", out); stats["ok"] += 1; return
            except Exception as e:
                err = e; await asyncio.sleep(5 * (attempt + 1))
        stats["fail"].append((item["id"], str(err)))

async def main():
    items = json.load(open(os.path.join(ROOT, "lines.json"), encoding="utf-8"))
    sem, stats = asyncio.Semaphore(3), {"ok": 0, "skip": 0, "fail": []}
    await asyncio.gather(*(one(i, sem, stats) for i in items))
    print(f"tao moi {stats['ok']}, da co {stats['skip']}, loi {len(stats['fail'])}")
    for f in stats["fail"]: print("  loi", *f)
    sys.exit(1 if stats["fail"] else 0)

asyncio.run(main())

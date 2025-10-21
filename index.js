import express from "express";
import YTDlpWrap from "yt-dlp-wrap";

const app = express();
const PORT = process.env.PORT || 3000;

const ytDlp = new YTDlpWrap();

let cache = { url: "", video: "", fetchedAt: 0, expiresIn: 0 };

app.get("/live.m3u8", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send("❌ Missing 'url' query parameter");

  const now = Date.now();
  if (
    cache.url &&
    cache.video === videoUrl &&
    now - cache.fetchedAt < cache.expiresIn
  ) {
    console.log("✅ Using cached URL");
    return res.redirect(cache.url);
  }

  try {
    console.log("🎥 Fetching stream for:", videoUrl);
    const output = await ytDlp.execPromise(["-g", "-f", "best", videoUrl]);
    const hlsUrl = output.trim();

    // Cache for 45 seconds
    cache = { url: hlsUrl, video: videoUrl, fetchedAt: now, expiresIn: 45000 };
    res.redirect(hlsUrl);
  } catch (err) {
    console.error("❌ Error fetching stream:", err);
    res.status(500).send("Error fetching live stream");
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

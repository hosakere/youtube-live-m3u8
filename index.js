import express from "express";
import fetch from "node-fetch";
import YtDlpWrap from "yt-dlp-wrap";

const app = express();
const port = process.env.PORT || 3000;

// Initialize yt-dlp
const ytDlp = new YtDlpWrap.default();

// Live m3u8 route
app.get("/live.m3u8", async (req, res) => {
  const youtubeUrl = req.query.url;
  if (!youtubeUrl) {
    return res.status(400).send("Missing YouTube URL");
  }

  try {
    const streamUrl = await ytDlp.execPromise(["-g", "-f", "best", youtubeUrl]);
    res.redirect(streamUrl.trim());
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error fetching stream: " + err.message);
  }
});

// Simple health check
app.get("/", (req, res) => {
  res.send("✅ YouTube Live M3U8 Server running on Render!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

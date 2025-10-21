import express from "express";
import { YtDlpWrap } from "yt-dlp-wrap";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 3000;

// create yt-dlp instance
const ytDlp = new YtDlpWrap();

// Route for m3u8
app.get("/live.m3u8", async (req, res) => {
  const youtubeUrl = req.query.url;
  if (!youtubeUrl) {
    return res.status(400).send("Missing YouTube URL");
  }

  try {
    const streamUrl = await ytDlp.execPromise([
      "-g",
      "-f",
      "best",
      youtubeUrl,
    ]);
    res.redirect(streamUrl.trim());
  } catch (err) {
    res.status(500).send("Error fetching stream: " + err.message);
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("✅ YouTube M3U8 server is running!");
});

// Auto-refresh job
const YT_TEST_URL = "https://www.youtube.com/live/jdJoOhqCipA";
setInterval(async () => {
  try {
    const ping = await fetch(
      `https://youtube-live-m3u8.onrender.com/live.m3u8?url=${YT_TEST_URL}`
    );
    console.log("Pinged stream:", ping.status);
  } catch (e) {
    console.error("Ping failed:", e.message);
  }
}, 10 * 60 * 1000);

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

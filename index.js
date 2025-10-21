import express from "express";
import fetch from "node-fetch";
import ytdlp from "yt-dlp-exec";

const app = express();
const port = process.env.PORT || 3000;

app.get("/live.m3u8", async (req, res) => {
  const youtubeUrl = req.query.url;
  if (!youtubeUrl) return res.status(400).send("Missing YouTube URL");

  try {
    const info = await ytdlp(youtubeUrl, { dumpSingleJson: true });
    res.redirect(info.url); // best stream URL
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error fetching stream: " + err.message);
  }
});

app.get("/", (req, res) => {
  res.send("✅ YouTube Live M3U8 Server running on Render!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import fetch from "node-fetch";
import pkg from "yt-dlp-wrap";
const { YtDlpWrap } = pkg;

const app = express();
const port = process.env.PORT || 3000;

// create yt-dlp instance
const ytDlp = new YtDlpWrap();

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

app.get("/", (req, res) => {
  res.send("✅ YouTube M3U8 server is running!");
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

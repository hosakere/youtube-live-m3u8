import YTDlpWrap from "yt-dlp-wrap";

const ytDlp = new YTDlpWrap();

export default async function handler(req, res) {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    res.status(400).send("#EXTM3U\n# Missing 'url' parameter\n# Example: /live.m3u8?url=https://www.youtube.com/live/VIDEO_ID");
    return;
  }

  try {
    const output = await ytDlp.execPromise(["-g", "-f", "best", videoUrl]);
    const hlsUrl = output.trim();

    // Redirect to actual m3u8
    res.writeHead(302, { Location: hlsUrl, "Cache-Control": "no-store" });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send(`#EXTM3U\n# Failed to fetch stream for ${videoUrl}\n# Error: ${err.message}`);
  }
}

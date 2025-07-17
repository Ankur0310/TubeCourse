// routes/playlist.js

import express from 'express';
import { youtube } from '../config/youtubeAPI.js'; // Assuming these are correctly configured
import { genAI } from '../config/genAI.js';       // Assuming these are correctly configured
import { extractPlaylistId } from '../services/youtube.js'; // Assuming this is correctly configured
import { getCourseGenerationPayload } from '../services/geminiPrompt.js'; // Updated import

const router = express.Router();

router.post('/', async (req, res) => {
  const { playlistUrl } = req.body;
  if (!playlistUrl) return res.status(400).json({ error: 'Missing playlistUrl' });

  const playlistId = extractPlaylistId(playlistUrl);
  if (!playlistId) return res.status(400).json({ error: 'Invalid playlist URL' });

  try {
    console.log('📺 Fetching playlist videos for ID:', playlistId);
    const videosRes = await youtube.playlistItems.list({
      part: ['snippet'],
      playlistId,
      maxResults: 50, // Adjust as needed
    });

    const videos = videosRes.data.items
      .map(item => ({
        title: item.snippet?.title,
        videoURL: `https://www.youtube.com/watch?v=${item.snippet?.resourceId?.videoId}`,
      }))
      .filter(v => v.title && v.videoURL);

    if (!videos.length) {
      return res.status(404).json({ error: 'No videos found in playlist.' });
    }

    // Get the prompt and the structured generation config
    const { prompt, generationConfig } = getCourseGenerationPayload(videos);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' }); // Using -latest for best results

    // 🧠 Single Gemini call: generate course content directly in JSON format
    console.log('🧠 Generating course content with structured JSON output...');
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: generationConfig,
    });

    const jsonResponseText = await (await result.response).text();
    console.log('🧾 Raw JSON response from Gemini:\n', jsonResponseText.slice(0, 500), '...');

    // ✅ Parse the JSON directly
    let parsedCourseData;
    try {
      parsedCourseData = JSON.parse(jsonResponseText);
      res.json({
        id: `course_${Date.now()}`,
        title: parsedCourseData.title || 'AI Course from Playlist',
        source: playlistUrl,
        raw: videos.map(v => v.title), // Original video titles
        course: parsedCourseData,
      });
    } catch (parseError) {
      console.error('⚠️ Failed to parse JSON from Gemini response:', parseError);
      console.error('Problematic JSON:', jsonResponseText);
      res.status(500).json({
        error: 'Failed to parse course content from AI. Response was not valid JSON.',
        rawAIResponse: jsonResponseText, // Return raw AI response for debugging
      });
    }

  } catch (err) {
    console.error('💥 Error processing playlist:', err);
    // Differentiate between API errors and other errors
    if (err.response && err.response.status) {
      res.status(err.response.status).json({ error: `AI API Error: ${err.response.status} - ${err.message}` });
    } else {
      res.status(500).json({ error: 'Failed to process playlist due to an internal error.' });
    }
  }
});

export default router;
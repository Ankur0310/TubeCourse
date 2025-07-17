import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

export const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

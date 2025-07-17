import url from "url";

export function extractPlaylistId(playlistUrl) {
  try {
    const parsed = new url.URL(playlistUrl);
    return parsed.searchParams.get("list");
  } catch {
    return null;
  }
}

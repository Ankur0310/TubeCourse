import JSON5 from 'json5';

export function extractJSON(text) {
  try {
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    let cleaned = codeBlockMatch ? codeBlockMatch[1] : text;

    cleaned = cleaned
      .replace(/[\u201C\u201D]/g, '"') // smart double quotes
      .replace(/[\u2018\u2019]/g, "'") // smart single quotes
      .replace(/\\(?!["\\/bfnrtu])/g, '\\\\'); // lone backslashes

    const firstCurly = cleaned.indexOf('{');
    const lastCurly = cleaned.lastIndexOf('}');
    if (firstCurly === -1 || lastCurly === -1) throw new Error('❌ No JSON object found.');

    let jsonCandidate = cleaned.slice(firstCurly, lastCurly + 1);

    // ✅ Fix common case: truncated string values
    // e.g., "question": "What is the differen...
    jsonCandidate = jsonCandidate.replace(
      /"([^"]+)":\s*?"[^"\n\r]*?(?=[,\n\r}])/g,
      (match) => {
        // Ensure it ends with a closing quote
        return match.endsWith('"') ? match : `${match}"`;
      }
    );

    // ✅ Fix truncated "videoURL" if any
    jsonCandidate = jsonCandidate.replace(/"videoURL":\s*?"[^"]*$/gm, '"videoURL": ""');

    const preview = jsonCandidate.length > 1000 ? jsonCandidate.slice(0, 1000) + '...' : jsonCandidate;

    try {
      return JSON.parse(jsonCandidate);
    } catch (strictErr) {
      console.warn('⚠️ Strict JSON.parse failed. Trying JSON5...');
      try {
        return JSON5.parse(jsonCandidate);
      } catch (json5Err) {
        console.error('❌ Final parse failed:\n', preview);
        throw new Error(`🚫 Failed to extract valid JSON: ${json5Err.message}`);
      }
    }
  } catch (outerErr) {
    throw new Error(`🚫 Failed to extract valid JSON: ${outerErr.message}`);
  }
}

// services/geminiPrompt.js

export function getCourseGenerationPayload(videos) {
  const lessonLines = videos
    .map((v, i) => `${i + 1}. ${v.title} - ${v.videoURL}`)
    .join('\n');

  const prompt = `
You are an expert course designer.

Create a beginner-friendly course based on the following YouTube videos, each with its title and video URL:

${lessonLines}

Instructions:
- The number of **lessons** must be equal to the number of videos listed.
- Group related lessons into **3 to 6 modules** based on content similarity.
- Each module should have a short description.
- Each **lesson** must include:
  - The exact **video title**
  - The **videoURL**
  - A short summary/description
  - At least **one medium-level quiz question**
  - At least **one hard-level quiz question**
- Include 1–2 practical projects at the end to apply the skills. For each project, provide:
  - A clear title and detailed description.
  - Its difficulty level (e.g., "Beginner", "Intermediate").
  - A list of 3-5 key skills covered.
  - An estimated time to complete.
  - 3-5 actionable milestones.
  - 2-3 suggested tools/technologies.
  - 1-2 bonus features for extending the project.
`;

  const responseSchema = {
    type: "OBJECT",
    properties: {
      "title": { "type": "STRING", "description": "Overall course title" },
      "targetAudience": { "type": "STRING", "description": "Who is this course for?" },
      "estimatedDuration": { "type": "STRING", "description": "Estimated time to complete the course (e.g., '10 hours', '2 days')" },
      "modules": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "title": { "type": "STRING", "description": "Module title" },
            "description": { "type": "STRING", "description": "Module description" },
            "lessons": {
              "type": "ARRAY",
              "items": {
                "type": "OBJECT",
                "properties": {
                  "title": { "type": "STRING", "description": "Video title (must match original)" },
                  "videoURL": { "type": "STRING", "description": "Video URL (must match original)" },
                  "description": { "type": "STRING", "description": "Short summary of the video content" },
                  "quiz": {
                    "type": "ARRAY",
                    "items": {
                      "type": "OBJECT",
                      "properties": {
                        "difficulty": { "type": "STRING", "enum": ["medium", "hard"], "description": "Difficulty level of the quiz question" },
                        "question": { "type": "STRING", "description": "Quiz question" },
                        "options": {
                          "type": "ARRAY",
                          "items": { "type": "STRING" },
                          "description": "Four possible answers"
                        },
                        "correctAnswer": { "type": "INTEGER", "description": "Index (0-3) of the correct option in the 'options' array" }
                      },
                      "required": ["difficulty", "question", "options", "correctAnswer"]
                    }
                  }
                },
                "required": ["title", "videoURL", "description", "quiz"]
              }
            }
          },
          "required": ["title", "description", "lessons"]
        },
        "minItems": 3,
        "maxItems": 6
      },
      "projects": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "title": { "type": "STRING", "description": "Project title" },
            "description": { "type": "STRING", "description": "Detailed project description" },
            "difficulty": { "type": "STRING", "enum": ["Beginner", "Intermediate", "Advanced"], "description": "Difficulty level of the project" },
            "keySkillsCovered": {
              "type": "ARRAY",
              "items": { "type": "STRING" },
              "description": "List of key skills reinforced by this project"
            },
            "estimatedTime": { "type": "STRING", "description": "Estimated time to complete the project (e.g., '4-6 hours', '1 day')" },
            "milestones": {
              "type": "ARRAY",
              "items": { "type": "STRING" },
              "description": "Key steps or phases of the project"
            },
            "suggestedTools": {
              "type": "ARRAY",
              "items": { "type": "STRING" },
              "description": "Recommended tools or technologies for the project"
            },
            "bonusFeatures": {
              "type": "ARRAY",
              "items": { "type": "STRING" },
              "description": "Optional features to extend the project"
            }
          },
          "required": ["title", "description", "difficulty", "keySkillsCovered", "estimatedTime", "milestones", "suggestedTools"]
        }
      }
    },
    "required": ["title", "targetAudience", "estimatedDuration", "modules"]
  };

  return { prompt, generationConfig: { responseMimeType: "application/json", responseSchema } };
}
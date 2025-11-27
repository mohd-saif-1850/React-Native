import { gemini } from "../utils/geminiClient.js";

export const refineOnlyTitle = async (title) => {
  const prompt = `
You refine expense titles.

Rules:
- Make it clean, short, natural (4-10 words)
- Keep original meaning
- Only return refined title, nothing else

User Title: "${title}"
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: [{ text: prompt }],
  });

  const refined = response.output_text?.trim();
  return refined || title;
};

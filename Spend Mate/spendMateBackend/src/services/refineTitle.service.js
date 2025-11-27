import { gemini } from "../utils/geminiClient.js";

export const refineOnlyTitle = async (title) => {
  const prompt = `
Refine this expense title.
Return 2-4 words only, clean and natural.
Input: "${title}"
Respond ONLY with the refined title.
  `;

  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: [{ text: prompt }],
  });

  const refined = response.text().trim();
  return refined;
};

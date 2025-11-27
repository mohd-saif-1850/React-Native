import { gemini } from "../utils/geminiClient.js";

export const refineOnlyTitle = async (title) => {
  const prompt = `
You IMPROVE an expense title.

User Title: "${title}"

RULES:
- MUST return a better title.
- NEVER return the same title.
- Fix spelling errors.
- Make it clear, human, natural.
- 3–6 words only.
- Do NOT add unnecessary words.
- Return ONLY the improved title.
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: [{ text: prompt }],
  });

  let refined = response.output_text?.trim();

  // Safety: NEVER same or empty
  if (!refined || refined.toLowerCase() === title.toLowerCase()) {
    refined = `Expense: ${title}`;
  }

  return refined;
};

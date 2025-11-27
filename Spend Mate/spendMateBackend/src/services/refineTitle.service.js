import { gemini } from "../utils/geminiClient.js";

export const refineOnlyTitle = async (title) => {
  const prompt = `
You are an AI that ALWAYS improves an expense title.

User Title: "${title}"

STRICT RULES:
- DO NOT return the same title.
- Fix spelling mistakes.
- Expand short titles.
- Make it more clear and meaningful.
- Use 3 to 7 words.
- Keep same meaning but sound better.
- Return ONLY the improved title. No quotes, no explanations.
- Even if user title looks correct, IMPROVE IT ANYWAY.
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: [{ text: prompt }],
  });

  let refined = response.output_text?.trim();

  if (!refined || refined.toLowerCase() === title.toLowerCase()) {
    refined = `Expense: ${title}`;
  }

  return refined;
};

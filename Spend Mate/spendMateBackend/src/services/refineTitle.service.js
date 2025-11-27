import { gemini } from "../utils/geminiClient.js";

export const refineOnlyTitle = async (title) => {
  const clean = title.trim();

  const prompt = `
You refine an expense title.

User Title: "${clean}"

Rules:
- Improve the title in a natural way.
- Fix spelling/mistakes.
- Make it short & clear (3-6 words).
- MUST be different from the original.
- Return ONLY the improved title. No explanation.
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: [{ text: prompt }],
  });

  let refined =
    response.output_text?.trim() ||
    response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!refined || refined.toLowerCase() === clean.toLowerCase()) {
    refined = `Expense: ${clean}`;
  }

  return refined;
};

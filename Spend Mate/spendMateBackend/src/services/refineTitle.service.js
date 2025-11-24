import { gemini } from "../utils/geminiClient.js";

export const generateRefinedTitle = async (title) => {
  const clean = title.trim().toLowerCase();

  const prompt = `
Refine this expense title.
User might write half, misspelled, or rough text.
Return a short, professional, natural title (2–4 words).
Only return the title. No explanation.
Input: "${clean}"
  `;

  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: prompt,
  });

  const refined =
    response.output_text ||
    response.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Unknown Expense";

  return refined.trim();
};

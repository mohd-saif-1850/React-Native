import { gemini } from "../utils/geminiClient.js";

export const refineOrGenerateDescription = async (title, description = "") => {
  const prompt = `
You refine or generate expense descriptions.

User Title: "${title}"
User Description: "${description || "NONE"}"

Rules:
- If user HAS written a description:
    • Refine it
    • Keep original meaning
    • Expand naturally
    • 10-50 words
- If user did NOT write a description:
    • Generate a natural 10-50 word description based on the title
Return ONLY the final description.
  `;

  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: [{ text: prompt }],
  });

  return response.text().trim();
};

import { gemini } from "../utils/geminiClient.js";

export const refineOrGenerateDescription = async (title, description = "") => {
  const prompt = `
You create HUMAN-LIKE, friendly, simple expense descriptions.

Title: "${title}"
User Description: "${description || "NONE"}"

STYLE RULES:
- Sound like a real person writing their own expense note.
- Be casual, clear, simple, and natural.
- 20-40 words max.
- No corporate tone.
- No robotic or formal language.
- No repeating the title.
- No unnecessary details.
- If the user wrote something:
    • Fix it
    • Expand it naturally
    • Keep their meaning
- If the user wrote nothing:
    • Create a friendly short description
    • Related to the title (what the user likely spent on)
- RETURN ONLY THE FINAL DESCRIPTION.
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: [{ text: prompt }],
  });

  let refined = response.output_text?.trim();

  if (!refined || refined.length < 5) {
    refined = `Noted an expense for ${title}. Just keeping track of the daily spending so it's easier to remember later.`;
  }

  return refined;
};

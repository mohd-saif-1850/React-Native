import { gemini } from "../utils/geminiClient.js";

export const refineOrGenerateDescription = async (title, description = "") => {
  const prompt = `
You generate HUMAN-LIKE, natural, and friendly expense descriptions.

INPUT:
• Title: "${title}"
• User Description: "${description || "NONE"}"

GUIDELINES:
- Write like a real person casually describing their expense.
- Tone: simple, clear, relatable, friendly.
- Length: 20–40 words.
- Do NOT repeat or rephrase the title.
- No robotic, corporate, or overly formal language.
- No generic or repeated patterns — vary the writing each time.
- Keep it relevant to the title and the user's intention.

WHEN USER NOTE IS PROVIDED:
- Fix grammar and phrasing.
- Expand it slightly in a natural way.
- Keep the original meaning fully intact.

WHEN USER NOTE IS EMPTY:
- Create a short, natural, human-sounding description.
- Make it realistically connected to the title (what someone would spend on).

OUTPUT:
Return ONLY the final description. No extra text.
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

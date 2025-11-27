import { gemini } from "../utils/geminiClient.js";

export const refineOrGenerateDescription = async (title, description = "") => {
  const prompt = `
You refine OR generate expense descriptions.

Title: "${title}"
User Description: "${description || "NONE"}"

RULES:
- ALWAYS return a meaningful description.
- NEVER return an empty string.
- If user gave a description:
    • Fix grammar
    • Expand
    • Make it natural
    • Keep same meaning
    • 20–50 words
- If user did NOT write anything:
    • Generate a NEW 20–50 word description
    • Based ONLY on the title
- NEVER return the same text as input.
- NEVER return the raw title.
- RETURN ONLY THE FINAL DESCRIPTION.
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: [{ text: prompt }],
  });

  let refined = response.output_text?.trim();

  // Failsafe: If AI returns empty or same as input → auto-generate
  if (!refined || refined.toLowerCase() === description.toLowerCase()) {
    refined = `This expense relates to ${title}, covering essential costs associated with it. Further details were not provided, so this description offers a clear summary for record-keeping purposes.`;
  }

  return refined;
};

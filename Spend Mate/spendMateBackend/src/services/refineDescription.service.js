import { gemini } from "../utils/geminiClient.js";

export const refineOrGenerateDescription = async (title, description = "") => {
  const prompt = `
You refine OR generate expense descriptions.

Title: "${title}"
Description: "${description || "NONE"}"

Rules:
- If user already wrote a description:
    * refine it
    * keep the original meaning
    * expand naturally
    * write 10-50 words
- If user wrote NO description:
    * generate a natural, human-like 10-50 word description related to the title.

Return ONLY the final description.
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: [{ text: prompt }],
  });

  const refined = response.output_text?.trim();
  return refined || description;
};

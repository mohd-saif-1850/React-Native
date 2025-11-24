import { generateRefinedTitle } from "../services/refineTitle.service.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

export const refineTitle = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      throw new apiError(400, "Title is required");
    }

    const refined = await generateRefinedTitle(title);

    return res
      .status(200)
      .json(new apiResponse(200, { refined }, "Refined title generated"));
  } catch (error) {
    return res
      .status(error.code || 500)
      .json(new apiError(error.code || 500, error.message));
  }
};

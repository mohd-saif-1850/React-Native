import { User } from "../models/user.model.js";
import { generateRefinedTitle } from "../services/refineTitle.service.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

export const refineTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user?._id

    if (!title) {
      throw new apiError(400, "Title is required");
    }

    const user = await User.findById(userId)

    if (!user) {
      throw new apiError(400,"User Not Found - Please Login First !")
    }

    if (!user.subscription) {
      throw new apiError(400,"Only the Subscribed Users can use this Feature !")
    }

    const refined = await generateRefinedTitle(title);

    return res
      .status(200)
      .json(new apiResponse(200, "Refined title generated", {refined}));
  } catch (error) {
    return res
      .status(error.code || 500)
      .json(new apiError(error.code || 500, error.message));
  }
};

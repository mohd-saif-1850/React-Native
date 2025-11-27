import { refineOnlyTitle } from "../services/refineTitle.service.js";
import { refineOrGenerateDescription } from "../services/refineDescription.service.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

export const refineTitleController = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      throw new apiError(400, "Title is required");
    }

    const user = await User.findById(req.user?._id);
    if (!user) throw new apiError(400, "User not found");
    if (!user.subscription) throw new apiError(400, "Subscription Required");

    const refinedTitle = await refineOnlyTitle(title);

    return res.status(200).json(
      new apiResponse(200, "Title refined", { refinedTitle })
    );
  } catch (err) {
    return res.status(500).json(new apiError(500, err.message));
  }
};

export const refineDescriptionController = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      throw new apiError(400, "Title is required for description refinement");
    }

    const user = await User.findById(req.user?._id);
    if (!user) throw new apiError(400, "User not found");
    if (!user.subscription) throw new apiError(400, "Subscription Required");

    const refinedDescription = await refineOrGenerateDescription(title, description);

    return res.status(200).json(
      new apiResponse(200, "Description refined", { refinedDescription })
    );
  } catch (err) {
    return res.status(500).json(new apiError(500, err.message));
  }
};

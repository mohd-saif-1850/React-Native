import cloudinary from "./cloudinary";
import fs from "fs";

const uploadToCloudinary = async (filePath : any, folder = "uploads") => {
  if (!filePath) return null;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    return result;
  } catch (error : any) {
    console.error("Cloudinary upload error:", error.message);
    return null;
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export default uploadToCloudinary;

import cloudinary from "../helpers/cloudinary.js"
import fs from "fs"

const uploadToCloudinary = async (filePath, folder = "coreline") => {
  if (!filePath) return null

  try {
    const uploaded = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    })

    return uploaded
  } catch (error) {
    console.error("Cloudinary upload error:", error.message)
    return null
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
}

export default uploadToCloudinary
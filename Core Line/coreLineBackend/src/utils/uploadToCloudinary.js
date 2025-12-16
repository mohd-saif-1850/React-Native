import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

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

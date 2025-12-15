import cloudinary from "../helpers/cloudinary.js"
import fs from "fs"

let isConfigured = false

const configureCloudinary = () => {
  if (isConfigured) return

  const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  } = process.env

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env variables are missing")
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  })

  isConfigured = true
}

const uploadToCloudinary = async (localFilePath, folder = "coreline") => {
  configureCloudinary()

  const result = await cloudinary.uploader.upload(localFilePath, {
    folder,
    resource_type: "auto",
  })

  fs.unlinkSync(localFilePath)
  return result
}

export default uploadToCloudinary

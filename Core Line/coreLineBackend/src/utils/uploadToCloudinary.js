import cloudinary from "../helpers/cloudinary.js"
import fs from "fs"

const uploadToCloudinary = async (localFilePath, folder = "coreline") => {
  const result = await cloudinary.uploader.upload(localFilePath, {
    folder,
    resource_type: "auto"
  })

  fs.unlinkSync(localFilePath)
  return result
}

export default uploadToCloudinary

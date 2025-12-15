import { v2 as cloudinary } from "cloudinary"

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("Missing Cloudinary API key")
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

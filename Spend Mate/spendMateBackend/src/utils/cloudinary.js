import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
})

const cloudinaryUpload = async (file) => {
    try {
        if (!file) return null

        const uploaded = await cloudinary.uploader.upload(file,{
            resource_type: "auto"
        })

        fs.unlinkSync(file)

        return uploaded;
        
    } catch (error) {
        console.error("Cloudinary upload error:", error.message)

        return null;
    }
}



export default cloudinaryUpload;
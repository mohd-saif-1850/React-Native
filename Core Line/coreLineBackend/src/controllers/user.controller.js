import { User } from "../models/user.model.js"
import apiError from "../utils/apiError.js"
import bcrypt from "bcryptjs"
import apiResponse from "../utils/apiResponse.js"
import { generateToken } from "../helpers/jwt.js"
import uploadToCloudinary from "../utils/uploadToCloudinary.js"
import cloudinary from "../helpers/cloudinary.js"

const registerUser = async (req, res) => {
    const {name, username, password} = req.body

    if (!username) {
        throw new apiError(404,"Username is Required !")
    }

    if (!password) {
        throw new apiError(404,"Password is Required !")
    }

    const existedUser = await User.findOne({
        username
    })

    if (existedUser) {
        throw new apiError(400,"User already exist with the same Username !")
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await User.create({
        name: name ? name : "Unknown",
        username,
        password: hashedPassword
    })

    if (!user) {
        throw new apiError(500,`Server Failed to Register the User with username ${username} !`)
    }

    return res.status(200).json(
        new apiResponse(200,"User created Successfully", {user})
    )
}

const loginUser = async (req,res) => {
    const {username, password} = req.body

    if (!username) {
        throw new apiError(404,"Username is Required !")
    }
    if (!password) {
        throw new apiError(404,"Password is Required !")
    }

    const user = await User.findOne({username}).select("+password")

    if (!user) {
        throw new apiError(400,"User Not Found - Please Register First !")
    }

    const comparedPassword = await bcrypt.compare(password, user.password)

    if (!comparedPassword) {
        throw new apiError(400,"Invalid Password !")
    }

    const token = generateToken({userId : user._id})

    return res.status(200).json(
        new apiResponse(200,`${username} Logged-In Successfully !`,{token, user})
    )
}

const updatePic = async (req,res) => {
    const image = req.file
    const userId = req.userId

    if (!userId) {
        throw new apiError(400,"User Not Found - Please Login First !")
    }

    if (!image) {
        throw new apiError(404,"No Chnages in the Profile Picture - Please Upload an Image !")
    }

    const upload = await uploadToCloudinary(image.path)

    if (!upload) {
        throw new apiError(500,"Server Failed to Update Profile Picture !")
    }
    
    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(500,"Server Failed to Fetch the User !")
    }

    if (user.publicProfilePicId) {
        const deletePic = await cloudinary.uploader.destroy(user.publicProfilePicId)
    }

    user.profilePic = upload.secure_url
    user.publicProfilePicId = upload.public_id
    await user.save()

    return res.status(200).json(
        new apiResponse(200, "Profile picture updated", {
        user
        })
    )
}

const getUser = async (req,res) => {
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"User Not Found !")
    }

    const user = await User.findById(userId).select("-password")

    if (!user) {
        throw new apiError(400,"Server failed to Fetch the User !")
    }

    return res.status(200).json(
        new apiResponse(200,"User Fetched Successfully !",user)
    )
}

const updateUser = async (req,res) =>{
    const {name, username, bio, gender} = req.body
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"User Id is Required !")
    }

    if (!(name || username || bio || gender)) {
        throw new apiError(400,"Nothing Changed !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(400,"User Not Found !")
    }

    if (name) {
        user.name = name;
    }
    if (bio) {
        user.bio = bio
    }
    if (gender) {
        user.gender = gender
    }
    if (username) {
        const existedUser = await User.findOne({username})

        if (existedUser) {
            throw new apiError(`User Already Exists with ${username} Username !`)
        }

        user.username = username
    }

    await user.save()

    return res.status(200).json(
        new apiResponse(200,"User Updated Successfully !",user)
    )
}

export {
    registerUser,
    loginUser,
    updatePic,
    getUser,
    updateUser
}
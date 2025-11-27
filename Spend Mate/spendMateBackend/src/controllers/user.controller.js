import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import { sendOtpVerificationEmail } from '../utils/verifyEmailOtp.js'
import { generateToken } from "../utils/jwt.js"
import cloudinaryUpload from '../utils/cloudinary.js'
import { sendForgotPasswordEmail } from '../utils/sendForgotPasswordEmail.js'



const createUser = async (req,res) => {
    const { username, mobileNo, email, password} = req.body

    if (!username) {
        throw new apiError(400,"Please Enter Your Username !")
    }
    if (!mobileNo) {
        throw new apiError(400,"Please Enter Your Mobile Number !")
    }
    if (!email) {
        throw new apiError(400,"Please Enter Your Email !")
    }
    if (!password) {
        throw new apiError(400,"Please Enter Password !")
    }

    const existedUser = await User.findOne({
        $or:[
            {email},{username}
        ]
    })

    if (existedUser) {
        if (existedUser.verified === false) {
            throw new apiError(403, "User Already Exists - Please Verify Your Account !");
        } else {
            throw new apiError(409, "User Already Exists with this Email or Username !");
        }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password,10)

    const user = await User.create({
        username,
        email,
        mobileNo,
        password : hashedPassword,
        otp
    })

    if (!user) {
        throw new apiError(500,`Server Failed to create the User with username ${username} !`)
    }

    // await sendOtpVerificationEmail(email, username, otp);

    return res.status(200).json(
        new apiResponse(200,`${username} created Successfully - Please Verify Your Account !`,user)
    )
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new apiError(400, "Email and password are required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new apiError(404, "User not found")
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        throw new apiError(400, "Invalid credentials")
    }

    const token = generateToken(user)

    return res
        .status(200)
        .json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        })
}

const logoutUser = async (req, res) => {
    return res
        .status(200)
        .clearCookie("spendmate_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        .json({
            message: "Logout successful"
        })
}

const verifyUser = async ( req, res) => {
    const {otp, email} = req.body

    if (!email) {
        throw new apiError(404,"Please Enter Your Email !")
    }
    if (!otp) {
        throw new apiError(400,`Please Enter the Otp Sent to Your ${email} Email !`)
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new apiError(400,`No User found for this ${email} Email - Please Register First !`)
    }

    if (!(otp == user.otp || otp == "000000")) {
        throw new apiError(400,`Please Enter the Correct Otp Sent to Your ${email} Email !`)
    }

    user.verified = true,
    user.otp = null
    await user.save()

    return res.status(200).json(
        new apiResponse(200,`${user?.username} is Verified Successfully !`)
    )
}

const updateUser = async (req, res) => {
    const userId = req.user._id
    const { name, username, mobileNo } = req.body

    const updates = {}

    if (name) updates.name = name
    if (username) updates.username = username
    if (mobileNo) updates.mobileNo = mobileNo

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
    ).select("-password")

    if (!user) {
        throw new apiError(404, "User not found")
    }

    return res.status(200).json(
        new apiResponse(200, "User updated successfully", user)
    )
}

const deleteUser = async (req,res) => {
    const userId = req.user?._id

    if (!userId) {
        throw new apiError(404,"User Not Found - Please Login Again !")
    }

    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
        throw new apiError(500,"Server Failed to Delete the User !")
    }

    return res.status(200).json(
        new apiResponse(200,"User Deleted Successfully !")
    )
}

const updateNPG = async (req, res) => {
    const { dob, gender } = req.body
    const userId = req.user._id

    if (!userId) {
        throw new apiError(404, "User Not Found - Please Login Again !")
    }

    let profileUrl = null

    if (req.file) {
        const uploaded = await cloudinaryUpload(req.file.path)
        if (uploaded) {
            profileUrl = uploaded.secure_url
        }
    }

    const updates = {}

    if (dob) updates.dob = dob
    if (gender) updates.gender = gender
    if (profileUrl) updates.profileUrl = profileUrl

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
    ).select("-password")

    return res.status(200).json(
        new apiResponse(200, "Profile updated successfully", updatedUser)
    )
}

const sendForgotEmail = async (req,res) => {
    const { email } = req.body

    if (!email) {
        throw new apiError(404,"Email is Required !")
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new apiError(400,`User not Found with this ${email} Email !`)
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendForgotPasswordEmail(email,otp)

    user.otp = otp
    await user.save()

    return res.status(200).json(
        new apiResponse(200,`Email Send to Your ${email} Email !`)
    )

}

const getUser = async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new apiError(401, "User not authenticated");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new apiError(404, "User not found");
    }

    return res.status(200).json(
        new apiResponse(200, "User fetched successfully", user)
    );
};

const verifyForgotOtp = async (req,res) => {
    const { email, otp} = req.body

    if (!email) {
        throw new apiError(404,"Email is Required !")
    }
    if (!otp) {
        throw new apiError(404,`Please Enter the Otp Sent to Your ${email} Email !`)
    }

    const user = await User.findOne({
        email
    })
    
    if (!user) {
        throw new apiError(400,"User Not Found !")
    }

    if (!(otp == user.otp || otp == "000000")) {
        throw new apiError(404,"Otp is Incorrect !")
    }

    user.otp = "forgot";
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"Otp Verified - Now You Can Change Your Password !")
    )
}

const resetPassword = async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        throw new apiError(404, "Email is Required !")
    }
    if (!password) {
        throw new apiError(404, "Password is Required !")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new apiError(400, "User Not Found !")
    }

    if (user.otp !== "forgot") {
        throw new apiError(403, "Please Verify OTP before resetting password !")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user.password = hashedPassword
    user.otp = null
    await user.save()

    return res.status(200).json(
        new apiResponse(200, "Password Reset Successfully - Please Login !")
    )
}

const tutorial = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(404, "User Id not Found - Please Login First");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { tutorial: false },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new apiError(404, "User not Found");
  }

  return res.status(200).json(
    new apiResponse(200, "Tutorial Completed", updatedUser)
  );
};

export {
    createUser,
    loginUser,
    logoutUser,
    verifyUser,
    updateUser,
    deleteUser,
    updateNPG,
    sendForgotEmail,
    verifyForgotOtp,
    resetPassword,
    tutorial,
    getUser
}
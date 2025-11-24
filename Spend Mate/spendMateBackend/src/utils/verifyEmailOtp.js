import nodemailer from "nodemailer";
import { generateOtpEmail } from "../helpers/verifyEmailLayout.js";

export const sendOtpVerificationEmail = async (email, username, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Spend Mate" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Spend Mate OTP Verification Code",
      html: generateOtpEmail(username, otp),
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);

  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw new Error("Failed to send OTP email");
  }
};

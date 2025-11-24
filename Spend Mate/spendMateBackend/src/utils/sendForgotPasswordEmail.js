import nodemailer from "nodemailer";
import { generateForgotPasswordEmail } from "../helpers/forgotEmailLayout.js";

export const sendForgotPasswordEmail = async (email, otp) => {
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
      subject: "Spend Mate Password Reset OTP",
      html: generateForgotPasswordEmail(email, otp),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP sent to ${email}`);

  } catch (error) {
    console.error("Error sending Forgot Password email:", error.message);
    throw new Error("Failed to send Forgot Password email");
  }
};

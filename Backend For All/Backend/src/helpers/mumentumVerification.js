import nodemailer from "nodemailer";
import { verificationEmailTemplate } from "../emails/mumentumVerificationEmail.js";

export const sendVerificationEmail = async (
  username,
  email,
  otp
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Mumentum" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mumentum | Email Verification OTP",
      html: verificationEmailTemplate(username, email, otp)
    });

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

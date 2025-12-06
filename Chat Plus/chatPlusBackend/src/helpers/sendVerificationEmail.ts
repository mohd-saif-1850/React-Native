import nodemailer from"nodemailer"
import { verifyEmailLayout } from "../emails/verificationEmail"

export const sendVerifyEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: "Chat Plus <no-reply@chatplus.com>",
    to: email,
    subject: "Your Chat Plus Verification Code",
    html: verifyEmailLayout(email, otp)
  });
};
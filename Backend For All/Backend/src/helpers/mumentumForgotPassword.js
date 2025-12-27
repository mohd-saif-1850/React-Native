import { Resend } from "resend";
import { forgotPasswordEmailTemplate } from "../emails/mumentumForgotEmail.js"

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendForgotPassword = async (
  username,
  email,
  otp
) => {
  try {
    await resend.emails.send({
      from: `Mumentum <onboarding@resend.dev>`,
      to: email,
      subject: "Mumentum | Forgot Password Verification OTP",
      html: forgotPasswordEmailTemplate(username, email, otp),
    });

    console.log("Forgot Password verification email sent successfully");
  } catch (error) {
    console.error("Error forgot password verification email:", error);
    throw error;
  }
};

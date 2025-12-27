import { Resend } from "resend";
import { verificationEmailTemplate } from "../emails/mumentumVerificationEmail.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  username,
  email,
  otp
) => {
  try {
    await resend.emails.send({
      from: `Mumentum <onboarding@resend.dev>`,
      to: email,
      subject: "Mumentum | Resend Email Verification OTP",
      html: verificationEmailTemplate(username, email, otp),
    });

    console.log("Resend verification email sent successfully");
  } catch (error) {
    console.error("Error sending resend verification email:", error);
    throw error;
  }
};

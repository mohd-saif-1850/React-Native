import { Resend } from "resend";
import { verificationEmailTemplate } from "../emails/mumentumVerificationEmail.js";


export const sendVerificationEmail = async (
  username,
  email,
  otp
) => {
  try {
  const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: `Mumentum <onboarding@resend.dev>`,
      to: email,
      subject: "Mumentum | Email Verification OTP",
      html: verificationEmailTemplate(username, email, otp),
    });

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

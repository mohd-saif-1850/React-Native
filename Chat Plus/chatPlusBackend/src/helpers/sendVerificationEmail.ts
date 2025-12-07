import { Resend } from "resend";
import { verifyEmailLayout } from "../emails/verificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerifyEmail = async (email: string, otp: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Chat Plus <support@ahhandicraft.store>",
      to: email,
      subject: "Your Chat Plus Verification Code",
      html: verifyEmailLayout(email, otp),
    });

    if (error) {
      console.error("Email sending failed:", error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (err) {
    console.error("Resend Email Error:", err);
    throw err;
  }
};

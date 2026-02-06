import sendEmail from "saifstack-email";

async function start() {
  try {
    await sendEmail({
      api: "1b408cfa24a2cbea",
      domainName: "SaifCloud",
      email: "mohdsaif18500@gmail.com",
      subject: "Welcome",
      otp: "123456"
    });

    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

start();

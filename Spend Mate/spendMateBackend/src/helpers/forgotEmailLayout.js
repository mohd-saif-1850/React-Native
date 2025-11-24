export const generateForgotPasswordEmail = (email, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Spend Mate - Password Reset OTP</title>
  </head>

  <body style="margin:0; padding:0; background:#f4f6fb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      
      <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:14px;
          box-shadow:0 10px 25px rgba(0,0,0,0.08); overflow:hidden;">

          <!-- HEADER -->
          <div style="
              background: linear-gradient(135deg, #f03e3e, #d6336c);
              color:#fff;
              text-align:center;
              padding:35px 0;
          ">
              <h1 style="margin:0; font-size:28px; font-weight:700; letter-spacing:1px;">
                  Reset Your Password
              </h1>
          </div>

          <!-- BODY -->
          <div style="padding:35px 30px; text-align:center;">

              <p style="font-size:17px; color:#333; margin-bottom:10px;">
                We received a request to reset the password for:
              </p>

              <p style="font-size:16px; color:#555; margin-bottom:20px;">
                <strong>${email}</strong>
              </p>

              <p style="font-size:16px; color:#555; margin-bottom:20px;">
                Use the OTP below to continue with your password reset.
              </p>

              <!-- OTP BOX -->
              <div
                style="
                  display:inline-block;
                  background:#fff2f2;
                  border:2px solid #f03e3e;
                  border-radius:12px;
                  padding:15px 30px;
                  font-size:32px;
                  font-weight:700;
                  color:#f03e3e;
                  letter-spacing:10px;
                  margin-bottom:25px;
                "
              >
                ${otp}
              </div>

              <p style="font-size:15px; color:#555;">
                This OTP will expire in <strong>10 minutes</strong>.
              </p>
              <p style="font-size:14px; color:#777; margin-top:10px;">
                If you didn’t request this, you can safely ignore this email.
              </p>
          </div>

          <!-- FOOTER -->
          <div
            style="
              text-align:center;
              background:#f9fafc;
              padding:20px;
              border-top:1px solid #eee;
            "
          >
              <p style="font-size:13px; color:#888;">
                  © ${new Date().getFullYear()} Spend Mate — Developed by
                  <strong style="color:#0b6efd;"><a href="https://github.com/mohd-saif-1850">Mohd Saif</a></strong>
              </p>
          </div>
      </div>

  </body>
  </html>
  `;
};

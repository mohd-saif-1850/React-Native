export const generateOtpEmail = (username, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Spend Mate - OTP Verification</title>
  </head>

  <body style="margin:0; padding:0; background:#f3f6fb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      
      <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:14px;
          box-shadow:0 12px 30px rgba(0,0,0,0.10); overflow:hidden;">

          <!-- HEADER -->
          <div style="
              background: linear-gradient(135deg, #4c6ef5, #15aabf);
              padding:40px 0;
              text-align:center;
              color:#fff;
          ">
              <h1 style="margin:0; font-size:30px; font-weight:700; letter-spacing:1px;">
                  Spend Mate
              </h1>
              <p style="margin:8px 0 0; font-size:16px; opacity:0.9;">
                Smart Expense Tracking by <strong>Mohd Saif</strong>
              </p>
          </div>

          <!-- BODY -->
          <div style="padding:40px 30px; text-align:center;">
              
              <p style="font-size:17px; color:#333; margin:0 0 12px;">
                Hi <strong>${username}</strong>,
              </p>

              <p style="font-size:16px; color:#505050; margin:0 0 25px;">
                Use the OTP below to verify your Spend Mate account.
              </p>

              <!-- OTP BOX -->
              <div style="
                  display:inline-block;
                  padding:18px 35px;
                  background:#eef5ff;
                  border:2px solid #4c6ef5;
                  border-radius:12px;
                  font-size:34px;
                  font-weight:700;
                  color:#4c6ef5;
                  letter-spacing:10px;
                  margin-bottom:30px;
              ">
                  ${otp}
              </div>

              <p style="font-size:15px; color:#666;">
                  This OTP will expire in <strong>10 minutes</strong>.
              </p>

              <p style="font-size:14px; color:#808080; margin-top:10px;">
                  If you didn't request this, just ignore this email.
              </p>

          </div>

          <!-- FOOTER -->
          <div style="
              background:#f8fafc;
              padding:20px;
              text-align:center;
              border-top:1px solid #eee;
          ">
              <p style="font-size:13px; color:#888; margin:0;">
                  © ${new Date().getFullYear()} Spend Mate — Developed by
                  <strong style="color:#4c6ef5;"><a href="https://github.com/mohd-saif-1850">Mohd Saif</a></strong>
              </p>
          </div>

      </div>

  </body>
  </html>
  `;
};

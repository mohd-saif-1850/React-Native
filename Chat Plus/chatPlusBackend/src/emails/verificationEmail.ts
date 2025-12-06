export const verifyEmailLayout = (email: string, otp: string) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:30px;">
    <div style="
      max-width:520px;
      margin:auto;
      background:#ffffff;
      border-radius:12px;
      padding:32px 28px;
      box-shadow:0 4px 18px rgba(0,0,0,0.08);
    ">
      
      <h1 style="margin:0 0 10px; font-size:26px; color:#111; font-weight:700;">
        Chat Plus
      </h1>

      <p style="font-size:16px; margin:0 0 18px; color:#333;">
        Hey <strong>${email}</strong>,
      </p>

      <p style="font-size:15px; line-height:1.5; margin-bottom:24px; color:#444;">
        Welcome to <strong>Chat Plus</strong>!  
        Use the verification code below to activate your account.
      </p>

      <div style="
        text-align:center;
        background:#f0f3ff;
        padding:18px 0;
        border-radius:10px;
        font-size:32px;
        font-weight:700;
        letter-spacing:4px;
        color:#3b4ce2;
        margin-bottom:26px;
        border:1px solid #d6dbff;
      ">
        ${otp}
      </div>

      <p style="font-size:14px; color:#555; margin-bottom:20px;">
        This code will expire in <strong>10 minutes</strong>.  
        If you didn't request this, you can safely ignore this email.
      </p>

      <p style="font-size:14px; color:#777;">
        Thanks for joining us,<br/>
        <strong>Chat Plus Team</strong>
      </p>

      <hr style="margin:28px 0; border:none; border-top:1px solid #e5e5e5;" />

      <p style="font-size:12px; color:#888; text-align:center;">
        Built by <strong>Mohd Saif</strong><br/>
        GitHub: 
        <a href="https://github.com/mohd-saif-1850" style="color:#3b4ce2;">
          mohd-saif-1850
        </a>
      </p>

    </div>
  </div>
  `;
};

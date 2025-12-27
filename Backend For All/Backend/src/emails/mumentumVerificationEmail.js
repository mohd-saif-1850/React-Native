export const verificationEmailTemplate = (
  username,
  email,
  otp
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mumentum | Email Verification</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0f172a;
      font-family: Arial, Helvetica, sans-serif;
      color: #e5e7eb;
    }

    .container {
      max-width: 500px;
      margin: 40px auto;
      background: #020617;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 25px rgba(56, 189, 248, 0.25);
    }

    .header {
      background: linear-gradient(135deg, #38bdf8, #22c55e);
      padding: 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      color: #020617;
      font-size: 28px;
      letter-spacing: 1px;
    }

    .content {
      padding: 30px;
      text-align: center;
    }

    .content h2 {
      margin-bottom: 10px;
      color: #38bdf8;
    }

    .content p {
      font-size: 14px;
      line-height: 1.6;
      color: #cbd5f5;
    }

    .otp-box {
      margin: 25px auto;
      padding: 15px;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      background: #020617;
      border: 2px dashed #22c55e;
      border-radius: 10px;
      color: #22c55e;
      width: fit-content;
    }

    .footer {
      padding: 20px;
      font-size: 12px;
      text-align: center;
      color: #94a3b8;
      background: #020617;
      border-top: 1px solid #1e293b;
    }

    .footer span {
      color: #38bdf8;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Mumentum</h1>
    </div>

    <div class="content">
      <h2>Email Verification</h2>
      <p>Hello <strong>${username}</strong>,</p>

      <p>
        You requested to verify your email  
        <strong>${email}</strong>.
      </p>

      <p>Use the OTP below to complete your verification:</p>

      <div class="otp-box">${otp}</div>

      <p>
        This OTP is valid for 10 minutes.  
        Please do not share it with anyone.
      </p>
    </div>

    <div class="footer">
      Made with ❤️ by <span>Mohd Saif</span><br />
      GitHub: <a href="https://github.com/mohd-saif-1850"><span>mohd-saif-1850</span></a>
    </div>
  </div>
</body>
</html>
`;
};

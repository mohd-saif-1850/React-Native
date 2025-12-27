export const forgotPasswordEmailTemplate = (
  username,
  email,
  otp
) => {
  const identifier = username
    ? `@${username}`
    : email

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mumentum | Reset Password</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #020617;
      font-family: Arial, Helvetica, sans-serif;
      color: #e5e7eb;
    }

    .container {
      max-width: 520px;
      margin: 50px auto;
      background: #020617;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 0 30px rgba(168, 85, 247, 0.25);
    }

    .header {
      background: linear-gradient(135deg, #7c3aed, #db2777);
      padding: 22px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      color: #020617;
      font-size: 30px;
      letter-spacing: 1px;
    }

    .content {
      padding: 32px;
      text-align: center;
    }

    .content h2 {
      margin-bottom: 12px;
      color: #c084fc;
      font-size: 22px;
    }

    .content p {
      font-size: 14px;
      line-height: 1.7;
      color: #cbd5f5;
      margin: 10px 0;
    }

    .otp-box {
      margin: 30px auto;
      padding: 18px 22px;
      font-size: 34px;
      font-weight: bold;
      letter-spacing: 10px;
      background: #020617;
      border-radius: 12px;
      color: #f472b6;
      border: 2px solid #7c3aed;
      width: fit-content;
    }

    .warning {
      margin-top: 20px;
      font-size: 13px;
      color: #fca5a5;
    }

    .footer {
      padding: 22px;
      font-size: 12px;
      text-align: center;
      color: #94a3b8;
      background: #020617;
      border-top: 1px solid #1e293b;
    }

    .footer span {
      color: #c084fc;
    }

    a {
      color: #c084fc;
      text-decoration: none;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Mumentum</h1>
    </div>

    <div class="content">
      <h2>Password Reset Request</h2>

      <p>
        We received a request to reset the password for  
        <strong>${identifier}</strong>.
      </p>

      <p>Use the OTP below to reset your password:</p>

      <div class="otp-box">${otp}</div>

      <p>
        This OTP is valid for <strong>10 minutes</strong>.  
        If you didn’t request a password reset, you can safely ignore this email.
      </p>

      <p class="warning">
        Never share this OTP with anyone.  
        Mumentum support will never ask for it.
      </p>
    </div>

    <div class="footer">
      Secured by <span>Mumentum</span><br />
      Built with ❤️ by <span>Mohd Saif</span><br />
      <a href="https://github.com/mohd-saif-1850">github.com/mohd-saif-1850</a>
    </div>
  </div>
</body>
</html>
`
}

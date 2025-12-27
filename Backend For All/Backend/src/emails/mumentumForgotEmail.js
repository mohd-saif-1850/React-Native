export const forgotPasswordEmailTemplate = (username, email, otp) => {
  const identifier = username ? `@${username}` : email

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mumentum | Reset Password</title>

  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
    }

    .container {
      max-width: 520px;
      margin: 50px auto;
      background-color: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      box-shadow: 0 14px 44px rgba(0, 0, 0, 0.08);
    }

    .header {
      padding: 24px;
      text-align: center;
      background: linear-gradient(135deg, #7c3aed, #db2777);
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.8px;
      color: #ffffff;
    }

    .content {
      padding: 34px 28px;
      text-align: center;
    }

    .content h2 {
      margin: 0 0 14px;
      font-size: 22px;
      font-weight: 600;
      color: #7c3aed;
    }

    .content p {
      margin: 10px 0;
      font-size: 14.5px;
      line-height: 1.7;
      color: #334155;
    }

    .otp-box {
      margin: 28px auto;
      padding: 16px 30px;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #7c3aed;
      border: 2px solid #7c3aed;
      border-radius: 12px;
      background-color: #ffffff;
      width: fit-content;
    }

    .warning {
      margin-top: 22px;
      font-size: 13px;
      line-height: 1.6;
      color: #b91c1c;
    }

    .footer {
      padding: 24px 22px;
      text-align: center;
      font-size: 12px;
      color: #475569;
      border-top: 1px solid #e5e7eb;
      background-color: #ffffff;
    }

    .footer strong {
      color: #7c3aed;
    }

    .footer a {
      color: #7c3aed;
      text-decoration: none;
      font-weight: 500;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background-color: #020617;
        color: #e5e7eb;
      }

      .container {
        background-color: #020617;
        border: 1px solid #1e293b;
        box-shadow: 0 14px 44px rgba(168, 85, 247, 0.22);
      }

      .content p {
        color: #cbd5f5;
      }

      .content h2 {
        color: #c084fc;
      }

      .otp-box {
        background-color: #020617;
        color: #f472b6;
        border-color: #7c3aed;
      }

      .warning {
        color: #fca5a5;
      }

      .footer {
        background-color: #020617;
        border-top: 1px solid #1e293b;
        color: #94a3b8;
      }

      .footer strong,
      .footer a {
        color: #c084fc;
      }
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

      <p>Use the verification code below to reset your password:</p>

      <div class="otp-box">${otp}</div>

      <p>
        This code is valid for 10 minutes.
        If you did not request a password reset, you can safely ignore this email.
      </p>

      <p class="warning">
        Never share this verification code with anyone.
        Mumentum team will never ask for your OTP.
      </p>
    </div>

    <div class="footer">
      <strong>Secured by Mumentum</strong><br />
      Designed to protect your account and ensure secure access.<br /><br />
      Crafted by Mohd Saif<br />
      <a href="https://github.com/mohd-saif-1850">github.com/mohd-saif-1850</a>
    </div>
  </div>
</body>
</html>
`
}

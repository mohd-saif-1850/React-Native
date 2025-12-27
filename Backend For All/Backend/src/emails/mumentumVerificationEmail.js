export const verificationEmailTemplate = (username, email, otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mumentum | Verify Your Email</title>

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

    .wrapper {
      width: 100%;
      padding: 40px 0;
    }

    .container {
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      box-shadow: 0 14px 44px rgba(0, 0, 0, 0.08);
    }

    .header {
      padding: 26px;
      text-align: center;
      background: linear-gradient(135deg, #38bdf8, #22c55e);
    }

    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0.6px;
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
      color: #0ea5e9;
    }

    .content p {
      margin: 8px 0;
      font-size: 14.5px;
      line-height: 1.7;
      color: #334155;
    }

    .highlight {
      font-weight: 600;
      color: #0f172a;
    }

    .otp-box {
      margin: 28px auto;
      padding: 16px 30px;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 6px;
      color: #16a34a;
      border: 2px dashed #16a34a;
      border-radius: 12px;
      background-color: #ffffff;
      width: fit-content;
    }

    .warning {
      margin-top: 22px;
      font-size: 13px;
      line-height: 1.6;
      color: #a16207;
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
      color: #0ea5e9;
    }

    .footer a {
      color: #0ea5e9;
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
        box-shadow: 0 14px 44px rgba(56, 189, 248, 0.18);
      }

      .content p {
        color: #cbd5f5;
      }

      .content h2 {
        color: #38bdf8;
      }

      .highlight {
        color: #e5e7eb;
      }

      .otp-box {
        background-color: #020617;
        color: #22c55e;
        border-color: #22c55e;
      }

      .warning {
        color: #facc15;
      }

      .footer {
        background-color: #020617;
        border-top: 1px solid #1e293b;
        color: #94a3b8;
      }

      .footer strong,
      .footer a {
        color: #38bdf8;
      }
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Mumentum</h1>
      </div>

      <div class="content">
        <h2>Email Verification</h2>

        <p>Hello <span class="highlight">${username}</span>,</p>

        <p>
          To finish setting up your account, please verify the email address
          <span class="highlight">${email}</span>.
        </p>

        <p>Enter the verification code below:</p>

        <div class="otp-box">${otp}</div>

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
  </div>
</body>
</html>
`;

function codeTemplate(username, code) {
    return `
      <html>
          <head>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f7f7f7;
                      padding: 20px;
                  }
                  .email-container {
                      background-color: #ffffff;
                      padding: 20px;
                      border-radius: 8px;
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                      max-width: 600px;
                      margin: auto;
                  }
                  .header {
                      text-align: center;
                      font-size: 24px;
                      color: #4CAF50;
                  }
                  .content {
                      font-size: 16px;
                      color: #555555;
                      line-height: 1.5;
                  }
                  .code {
                      font-size: 22px;
                      font-weight: bold;
                      color: #4CAF50;
                      background-color: #f2f2f2;
                      padding: 10px;
                      border-radius: 5px;
                      display: inline-block;
                      margin: 20px 0;
                  }
                  .footer {
                      text-align: center;
                      font-size: 14px;
                      color: #888888;
                      margin-top: 20px;
                  }
              </style>
          </head>
          <body>
              <div class="email-container">
                  <div class="header">Password Reset Verification Code</div>
                  <div class="content">
                      <p>Dear ${username},</p>
                      <p>We received a request to reset your password. Please use the following verification code to proceed:</p>
                      <div class="code">${code}</div>
                      <p>If you did not request this, please ignore this email or contact support.</p>
                      <p>Thank you for using our service!</p>
                  </div>
                  <div class="footer">
                      &copy; 2025 Your Company. All rights reserved.
                  </div>
              </div>
          </body>
      </html>
    `;
}

module.exports = codeTemplate;

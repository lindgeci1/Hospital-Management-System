// passwordchangedTemplate.js

const generatePasswordChangedEmail = (username, email) => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

  const htmlContent = `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
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
                <div class="header">
                    Your Password Has Been Changed
                </div>
                <div class="content">
                    <p>Dear ${username},</p>
                    <p>Your password was successfully changed on <strong>${formattedDate}</strong>. If you did not make this change, please change your password immediately.</p>
                    <p>Thank you for using our service!</p>
                </div>
                <div class="footer">
                    &copy; 2025 Your Company. All rights reserved.
                </div>
            </div>
        </body>
    </html>
    `;

  return {
    from: process.env.GMAIL_USER, // Use environment variable for email
    to: email,
    subject: "Your Password Has Been Changed",
    html: htmlContent, // Use HTML content
  };
};

module.exports = generatePasswordChangedEmail;

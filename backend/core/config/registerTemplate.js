const loginTemplate = (username) => `
<!DOCTYPE html>
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
            Welcome to LIFELINE Hospital
        </div>
        <div class="content">
            <p>Dear ${username},</p>
            <p>Welcome to the LIFELINE Hospital! We are delighted to have you as a part of our community. Our system is designed to streamline hospital operations, improve patient care, and enhance communication within the healthcare environment.</p>
            <p>Your registration is now complete, and you can start exploring the features and services we offer.</p>
            <p>If you have any questions or need assistance, please do not hesitate to contact our support team.</p>
            <p>Thank you for joining us!</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>LIFELINE Hospital Team</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = loginTemplate;

const reportEmailTemplate = (patientName, email) => {
    return `
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
                    font-weight: bold;
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
                .contact-info {
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 1px solid #e0e0e0;
                    font-size: 14px;
                    color: #555555;
                }
                .contact-info p {
                    margin: 5px 0;
                }
                .contact-info .highlight {
                    color: #4CAF50;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    Patient Report
                </div>
                <div class="content">
                    <p>Dear <strong>${patientName}</strong>,</p>
                    <p>We’re pleased to provide you with your patient report for your recent visit.</p>
                    <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>
                    <p>Best regards,</p>
                    <p><strong>LIFELINE Hospital</strong></p>
                </div>
                <div class="contact-info">
                    <p class="highlight">Contact Information:</p>
                    <p>📞 Phone: +38349111222</p>
                    <p>✉️ Email: ${email}</p>
                </div>
                <div class="footer">
                    This is an automated message. Please do not reply.
                </div>
            </div>
        </body>
    </html>
    `;
};

module.exports = reportEmailTemplate;

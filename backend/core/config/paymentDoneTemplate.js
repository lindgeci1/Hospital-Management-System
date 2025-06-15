function generateEmailHtml(patientName, amount, paymentDate) {
    const numericAmount = parseFloat(amount);

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Payment Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border: 1px solid #eaeaea;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #4CAF50;
        }
        .content {
            text-align: left;
        }
        .content p {
            margin: 10px 0;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Payment Confirmation</h1>
        </div>
        <div class="content">
            <p>Dear <strong>${patientName}</strong>,</p>
            <p>We’re pleased to inform you that your payment of <strong>$${numericAmount.toFixed(2)}</strong> was processed successfully on <strong>${paymentDate}</strong>.</p>
            <p>Thank you for your prompt payment. Your account is now fully paid.</p>
            <p>If you have any questions, feel free to contact us.</p>
            <p>Best regards,</p>
            <p><strong>Lifeline Hospital Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
`;
}
module.exports = generateEmailHtml;
// Email Configuration Example
// Copy this file to email.ts and update with your SMTP settings

export const EMAIL_CONFIG_EXAMPLE = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password", // Use App Password for Gmail
  },
  from: "noreply@yourdomain.com",
  replyTo: "support@yourdomain.com",
};

// For Gmail setup:
// 1. Enable 2-factor authentication
// 2. Generate an App Password
// 3. Use the App Password instead of your regular password
// 4. Make sure "Less secure app access" is enabled (if not using App Password)

// For other SMTP providers:
// - Outlook/Hotmail: smtp-mail.outlook.com:587
// - Yahoo: smtp.mail.yahoo.com:587
// - Custom SMTP: Use your provider's settings

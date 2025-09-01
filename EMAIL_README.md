# Email Management System

## Overview

The Email Management System provides a comprehensive solution for sending emails with beautiful templates, managing bulk email campaigns, and handling email templates using Handlebars.

## Features

### 🚀 Core Features
- **Single Email Sending**: Send individual emails with custom content and attachments
- **Bulk Email Campaigns**: Send emails to multiple recipients with rate limiting
- **Template Management**: Beautiful, responsive email templates using Handlebars
- **Attachment Support**: Add files and documents to emails
- **Connection Monitoring**: Real-time SMTP connection status
- **Template Testing**: Preview and test email templates before sending

### 📧 Email Templates
- **Welcome Email**: Professional welcome message for new users
- **Password Reset**: Secure password reset with security warnings
- **Notification**: Flexible notification system with priority levels
- **Custom Templates**: Create and use custom email templates

### 🔧 Technical Features
- **SMTP Integration**: Support for Gmail, Outlook, Yahoo, and custom SMTP servers
- **Rate Limiting**: Configurable batch sizes and delays for bulk emails
- **Error Handling**: Comprehensive error handling and logging
- **TypeScript Support**: Full type safety and IntelliSense
- **Responsive Design**: Mobile-friendly email templates

## Installation

### 1. Install Dependencies

```bash
npm install nodemailer @types/nodemailer handlebars @types/handlebars
```

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_REPLY_TO=support@yourdomain.com
```

### 3. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to Security settings
   - Generate App Password for "Mail"
   - Use this password in `SMTP_PASS`

3. **Alternative: Less Secure Apps**
   - Enable "Less secure app access" (not recommended for production)

## Usage

### Basic Email Sending

```typescript
import { emailController } from './controllers/EmailController';

// Send welcome email
const result = await emailController.sendWelcomeEmail(
  {
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    role: "user",
    department: "IT"
  },
  "http://localhost:3000/dashboard"
);

if (result.success) {
  console.log(`Email sent! Message ID: ${result.messageId}`);
} else {
  console.error(`Email failed: ${result.error}`);
}
```

### Custom Email with Template

```typescript
// Send custom email
const result = await emailController.sendEmail({
  to: ["user@example.com"],
  subject: "Custom Notification",
  template: "notification",
  context: {
    recipientName: "John Doe",
    message: "This is a custom notification",
    notificationType: "system",
    priority: "high",
    actionRequired: true,
    actionDescription: "Please review the system",
    actionUrl: "http://localhost:3000/system",
    actionButtonText: "Review System"
  }
});
```

### Bulk Email Campaigns

```typescript
// Send bulk emails
const result = await emailController.sendBulkEmails({
  emails: [
    {
      to: ["user1@example.com"],
      subject: "Bulk Email 1",
      template: "notification",
      context: { recipientName: "User 1" }
    },
    {
      to: ["user2@example.com"],
      subject: "Bulk Email 2",
      template: "notification",
      context: { recipientName: "User 2" }
    }
  ],
  batchSize: 5,
  delayBetweenBatches: 2000
});

console.log(`Bulk send completed: ${result.successful} successful, ${result.failed} failed`);
```

## Email Templates

### Template Structure

Templates are located in `src/templates/emails/` and use Handlebars syntax:

```handlebars
<!DOCTYPE html>
<html>
<head>
    <title>{{subject}}</title>
    <style>
        /* CSS styles */
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello {{firstName}} {{lastName}}</h1>
        <p>{{message}}</p>
        
        {{#if actionRequired}}
        <div class="action-required">
            <strong>Action Required:</strong> {{actionDescription}}
        </div>
        {{/if}}
        
        {{#if actionUrl}}
        <a href="{{actionUrl}}" class="button">{{actionButtonText}}</a>
        {{/if}}
    </div>
</body>
</html>
```

### Available Templates

1. **welcome.hbs** - Welcome email for new users
2. **password-reset.hbs** - Password reset request
3. **notification.hbs** - General notifications with actions

### Template Variables

Each template accepts different context variables:

#### Welcome Template
- `firstName`, `lastName` - User's name
- `username` - Username
- `role` - User role
- `department` - User department
- `dashboardUrl` - Dashboard access link

#### Password Reset Template
- `firstName`, `lastName` - User's name
- `username` - Username
- `email` - User's email
- `resetUrl` - Password reset link
- `expiryTime` - Link expiration time
- `requestTime` - Request timestamp

#### Notification Template
- `recipientName` - Recipient's name
- `message` - Notification message
- `notificationType` - Type of notification
- `priority` - Priority level (low/medium/high)
- `timestamp` - Notification time
- `actionRequired` - Whether action is needed
- `actionDescription` - Description of required action
- `actionUrl` - Action link
- `actionButtonText` - Action button text
- `additionalInfo` - Additional information

## Configuration

### SMTP Providers

#### Gmail
```typescript
{
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password"
  }
}
```

#### Outlook/Hotmail
```typescript
{
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: "your-email@outlook.com",
    pass: "your-password"
  }
}
```

#### Custom SMTP
```typescript
{
  host: "smtp.yourdomain.com",
  port: 587,
  secure: false,
  auth: {
    user: "noreply@yourdomain.com",
    pass: "your-smtp-password"
  }
}
```

### Rate Limiting

Configure bulk email settings:

```typescript
const bulkSettings = {
  batchSize: 10,           // Emails per batch
  delayBetweenBatches: 1000 // Delay in milliseconds
};
```

## Dashboard Integration

The Email Manager is integrated into the main dashboard:

1. **Navigation**: Access via "Email Management" in the sidebar
2. **Permissions**: Requires `email:read` and `email:write` permissions
3. **Features**: 
   - Send single emails
   - Bulk email campaigns
   - Template testing
   - Connection monitoring
   - Quick actions

## Security Considerations

### Environment Variables
- Never commit SMTP credentials to version control
- Use environment variables for sensitive information
- Rotate passwords regularly

### Rate Limiting
- Implement appropriate delays between email batches
- Monitor SMTP provider limits
- Use bulk email responsibly

### Template Security
- Sanitize user input in template context
- Validate email addresses
- Implement proper authentication checks

## Troubleshooting

### Common Issues

#### Connection Failed
- Check SMTP credentials
- Verify firewall settings
- Ensure 2FA is properly configured (Gmail)

#### Template Not Found
- Verify template file exists in `src/templates/emails/`
- Check template name spelling
- Ensure file has `.hbs` extension

#### Email Not Sent
- Check SMTP connection
- Verify recipient email format
- Review error logs

### Debug Mode

Enable debug logging:

```typescript
// In emailService.ts
this.transporter = nodemailer.createTransporter({
  ...EMAIL_CONFIG,
  debug: true, // Enable debug output
  logger: true // Enable logging
});
```

## API Reference

### EmailController Methods

- `sendEmail(request: EmailSendRequest): Promise<EmailResult>`
- `sendWelcomeEmail(user, dashboardUrl): Promise<EmailResult>`
- `sendPasswordResetEmail(user, resetUrl, expiryTime): Promise<EmailResult>`
- `sendNotificationEmail(recipient, notification): Promise<EmailResult>`
- `sendBulkEmails(request: EmailBulkRequest): Promise<BulkResult>`
- `verifyConnection(): Promise<boolean>`
- `getAvailableTemplates(): string[]`
- `testTemplate(templateName, context): Promise<TemplateTestResult>`

### EmailService Methods

- `sendEmail(data: EmailData): Promise<EmailResult>`
- `sendWelcomeEmail(user, dashboardUrl): Promise<EmailResult>`
- `sendPasswordResetEmail(user, resetUrl, expiryTime): Promise<EmailResult>`
- `sendNotificationEmail(recipient, notification): Promise<EmailResult>`
- `sendCustomEmail(to, subject, htmlContent, attachments): Promise<EmailResult>`
- `verifyConnection(): Promise<boolean>`

## Contributing

### Adding New Templates

1. Create new `.hbs` file in `src/templates/emails/`
2. Add template to `EMAIL_TEMPLATES` in `src/config/email.ts`
3. Update template documentation
4. Test template rendering

### Customizing Styles

Email templates use inline CSS for maximum compatibility:
- Use web-safe fonts
- Test across different email clients
- Keep styles simple and responsive

## License

This email management system is part of the AdminFront project and follows the same license terms.

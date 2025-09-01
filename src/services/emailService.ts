import fs from "node:fs";
import Handlebars from "handlebars";
import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";
import path from "node:path";
import { type EmailData, EMAIL_CONFIG } from "../config/email";

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailTemplate {
  subject: string;
  template: string;
}

export class EmailService {
  private transporter: Transporter;
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();
  private templateCache: Map<string, string> = new Map();

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: EMAIL_CONFIG.auth,
    });

    this.loadTemplates();
  }

  /**
   * Load all email templates from the templates directory
   */
  private loadTemplates(): void {
    const templatesDir = path.join(process.cwd(), "src", "templates", "emails");

    try {
      const templateFiles = fs.readdirSync(templatesDir);

      templateFiles.forEach((file) => {
        if (file.endsWith(".hbs")) {
          const templateName = file.replace(".hbs", "");
          const templatePath = path.join(templatesDir, file);
          const templateContent = fs.readFileSync(templatePath, "utf-8");

          this.templateCache.set(templateName, templateContent);
          this.templates.set(templateName, Handlebars.compile(templateContent));
        }
      });
    } catch (error) {
      console.error("Error loading email templates:", error);
    }
  }

  /**
   * Send email using template
   */
  async sendEmail(data: EmailData): Promise<EmailResult> {
    try {
      const template = this.templates.get(data.template);

      if (!template) {
        throw new Error(`Template '${data.template}' not found`);
      }

      // Compile template with context
      const htmlContent = template(data.context);

      const mailOptions: SendMailOptions = {
        from: EMAIL_CONFIG.from,
        to: data.to,
        subject: data.subject,
        html: htmlContent,
        attachments: data.attachments,
      };

      if (EMAIL_CONFIG.replyTo) {
        mailOptions.replyTo = EMAIL_CONFIG.replyTo;
      }

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error("Email sending failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(
    user: {
      email: string;
      firstName: string;
      lastName: string;
      username: string;
      role: string;
      department?: string;
    },
    dashboardUrl: string,
  ): Promise<EmailResult> {
    const context = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
      department: user.department || "Not specified",
      dashboardUrl,
    };

    return this.sendEmail({
      to: user.email,
      subject: "Welcome to AdminFront! 🎉",
      template: "welcome",
      context,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    user: {
      email: string;
      firstName: string;
      lastName: string;
      username: string;
    },
    resetUrl: string,
    expiryTime: string,
  ): Promise<EmailResult> {
    const context = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      resetUrl,
      expiryTime,
      requestTime: new Date().toLocaleString(),
    };

    return this.sendEmail({
      to: user.email,
      subject: "Password Reset Request - AdminFront",
      template: "password-reset",
      context,
    });
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(
    recipient: {
      email: string;
      name: string;
    },
    notification: {
      subject: string;
      message: string;
      type: string;
      priority: "low" | "medium" | "high";
      actionRequired?: boolean;
      actionDescription?: string;
      actionUrl?: string;
      actionButtonText?: string;
      additionalInfo?: string;
    },
  ): Promise<EmailResult> {
    const priorityClass = `priority-${notification.priority}`;

    const context = {
      recipientName: recipient.name,
      subject: notification.subject,
      message: notification.message,
      notificationType: notification.type,
      priority: notification.priority,
      timestamp: new Date().toLocaleString(),
      priorityClass,
      actionRequired: notification.actionRequired,
      actionDescription: notification.actionDescription,
      actionUrl: notification.actionUrl,
      actionButtonText: notification.actionButtonText,
      additionalInfo: notification.additionalInfo,
    };

    return this.sendEmail({
      to: recipient.email,
      subject: notification.subject,
      template: "notification",
      context,
    });
  }

  /**
   * Send custom email with HTML content
   */
  async sendCustomEmail(
    to: string | string[],
    subject: string,
    htmlContent: string,
    attachments?: Array<{
      filename: string;
      content: string | Buffer;
      contentType?: string;
    }>,
  ): Promise<EmailResult> {
    try {
      const mailOptions: SendMailOptions = {
        from: EMAIL_CONFIG.from,
        to,
        subject,
        html: htmlContent,
        attachments,
      };

      if (EMAIL_CONFIG.replyTo) {
        mailOptions.replyTo = EMAIL_CONFIG.replyTo;
      }

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error("Custom email sending failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Verify email configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Email connection verification failed:", error);
      return false;
    }
  }

  /**
   * Get available templates
   */
  getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Get template content
   */
  getTemplateContent(templateName: string): string | undefined {
    return this.templateCache.get(templateName);
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;

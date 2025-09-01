import type { EmailData } from "../config/email";
import { type EmailResult, emailService } from "../services/emailService";
import { BaseController } from "./BaseController";

export interface EmailRecord {
  id: string;
  to: string | string[];
  subject: string;
  template: string;
  status: "pending" | "sent" | "failed";
  sentAt?: Date;
  errorMessage?: string;
  messageId?: string;
  context: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailSendRequest {
  to: string | string[];
  subject: string;
  template: string;
  context: Record<string, unknown>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export interface EmailBulkRequest {
  emails: EmailSendRequest[];
  batchSize?: number;
  delayBetweenBatches?: number;
}

export class EmailController extends BaseController<EmailRecord> {
  constructor() {
    super("Email", {}); // No service needed for emails
  }

  /**
   * Send a single email
   */
  async sendEmail(request: EmailSendRequest): Promise<EmailResult> {
    try {
      this.log(
        "info",
        `Sending email to: ${Array.isArray(request.to) ? request.to.join(", ") : request.to}`,
      );

      const result = await emailService.sendEmail({
        to: request.to,
        subject: request.subject,
        template: request.template as EmailData["template"],
        context: request.context,
        attachments: request.attachments,
      });

      if (result.success) {
        this.log(
          "info",
          `Email sent successfully. Message ID: ${result.messageId}`,
        );
      } else {
        this.log("error", `Email sending failed: ${result.error}`);
      }

      return result;
    } catch (error) {
      this.handleError(error, "sendEmail");
    }
  }

  /**
   * Send welcome email to new user
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
    try {
      this.log("info", `Sending welcome email to: ${user.email}`);

      const result = await emailService.sendWelcomeEmail(user, dashboardUrl);

      if (result.success) {
        this.log("info", `Welcome email sent successfully to: ${user.email}`);
      } else {
        this.log(
          "error",
          `Welcome email failed for: ${user.email} - ${result.error}`,
        );
      }

      return result;
    } catch (error) {
      this.handleError(error, "sendWelcomeEmail");
    }
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
    try {
      this.log("info", `Sending password reset email to: ${user.email}`);

      const result = await emailService.sendPasswordResetEmail(
        user,
        resetUrl,
        expiryTime,
      );

      if (result.success) {
        this.log(
          "info",
          `Password reset email sent successfully to: ${user.email}`,
        );
      } else {
        this.log(
          "error",
          `Password reset email failed for: ${user.email} - ${result.error}`,
        );
      }

      return result;
    } catch (error) {
      this.handleError(error, "sendPasswordResetEmail");
    }
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
    try {
      this.log("info", `Sending notification email to: ${recipient.email}`);

      const result = await emailService.sendNotificationEmail(
        recipient,
        notification,
      );

      if (result.success) {
        this.log(
          "info",
          `Notification email sent successfully to: ${recipient.email}`,
        );
      } else {
        this.log(
          "error",
          `Notification email failed for: ${recipient.email} - ${result.error}`,
        );
      }

      return result;
    } catch (error) {
      this.handleError(error, "sendNotificationEmail");
    }
  }

  /**
   * Send bulk emails with rate limiting
   */
  async sendBulkEmails(request: EmailBulkRequest): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: EmailResult[];
  }> {
    try {
      this.log(
        "info",
        `Starting bulk email send for ${request.emails.length} emails`,
      );

      const batchSize = request.batchSize || 10;
      const delay = request.delayBetweenBatches || 1000;
      const results: EmailResult[] = [];
      let successful = 0;
      let failed = 0;

      // Process emails in batches
      for (let i = 0; i < request.emails.length; i += batchSize) {
        const batch = request.emails.slice(i, i + batchSize);

        // Send batch
        const batchPromises = batch.map((email) => this.sendEmail(email));
        const batchResults = await Promise.all(batchPromises);

        // Count results
        batchResults.forEach((result) => {
          results.push(result);
          if (result.success) {
            successful++;
          } else {
            failed++;
          }
        });

        // Delay between batches (except for the last batch)
        if (i + batchSize < request.emails.length) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      this.log(
        "info",
        `Bulk email send completed. Successful: ${successful}, Failed: ${failed}`,
      );

      return {
        total: request.emails.length,
        successful,
        failed,
        results,
      };
    } catch (error) {
      this.handleError(error, "sendBulkEmails");
    }
  }

  /**
   * Verify email service connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      this.log("info", "Verifying email service connection");

      const isConnected = await emailService.verifyConnection();

      if (isConnected) {
        this.log("info", "Email service connection verified successfully");
      } else {
        this.log("error", "Email service connection verification failed");
      }

      return isConnected;
    } catch (error) {
      this.log(
        "error",
        `Email service connection verification error: ${error}`,
      );
      return false;
    }
  }

  /**
   * Get available email templates
   */
  getAvailableTemplates(): string[] {
    return emailService.getAvailableTemplates();
  }

  /**
   * Get template content
   */
  getTemplateContent(templateName: string): string | undefined {
    return emailService.getTemplateContent(templateName);
  }

  /**
   * Test email template rendering
   */
  async testTemplate(
    templateName: string,
    context: Record<string, unknown>,
  ): Promise<{ success: boolean; html?: string; error?: string }> {
    try {
      this.log("info", `Testing template: ${templateName}`);

      const template = emailService.getTemplateContent(templateName);

      if (!template) {
        return {
          success: false,
          error: `Template '${templateName}' not found`,
        };
      }

      // Compile and render template
      const Handlebars = require("handlebars");
      const compiledTemplate = Handlebars.compile(template);
      const html = compiledTemplate(context);

      return {
        success: true,
        html,
      };
    } catch (error) {
      this.log("error", `Template test failed: ${error}`);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Export singleton instance
export const emailController = new EmailController();
export default emailController;

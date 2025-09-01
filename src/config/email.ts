export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  replyTo?: string;
}

export const EMAIL_CONFIG: EmailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
  from: process.env.EMAIL_FROM || "noreply@adminfront.com",
  replyTo: process.env.EMAIL_REPLY_TO,
};

export const EMAIL_TEMPLATES = {
  WELCOME: "welcome",
  PASSWORD_RESET: "password-reset",
  USER_CREATED: "user-created",
  NOTIFICATION: "notification",
  VERIFICATION: "verification",
} as const;

export type EmailTemplateType =
  (typeof EMAIL_TEMPLATES)[keyof typeof EMAIL_TEMPLATES];

export interface EmailData {
  to: string | string[];
  subject: string;
  template: EmailTemplateType;
  context: Record<string, unknown>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

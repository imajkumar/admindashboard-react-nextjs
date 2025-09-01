import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { EmailRecord, EmailSendRequest, EmailBulkRequest } from "../../controllers/EmailController";

// Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailFilters {
  status?: "pending" | "sent" | "failed";
  template?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface EmailListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: EmailFilters;
}

export interface PaginatedEmailResponse {
  emails: EmailRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmailSendResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailBulkResponse {
  total: number;
  successful: number;
  failed: number;
  results: EmailSendResponse[];
}

export interface EmailTemplateCreateRequest {
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  isDefault?: boolean;
}

export interface EmailTemplateUpdateRequest {
  id: string;
  updates: Partial<EmailTemplateCreateRequest>;
}

export interface EmailTestRequest {
  templateId: string;
  context: Record<string, unknown>;
}

export interface EmailTestResponse {
  success: boolean;
  html?: string;
  error?: string;
}

// Create API service
export const emailApi = createApi({
  reducerPath: "emailApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/email",
    prepareHeaders: (headers, { getState }) => {
      // Get token from state or localStorage
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Email", "EmailList", "EmailTemplate", "EmailTemplateList"],
  endpoints: (builder) => ({
    // Get emails with pagination and filters
    getEmails: builder.query<PaginatedEmailResponse, EmailListParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
        
        if (params.filters) {
          if (params.filters.status) searchParams.append("status", params.filters.status);
          if (params.filters.template) searchParams.append("template", params.filters.template);
          if (params.filters.search) searchParams.append("search", params.filters.search);
          
          if (params.filters.dateRange) {
            searchParams.append("startDate", params.filters.dateRange.start.toISOString());
            searchParams.append("endDate", params.filters.dateRange.end.toISOString());
          }
        }
        
        return `?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.emails.map(({ id }) => ({ type: "Email" as const, id })),
              { type: "EmailList", id: "LIST" },
            ]
          : [{ type: "EmailList", id: "LIST" }],
    }),
    
    // Get email by ID
    getEmailById: builder.query<EmailRecord, string>({
      query: (id) => id,
      providesTags: (result, error, id) => [{ type: "Email", id }],
    }),
    
    // Send single email
    sendEmail: builder.mutation<EmailSendResponse, EmailSendRequest>({
      query: (emailData) => ({
        url: "send",
        method: "POST",
        body: emailData,
      }),
      invalidatesTags: [{ type: "EmailList", id: "LIST" }],
    }),
    
    // Send bulk emails
    sendBulkEmails: builder.mutation<EmailBulkResponse, EmailBulkRequest>({
      query: (bulkData) => ({
        url: "bulk",
        method: "POST",
        body: bulkData,
      }),
      invalidatesTags: [{ type: "EmailList", id: "LIST" }],
    }),
    
    // Send welcome email
    sendWelcomeEmail: builder.mutation<
      EmailSendResponse,
      {
        user: {
          email: string;
          firstName: string;
          lastName: string;
          username: string;
          role: string;
          department?: string;
        };
        dashboardUrl: string;
      }
    >({
      query: (welcomeData) => ({
        url: "welcome",
        method: "POST",
        body: welcomeData,
      }),
      invalidatesTags: [{ type: "EmailList", id: "LIST" }],
    }),
    
    // Send password reset email
    sendPasswordResetEmail: builder.mutation<
      EmailSendResponse,
      {
        user: {
          email: string;
          firstName: string;
          lastName: string;
          username: string;
        };
        resetUrl: string;
        expiryTime: string;
      }
    >({
      query: (resetData) => ({
        url: "password-reset",
        method: "POST",
        body: resetData,
      }),
      invalidatesTags: [{ type: "EmailList", id: "LIST" }],
    }),
    
    // Send notification email
    sendNotificationEmail: builder.mutation<
      EmailSendResponse,
      {
        recipient: {
          email: string;
          name: string;
        };
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
        };
      }
    >({
      query: (notificationData) => ({
        url: "notification",
        method: "POST",
        body: notificationData,
      }),
      invalidatesTags: [{ type: "EmailList", id: "LIST" }],
    }),
    
    // Get email templates
    getEmailTemplates: builder.query<EmailTemplate[], void>({
      query: () => "templates",
      providesTags: [{ type: "EmailTemplateList", id: "LIST" }],
    }),
    
    // Get email template by ID
    getEmailTemplateById: builder.query<EmailTemplate, string>({
      query: (id) => `templates/${id}`,
      providesTags: (result, error, id) => [{ type: "EmailTemplate", id }],
    }),
    
    // Create email template
    createEmailTemplate: builder.mutation<EmailTemplate, EmailTemplateCreateRequest>({
      query: (templateData) => ({
        url: "templates",
        method: "POST",
        body: templateData,
      }),
      invalidatesTags: [{ type: "EmailTemplateList", id: "LIST" }],
    }),
    
    // Update email template
    updateEmailTemplate: builder.mutation<EmailTemplate, EmailTemplateUpdateRequest>({
      query: ({ id, updates }) => ({
        url: `templates/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "EmailTemplate", id },
        { type: "EmailTemplateList", id: "LIST" },
      ],
    }),
    
    // Delete email template
    deleteEmailTemplate: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (id) => ({
        url: `templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "EmailTemplate", id },
        { type: "EmailTemplateList", id: "LIST" },
      ],
    }),
    
    // Test email template
    testEmailTemplate: builder.mutation<EmailTestResponse, EmailTestRequest>({
      query: (testData) => ({
        url: "templates/test",
        method: "POST",
        body: testData,
      }),
    }),
    
    // Verify email connection
    verifyEmailConnection: builder.query<{ connected: boolean; message?: string }, void>({
      query: () => "verify-connection",
    }),
    
    // Get email statistics
    getEmailStats: builder.query<
      {
        total: number;
        sent: number;
        failed: number;
        pending: number;
        byTemplate: Record<string, number>;
        byStatus: Record<string, number>;
      },
      void
    >({
      query: () => "stats",
      providesTags: [{ type: "EmailList", id: "LIST" }],
    }),
    
    // Get email logs
    getEmailLogs: builder.query<
      Array<{
        id: string;
        timestamp: Date;
        level: "info" | "warning" | "error";
        message: string;
        details?: Record<string, unknown>;
      }>,
      { limit?: number; level?: string }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.level) searchParams.append("level", params.level);
        return `logs?${searchParams.toString()}`;
      },
    }),
    
    // Resend failed email
    resendFailedEmail: builder.mutation<
      EmailSendResponse,
      { emailId: string; retryCount?: number }
    >({
      query: (resendData) => ({
        url: `${resendData.emailId}/resend`,
        method: "POST",
        body: { retryCount: resendData.retryCount || 0 },
      }),
      invalidatesTags: (result, error, { emailId }) => [{ type: "Email", id: emailId }],
    }),
  }),
});

// Export hooks
export const {
  useGetEmailsQuery,
  useGetEmailByIdQuery,
  useSendEmailMutation,
  useSendBulkEmailsMutation,
  useSendWelcomeEmailMutation,
  useSendPasswordResetEmailMutation,
  useSendNotificationEmailMutation,
  useGetEmailTemplatesQuery,
  useGetEmailTemplateByIdQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  useTestEmailTemplateMutation,
  useVerifyEmailConnectionQuery,
  useGetEmailStatsQuery,
  useGetEmailLogsQuery,
  useResendFailedEmailMutation,
} = emailApi;

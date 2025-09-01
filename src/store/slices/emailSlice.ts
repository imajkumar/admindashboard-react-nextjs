import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EmailRecord } from "../../controllers/EmailController";

// Types
export interface EmailState {
  emails: EmailRecord[];
  drafts: Array<{
    id: string;
    to: string[];
    subject: string;
    template: string;
    context: Record<string, unknown>;
    attachments: Array<{
      filename: string;
      content: string | Buffer;
      contentType?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }>;
  templates: Array<{
    id: string;
    name: string;
    subject: string;
    content: string;
    variables: string[];
    category: string;
    isDefault: boolean;
  }>;
  filters: {
    status: "all" | "pending" | "sent" | "failed";
    template: string;
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
    search: string;
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  sort: {
    field: string;
    order: "ascend" | "descend";
  };
  isLoading: boolean;
  error: string | null;
  connectionStatus: boolean | null;
}

// Initial state
const initialState: EmailState = {
  emails: [],
  drafts: [],
  templates: [
    {
      id: "welcome",
      name: "Welcome Email",
      subject: "Welcome to AdminFront! 🎉",
      content: "Welcome email template content",
      variables: ["firstName", "lastName", "username", "role", "department", "dashboardUrl"],
      category: "user",
      isDefault: true,
    },
    {
      id: "password-reset",
      name: "Password Reset",
      subject: "Password Reset Request - AdminFront",
      content: "Password reset email template content",
      variables: ["firstName", "lastName", "username", "email", "resetUrl", "expiryTime"],
      category: "security",
      isDefault: false,
    },
    {
      id: "notification",
      name: "General Notification",
      subject: "Notification",
      content: "General notification email template content",
      variables: ["recipientName", "subject", "message", "type", "priority", "timestamp"],
      category: "system",
      isDefault: false,
    },
  ],
  filters: {
    status: "all",
    template: "",
    dateRange: {
      start: null,
      end: null,
    },
    search: "",
  },
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  sort: {
    field: "createdAt",
    order: "descend",
  },
  isLoading: false,
  error: null,
  connectionStatus: null,
};

// Slice
const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    // Set emails
    setEmails: (state, action: PayloadAction<EmailRecord[]>) => {
      state.emails = action.payload;
    },
    
    // Add email
    addEmail: (state, action: PayloadAction<EmailRecord>) => {
      state.emails.unshift(action.payload);
      state.pagination.total += 1;
    },
    
    // Update email
    updateEmail: (state, action: PayloadAction<{ id: string; updates: Partial<EmailRecord> }>) => {
      const { id, updates } = action.payload;
      const emailIndex = state.emails.findIndex((email) => email.id === id);
      if (emailIndex !== -1) {
        state.emails[emailIndex] = { ...state.emails[emailIndex], ...updates };
      }
    },
    
    // Remove email
    removeEmail: (state, action: PayloadAction<string>) => {
      state.emails = state.emails.filter((email) => email.id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
    
    // Set drafts
    setDrafts: (state, action: PayloadAction<EmailState["drafts"]>) => {
      state.drafts = action.payload;
    },
    
    // Add draft
    addDraft: (state, action: PayloadAction<EmailState["drafts"][0]>) => {
      state.drafts.unshift(action.payload);
    },
    
    // Update draft
    updateDraft: (state, action: PayloadAction<{ id: string; updates: Partial<EmailState["drafts"][0]> }>) => {
      const { id, updates } = action.payload;
      const draftIndex = state.drafts.findIndex((draft) => draft.id === id);
      if (draftIndex !== -1) {
        state.drafts[draftIndex] = { 
          ...state.drafts[draftIndex], 
          ...updates, 
          updatedAt: new Date() 
        };
      }
    },
    
    // Remove draft
    removeDraft: (state, action: PayloadAction<string>) => {
      state.drafts = state.drafts.filter((draft) => draft.id !== action.payload);
    },
    
    // Set templates
    setTemplates: (state, action: PayloadAction<EmailState["templates"]>) => {
      state.templates = action.payload;
    },
    
    // Add template
    addTemplate: (state, action: PayloadAction<EmailState["templates"][0]>) => {
      state.templates.push(action.payload);
    },
    
    // Update template
    updateTemplate: (state, action: PayloadAction<{ id: string; updates: Partial<EmailState["templates"][0]> }>) => {
      const { id, updates } = action.payload;
      const templateIndex = state.templates.findIndex((template) => template.id === id);
      if (templateIndex !== -1) {
        state.templates[templateIndex] = { ...state.templates[templateIndex], ...updates };
      }
    },
    
    // Remove template
    removeTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((template) => template.id !== action.payload);
    },
    
    // Set filters
    setFilters: (state, action: PayloadAction<Partial<EmailState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.current = 1; // Reset to first page when filters change
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.current = 1;
    },
    
    // Set pagination
    setPagination: (state, action: PayloadAction<Partial<EmailState["pagination"]>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Set sort
    setSort: (state, action: PayloadAction<EmailState["sort"]>) => {
      state.sort = action.payload;
    },
    
    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set connection status
    setConnectionStatus: (state, action: PayloadAction<boolean | null>) => {
      state.connectionStatus = action.payload;
    },
    
    // Reset email state
    resetEmail: () => initialState,
  },
});

// Export actions
export const {
  setEmails,
  addEmail,
  updateEmail,
  removeEmail,
  setDrafts,
  addDraft,
  updateDraft,
  removeDraft,
  setTemplates,
  addTemplate,
  updateTemplate,
  removeTemplate,
  setFilters,
  clearFilters,
  setPagination,
  setSort,
  setLoading,
  setError,
  clearError,
  setConnectionStatus,
  resetEmail,
} = emailSlice.actions;

// Export reducer
export default emailSlice.reducer;

// Export selectors
export const selectEmails = (state: { email: EmailState }) => state.email.emails;
export const selectDrafts = (state: { email: EmailState }) => state.email.drafts;
export const selectTemplates = (state: { email: EmailState }) => state.email.templates;
export const selectFilters = (state: { email: EmailState }) => state.email.filters;
export const selectPagination = (state: { email: EmailState }) => state.email.pagination;
export const selectSort = (state: { email: EmailState }) => state.email.sort;
export const selectEmailLoading = (state: { email: EmailState }) => state.email.isLoading;
export const selectEmailError = (state: { email: EmailState }) => state.email.error;
export const selectConnectionStatus = (state: { email: EmailState }) => state.email.connectionStatus;

// Computed selectors
export const selectFilteredEmails = (state: { email: EmailState }) => {
  const { emails, filters } = state.email;
  return emails.filter((email) => {
    if (filters.status !== "all" && email.status !== filters.status) return false;
    if (filters.template && email.template !== filters.template) return false;
    if (filters.dateRange.start && new Date(email.createdAt) < filters.dateRange.start) return false;
    if (filters.dateRange.end && new Date(email.createdAt) > filters.dateRange.end) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        email.subject.toLowerCase().includes(searchLower) ||
        (Array.isArray(email.to) ? email.to.join(", ").toLowerCase().includes(searchLower) : email.to.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });
};

export const selectEmailById = (state: { email: EmailState }, emailId: string) =>
  state.email.emails.find((email) => email.id === emailId);

export const selectDraftById = (state: { email: EmailState }, draftId: string) =>
  state.email.drafts.find((draft) => draft.id === draftId);

export const selectTemplateById = (state: { email: EmailState }, templateId: string) =>
  state.email.templates.find((template) => template.id === templateId);

export const selectEmailsByStatus = (state: { email: EmailState }, status: EmailRecord["status"]) =>
  state.email.emails.filter((email) => email.status === status);

export const selectTemplatesByCategory = (state: { email: EmailState }, category: string) =>
  state.email.templates.filter((template) => template.category === category);

export const selectDefaultTemplates = (state: { email: EmailState }) =>
  state.email.templates.filter((template) => template.isDefault);

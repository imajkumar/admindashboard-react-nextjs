import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types
export interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    growthRate: number;
  };
  emails: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
    successRate: number;
  };
  system: {
    uptime: number;
    performance: number;
    lastBackup: Date;
    diskUsage: number;
    memoryUsage: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }>;
}

export interface DashboardChart {
  id: string;
  title: string;
  type: "line" | "bar" | "pie" | "doughnut" | "area";
  data: ChartData;
  options?: Record<string, unknown>;
}

export interface RecentActivity {
  id: string;
  type: "user" | "email" | "system" | "security";
  action: string;
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  severity: "low" | "medium" | "high" | "critical";
  metadata?: Record<string, unknown>;
}

export interface DashboardMetrics {
  pageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: Array<{
    path: string;
    views: number;
    uniqueViews: number;
  }>;
  topReferrers: Array<{
    source: string;
    visits: number;
    percentage: number;
  }>;
}

export interface SystemHealth {
  status: "healthy" | "warning" | "critical";
  checks: Array<{
    name: string;
    status: "pass" | "fail" | "warning";
    responseTime: number;
    lastChecked: Date;
    message?: string;
  }>;
  overallScore: number;
  recommendations: string[];
}

export interface NotificationSummary {
  unread: number;
  byType: {
    info: number;
    warning: number;
    error: number;
    success: number;
  };
  recent: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: Date;
    read: boolean;
  }>;
}

// Create API service
export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/dashboard",
    prepareHeaders: (headers, { getState }) => {
      // Get token from state or localStorage
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Dashboard", "DashboardStats", "DashboardCharts", "RecentActivity", "SystemHealth"],
  endpoints: (builder) => ({
    // Get dashboard statistics
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "stats",
      providesTags: ["DashboardStats"],
    }),
    
    // Get dashboard charts
    getDashboardCharts: builder.query<DashboardChart[], { period?: string; refresh?: boolean }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.period) searchParams.append("period", params.period);
        if (params.refresh) searchParams.append("refresh", params.refresh.toString());
        return `charts?${searchParams.toString()}`;
      },
      providesTags: ["DashboardCharts"],
    }),
    
    // Get specific chart
    getChart: builder.query<DashboardChart, { chartId: string; period?: string }>({
      query: ({ chartId, period }) => {
        const searchParams = new URLSearchParams();
        if (period) searchParams.append("period", period);
        return `charts/${chartId}?${searchParams.toString()}`;
      },
      providesTags: (result, error, { chartId }) => [{ type: "DashboardCharts", id: chartId }],
    }),
    
    // Get recent activity
    getRecentActivity: builder.query<RecentActivity[], { limit?: number; type?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.type) searchParams.append("type", params.type);
        return `activity?${searchParams.toString()}`;
      },
      providesTags: ["RecentActivity"],
    }),
    
    // Get system health
    getSystemHealth: builder.query<SystemHealth, void>({
      query: () => "health",
      providesTags: ["SystemHealth"],
    }),
    
    // Get dashboard metrics
    getDashboardMetrics: builder.query<DashboardMetrics, { period: "day" | "week" | "month" | "year" }>({
      query: (params) => `metrics?period=${params.period}`,
      providesTags: ["Dashboard"],
    }),
    
    // Get notification summary
    getNotificationSummary: builder.query<NotificationSummary, void>({
      query: () => "notifications/summary",
      providesTags: ["Dashboard"],
    }),
    
    // Get user activity timeline
    getUserActivityTimeline: builder.query<
      Array<{
        date: string;
        activeUsers: number;
        newUsers: number;
        totalSessions: number;
        averageSessionDuration: number;
      }>,
      { period: "week" | "month" | "quarter" | "year" }
    >({
      query: (params) => `activity/timeline?period=${params.period}`,
      providesTags: ["Dashboard"],
    }),
    
    // Get email performance metrics
    getEmailPerformance: builder.query<
      {
        deliveryRate: number;
        openRate: number;
        clickRate: number;
        bounceRate: number;
        spamRate: number;
        byTemplate: Record<string, {
          sent: number;
          delivered: number;
          opened: number;
          clicked: number;
        }>;
      },
      { period: "week" | "month" | "quarter" | "year" }
    >({
      query: (params) => `email/performance?period=${params.period}`,
      providesTags: ["Dashboard"],
    }),
    
    // Get system performance metrics
    getSystemPerformance: builder.query<
      {
        cpu: {
          current: number;
          average: number;
          peak: number;
          history: Array<{ timestamp: Date; value: number }>;
        };
        memory: {
          current: number;
          average: number;
          peak: number;
          history: Array<{ timestamp: Date; value: number }>;
        };
        disk: {
          current: number;
          average: number;
          peak: number;
          history: Array<{ timestamp: Date; value: number }>;
        };
        network: {
          current: number;
          average: number;
          peak: number;
          history: Array<{ timestamp: Date; value: number }>;
        };
      },
      { period: "hour" | "day" | "week" | "month" }
    >({
      query: (params) => `performance?period=${params.period}`,
      providesTags: ["Dashboard"],
    }),
    
    // Get security overview
    getSecurityOverview: builder.query<
      {
        threats: {
          total: number;
          blocked: number;
          allowed: number;
          severity: {
            low: number;
            medium: number;
            high: number;
            critical: number;
          };
        };
        vulnerabilities: {
          total: number;
          critical: number;
          high: number;
          medium: number;
          low: number;
          patched: number;
        };
        incidents: {
          total: number;
          resolved: number;
          open: number;
          byType: Record<string, number>;
        };
        lastScan: Date;
        nextScan: Date;
      },
      void
    >({
      query: () => "security",
      providesTags: ["Dashboard"],
    }),
    
    // Export dashboard data
    exportDashboardData: builder.mutation<
      { success: boolean; downloadUrl?: string; message?: string },
      {
        format: "csv" | "excel" | "pdf";
        data: string[];
        period: "day" | "week" | "month" | "quarter" | "year";
        filters?: Record<string, unknown>;
      }
    >({
      query: (exportData) => ({
        url: "export",
        method: "POST",
        body: exportData,
      }),
    }),
    
    // Refresh dashboard data
    refreshDashboardData: builder.mutation<
      { success: boolean; message?: string; refreshedAt: Date },
      { sections?: string[] }
    >({
      query: (refreshData) => ({
        url: "refresh",
        method: "POST",
        body: refreshData,
      }),
      invalidatesTags: ["Dashboard", "DashboardStats", "DashboardCharts", "RecentActivity", "SystemHealth"],
    }),
  }),
});

// Export hooks
export const {
  useGetDashboardStatsQuery,
  useGetDashboardChartsQuery,
  useGetChartQuery,
  useGetRecentActivityQuery,
  useGetSystemHealthQuery,
  useGetDashboardMetricsQuery,
  useGetNotificationSummaryQuery,
  useGetUserActivityTimelineQuery,
  useGetEmailPerformanceQuery,
  useGetSystemPerformanceQuery,
  useGetSecurityOverviewQuery,
  useExportDashboardDataMutation,
  useRefreshDashboardDataMutation,
} = dashboardApi;

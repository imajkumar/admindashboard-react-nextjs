import { type ApiResponse, apiRequest } from "../../config/axios";
import { API_ENDPOINTS } from "../api";

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  userEngagement: number;
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

export interface RecentActivity {
  id: string;
  type:
    | "user_login"
    | "user_created"
    | "user_updated"
    | "user_deleted"
    | "system_event";
  description: string;
  userId?: string;
  userName?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DashboardFilters {
  dateRange?: {
    from: string;
    to: string;
  };
  period?: "daily" | "weekly" | "monthly" | "yearly";
}

export interface UserActivitySummary {
  totalActivities: number;
  activeUsers: number;
  topActions: Array<{
    action: string;
    count: number;
  }>;
  timeRange: {
    from: string;
    to: string;
  };
}

export interface SystemHealth {
  status: "healthy" | "warning" | "critical";
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  lastCheck: string;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  availability: number;
  timestamp: string;
}

export interface RealTimeUpdate {
  id: string;
  type: string;
  data: unknown;
  timestamp: string;
}

// Dashboard service class
export class DashboardService {
  // Get dashboard statistics
  async getStats(
    filters?: DashboardFilters,
  ): Promise<ApiResponse<DashboardStats>> {
    const queryParams = new URLSearchParams();

    if (filters?.dateRange?.from)
      queryParams.append("startDate", filters.dateRange.from);
    if (filters?.dateRange?.to)
      queryParams.append("endDate", filters.dateRange.to);
    if (filters?.period) queryParams.append("period", filters.period);

    const url = `/dashboard/stats?${queryParams.toString()}`;
    return apiRequest.get<DashboardStats>(url);
  }

  // Get chart data
  async getChartData(
    chartType: string,
    filters?: DashboardFilters,
  ): Promise<ApiResponse<ChartData>> {
    const queryParams = new URLSearchParams();

    queryParams.append("chartType", chartType);
    if (filters?.dateRange?.from)
      queryParams.append("startDate", filters.dateRange.from);
    if (filters?.dateRange?.to)
      queryParams.append("endDate", filters.dateRange.to);
    if (filters?.period) queryParams.append("period", filters.period);

    const url = `/dashboard/chart-data?${queryParams.toString()}`;
    return apiRequest.get<ChartData>(url);
  }

  // Get recent activity
  async getRecentActivity(
    limit: number = 10,
  ): Promise<ApiResponse<RecentActivity[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());

    const url = `/dashboard/recent-activity?${queryParams.toString()}`;
    return apiRequest.get<RecentActivity[]>(url);
  }

  // Get notifications
  async getNotifications(
    limit: number = 20,
    unreadOnly: boolean = false,
  ): Promise<ApiResponse<Notification[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());
    if (unreadOnly) queryParams.append("unreadOnly", "true");

    const url = `/dashboard/notifications?${queryParams.toString()}`;
    return apiRequest.get<Notification[]>(url);
  }

  // Mark notification as read
  async markNotificationAsRead(
    notificationId: string,
  ): Promise<ApiResponse<void>> {
    const url = `${API_ENDPOINTS.DASHBOARD.NOTIFICATIONS}/${notificationId}/read`;
    return apiRequest.patch<void>(url, {});
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    const url = `${API_ENDPOINTS.DASHBOARD.NOTIFICATIONS}/mark-all-read`;
    return apiRequest.patch<void>(url, {});
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    const url = `${API_ENDPOINTS.DASHBOARD.NOTIFICATIONS}/${notificationId}`;
    return apiRequest.delete<void>(url);
  }

  // Get user activity summary
  async getUserActivitySummary(
    filters?: DashboardFilters,
  ): Promise<ApiResponse<UserActivitySummary>> {
    const params = new URLSearchParams();

    if (filters?.dateRange) {
      params.append("from", filters.dateRange.from);
      params.append("to", filters.dateRange.to);
    }

    const url = `/dashboard/user-activity-summary?${params.toString()}`;
    return apiRequest.get<UserActivitySummary>(url);
  }

  // Get system health status
  async getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
    const url = "/dashboard/system-health";
    return apiRequest.get<SystemHealth>(url);
  }

  // Get performance metrics
  async getPerformanceMetrics(
    filters?: DashboardFilters,
  ): Promise<ApiResponse<PerformanceMetrics>> {
    const params = new URLSearchParams();

    if (filters?.dateRange) {
      params.append("from", filters.dateRange.from);
      params.append("to", filters.dateRange.to);
    }

    if (filters?.period) {
      params.append("period", filters.period);
    }

    const url = `/dashboard/performance-metrics?${params.toString()}`;
    return apiRequest.get<PerformanceMetrics>(url);
  }

  // Export dashboard report
  async exportDashboardReport(
    format: "pdf" | "excel" | "csv",
    filters?: DashboardFilters,
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    const params = new URLSearchParams();
    params.append("format", format);

    if (filters?.dateRange) {
      params.append("from", filters.dateRange.from);
      params.append("to", filters.dateRange.to);
    }

    if (filters?.period) {
      params.append("period", filters.period);
    }

    const url = `/dashboard/export-report?${params.toString()}`;
    return apiRequest.get<{ downloadUrl: string }>(url);
  }

  // Get real-time updates (for WebSocket implementation)
  async getRealTimeUpdates(): Promise<ApiResponse<RealTimeUpdate[]>> {
    const url = "/dashboard/real-time-updates";
    return apiRequest.get<RealTimeUpdate[]>(url);
  }

  // Subscribe to real-time updates
  async subscribeToUpdates(topics: string[]): Promise<ApiResponse<void>> {
    const url = "/dashboard/subscribe-updates";
    return apiRequest.post<void>(url, { topics });
  }

  // Unsubscribe from real-time updates
  async unsubscribeFromUpdates(topics: string[]): Promise<ApiResponse<void>> {
    const url = "/dashboard/unsubscribe-updates";
    return apiRequest.post<void>(url, { topics });
  }
}

// Export default instance
export default new DashboardService();

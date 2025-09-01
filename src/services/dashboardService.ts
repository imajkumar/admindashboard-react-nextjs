import { apiRequest, ApiResponse } from "../config/axios";
import { API_ENDPOINTS } from "./api";

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
  metadata?: Record<string, any>;
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

// Dashboard service class
export class DashboardService {
  // Get dashboard statistics
  async getStats(
    filters?: DashboardFilters,
  ): Promise<ApiResponse<DashboardStats>> {
    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockStats: DashboardStats = {
      totalUsers: 1128,
      activeUsers: 932,
      newUsers: 28,
      totalRevenue: 11280,
      monthlyGrowth: 12.5,
      userEngagement: 78.3,
    };

    const mockResponse: ApiResponse<DashboardStats> = {
      success: true,
      data: mockStats,
      message: "Statistics retrieved successfully",
    };

    return mockResponse;
  }

  // Get chart data
  async getChartData(
    chartType: string,
    filters?: DashboardFilters,
  ): Promise<ApiResponse<ChartData>> {
    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 500));

    let mockChartData: ChartData;

    switch (chartType) {
      case "user-growth":
        mockChartData = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "New Users",
              data: [65, 78, 90, 85, 95, 120],
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 2,
              fill: true,
            },
          ],
        };
        break;
      case "revenue":
        mockChartData = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Revenue",
              data: [1200, 1900, 3000, 5000, 2000, 3000],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: true,
            },
          ],
        };
        break;
      default:
        mockChartData = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Data",
              data: [10, 20, 30, 40, 50, 60],
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              fill: false,
            },
          ],
        };
    }

    const mockResponse: ApiResponse<ChartData> = {
      success: true,
      data: mockChartData,
      message: "Chart data retrieved successfully",
    };

    return mockResponse;
  }

  // Get recent activity
  async getRecentActivity(
    limit: number = 10,
  ): Promise<ApiResponse<RecentActivity[]>> {
    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 400));

    const mockActivities: RecentActivity[] = [
      {
        id: "1",
        type: "user_login",
        description: "User logged in successfully",
        userId: "1",
        userName: "John Doe",
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: "2",
        type: "user_created",
        description: "New user account created",
        userId: "4",
        userName: "Alice Johnson",
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
      {
        id: "3",
        type: "user_updated",
        description: "User profile updated",
        userId: "2",
        userName: "Jane Smith",
        timestamp: new Date(Date.now() - 900000).toISOString(),
      },
      {
        id: "4",
        type: "system_event",
        description: "System backup completed",
        timestamp: new Date(Date.now() - 1200000).toISOString(),
      },
    ];

    const limitedActivities = mockActivities.slice(0, limit);

    const mockResponse: ApiResponse<RecentActivity[]> = {
      success: true,
      data: limitedActivities,
      message: "Recent activity retrieved successfully",
    };

    return mockResponse;
  }

  // Get notifications
  async getNotifications(
    limit: number = 20,
    unreadOnly: boolean = false,
  ): Promise<ApiResponse<Notification[]>> {
    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 300));

    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Welcome to Admin Dashboard",
        message: "Your account has been successfully created.",
        type: "success",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "2",
        title: "System Maintenance",
        message: "Scheduled maintenance will occur tonight at 2 AM.",
        type: "info",
        isRead: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "3",
        title: "New User Registration",
        message: "A new user has registered and requires approval.",
        type: "warning",
        isRead: true,
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        id: "4",
        title: "Security Alert",
        message: "Multiple failed login attempts detected.",
        type: "error",
        isRead: false,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ];

    let filteredNotifications = mockNotifications;
    if (unreadOnly) {
      filteredNotifications = mockNotifications.filter((n) => !n.isRead);
    }

    const limitedNotifications = filteredNotifications.slice(0, limit);

    const mockResponse: ApiResponse<Notification[]> = {
      success: true,
      data: limitedNotifications,
      message: "Notifications retrieved successfully",
    };

    return mockResponse;
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
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();

    if (filters?.dateRange) {
      params.append("from", filters.dateRange.from);
      params.append("to", filters.dateRange.to);
    }

    const url = `/dashboard/user-activity-summary?${params.toString()}`;
    return apiRequest.get<any>(url);
  }

  // Get system health status
  async getSystemHealth(): Promise<ApiResponse<any>> {
    const url = "/dashboard/system-health";
    return apiRequest.get<any>(url);
  }

  // Get performance metrics
  async getPerformanceMetrics(
    filters?: DashboardFilters,
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();

    if (filters?.dateRange) {
      params.append("from", filters.dateRange.from);
      params.append("to", filters.dateRange.to);
    }

    if (filters?.period) {
      params.append("period", filters.period);
    }

    const url = `/dashboard/performance-metrics?${params.toString()}`;
    return apiRequest.get<any>(url);
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
  async getRealTimeUpdates(): Promise<ApiResponse<any>> {
    const url = "/dashboard/real-time-updates";
    return apiRequest.get<any>(url);
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

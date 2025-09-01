import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  description?: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  action?: {
    text: string;
    onClick: () => void;
  };
  closable?: boolean;
  timestamp: number;
  read: boolean;
  persistent?: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  maxNotifications: number;
  autoClose: boolean;
  autoCloseDuration: number;
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  soundEnabled: boolean;
  desktopNotifications: boolean;
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  maxNotifications: 10,
  autoClose: true,
  autoCloseDuration: 4500,
  position: "topRight",
  soundEnabled: true,
  desktopNotifications: false,
};

// Slice
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Add notification
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "timestamp" | "read">>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        read: false,
      };
      
      // Add to beginning of array
      state.notifications.unshift(notification);
      
      // Remove excess notifications
      if (state.notifications.length > state.maxNotifications) {
        state.notifications = state.notifications.slice(0, state.maxNotifications);
      }
    },
    
    // Remove notification
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    
    // Mark notification as read
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    
    // Mark all notifications as read
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
    },
    
    // Clear all notifications
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Clear notifications by type
    clearNotificationsByType: (state, action: PayloadAction<Notification["type"]>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.type !== action.payload
      );
    },
    
    // Update notification
    updateNotification: (state, action: PayloadAction<{ id: string; updates: Partial<Notification> }>) => {
      const { id, updates } = action.payload;
      const notification = state.notifications.find((n) => n.id === id);
      if (notification) {
        Object.assign(notification, updates);
      }
    },
    
    // Set max notifications
    setMaxNotifications: (state, action: PayloadAction<number>) => {
      state.maxNotifications = Math.max(1, action.payload);
      if (state.notifications.length > state.maxNotifications) {
        state.notifications = state.notifications.slice(0, state.maxNotifications);
      }
    },
    
    // Toggle auto close
    toggleAutoClose: (state) => {
      state.autoClose = !state.autoClose;
    },
    
    // Set auto close duration
    setAutoCloseDuration: (state, action: PayloadAction<number>) => {
      state.autoCloseDuration = Math.max(1000, action.payload);
    },
    
    // Set notification position
    setNotificationPosition: (state, action: PayloadAction<NotificationState["position"]>) => {
      state.position = action.payload;
    },
    
    // Toggle sound
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    
    // Toggle desktop notifications
    toggleDesktopNotifications: (state) => {
      state.desktopNotifications = !state.desktopNotifications;
    },
    
    // Reset notification state
    resetNotifications: () => initialState,
  },
});

// Export actions
export const {
  addNotification,
  removeNotification,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
  clearNotificationsByType,
  updateNotification,
  setMaxNotifications,
  toggleAutoClose,
  setAutoCloseDuration,
  setNotificationPosition,
  toggleSound,
  toggleDesktopNotifications,
  resetNotifications,
} = notificationSlice.actions;

// Export reducer
export default notificationSlice.reducer;

// Export selectors
export const selectNotifications = (state: { notification: NotificationState }) => state.notification.notifications;
export const selectUnreadNotifications = (state: { notification: NotificationState }) => 
  state.notification.notifications.filter((n) => !n.read);
export const selectNotificationCount = (state: { notification: NotificationState }) => state.notification.notifications.length;
export const selectUnreadCount = (state: { notification: NotificationState }) => 
  state.notification.notifications.filter((n) => !n.read).length;
export const selectNotificationSettings = (state: { notification: NotificationState }) => ({
  maxNotifications: state.notification.maxNotifications,
  autoClose: state.notification.autoClose,
  autoCloseDuration: state.notification.autoCloseDuration,
  position: state.notification.position,
  soundEnabled: state.notification.soundEnabled,
  desktopNotifications: state.notification.desktopNotifications,
});

// Helper action creators for common notification types
export const showSuccess = (title: string, message?: string, options?: Partial<Notification>) => 
  addNotification({ type: "success", title, message: message || title, ...options });

export const showError = (title: string, message?: string, options?: Partial<Notification>) => 
  addNotification({ type: "error", title, message: message || title, ...options });

export const showWarning = (title: string, message?: string, options?: Partial<Notification>) => 
  addNotification({ type: "warning", title, message: message || title, ...options });

export const showInfo = (title: string, message?: string, options?: Partial<Notification>) => 
  addNotification({ type: "info", title, message: message || title, ...options });

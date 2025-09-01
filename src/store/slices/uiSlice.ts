import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface UIState {
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  sidebarMinWidth: number;
  sidebarMaxWidth: number;
  
  // Modal states
  modals: {
    userCreation: boolean;
    userEdit: boolean;
    userDelete: boolean;
    emailCompose: boolean;
    settings: boolean;
    help: boolean;
  };
  
  // Drawer states
  drawers: {
    userProfile: boolean;
    emailHistory: boolean;
    notifications: boolean;
    search: boolean;
  };
  
  // Loading states
  loading: {
    global: boolean;
    sidebar: boolean;
    content: boolean;
    header: boolean;
  };
  
  // Breadcrumb
  breadcrumbs: Array<{
    title: string;
    path: string;
    icon?: string;
  }>;
  
  // Page title
  pageTitle: string;
  
  // Search
  searchQuery: string;
  searchResults: any[];
  searchOpen: boolean;
  
  // Notifications panel
  notificationsPanelOpen: boolean;
  
  // Help panel
  helpPanelOpen: boolean;
  
  // Settings panel
  settingsPanelOpen: boolean;
}

// Initial state
const initialState: UIState = {
  sidebarCollapsed: false,
  sidebarWidth: 256,
  sidebarMinWidth: 80,
  sidebarMaxWidth: 400,
  
  modals: {
    userCreation: false,
    userEdit: false,
    userDelete: false,
    emailCompose: false,
    settings: false,
    help: false,
  },
  
  drawers: {
    userProfile: false,
    emailHistory: false,
    notifications: false,
    search: false,
  },
  
  loading: {
    global: false,
    sidebar: false,
    content: false,
    header: false,
  },
  
  breadcrumbs: [],
  pageTitle: "",
  
  searchQuery: "",
  searchResults: [],
  searchOpen: false,
  
  notificationsPanelOpen: false,
  helpPanelOpen: false,
  settingsPanelOpen: false,
};

// Slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      const width = Math.max(
        state.sidebarMinWidth,
        Math.min(action.payload, state.sidebarMaxWidth)
      );
      state.sidebarWidth = width;
    },
    
    // Modal actions
    openModal: (state, action: PayloadAction<keyof UIState["modals"]>) => {
      state.modals[action.payload] = true;
    },
    
    closeModal: (state, action: PayloadAction<keyof UIState["modals"]>) => {
      state.modals[action.payload] = false;
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof UIState["modals"]] = false;
      });
    },
    
    // Drawer actions
    openDrawer: (state, action: PayloadAction<keyof UIState["drawers"]>) => {
      state.drawers[action.payload] = true;
    },
    
    closeDrawer: (state, action: PayloadAction<keyof UIState["drawers"]>) => {
      state.drawers[action.payload] = false;
    },
    
    closeAllDrawers: (state) => {
      Object.keys(state.drawers).forEach((key) => {
        state.drawers[key as keyof UIState["drawers"]] = false;
      });
    },
    
    // Loading actions
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<{ key: keyof UIState["loading"]; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    
    // Breadcrumb actions
    setBreadcrumbs: (state, action: PayloadAction<UIState["breadcrumbs"]>) => {
      state.breadcrumbs = action.payload;
    },
    
    addBreadcrumb: (state, action: PayloadAction<UIState["breadcrumbs"][0]>) => {
      state.breadcrumbs.push(action.payload);
    },
    
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },
    
    // Page title
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
    
    // Search actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.searchResults = action.payload;
    },
    
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload;
    },
    
    // Panel actions
    toggleNotificationsPanel: (state) => {
      state.notificationsPanelOpen = !state.notificationsPanelOpen;
    },
    
    toggleHelpPanel: (state) => {
      state.helpPanelOpen = !state.helpPanelOpen;
    },
    
    toggleSettingsPanel: (state) => {
      state.settingsPanelOpen = !state.settingsPanelOpen;
    },
    
    // Reset UI state
    resetUI: () => initialState,
  },
});

// Export actions
export const {
  toggleSidebar,
  setSidebarCollapsed,
  setSidebarWidth,
  openModal,
  closeModal,
  closeAllModals,
  openDrawer,
  closeDrawer,
  closeAllDrawers,
  setGlobalLoading,
  setLoading,
  setBreadcrumbs,
  addBreadcrumb,
  clearBreadcrumbs,
  setPageTitle,
  setSearchQuery,
  setSearchResults,
  toggleSearch,
  setSearchOpen,
  toggleNotificationsPanel,
  toggleHelpPanel,
  toggleSettingsPanel,
  resetUI,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;

// Export selectors
export const selectUI = (state: { ui: UIState }) => state.ui;
export const selectSidebarCollapsed = (state: { ui: UIState }) => state.ui.sidebarCollapsed;
export const selectSidebarWidth = (state: { ui: UIState }) => state.ui.sidebarWidth;
export const selectModals = (state: { ui: UIState }) => state.ui.modals;
export const selectDrawers = (state: { ui: UIState }) => state.ui.drawers;
export const selectLoading = (state: { ui: UIState }) => state.ui.loading;
export const selectBreadcrumbs = (state: { ui: UIState }) => state.ui.breadcrumbs;
export const selectPageTitle = (state: { ui: UIState }) => state.ui.pageTitle;
export const selectSearchQuery = (state: { ui: UIState }) => state.ui.searchQuery;
export const selectSearchResults = (state: { ui: UIState }) => state.ui.searchResults;
export const selectSearchOpen = (state: { ui: UIState }) => state.ui.searchOpen;

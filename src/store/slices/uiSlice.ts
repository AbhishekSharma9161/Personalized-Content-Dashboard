import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  activeSection: 'feed' | 'trending' | 'favorites' | 'search';
  settingsOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    duration?: number;
  }>;
}

const initialState: UiState = {
  sidebarOpen: true,
  activeSection: 'feed',
  settingsOpen: false,
  theme: 'light',
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setActiveSection: (state, action: PayloadAction<'feed' | 'trending' | 'favorites' | 'search'>) => {
      state.activeSection = action.payload;
    },
    toggleSettings: (state) => {
      state.settingsOpen = !state.settingsOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UiState['notifications'][0], 'id'>>) => {
      const notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setActiveSection,
  toggleSettings,
  setTheme,
  addNotification,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;

import React, { useState, useEffect } from "react";
import { Moon, Sun, Bell, Settings, Search, User, LogIn } from "lucide-react";
import { SettingsPanel } from "../Settings/SettingsPanel";
import { NotificationsPanel } from "../Notifications/NotificationsPanel";
import { AuthModal } from "../Auth/AuthModal";
import { useAppSelector } from "../../store/hooks";

interface SimpleDashboardLayoutProps {
  children: React.ReactNode;
  activeSection: "feed" | "trending" | "favorites";
  onSectionChange: (section: "feed" | "trending" | "favorites") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  preferences: string[];
  onPreferencesChange: (preferences: string[]) => void;
}

export const SimpleDashboardLayout: React.FC<SimpleDashboardLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
  searchQuery,
  onSearchChange,
  preferences,
  onPreferencesChange,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(prefersDark);
    updateTheme(prefersDark);
  }, []);

  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    updateTheme(newMode);
  };

  const openNotifications = () => {
    setIsNotificationsOpen(true);
    setNotificationCount(0); // Clear notification badge when opened
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground">ContentHub</h2>
            <p className="text-sm text-muted-foreground">Dashboard</p>
          </div>

          <nav className="px-6 space-y-2">
            <div
              className={`p-3 rounded cursor-pointer transition-all duration-200 ${
                activeSection === "feed"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:scale-105"
              }`}
              onClick={() => onSectionChange("feed")}
            >
              📰 Feed
            </div>
            <div
              className={`p-3 rounded cursor-pointer transition-all duration-200 ${
                activeSection === "trending"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:scale-105"
              }`}
              onClick={() => onSectionChange("trending")}
            >
              🔥 Trending
            </div>
            <div
              className={`p-3 rounded cursor-pointer transition-all duration-200 ${
                activeSection === "favorites"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:scale-105"
              }`}
              onClick={() => onSectionChange("favorites")}
            >
              ❤️ Favorites
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* User Profile/Login */}
                {isAuthenticated ? (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center space-x-2 p-2 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-105 group"
                    title="Profile"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-6 h-6 rounded-full border border-border"
                    />
                    <span className="text-sm font-medium text-foreground hidden sm:block">
                      {user?.name}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center space-x-1 p-2 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-105 group"
                    title="Sign In"
                  >
                    <LogIn className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground hidden sm:block">
                      Sign In
                    </span>
                  </button>
                )}

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-110 group"
                  title={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                  data-testid="theme-toggle"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-amber-500 group-hover:text-amber-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-600 group-hover:text-slate-500" />
                  )}
                </button>

                {/* Notifications */}
                <button
                  onClick={openNotifications}
                  className="p-2 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-110 relative group"
                  title="Notifications"
                  data-testid="notifications-button"
                >
                  <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                  {notificationCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
                      data-testid="notification-badge"
                    >
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Settings */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-110 group"
                  title="Settings"
                  data-testid="settings-button"
                >
                  <Settings className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onPreferencesChange={onPreferencesChange}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleDarkMode}
      />

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={isAuthenticated ? "profile" : "login"}
      />
    </div>
  );
};

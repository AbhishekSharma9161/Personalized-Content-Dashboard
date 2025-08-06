import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Settings,
  User,
  Palette,
  Globe,
  LogIn,
  UserPlus,
} from "lucide-react";
import { AuthModal } from "../Auth/AuthModal";
import { useAppSelector } from "../../store/hooks";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: string[];
  onPreferencesChange: (preferences: string[]) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const availableCategories = [
  { id: "technology", label: "Technology", icon: "💻", color: "bg-blue-500" },
  { id: "sports", label: "Sports", icon: "⚽", color: "bg-green-500" },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: "🎬",
    color: "bg-purple-500",
  },
  { id: "business", label: "Business", icon: "💼", color: "bg-emerald-500" },
  { id: "science", label: "Science", icon: "🔬", color: "bg-teal-500" },
  { id: "health", label: "Health", icon: "🏥", color: "bg-pink-500" },
  { id: "politics", label: "Politics", icon: "🏛️", color: "bg-red-500" },
  { id: "world", label: "World News", icon: "🌍", color: "bg-orange-500" },
  { id: "finance", label: "Finance", icon: "💰", color: "bg-yellow-500" },
  { id: "gaming", label: "Gaming", icon: "🎮", color: "bg-indigo-500" },
  { id: "music", label: "Music", icon: "🎵", color: "bg-violet-500" },
  { id: "food", label: "Food", icon: "🍕", color: "bg-amber-500" },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  preferences,
  onPreferencesChange,
  isDarkMode,
  onThemeToggle,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(preferences);
  const [activeTab, setActiveTab] = useState<
    "preferences" | "appearance" | "account"
  >("preferences");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "profile">(
    "login",
  );

  useEffect(() => {
    setSelectedCategories(preferences);
  }, [preferences]);

  if (!isOpen) return null;

  const toggleCategory = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newCategories);
  };

  const savePreferences = () => {
    onPreferencesChange(selectedCategories);
    onClose();
  };

  const resetToDefaults = () => {
    const defaultCategories = ["technology", "sports", "entertainment"];
    setSelectedCategories(defaultCategories);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            data-testid="close-settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { id: "preferences", label: "Feed Preferences", icon: "📰" },
            { id: "appearance", label: "Appearance", icon: "🎨" },
            { id: "account", label: "Account", icon: "👤" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Select Your Interests
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose the categories you&apos;d like to see in your feed. You can
                  select multiple categories.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${
                      selectedCategories.includes(category.id)
                        ? "bg-primary text-primary-foreground border-primary shadow-lg"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                      {selectedCategories.includes(category.id) && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                Selected: {selectedCategories.length} categories
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Theme Settings
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize the appearance of your dashboard.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Dark Mode</div>
                      <div className="text-sm text-muted-foreground">
                        Switch between light and dark themes
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onThemeToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDarkMode ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        isDarkMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="font-medium">Language</span>
                  </div>
                  <select className="w-full p-2 bg-background border border-border rounded-md">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Account Settings
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isAuthenticated
                    ? "Manage your account and profile settings."
                    : "Sign in or create an account to personalize your experience."}
                </p>
              </div>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-12 h-12 rounded-full border-2 border-primary/20"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user?.email}
                        </div>
                        {user?.bio && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {user.bio}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setAuthMode("profile");
                        setAuthModalOpen(true);
                      }}
                      className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Manage Profile
                    </button>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3">Account Preferences</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Newsletter</span>
                        <span
                          className={
                            user?.preferences.newsletter
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }
                        >
                          {user?.preferences.newsletter
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Notifications</span>
                        <span
                          className={
                            user?.preferences.notifications
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }
                        >
                          {user?.preferences.notifications
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Language</span>
                        <span className="text-muted-foreground capitalize">
                          {user?.preferences.language}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Data & Privacy</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <button className="text-primary hover:underline">
                        Export your data
                      </button>
                      <br />
                      <button className="text-destructive hover:underline">
                        Delete account
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                    <div className="text-center space-y-4">
                      <User className="w-16 h-16 text-primary mx-auto" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">
                          Personalize Your Experience
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Create an account to save your preferences, sync
                          across devices, and get personalized content
                          recommendations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setAuthModalOpen(true);
                      }}
                      className="flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode("signup");
                        setAuthModalOpen(true);
                      }}
                      className="flex items-center justify-center space-x-2 bg-muted text-muted-foreground py-3 rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </button>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2 text-sm">
                      Benefits of creating an account:
                    </h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Save and sync your content preferences</li>
                      <li>• Get personalized content recommendations</li>
                      <li>• Access your dashboard from any device</li>
                      <li>• Customize your profile and settings</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <button
            onClick={resetToDefaults}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={savePreferences}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

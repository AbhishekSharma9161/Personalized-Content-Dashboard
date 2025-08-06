import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../index";

// Actions that should trigger persistence
const PERSISTENCE_ACTIONS = [
  "userPreferences/setCategories",
  "userPreferences/addCategory",
  "userPreferences/removeCategory",
  "userPreferences/setLanguage",
  "userPreferences/toggleDarkMode",
  "userPreferences/setLayout",
  "userPreferences/setArticlesPerPage",
  "ui/setTheme",
  "content/toggleFavorite",
  "auth/loginUser/fulfilled",
  "auth/signupUser/fulfilled",
  "auth/updateUserProfile/fulfilled",
  "auth/updateUserLocal",
  "auth/logout",
];

export const persistenceMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    // Check if the action should trigger persistence
    if (PERSISTENCE_ACTIONS.some((actionType) => action.type === actionType)) {
      try {
        // Check if localStorage is available
        if (typeof window !== "undefined" && window.localStorage) {
          const state = store.getState();

          // Save user preferences
          localStorage.setItem(
            "userPreferences",
            JSON.stringify(state.userPreferences),
          );

          // Save UI theme
          localStorage.setItem("theme", state.ui.theme);

          // Save favorites
          localStorage.setItem(
            "favorites",
            JSON.stringify(state.content.favorites),
          );

          // Save auth state
          localStorage.setItem(
            "authState",
            JSON.stringify({
              user: state.auth.user,
              isAuthenticated: state.auth.isAuthenticated,
            }),
          );
        }

        // Apply theme to document
        if (
          action.type === "ui/setTheme" ||
          action.type === "userPreferences/toggleDarkMode"
        ) {
          const state = store.getState();
          const isDark =
            state.ui.theme === "dark" || state.userPreferences.darkMode;
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", isDark);
          }
        }
      } catch (error) {
        console.error("Failed to persist state:", error);
      }
    }

    return result;
  };

// Function to load initial state from localStorage
export const loadPersistedState = () => {
  try {
    // Check if localStorage is available
    if (typeof window === "undefined" || !window.localStorage) {
      return {};
    }

    const userPreferences = localStorage.getItem("userPreferences");
    const theme = localStorage.getItem("theme");
    const favorites = localStorage.getItem("favorites");
    const authState = localStorage.getItem("authState");

    const result: any = {};

    if (userPreferences) {
      result.userPreferences = JSON.parse(userPreferences);
    }

    if (theme) {
      result.ui = { theme };
    }

    if (favorites) {
      result.content = { favorites: JSON.parse(favorites) };
    }

    if (authState) {
      const parsedAuthState = JSON.parse(authState);
      result.auth = {
        ...parsedAuthState,
        isLoading: false,
        error: null,
      };
    }

    return result;
  } catch (error) {
    console.error("Failed to load persisted state:", error);
    return {};
  }
};

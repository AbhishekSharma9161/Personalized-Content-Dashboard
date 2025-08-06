import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
  };
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Mock API calls - in a real app, these would call actual APIs
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (email === "demo@example.com" && password === "password123") {
      const user: User = {
        id: "1",
        email: email,
        name: "Demo User",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        bio: "Content enthusiast and dashboard user",
        preferences: {
          newsletter: true,
          notifications: true,
          language: "en",
        },
        createdAt: new Date().toISOString(),
      };
      return user;
    } else {
      throw new Error("Invalid credentials");
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Mock user creation
    const user: User = {
      id: Date.now().toString(),
      email: email,
      name: name,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      bio: "",
      preferences: {
        newsletter: false,
        notifications: true,
        language: "en",
      },
      createdAt: new Date().toISOString(),
    };
    return user;
  },
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (updates: Partial<User>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    return updates;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserLocal: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      })
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Signup failed";
      })
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Profile update failed";
      });
  },
});

export const { logout, clearError, updateUserLocal } = authSlice.actions;
export default authSlice.reducer;

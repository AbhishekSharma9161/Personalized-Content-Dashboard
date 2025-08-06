import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";
import { AuthModal } from "../AuthModal";
import authSlice from "../../../store/slices/authSlice";

// Mock store setup
const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        ...preloadedState.auth,
      },
    },
  });
};

describe("AuthModal", () => {
  it("renders login form when not authenticated", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <AuthModal isOpen={true} onClose={() => {}} initialMode="login" />
      </Provider>,
    );

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
  });

  it("renders signup form when switching to signup", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <AuthModal isOpen={true} onClose={() => {}} initialMode="signup" />
      </Provider>,
    );

    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(
      screen.getByText("Join us to personalize your content experience"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your full name"),
    ).toBeInTheDocument();
  });

  it("renders profile when authenticated", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      avatar: "avatar-url",
      bio: "Test bio",
      preferences: {
        newsletter: true,
        notifications: true,
        language: "en",
      },
      createdAt: "2024-01-01T00:00:00.000Z",
    };

    const store = createMockStore({
      auth: {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <AuthModal isOpen={true} onClose={() => {}} initialMode="profile" />
      </Provider>,
    );

    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("shows demo credentials helper", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <AuthModal isOpen={true} onClose={() => {}} initialMode="login" />
      </Provider>,
    );

    expect(screen.getByText("Demo Account:")).toBeInTheDocument();
    expect(screen.getByText("Email: demo@example.com")).toBeInTheDocument();
    expect(screen.getByText("Password: password123")).toBeInTheDocument();
    expect(screen.getByText("Use Demo Credentials")).toBeInTheDocument();
  });

  it("fills demo credentials when button is clicked", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <AuthModal isOpen={true} onClose={() => {}} initialMode="login" />
      </Provider>,
    );

    const emailInput = screen.getByPlaceholderText(
      "Enter your email",
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Enter your password",
    ) as HTMLInputElement;
    const demoButton = screen.getByText("Use Demo Credentials");

    fireEvent.click(demoButton);

    expect(emailInput.value).toBe("demo@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("does not render when isOpen is false", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <AuthModal isOpen={false} onClose={() => {}} initialMode="login" />
      </Provider>,
    );

    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
  });
});

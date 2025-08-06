import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SettingsPanel } from "../Settings/SettingsPanel";

describe("SettingsPanel", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    preferences: ["technology", "sports"],
    onPreferencesChange: jest.fn(),
    isDarkMode: false,
    onThemeToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    render(<SettingsPanel {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("should render settings panel when isOpen is true", () => {
    render(<SettingsPanel {...defaultProps} />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Feed Preferences")).toBeInTheDocument();
    expect(screen.getByText("Appearance")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("should display selected categories correctly", () => {
    render(<SettingsPanel {...defaultProps} />);

    // Technology and Sports should be selected by default
    const technologyButton = screen.getByRole("button", {
      name: /Technology/i,
    });
    const sportsButton = screen.getByRole("button", { name: /Sports/i });

    expect(technologyButton).toHaveClass("bg-primary");
    expect(sportsButton).toHaveClass("bg-primary");
  });

  it("should allow toggling category selection", () => {
    render(<SettingsPanel {...defaultProps} />);

    const entertainmentButton = screen.getByRole("button", {
      name: /Entertainment/i,
    });
    fireEvent.click(entertainmentButton);

    // Should now be selected
    expect(entertainmentButton).toHaveClass("bg-primary");
  });

  it("should call onClose when close button is clicked", () => {
    render(<SettingsPanel {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: "" }); // X button
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("should call onPreferencesChange when save is clicked", () => {
    render(<SettingsPanel {...defaultProps} />);

    // Add a new category
    const businessButton = screen.getByRole("button", { name: /Business/i });
    fireEvent.click(businessButton);

    // Save changes
    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);

    expect(defaultProps.onPreferencesChange).toHaveBeenCalledWith(
      expect.arrayContaining(["technology", "sports", "business"]),
    );
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("should switch between tabs correctly", () => {
    render(<SettingsPanel {...defaultProps} />);

    // Click on Appearance tab
    const appearanceTab = screen.getByText("Appearance");
    fireEvent.click(appearanceTab);

    expect(screen.getByText("Theme Settings")).toBeInTheDocument();
    expect(screen.getByText("Dark Mode")).toBeInTheDocument();
  });

  it("should call onThemeToggle when dark mode toggle is clicked", () => {
    render(<SettingsPanel {...defaultProps} />);

    // Switch to Appearance tab
    const appearanceTab = screen.getByText("Appearance");
    fireEvent.click(appearanceTab);

    // Find and click the dark mode toggle
    const darkModeToggle = screen.getByRole("button");
    fireEvent.click(darkModeToggle);

    expect(defaultProps.onThemeToggle).toHaveBeenCalled();
  });

  it("should show correct number of selected categories", () => {
    render(<SettingsPanel {...defaultProps} />);

    expect(screen.getByText("Selected: 2 categories")).toBeInTheDocument();
  });

  it("should reset categories to defaults when reset button is clicked", () => {
    render(<SettingsPanel {...defaultProps} />);

    // Add more categories first
    const businessButton = screen.getByRole("button", { name: /Business/i });
    const scienceButton = screen.getByRole("button", { name: /Science/i });
    fireEvent.click(businessButton);
    fireEvent.click(scienceButton);

    // Reset to defaults
    const resetButton = screen.getByText("Reset to Defaults");
    fireEvent.click(resetButton);

    // Should show default selection count
    expect(screen.getByText("Selected: 3 categories")).toBeInTheDocument();
  });

  it("should handle cancel button correctly", () => {
    render(<SettingsPanel {...defaultProps} />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("should display account tab content", () => {
    render(<SettingsPanel {...defaultProps} />);

    // Click on Account tab
    const accountTab = screen.getByText("Account");
    fireEvent.click(accountTab);

    expect(screen.getByText("Account Settings")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Display Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("should show all available categories", () => {
    render(<SettingsPanel {...defaultProps} />);

    const expectedCategories = [
      "Technology",
      "Sports",
      "Entertainment",
      "Business",
      "Science",
      "Health",
      "Politics",
      "World News",
      "Finance",
      "Gaming",
      "Music",
      "Food",
    ];

    expectedCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it("should handle dark mode state correctly", () => {
    const darkModeProps = { ...defaultProps, isDarkMode: true };
    render(<SettingsPanel {...darkModeProps} />);

    // Switch to Appearance tab
    const appearanceTab = screen.getByText("Appearance");
    fireEvent.click(appearanceTab);

    // Dark mode toggle should be in "on" state
    const toggle = screen.getByRole("button");
    expect(toggle).toHaveClass("bg-primary");
  });
});

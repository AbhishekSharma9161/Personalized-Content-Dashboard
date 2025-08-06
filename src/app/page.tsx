"use client";

import React, { useState, useEffect } from "react";
import { SimpleDashboardLayout } from "../components/Layout/SimpleDashboardLayout";
import { SimpleDashboard } from "../pages/SimpleDashboard";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<
    "feed" | "trending" | "favorites"
  >("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [preferences, setPreferences] = useState<string[]>([
    "technology",
    "sports",
    "entertainment",
    "business",
    "social",
  ]);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem("userCategories");
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    }
  }, []);

  const handleSectionChange = (section: "feed" | "trending" | "favorites") => {
    setActiveSection(section);
    setSearchQuery(""); // Clear search when changing sections
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePreferencesChange = (newPreferences: string[]) => {
    setPreferences(newPreferences);
    localStorage.setItem("userCategories", JSON.stringify(newPreferences));
  };

  return (
    <SimpleDashboardLayout
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      preferences={preferences}
      onPreferencesChange={handlePreferencesChange}
    >
      <SimpleDashboard
        activeSection={activeSection}
        searchQuery={searchQuery}
        preferences={preferences}
      />
    </SimpleDashboardLayout>
  );
}

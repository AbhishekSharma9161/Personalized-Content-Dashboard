"use client";

import React from "react";
import { DashboardLayout } from "../../components/Layout/DashboardLayout";
import { Dashboard } from "../../pages/Dashboard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}

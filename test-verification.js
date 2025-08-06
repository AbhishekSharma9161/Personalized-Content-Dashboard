#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

console.log("🧪 Running ContentHub Test Verification\n");

// Check if test files exist
const testFiles = [
  "client/components/__tests__/SimpleDashboard.test.tsx",
  "client/components/__tests__/SettingsPanel.test.tsx",
  "client/components/__tests__/integration/ContentFlow.test.tsx",
  "tests/e2e/dashboard.spec.ts",
  "jest.config.js",
  "playwright.config.ts",
];

console.log("📁 Checking test files...");
testFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log("\n📦 Checking dependencies...");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

const requiredDeps = {
  "@hello-pangea/dnd": "Drag and drop functionality",
  "@reduxjs/toolkit": "State management",
  "framer-motion": "Animations",
  "react-redux": "Redux integration",
};

const requiredDevDeps = {
  "@testing-library/react": "Unit testing",
  "@testing-library/jest-dom": "Jest DOM matchers",
  "@playwright/test": "E2E testing",
  jest: "Test runner",
  "ts-jest": "TypeScript Jest support",
};

Object.entries(requiredDeps).forEach(([dep, description]) => {
  if (packageJson.dependencies?.[dep]) {
    console.log(`✅ ${dep} - ${description}`);
  } else {
    console.log(`❌ ${dep} - ${description} - MISSING`);
  }
});

Object.entries(requiredDevDeps).forEach(([dep, description]) => {
  if (packageJson.devDependencies?.[dep]) {
    console.log(`✅ ${dep} - ${description}`);
  } else {
    console.log(`❌ ${dep} - ${description} - MISSING`);
  }
});

console.log("\n🚀 Test setup verification complete!");
console.log("\nAvailable test commands:");
console.log("  npm run test:unit          - Run unit tests");
console.log("  npm run test:unit:coverage - Run unit tests with coverage");
console.log(
  "  npm run test:e2e           - Run E2E tests (requires dev server)",
);
console.log("  npm run test:all           - Run all tests");

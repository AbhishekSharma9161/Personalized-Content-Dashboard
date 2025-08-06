export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.(ts|tsx|js|jsx)",
    "<rootDir>/src/**/?(*.)(spec|test).(ts|tsx|js|jsx)",
  ],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/node_modules/**",
    "!src/**/__tests__/**",
    "!src/**/test/**",
    "!src/tests/**",
  ],
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: {
        jsx: "react-jsx",
      },
    },
  },
};

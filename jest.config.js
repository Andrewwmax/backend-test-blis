module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js", "json"],
	testMatch: ["**/tests/**/*.test.ts"],
	collectCoverage: false,
	resetMocks: true,
	clearMocks: true,
	collectCoverageFrom: ["src/**/*.{ts,js}", "!src/**/*.d.ts", "!src/schemas/**/*"],
	setupFilesAfterEnv: ["<rootDir>/src/singleton.ts"],
};

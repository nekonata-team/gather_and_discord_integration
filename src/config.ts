/**
 * Retrieves an environment variable or throws an error if it's not set
 * @param key - The environment variable key
 * @param defaultValue - Optional default value if the environment variable is not set
 * @returns The environment variable value
 * @throws Error if the environment variable is not set and no default is provided
 */
function getEnvOrThrow(key: string, defaultValue?: string): string {
	const value = process.env[key] ?? defaultValue;
	if (value === undefined) {
		throw new Error(`Environment variable ${key} is not set`);
	}
	return value;
}

// Gather Town configuration
export const GATHER = {
	API_KEY: getEnvOrThrow("GATHER_API_KEY"),
	SPACE_ID: getEnvOrThrow("GATHER_SPACE_ID"),
	MAP_ID: getEnvOrThrow("GATHER_MAP_ID", "office-main"),
};

// Discord configuration
export const DISCORD = {
	WEBHOOK_URL: getEnvOrThrow("DISCORD_WEBHOOK_URL"),
};

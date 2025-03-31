/**
 * Discord Webhook notification handler
 */
export class DiscordNotifier {
	// Color constants for better readability
	private static readonly COLORS = {
		SUCCESS: 3066993, // Green
		INFO: 5793266, // Blue
		ERROR: 16711680, // Red
		WARNING: 16776960, // Yellow
	};

	private readonly webhookUrl: string;

	/**
	 * Creates a new Discord notifier instance
	 * @param webhookUrl - Discord webhook URL
	 */
	constructor(webhookUrl: string) {
		if (
			!webhookUrl ||
			!webhookUrl.startsWith("https://discord.com/api/webhooks/")
		) {
			throw new Error("Invalid Discord webhook URL");
		}

		this.webhookUrl = webhookUrl;
	}

	/**
	 * Formats current time in Japanese locale
	 * @returns Formatted timestamp string
	 */
	private getFormattedTime(): string {
		return new Date().toLocaleString("ja-JP", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	}

	/**
	 * Sends an embedded message to Discord
	 * @param title - Embed title
	 * @param description - Embed description
	 * @param color - Color code for the embed
	 * @param fields - Optional fields to include in the embed
	 * @returns Promise resolving to the response or error
	 */
	async sendEmbed(
		title: string,
		description: string,
		color: number,
		fields: Array<{ name: string; value: string; inline?: boolean }> = [],
	): Promise<Response> {
		const payload = {
			embeds: [
				{
					title,
					description,
					color,
					fields,
					footer: {
						text: `Time: ${this.getFormattedTime()}`,
					},
				},
			],
		};

		const response = await fetch(this.webhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			throw new Error(`Discord API responded with status: ${response.status}`);
		}

		return response;
	}

	/**
	 * Sends a system notification message
	 * @param message - Notification content
	 */
	async sendSystemNotification(message: string): Promise<Response> {
		return this.sendEmbed(
			"Gather監視ボット",
			message,
			DiscordNotifier.COLORS.SUCCESS,
		);
	}

	/**
	 * Notifies when someone enters the space
	 * @param name - User's name
	 * @param uid - User's ID
	 * @param playerCount - Current number of players in the space
	 */
	async sendJoinNotification(
		name: string,
		uid: string,
		playerCount: number,
	): Promise<Response> {
		return this.sendEmbed(
			"🚪 入室通知",
			`**${name}** さんがオフィスに入室しました`,
			DiscordNotifier.COLORS.INFO,
			[
				{ name: "ユーザーID", value: uid, inline: true },
				{ name: "現在の人数", value: `${playerCount}人`, inline: true },
			],
		);
	}

	/**
	 * Notifies when someone leaves the space
	 * @param uid - User's ID
	 * @param playerCount - Current number of players in the space
	 */
	async sendExitNotification(
		uid: string,
		playerCount: number,
	): Promise<Response> {
		return this.sendEmbed(
			"🚪 退室通知",
			"ユーザーがオフィスから退室しました",
			DiscordNotifier.COLORS.ERROR,
			[
				{ name: "ユーザーID", value: uid || "不明", inline: true },
				{ name: "現在の人数", value: `${playerCount}人`, inline: true },
			],
		);
	}
}

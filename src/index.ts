import { DISCORD, GATHER } from "./config";
import { DiscordNotifier } from "./discord_notifier";
import { GatherMonitor } from "./gather_monitor";

function main() {
	try {
		console.log("Starting Gather Town Bot...");

		console.log(GATHER.API_KEY, GATHER.SPACE_ID, GATHER.MAP_ID);
		console.log(DISCORD.WEBHOOK_URL);

		const notifier = new DiscordNotifier(DISCORD.WEBHOOK_URL);

		const monitor = new GatherMonitor(
			GATHER.SPACE_ID,
			GATHER.API_KEY,
			notifier,
		);
		notifier.sendSystemNotification("オフィスの入退室監視を開始しました");
		monitor.start();
	} catch (error) {
		console.error("Error starting Gather Town Bot:", error);
		process.exit(1);
	}
}

main();

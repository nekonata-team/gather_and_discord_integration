import { DISCORD, GATHER } from "./config";
import { DiscordNotifier } from "./discord_notifier";
import { GatherMonitor } from "./gather_monitor";

function main() {
	console.log("Starting Gather Town Bot...");

	console.log(GATHER.API_KEY, GATHER.SPACE_ID, GATHER.MAP_ID);
	console.log(DISCORD.WEBHOOK_URL);

	const notifier = new DiscordNotifier(DISCORD.WEBHOOK_URL);
	const monitor = new GatherMonitor(GATHER.SPACE_ID, GATHER.API_KEY, notifier);
	monitor.start();
}

main();

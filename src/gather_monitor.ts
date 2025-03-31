import { Game } from "@gathertown/gather-game-client";
import type { DiscordNotifier } from "./discord_notifier";

/**
 * Monitors Gather.Town space activities and sends notifications to Discord
 */
export class GatherMonitor {
	private readonly game: Game;
	private readonly notifier: DiscordNotifier;

	/**
	 * Creates a new GatherMonitor instance
	 * @param spaceId - Gather.Town space identifier
	 * @param apiKey - API key for authentication
	 * @param notifier - Discord notification service
	 */
	constructor(spaceId: string, apiKey: string, notifier: DiscordNotifier) {
		this.notifier = notifier;
		this.game = new Game(spaceId, () => Promise.resolve({ apiKey }));
	}

	/**
	 * Starts monitoring the Gather.Town space
	 */
	public async start(): Promise<void> {
		this.game.connect();
		this.setupEventListeners();
	}

	/**
	 * Sets up event listeners for Gather.Town events
	 */
	private setupEventListeners(): void {
		this.game.subscribeToConnection((connected) => {
			console.log(
				`Connection status: ${connected ? "connected" : "disconnected"}`,
			);
		});
		this.game.subscribeToEvent("playerJoins", async (data) => {
			// playerの情報はwaitForInitを待たないと取得できない
			await this.game.waitForInit();

			const encId = data.playerJoins.encId;
			const uid = this.game.getPlayerUidFromEncId(encId);

			if (!uid) {
				console.error(
					`Player join event received but uid not found for encId: ${encId}`,
				);
				return;
			}

			const player = this.game.getPlayer(uid);
			const playerName = player?.name || "名前不明";
			const playerCount = this.getPlayerCount();

			await this.notifier.sendJoinNotification(playerName, uid, playerCount);
			console.log(
				`Player joined: ${playerName} (${uid}), total players: ${playerCount}`,
			);
		});
		this.game.subscribeToEvent("playerExits", async (data) => {
			const encId = data.playerExits.encId;
			const uid = this.game.getPlayerUidFromEncId(encId);
			const playerCount = this.getPlayerCount();

			await this.notifier.sendExitNotification(uid || "不明", playerCount);
			console.log(
				`Player exited: ${uid || "unknown"}, remaining players: ${playerCount}`,
			);
		});
	}

	/**
	 * Gets the current number of players in the space
	 */
	private getPlayerCount(): number {
		return Object.keys(this.game.players).length;
	}
}
